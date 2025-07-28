export class Product {
  constructor(
    public id: number | null,
    public desc: string,
    public price: number,
    public available: boolean,
    public idMenu: number | null
  ) {}
}
