import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ExtensionFichier, Fichier, TypeFichier } from 'src/app/entities/fichier';
import { CloudinaryService } from 'src/app/services/cloudinary.service';
import { FichierService } from 'src/app/services/fichier.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { Router } from '@angular/router';
import { EspaceStockage } from 'src/app/entities/espaceStockage';
import {FileItem} from  'src/app/entities/fileItem'
import { FolderResponse } from 'src/app/entities/folderResponse';
import Swal from 'sweetalert2';
import { cloudinary } from 'src/environment/environment-vars';
import { EspaceStockageService } from 'src/app/services/espace-stockage.service';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-espace-stockage',
  templateUrl: './espace-stockage.component.html',
  styleUrls: ['./espace-stockage.component.css'],
  providers: [MessageService]
})
export class EspaceStockageComponent {

//user dependent
  userid = 1
  username = "testuser"



  currentspaceId !: number;
  currentSpace !: EspaceStockage;

  cloudName = cloudinary.cloudname;
  uploadPreset = cloudinary.uploadPreset;
  myWidget: any;
  uploadedUrl!: string;
  rootFolder = 'EcoCycleTech/'+this.username+ "_" + this.userid;
  currentFolder = 'EcoCycleTech/'+this.username+ "_" + this.userid;
  viewMode : 'grid' | 'list' = 'grid';
  viewOptions = [
    { icon: 'pi pi-th-large', value: 'grid', label: 'Grid' },
    { icon: 'pi pi-list', value: 'list', label: 'List' }
  ];
  items: FileItem[] = [];
  
  breadcrumbItems: { label: string, path: string }[] = [];
  loading = false;
  searchQuery = '';
  home!: MenuItem;

  occupiedSpace?: number ; 
  freeSpace?: number ;    
  totalSpace?: number ;   
  occupiedSpacePercentage?: number ;
  totalSpaceGB?: number;
  occupiedSpaceGB?: number;
  freeSpaceGB?:number;


  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;


  doughnutChartData = {
  labels: ['Occupied Space', 'Free Space'],
  datasets: [
    {
      data: [0, 100], // temporary dummy data
      backgroundColor: ['#add8e6', '#66BB6A'],
      hoverBackgroundColor: ['#a0c8d5', '#81C784']
    }
  ]
};
  
  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '70%', 
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#333'
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true
    }
  };

  
  // Update function after receiving space info
  updateChart() {
    this.doughnutChartData.datasets[0].data = [this.occupiedSpace!, this.freeSpace!];
    if (this.chart) {
      this.chart.update(); // Force the chart to refresh
    }
  }
  

  constructor(private messageService: MessageService, private cloudinaryService : CloudinaryService, private fichierService : FichierService, 
    private subscriptionService : SubscriptionService,  private router: Router, private espaceService : EspaceStockageService
  ) {}


  ngOnInit() {
      



    this.subscriptionService.getUserSpace(this.userid).subscribe({
      next: (data) => {
        console.log("Active Espace:", data);
        this.currentSpace = data;
        this.currentspaceId = data.idEspace;
    
        // First, get total space
        this.subscriptionService.getSubscriptionByEspace(this.currentspaceId).subscribe({
          next: (subData) => {
            this.totalSpace= subData.planStockage?.tailleMax!
            this.totalSpaceGB = this.formatBytesToGB(subData.planStockage?.tailleMax!);
    
            // After totalSpace is fetched, get occupied space
            this.espaceService.getOccupiedSpace(this.currentspaceId).subscribe({
              next: (occupiedData) => {
                this.occupiedSpace= occupiedData
                this.occupiedSpaceGB = this.formatBytesToGB(occupiedData);
                this.freeSpace = this.totalSpace! - this.occupiedSpace!;
                this.freeSpaceGB=  this.totalSpaceGB! - this.occupiedSpaceGB
                console.log(`Total: ${this.totalSpace}, Occupied: ${this.occupiedSpace}, Free: ${this.freeSpace}`);
                // Update chart data
                this.updateChart();
              },
              error: (err) => {
                console.error('Error fetching occupied space:', err);
              }
            });
    
          },
          error: (err) => {
            console.error('Error fetching subscription plan:', err);
          }
        });
    
      },
      error: (error) => {
        if (error.status === 404) {
          console.warn('No active espace found for this user.');
          this.router.navigateByUrl('/EcoDrive');
        } else {
          console.error('Error fetching user space:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An unexpected error occurred!'
          });
        }
      }
    });



    this.home = {
      icon: 'pi pi-home',
      command: () => this.navigateToBreadcrumb(this.breadcrumbItems[0])
    };



    //handling uploading files and synchronizing with database
    this.myWidget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: this.cloudName,
        uploadPreset: this.uploadPreset
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the file info: ", result.info);
          this.uploadedUrl = result.info.secure_url;

          let extension : any;
          let filetype : TypeFichier;
          if (result.info.original_extension != null){
            extension= result.info.original_extension.toUpperCase()
          
          }
          else{
            extension=  result.info.path.split('.').pop();
          }
          // Now decide the fileType
