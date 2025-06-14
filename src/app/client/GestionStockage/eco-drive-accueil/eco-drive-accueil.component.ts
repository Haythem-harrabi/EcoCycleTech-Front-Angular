import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlanStockage } from 'src/app/entities/planStockage';
import { PlanStockageService } from 'src/app/services/plan-stockage.service';
import Typed from 'typed.js';

@Component({
  selector: 'app-eco-drive-accueil',
  templateUrl: './eco-drive-accueil.component.html',
  styleUrls: ['./eco-drive-accueil.component.css'],
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translate(-50%, calc(-50% + 30px))'  ,
          boxShadow: 'none'
        }),
        animate('2.5s cubic-bezier(0.23, 1, 0.32, 1)',
          style({
            opacity: 1,
            transform: 'translate(-50%, -50%)'  ,
            boxShadow: '0 10px 30px rgba(255,255,255,0.3)'
          })
        )
      ])
    ]),
    trigger('slideFade', [
      transition(':increment', [
        style({
          opacity: 0,
          transform: 'translateX(100px)'
        }),
        animate('600ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({
            opacity: 1,
            transform: 'translateX(0)'
          })
        )
      ]),
      transition(':decrement', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)'
        }),
        animate('600ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({
            opacity: 1,
            transform: 'translateX(0)'
          })
        )
      ])
    ]),
    trigger('popupAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
      ])
    ])

  ]
})
export class EcoDriveAccueilComponent implements OnInit {

currentPlanIndex = 0;
animationState = 0;
@ViewChild('plansSection') plansSection!: ElementRef;

typed!: Typed;
@ViewChild('typedElement', { static: true }) typedElement!: ElementRef;

plans : PlanStockage[] = []
// popular : boolean = false


constructor(private ps : PlanStockageService){}
ngOnInit(): void {
  this.ps.getPlans().subscribe(
    (data) => {this.plans=data;
      console.log("plans : " + this.plans)
      this.plans.forEach(plan => {plan.tailleMax=this.formatBytesToGB(plan.tailleMax)

      });
    }
  )

   const options = {
    strings: ['Secure', 'Eco-friendly', 'Easy'],
    typeSpeed: 100,
    backSpeed: 35,
    backDelay: 1500,
    loop: true
  };

  this.typed = new Typed(this.typedElement.nativeElement, options);
}

prevPlan() {
  if (this.currentPlanIndex > 0) {
    this.currentPlanIndex--;
    this.animationState--;
  }
}

nextPlan() {
  if (this.currentPlanIndex < this.plans.length - 1) {
    this.currentPlanIndex++;
    this.animationState++;
  }
}



goToPlan(index: number) {
  this.currentPlanIndex = index;
}

selectPlan(plan: any) {

  console.log('Selected plan:', plan);
  this.selectedPlan = plan;
  this.showPaypal = true;
  // Add your navigation or subscription logic here
}


scrollToPlans() {
  this.plansSection.nativeElement.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
}




showPaypal: boolean = false;
selectedPlan: any = null;



closePaypal() {
  this.showPaypal = false;
}

formatBytesToGB(bytes: number): number {
  return parseFloat((bytes / (1024 ** 3)).toFixed(2));
}


onRefresh() {
    // Do something, like reloading data
    console.log('Child triggered refresh!');
     window.location.reload();
  }
}
