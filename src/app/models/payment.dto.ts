export enum PaymentMethod {
  EFECTIVO,
  TARJETA,
  YAPE,
  PLIN,
  TRANSFERENCIA
}

export class PaymentDTO {
  constructor(
    public idPayment: number | null,
    public dateTime: string | null,
    public paymentMethod : PaymentMethod,
    public amount: number | null,
    public  idVoucher: number | null
  ) {
  }
}
