export class UserModel {
  constructor(
    public idUser: number | null,
    public name: string,
    public pass: string,
    public active: boolean | null,
    public role: string
  ) {}
}

