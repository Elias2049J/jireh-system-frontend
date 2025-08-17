export class SupplyModel {
  constructor(
    public idSupply: number | null,
    public name: string,
    public type: string,
    public unitType: string,
    public minStock: number
  ) {}
}
