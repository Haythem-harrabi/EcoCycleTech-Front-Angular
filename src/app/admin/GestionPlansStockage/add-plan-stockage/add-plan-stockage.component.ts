import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanStockage } from 'src/app/entities/planStockage';
import { PlanStockageService } from 'src/app/services/plan-stockage.service';


@Component({
  selector: 'app-add-plan-stockage',
  templateUrl: './add-plan-stockage.component.html',
  styleUrls: ['./add-plan-stockage.component.css']
})
export class AddPlanStockageComponent  {
  
  
  planForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private ps : PlanStockageService) {
    this.planForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      tailleMax: ['', [Validators.required, Validators.min(0.01)]],
      prix: ['', [Validators.required, Validators.min(0)]]
    });
  }

  get f() {
    return this.planForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.planForm.invalid) {
      return;
    }

    const newPlan: PlanStockage = {
      idPlan: 0, 
      titre: this.planForm.value.title,
      tailleMax: this.planForm.value.maxSize,
      prix: this.planForm.value.price,
      espaces: [] 
      ,
      toJson: function () {
        throw new Error('Function not implemented.');
      }
    };

    console.log(this.planForm.value)

    this.ps.AddPlan(this.planForm.value).subscribe(
      () => 
        {console.log("plan created successfully !")
     
        }
    )
    this.resetForm();
  }
    
  

  resetForm(): void {
    this.submitted = false;
    this.planForm.reset();
  }
}