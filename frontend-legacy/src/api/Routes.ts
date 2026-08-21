const API_URL = "http://localhost:8000";

import { PurchaseOrder } from "@/domain/entities/PurchaseOrder";
import { User } from "@/domain/entities/User";
import { UserRole } from "@/domain/enums/UserRole";

export class Routes {
  
  // ==========================================
  // ROTAS PÚBLICAS (Sem alteração)
  // ==========================================

  static async register(user: User): Promise<User> {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user.toDict()),
    });

    if (!response.ok) throw new Error("Erro ao registrar usuário");
    const data = await response.json();
    return new User(data.nome || data.name, data.email, "x", data.role as UserRole);
  }

  static async login(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("E-mail ou senha incorretos");

    const data = await response.json();
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));

    const u = data.user;
    return new User(u.nome || u.name, u.email, "x", u.role as UserRole);
  }

  // ==========================================
  // ROTAS PROTEGIDAS (Sincronizando o Estado)
  // ==========================================

  static async uploadOrder(file: File): Promise<PurchaseOrder> {
    const formData = new FormData();
    formData.append("file", file, file.name);

    const response = await fetch(`${API_URL}/scan`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      body: formData,
    });

    if (!response.ok) throw new Error("Erro ao processar arquivo");
    
    const rawData = await response.json();

    localStorage.setItem("purchase_order", JSON.stringify(rawData));

    return PurchaseOrder.fromDict(rawData);
  }

  static async calculateOrder(data: PurchaseOrder): Promise<PurchaseOrder> {
    const response = await fetch(`${API_URL}/orders/calculate`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}` 
      },
      body: JSON.stringify(data.toDict()),
    });

    if (!response.ok) throw new Error("Erro ao calcular cubagem do pedido");

    const updatedData = await response.json();
    
    localStorage.setItem("purchase_order", JSON.stringify(updatedData));

    return PurchaseOrder.fromDict(updatedData);
  }

  static async quoteOrder(data: PurchaseOrder): Promise<PurchaseOrder> {
    const response = await fetch(`${API_URL}/orders/quote`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}` 
      },
      body: JSON.stringify(data.toDict()),
    });

    if (!response.ok) throw new Error("Erro ao cotar frete do pedido");

    const updatedData = await response.json();

    localStorage.setItem("purchase_order", JSON.stringify(updatedData));

    return PurchaseOrder.fromDict(updatedData);
  }

  static async saveOrder(data: PurchaseOrder): Promise<{ status: string; message: string; id_interno: string }> {
    const response = await fetch(`${API_URL}/orders/save`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}` 
      },
      body: JSON.stringify(data.toDict()),
    });

    if (!response.ok) throw new Error("Erro ao salvar pedido no banco");

    const result = await response.json();

    if (result.status === "success") {
      localStorage.removeItem("purchase_order");
    }

    return result;
  }
}