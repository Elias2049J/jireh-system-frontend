export class MesaDTO {
  constructor(
    public id: number | null,
    public number: number | null,
    public free: boolean | null,
    public paid: boolean | null,
    public activatedAt?: Date | null
  ) {}
}
