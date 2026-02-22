export class CustomerEntity {
  userId: string;
  name: string;
  email: string;

  constructor(param: CustomerEntity) {
    this.userId = param.userId;
    this.name = param.name;
    this.email = param.email;
  }
}
