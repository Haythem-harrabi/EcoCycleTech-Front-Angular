import { User } from "../admin/models/user";
import { EspaceStockage } from "./espaceStockage";
import { PlanStockage } from "./planStockage";


export class Subscription {
        id?: number;
        amount!: number;
        currency: string = "TND";
        paypalPaymentId?: string;
        paymentStatus?: string;
        paidAt?: Date;
        startDate?: Date;
        endDate?: Date;
        user ?: any;
        planStockage ?: PlanStockage;
        espace ?: EspaceStockage;



constructor(
    amount: number,
    currency: string = "TND",
    paypalPaymentId?: string,
    paymentStatus?: string,
    paidAt?: Date,
    startDate?: Date,
    endDate?: Date,
    user?: any,
    planStockage?: PlanStockage,
    espace?: EspaceStockage,
    id?: number
  ) {
    this.id = id;
    this.amount = amount;
    this.currency = currency;
    this.paypalPaymentId = paypalPaymentId;
    this.paymentStatus = paymentStatus;
    this.paidAt = paidAt;
    this.startDate = startDate;
    this.endDate = endDate;
    this.user = user;
    this.planStockage = planStockage;
    this.espace = espace;
  }





}
