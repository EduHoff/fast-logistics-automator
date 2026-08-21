import { UserRole } from "../enums/UserRole";

export class User {
  private nameAttr: string;
  private emailAttr: string;
  private passwordAttr: string;
  private roleAttr: UserRole;

  constructor();

  constructor(name: string, email: string, password: string, role: UserRole);

  constructor(name?: string, email?: string, password?: string, role?: UserRole) {
    this.nameAttr = name ?? "";
    this.emailAttr = email ?? "";
    this.passwordAttr = password ?? "";
    this.roleAttr = role!;
  }

  public get name(): string { return this.nameAttr; }
  public set name(value: string) { this.nameAttr = value; }

  public get email(): string { return this.emailAttr; }
  public set email(value: string) { this.emailAttr = value; }

  public get password(): string { return this.passwordAttr; }
  public set password(value: string) { this.passwordAttr = value; }

  public get role(): UserRole { return this.roleAttr; }
  public set role(value: UserRole) { this.roleAttr = value; }

  public isAdmin(): boolean {
    return this.roleAttr === UserRole.ADMIN || String(this.roleAttr).toUpperCase() === "ADMIN";
  }

  public toDict(): Record<string, string> {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
      role: String(this.role).toLowerCase()
    };
  }
}