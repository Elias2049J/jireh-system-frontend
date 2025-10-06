import { OptionDTO } from './option.dto';

export interface OptionListDTO {
  idOptionList: number;
  name: string;
  minSelectable: number;
  maxSelectable: number;
  options: OptionDTO[];
}

