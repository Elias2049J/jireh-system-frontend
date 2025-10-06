import {Product} from './product.model';

export interface OptionDTO {
  idOption: number;
  name: string;
  alias: string;
  additionalPrice: number;
  defaultSelected: boolean;
  idOptionList: number;
  idProduct: number | null;
}

