import { User } from "@/domain/entities/User";
import { Routes } from "@/api/Routes";
import { CreateUserDTO } from "../dtos/CreateUserDTO";

export class CreateUserUseCase {
  constructor() {}

  async execute(data: CreateUserDTO): Promise<User> {
    const user = new User(
      data.name,
      data.email,
      data.password,
      data.role
    );

    return await Routes.register(user);
  }
}