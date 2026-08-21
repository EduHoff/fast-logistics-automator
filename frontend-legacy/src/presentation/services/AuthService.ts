import { Routes } from "@/api/Routes";
import { CreateUserDTO } from "@/application/dtos/CreateUserDTO";
import { User } from "@/domain/entities/User";
import { UserRole } from "@/domain/enums/UserRole";

export class AuthService {

  async register(data: CreateUserDTO): Promise<User> {
    const newUser = new User(
      data.name,
      data.email,
      data.password,
      data.role as UserRole
    );

    return await Routes.register(newUser);
  }

  async login(email: string, password: string): Promise<User> {
    return await Routes.login(email, password);
  }


  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("purchase_order");
    }
  }


  isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token");
    }
    return false;
  }
}