import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EspaceStockage, StatutEspace } from 'src/app/entities/espaceStockage';
import { PlanStockage } from 'src/app/entities/planStockage';
import { EspaceStockageService } from 'src/app/services/espace-stockage.service';
import { PlanStockageService } from 'src/app/services/plan-stockage.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-plan-stockage',
  templateUrl: './add-plan-stockage.component.html',
  styleUrls: ['./add-plan-stockage.component.css']
})
export class AddPlanStockageComponent  {

  
  
  planForm: FormGroup;
  submitted = false;
  editMode !: boolean ;
  id !:number;
  espaces: EspaceStockage[] = [];
  loadingSpaces = false;
  PlanSize : number=1;

  premiumOptions = [
    { label: 'Standard', value: false },
    { label: 'Premium', value: true }
  ];



  constructor(private fb: FormBuilder, private ps : PlanStockageService, private act : ActivatedRoute, private route : Router, private es : EspaceStockageService) {
    this.planForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      tailleMax: [null, [Validators.required, Validators.min(1.00),Validators.max(100)]],
      prix: [null, [Validators.required, Validators.min(0)]],
      premium: [null, Validators.required] 
    });
  }
 

  ngOnInit() {
    this.id= this.act.snapshot.params["id"] ;

   this.ps.getPlanById(this.id).subscribe(
    (plan) => {plan.tailleMax = this.formatBytesToGB(plan.tailleMax)
      this.planForm.patchValue(plan);
      this.PlanSize = plan.tailleMax
    });
  if (this.id){
    this.editMode=true;
    this.loadAssociatedSpaces(this.id)
  }}
  

 formatGBtoBytes(gb: number): number {
    return gb * Math.pow(1024, 3);
  }

  get f() {
    return this.planForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.planForm.invalid) {
      return;
    }

    console.log(this.planForm.value)
    const formData = this.planForm.value;
    formData.tailleMax = this.formatGBtoBytes(formData.tailleMax );

    if (this.editMode){
      Swal.fire({
        title: "You are about to update the plan with ID " + this.id + ". Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        confirmButtonColor: "#4A90E2",
        didOpen: () => {
          const icon = Swal.getIcon();
          const buttons = Swal.getConfirmButton()?.parentElement;
          const text = document.getElementById("swal2-title");
          if (icon) {
            icon.style.borderColor = "#4A90E2"; 
            icon.style.color = "#4A90E2";    
            icon.style.scale = "1.4";   
          }

    if (buttons) {
      buttons.style.fontSize = "1.1rem";
      buttons.style.padding = "10px 20px";
    }

    if (text) {
      text.style.fontSize = "28px";
    }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.ps.UpdatePlan(this.id, formData).subscribe(
            () => {
              Swal.fire({
                title: "Plan updated!",
                text: "The plan was updated successfully.",
                icon: "success",
                showCloseButton: true,
                didOpen: () => {
                  const icon = Swal.getIcon();
                  const button = Swal.getConfirmButton();
                  if (icon) {
                    icon.style.scale = "1.4";   
                    icon.style.fontSize="16px"
                  }
        
            if (button) {
              button.style.fontSize = "1.1rem";
              button.style.padding = "10px 20px";
              button.style.backgroundColor = "#1da750"
              button.style.borderColor = "#35cb6c"
            }
                }
              });
              this.route.navigateByUrl("/admin/Plans");
              this.resetForm();
            },
            error => {
              console.error('Error updating plan:', error);
              let errorMessage = 'An error occurred while updating the plan.';
              if (error.error && error.error.error) {
                errorMessage = "ERROR: " + error.error.error;
              }
              Swal.fire({
                title: "Oops!",
                text: errorMessage,
                icon: "error",
                showCloseButton: true
              });
            }
          );
        }
      });
    }


    else{
      Swal.fire({
        title: "You are about to create a new plan. Proceed?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, create it!",
        confirmButtonColor: "#4A90E2",
        didOpen: () => {
          const icon = Swal.getIcon();
          const buttons = Swal.getConfirmButton()?.parentElement;
          const text = document.getElementById("swal2-title");
          if (icon) {
            icon.style.borderColor = "#4A90E2"; 
            icon.style.color = "#4A90E2";    
            icon.style.scale = "1.4";   
          }

    if (buttons) {
      buttons.style.fontSize = "1.1rem";
      buttons.style.padding = "10px 20px";
    }

    if (text) {
      text.style.fontSize = "28px";
    }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.ps.AddPlan(formData).subscribe(
            () => {
              Swal.fire({
                title: "Plan created!",
                text: "The new plan was added successfully.",
                icon: "success",
                showCloseButton: true,
                didOpen: () => {
                  const icon = Swal.getIcon();
                  const button = Swal.getConfirmButton();
                  const text = document.getElementById("swal2-title");
                  if (icon) {
                    icon.style.scale = "1.4";   
                  }
        
            if (button) {
              button.style.fontSize = "1.1rem";
              button.style.padding = "10px 20px";
              button.style.backgroundColor = "#1da750"
              button.style.borderColor = "#35cb6c"
            }
                }
              });
              this.resetForm();
            },
            error => {
              console.error('Error creating plan:', error);
              let errorMessage = 'An error occurred while creating the plan.';
              if (error.error && error.error.error) {
                errorMessage = "ERROR: " + error.error.error;
              }
              Swal.fire({
                title: "Oops!",
                text: errorMessage,
                icon: "error",
                showCloseButton: true
              });
            }
          );
        }
      });
    }
  }
  

  resetForm(): void {
    this.submitted = false;
    this.planForm.reset();
  }






  /* Spaces */

   loadAssociatedSpaces(planId: number) {
     this.loadingSpaces = true;
    this.es.getEspacesByPlan(planId).subscribe({
       next: (spaces) => {
        
         this.espaces = spaces;
         this.loadingSpaces = false;
         this.espaces.forEach(espace => {
          espace.usedTaille = this.formatBytesToGB(espace.usedTaille)
          
         });
       },
       error: () => this.loadingSpaces = false
     });
   }
 
   blockSpace(spaceId: number) {
    let user : any;

    this.es.getEspaceById(spaceId).subscribe({
      next: (data) => { console.log(data)
        // user = data.user;
         
      }
    }
    )
        Swal.fire({
          title: "You are about to block space "+ spaceId +" for user "+ user+". Proceed ?",
          icon: "warning",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "Yes, block it",
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
          if (result.isConfirmed){
         this.es.blockSpace(spaceId).subscribe({
           next: () => {
             Swal.fire({
                          title: "Space Blocked !",
                          text: "This account will no longer be able to upload new files !",
                          icon: "success",
                          showCloseButton: true,
                          didOpen: () => {
                                            const icon = Swal.getIcon();
                                            const button = Swal.getConfirmButton();
                                            if (icon) {
                                              icon.style.scale = "1.4";   
                                            }
                                  
                                      if (button) {
                                        button.style.fontSize = "1.1rem";
                                        button.style.padding = "10px 20px";
                                        button.style.backgroundColor = "#1da750"
                                        button.style.borderColor = "#35cb6c"
                                      }
                                          }
                        });
             this.loadAssociatedSpaces(this.id);
           }
         });
       }
        },
               error=>{
                 Swal.fire({
                   title: "Oops !",
                   text: "An error occured while blocking space "+spaceId+".",
                   icon: "error",
                   showCloseButton: true
                 });
               });
             } 
           
          

             formatBytesToGB(bytes: number): number {
              return parseFloat((bytes / (1024 ** 3)).toFixed(2));
            }



       UnblockSpace(spaceId: number) {
        let user : any;

    this.es.getEspaceById(spaceId).subscribe({
      next: (data) => { console.log(data)
        // user = data.user;
      }
    })
        Swal.fire({
          title: "You are about to unblock space "+ spaceId +" for user "+ user+". Proceed ?",
          icon: "warning",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "Yes, unblock it",
          confirmButtonColor : "#4A90E2",
          didOpen: () => {
                            const icon = Swal.getIcon();
                            const button = Swal.getConfirmButton();
                            if (icon) {
                              icon.style.scale = "1.4";   
                              icon.style.color = "#4A90E2";
                              icon.style.borderColor= "#4A90E2"
                            }
                  
                      if (button) {
                        button.style.fontSize = "1.1rem";
                        button.style.padding = "10px 20px";
                      }
                          }
        }).then((result) => {
          if (result.isConfirmed){
         this.es.unblockSpace(spaceId).subscribe({
           next: () => {
             Swal.fire({
                          title: "Space unblocked !",
                          text: "This account is now in active state !",
                          icon: "success",
                          showCloseButton: true,
                          didOpen: () => {
                                            const icon = Swal.getIcon();
                                            const button = Swal.getConfirmButton();
                                            if (icon) {
                                              icon.style.scale = "1.4";   
                                            }
                                  
                                      if (button) {
                                        button.style.fontSize = "1.1rem";
                                        button.style.padding = "10px 20px";
                                        button.style.backgroundColor = "#1da750"
                                        button.style.borderColor = "#35cb6c"
                                      }
                                          }
                        });
             this.loadAssociatedSpaces(this.id);
           }
         });
       }
        },
               error=>{
                 Swal.fire({
                   title: "Oops !",
                   text: "An error occured while blocking space "+spaceId+".",
                   icon: "error",
                   showCloseButton: true
                 });
               });
             } 
           
          
      


   getStatusSeverity(status: StatutEspace): string {
    switch(status) {
      case StatutEspace.ACTIVE : return 'success';
      case StatutEspace.BLOCKED: return 'danger';
      case StatutEspace.EXPIRED: return 'warning';
      default: return 'info';
    }
  }
  
  getStatusIcon(status: StatutEspace): string {
    switch(status) {
      case StatutEspace.ACTIVE: return 'pi pi-check-circle';
      case StatutEspace.BLOCKED: return 'pi pi-ban';
      case StatutEspace.EXPIRED: return 'pi pi-clock';
      default: return 'pi pi-info-circle';
    }
  }
 
}