import { AuthService } from 'src/app/client/UserManagement/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { EspaceStockage, StatutEspace } from 'src/app/entities/espaceStockage';
import { Subscription } from 'src/app/entities/subscription';
import { EspaceStockageService } from 'src/app/services/espace-stockage.service';
import { concatMap } from 'rxjs/operators';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { paypal } from 'src/environment/environment-vars';
import { CloudinaryService } from 'src/app/services/cloudinary.service';
import Swal from 'sweetalert2';
import { User } from 'src/app/admin/models/user';

declare var window: any;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css'],
  animations: [

  ]
})

export class PaypalComponent implements OnInit {

  @Input() selectedPlan: any;  // Input property to receive the selected plan
  @Output() close = new EventEmitter<void>();  // Output event to notify closing the modal

  public payPalConfig?: IPayPalConfig;
  public showPaypalButtons = false;
  public paymentAmount = '';
  public currency = 'USD';
  public description = '';
  public paymentMethod = 'paypal';

  // Payment status tracking
  public paymentStatus = '';
  public paymentError = '';
  public paymentId = '';
  public payerId = '';

  public rootFolder= "EcoCycleTech/"

  public currentUser !: User;

  constructor(private http : HttpClient, private es : EspaceStockageService, private ss : SubscriptionService, private cloudinaryService : CloudinaryService, private auth: AuthService) { }


  ngOnInit(): void {
    this.initConfig();
    console.log(this.selectedPlan);
    this.currentUser=this.auth.getCurrentUser();
    
    console.log(this.currentUser)

    if (this.selectedPlan){
      this.paymentAmount= this.selectedPlan.prix
      this.description = this.selectedPlan.titre
    }
  }

  closePopup() {
    this.notifyParent();
    this.close.emit();
    
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: this.currency,
      clientId: paypal.apiKey,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: this.currency,
              value: this.paymentAmount,
              breakdown: {
                item_total: {
                  currency_code: this.currency,
                  value: this.paymentAmount
                }
              }
            },
            items: [
              {
                name: this.selectedPlan.titre,
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: this.currency,
                  value: this.paymentAmount
                }
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
      },
      onApprove: (data, actions) => {
        this.paymentId = data.orderID;
        this.payerId = data.payerID;

        // Call your backend to execute the payment
        this.executePayment(this.paymentId, this.payerId);

        return actions.order.capture().then(() => {
          this.paymentStatus = 'Payment completed successfully!';
        });
      },
      onClientAuthorization: (data) => {
        this.paymentStatus = 'Payment authorized successfully.';
        console.log('Payment authorized: ', data);
      },
      onCancel: (data, actions) => {
        this.paymentStatus = 'Payment completed successfully!';
        this.paymentId=data.orderID;
        this.continuePayment()
        console.log('Payment completed successfully! ', data);
      },
      onError: err => {
        this.paymentError = 'Error processing payment.';
        console.log('Payment error: ', err);
      },
      onClick: (data, actions) => {
        // Reset status messages
        this.paymentStatus = '';
        this.paymentError = '';
      }
    };
  }

  // Method to start payment process
  public startPayment(): void {
    this.showPaypalButtons = true;
  }

  // Method to execute payment on your backend
  private executePayment(paymentId: string, payerId: string) {
  }


@Output() refreshParent = new EventEmitter<void>();

  notifyParent() {
    console.log("emitting signal")
    this.refreshParent.emit(); // emit signal
  }

  public continuePayment(){

    console.log("continuing payment")
    let paidAt : Date = new Date()
    let endDate = new Date(paidAt);
    endDate.setMonth(endDate.getMonth() + 1);

    //user dependent
    let user = {idUser:this.currentUser.id};
    console.log("user : " +this.currentUser)


    //create space
    let espace = new EspaceStockage(
      0,
      0,
      this.selectedPlan.prix,
      endDate,
      new Date(),
      StatutEspace.ACTIVE,
      []
    );

    this.closePopup();

    //Add space before adding subscription
    this.es.AddEspace(espace).pipe(
      concatMap((espaceResponse: EspaceStockage) => {

        console.log("User =  "+ JSON.stringify(this.currentUser))
        let sub = new Subscription(
          parseInt(this.paymentAmount),
          'TND',
          this.paymentId,
          'completed',
          paidAt,
          paidAt,
          endDate,
          user,
          this.selectedPlan,
          espaceResponse
        );
        console.log('Subscription to be added:', sub);
        return this.ss.addSubscription(sub);
      })
    ).subscribe(
      (response) => {
        console.log('Subscription added successfully:', response);
        
        
      },
      (error) => {
        console.error('Error occurred while adding subscription:', error);
      }
    );



 //user dependent
    let folderPath = this.rootFolder + this.currentUser.username + "_" + this.currentUser.id
    console.log ("creating folder : "+ folderPath)
    this.cloudinaryService.createFolder(folderPath).subscribe( {
      next: () => {

        Swal.fire({
          icon: 'success',
          title: 'Purchase completed successfully!',
          text: `You can start using your storage space`,
          confirmButtonColor: '#3085d6',
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
      },
      error: (error) => {
        console.error('Error creating folder:', error);

        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Something went wrong. Please try again later.',
          confirmButtonColor: '#d33'
        });
      }
      });

      }

  }