switch (extension.toUpperCase()) {
  case 'PDF':
  case 'DOCX':
  case 'TXT':
    filetype = TypeFichier.DOCUMENT;
    break;

  case 'PNG':
  case 'JPG':
  case 'JPEG':
    filetype = TypeFichier.IMAGE;
    break;

  case 'MP4':
    filetype = TypeFichier.VIDEO;
    break;

  default:
    filetype = TypeFichier.UNKNOWN;
    break;
}
console.log("filetype:"+ filetype)
console.log("extension = " + extension)

          //Adding file in database
          const fichier : Fichier = new Fichier(0,result.info.original_filename,result.info.bytes,new Date(),result.info.url,this.currentSpace,filetype, extension.toUpperCase() as ExtensionFichier,result.info.public_id);
          this.fichierService.AddFichier(fichier).subscribe({
            next : (data) => {console.log("File created successfully !" + data)
              setTimeout(() => {
                this.loadFolderContents(this.currentFolder);
              }, 1500);
              },
            error: (err) => {
              console.error("Error creating fichier:", err);
            }
          });

          //fetching & verifying sensitive data
          const originalFilename = result.info.original_filename;

          this.fichierService.fetchFileAsBlob(this.uploadedUrl).subscribe(blob => {
            console.log('File blob fetched:', blob);
        
            const formData = new FormData();
            formData.append('file', blob, originalFilename);
        
            this.fichierService.analyzeFile(formData).subscribe({
              next: (response) => {
                console.log('Analysis result:', response);
                this.closeUploadWidget()
                this.messageService.add({
                  severity: response.sensitiveDataDetected ? 'warn' : 'success',
                  summary: response.sensitiveDataDetected ? 'Sensitive Data Detected in file : '+ response.filename : 'No Sensitive Data',
                  detail: response.details,
                  life: 6000
                });
              },
              error: (err) => {
                console.error('Error analyzing file:', err);
                this.closeUploadWidget()
                this.messageService.add({
                  severity: 'error',
                  summary: 'Analysis Failed',
                  detail: 'Could not analyze the file.',
                  life: 6000
                });
              }
            });
          }, error => {
            console.error('Error fetching file from Cloudinary:', error);
          });



          let modifiedSpace :EspaceStockage = this.currentSpace
          modifiedSpace.usedTaille+= result.info.bytes;
          this.espaceService.UpdateEspace(this.currentSpace.idEspace,modifiedSpace).subscribe(
            () => {console.log("Updated")}
          )


          
          

        }
      }
    );


    
    // Initialize breadcrumb
    this.updateBreadcrumb(this.rootFolder);
    
    // // Load root folder contents
    this.loadFolderContents(this.rootFolder);
  }

  openUploadWidget() {
    this.myWidget.update({ folder: this.currentFolder });
    this.myWidget.open();
  }

  closeUploadWidget() {
    this.myWidget.close();
  }


  loadFolderContents(folderPath: string) {
    this.loading = true;
    this.cloudinaryService.getFolderContents(folderPath).subscribe({
      next: (response: FolderResponse) => {
        // Transform the response to our FileItem format
        this.items = this.transformFolderContents(response);
        this.currentFolder = folderPath;
        this.updateBreadcrumb(folderPath);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading folder contents:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load folder contents'
        });
        this.loading = false;
      }
    });
  }

  transformFolderContents(response: FolderResponse): FileItem[] {
    const items: FileItem[] = [];
    
    // Add files from current folder
    if (response.files && response.files.length > 0) {
      response.files.forEach(file => {

        this.fichierService.getFichierByPublicId(file.public_id).subscribe(
          (data) => { console.log("data="+data) 
            items.push({
            id: file.public_id,
            name: data.nom,
            type: 'file',
            url: file.url,
            format: file.format,
            size: file.bytes,
            created_at: new Date(file.created_at),
            path: file.public_id,
            extension : data.extension
          });}
        )
      });
    
    }
    
    // Add subfolders
    if (response.subfolders && response.subfolders.length > 0) {
      response.subfolders.forEach(subfolder => {
        items.push({
          id: subfolder.folder,
          name: this.extractNameFromPath(subfolder.folder),
          type: 'folder',
          path: subfolder.folder
        });
      });
    }
    
    return items;
  }



  extractNameFromPath(path: string): string {
    const parts = path.split('/');
    return parts[parts.length - 1];
  }


  navigateToFolder(folder: FileItem) {
    if (folder.type === 'folder') {
      this.loadFolderContents(folder.path);
    }
  }

  updateBreadcrumb(path: string) {
    const parts = path.split('/');
    this.breadcrumbItems = [{ label: 'My EcoDrive', path: this.rootFolder }];
    
    if (path !== this.rootFolder) {
      let currentPath = parts[0];
      this.breadcrumbItems = [{ label: parts[0], path: parts[0] }];
      
      for (let i = 1; i < parts.length; i++) {
        currentPath += '/' + parts[i];
        this.breadcrumbItems.push({
          label: parts[i],
          path: currentPath
        });
      }
    }
  }

  navigateToBreadcrumb(item: { label: string, path: string }) {
    this.loadFolderContents(item.path);
  }

  async createNewFolder() {
    const { value : folderName} =  await Swal.fire({
      title: "Enter folder name",
      input: "text",
      inputLabel: "Folder name",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
        return undefined; 
      },
      didOpen: () => {
      const button = Swal.getConfirmButton();
      if (button) {
        button.style.backgroundColor = "#1da750"
        button.style.borderColor = "#35cb6c"
      }


      }
    });

    if (folderName) {
      const newFolderPath = `${this.currentFolder}/${folderName}`;
      this.cloudinaryService.createFolder(newFolderPath).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Folder ${folderName} created`
          });
          this.loadFolderContents(this.currentFolder);
        },
        error: (error) => {
          console.error('Error creating folder:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create folder'
          });
        }
      });
    }
  }

  deleteItem(item: FileItem) {
    console.log(item.id);
    console.log(item.extension);
    let resourcetype : string;
    switch (item.extension?.toString()) {
      case "DOCX":
      case "PDF":
      case "TXT":
        resourcetype = "raw";
        break;
      case "PNG":
      case "JPG":
      case "JPEG":
        resourcetype = "image";
        break;
      default:
        resourcetype = "image";
        break;
    }
    
    console.log("Resource type to delete:", resourcetype);
    

    Swal.fire({
          title: "You are about to delete "+ item.name+"."+item.format+" . Continue ?",
          icon: "warning",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "Yes, delete it",
          confirmButtonColor : "#FFAD60",
          didOpen: () => {
                            const icon = Swal.getIcon();
                            const button = Swal.getConfirmButton();
                            if (icon) {
                              icon.style.scale = "1.4";   
                              icon.style.color = "red";
                              icon.style.borderColor= "red"
                            }
                  
                      if (button) {
                        button.style.fontSize = "1.1rem";
                        button.style.padding = "10px 20px";
                        button.style.backgroundColor = "#DC2626"
                        button.style.borderColor = "#DC2626"
                      }
                          }
        }).then((result) => {
          
          if (result.isConfirmed) {

            if (item.type === 'file') {
              this.cloudinaryService.deleteFile(item.id, resourcetype).subscribe({
                next: () => {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `File ${item.name} deleted`
                  });
                  this.loadFolderContents(this.currentFolder);
                },
                error: (error) => {
                  console.error('Error deleting file:', error);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete file'
                  });
                }
              });
            }
            else if (item.type=== 'folder'){
              this.cloudinaryService.deleteFolder(item.path).subscribe({
                next: () => {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Folder ${item.name} deleted`
                  });
                  this.loadFolderContents(this.currentFolder);
                },
                error: (error) => {
                  console.error('Error deleting folder:', error);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete folder'
                  });
                }
              });
            }
          


          }
        });

      }




    
  

  changeViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  filterItems() {
    // // Client-side filtering based on search query
    // if (!this.searchQuery.trim()) {
    //   this.loadFolderContents(this.currentFolder);
    //   return;
    // }
    
    // const query = this.searchQuery.toLowerCase();
    
    // // Reload data then filter (in a real app, you might want server-side search)
    // this.loading = true;
    // this.cloudinaryService.getFolderContents(this.currentFolder).subscribe({
    //   next: (response: FolderResponse) => {
    //     const allItems = this.transformFolderContents(response);
    //     this.items = allItems.filter(item => 
    //       item.name.toLowerCase().includes(query)
    //     );
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error during search:', error);
    //     this.loading = false;
    //   }
    // });
  }

  getDownloadUrl(item: FileItem): string {
    const fileName = item.name?.replace(/\s+/g, '_') || 'file';
    const urlParts = item.url!.split('/upload/');
  
    if (urlParts.length === 2) {
      return `${urlParts[0]}/upload/fl_attachment:${encodeURIComponent(fileName)}/${urlParts[1]}`;
    }
    return item.url!; // fallback
  }


  formatBytesToGB(bytes: number): number {
    return parseFloat((bytes / (1024 ** 3)).toFixed(2) );
  }

  convertGBtoBytes(gb: number): number {
    return gb * Math.pow(1024, 3);
  }


}