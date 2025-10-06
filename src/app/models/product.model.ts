import {OptionListDTO} from './option-list.dto';

export enum ProductType {
  SIMPLE = 'SIMPLE'
}

export enum ProductSubType {
  simple = 'simple',
}

export class Product {
  constructor(
    public type: ProductSubType,
    public productType: ProductType,
    public idProduct: number | null,
    public code: string | null,
    public name: string | null,
    public prefix: string | null,
    public price: number | null,
    public available: boolean,
    public idMenu: number | null,
    public optionLists: OptionListDTO[] | null
  ) {}
}
