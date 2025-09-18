export enum ProductType {
  SIMPLE = 'SIMPLE',
  COMPUESTO = 'COMPUESTO',
}

export enum ProductSubType {
  simple = 'simple',
  composed = 'composed'
}

export class Product {
  constructor(
    public type: ProductSubType,
    public productType: ProductType,
    public idProduct: number | null,
    public code: string | null,
    public name: string | null,
    public alias: string | null,
    public price: number | null,
    public available: boolean,
    public idMenu: number | null,
    public idsSimpleProducts: number[] | null
  ) {}
}
