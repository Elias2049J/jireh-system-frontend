export enum PrintArea {
  COCINA = 'COCINA',
  MESERO = 'MESERO',
  CAJA = 'CAJA'
}

export class Menu {
  constructor(
    public idMenu: number | null,
    public name: string,
    public printArea: PrintArea | null
  ) {}
}
