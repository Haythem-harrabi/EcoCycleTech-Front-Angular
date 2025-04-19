import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, ViewChild } from '@angular/core';

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
    ])
  ]
})
export class EcoDriveAccueilComponent {
  
currentPlanIndex = 0;
animationState = 0;
@ViewChild('plansSection') plansSection!: ElementRef;


plans = [
  {
    id: 1,
    titre: 'EcoBasic',
    tailleMax: 50,
    prix: 9.99,
    popular: false,
    features: [
      '50GB Storage',
      'Basic Security',
      '24/7 Support'
    ]
  },
  {
    id: 2,
    titre: 'EcoPro',
    tailleMax: 200,
    prix: 19.99,
    popular: true,
    features: [
      '200GB Storage',
      'Advanced Security',
      'Priority Support'
    ]
  },
  {
    id: 3,
    titre: 'EcoEnterprise',
    tailleMax: 500,
    prix: 39.99,
    popular: false,
    features: [
      '500GB Storage',
      'Enterprise Security',
      'Dedicated Account Manager'
    ]
  }
];

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
  // Add your navigation or subscription logic here
}


scrollToPlans() {
  this.plansSection.nativeElement.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
}
}