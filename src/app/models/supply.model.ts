export class SupplyModel {
  constructor(
    public id: number | null,
    public name: string,
    public description:string,
    public unitCost: number,
    public unit: string,
    public stock: number
  ) {}
}
