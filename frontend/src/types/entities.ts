import { Category, UnitType, UserRole, VehicleType } from "./enums";

export interface User {
  name: string;
  email: string;
  role: UserRole;
}

export interface Product {
  code: string;
  description: string;
  quantity: number;
  unit: UnitType;
  category: Category;
  items_per_m3?: number;
  length?: number;
  width?: number;
  height?: number;
}

export interface Vehicle {
  capacity_m3: number;
  type: VehicleType;
  quantity: number;
}
