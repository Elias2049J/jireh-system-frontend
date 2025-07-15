import {Product} from './product.model';

export class Menu {
  constructor(
    public idMenu: number,
    public name: string,
    public products: Product[]
  ) {}
}
