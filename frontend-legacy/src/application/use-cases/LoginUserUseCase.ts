import { User } from "domain/entities/User";
import { Routes } from "api/Routes";

export class LoginUserUseCase {

  constructor() {}

  async execute(email: string, password: string): Promise<User> {

    const user = await Routes.login(email, password);

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    return user;
  }
}