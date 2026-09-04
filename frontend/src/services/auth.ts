import { fetchClient } from "./client";
import { CreateUserDTO, LoginCredentialsDTO, LoginResponseDTO, User } from "@/types";

export async function registerUser(data: CreateUserDTO): Promise<User> {
  return fetchClient<User>("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(credentials: LoginCredentialsDTO): Promise<LoginResponseDTO> {
  const data = await fetchClient<LoginResponseDTO>("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
}

export function logoutUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("purchase_order");
    window.location.href = "/login";
  }
}

export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("token");
  }
  return false;
}
