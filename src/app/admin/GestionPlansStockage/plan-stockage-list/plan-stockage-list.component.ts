import { Component, OnInit } from '@angular/core';
import { PlanStockage } from 'src/app/entities/planStockage';
import { PlanStockageService } from 'src/app/services/plan-stockage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plan-stockage-list',
  templateUrl: './plan-stockage-list.component.html',
  styleUrls: ['./plan-stockage-list.component.css']
})
export class PlanStockageListComponent implements OnInit {
  plans: PlanStockage[] = [];

  constructor(private planService: PlanStockageService) {}

  ngOnInit(): void {
    this.planService.getPlans().subscribe(data => {
      this.plans = data;
    });
  }

  DeletePlan(id : number){

    Swal.fire({
      title: "You are about to delete plan "+ id+". Continue ?",
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
        this.planService.DeletePlan(id).subscribe((resultData: any)=>
          {
            Swal.fire({
              title: "Plan deleted !",
              text: "Plan deleted successfully!",
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
    
           this.planService.getPlans().subscribe((resultData: any)=>
              {
                this.plans = resultData;
               
              });
          },
        error=>{
          Swal.fire({
            title: "Oops !",
            text: "An error occured while deleting plan "+id+".",
            icon: "error",
            showCloseButton: true
          });
        });
      } 
    });
   


  


  }
}