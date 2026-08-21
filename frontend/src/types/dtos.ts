import { UF, UserRole } from "./enums";
import { Product, User, Vehicle } from "./entities";

export interface LoginCredentialsDTO {
  email: string;
  password: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginResponseDTO {
  access_token: string;
  user: User;
}

export interface PurchaseOrder {
  order_number: string;
  customer_name: string;
  city: string;
  uf: UF;
  created_by_id: string;
  total_volume_m3: number;
  total_freight: number;
  items: Product[];
  vehicles: Vehicle[];
}

export interface SaveOrderResponseDTO {
  status: string;
  message: string;
  id_interno: string;
}