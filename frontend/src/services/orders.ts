import { fetchClient } from "./client";
import { PurchaseOrder, SaveOrderResponseDTO } from "@/types";

export async function uploadOrder(file: File): Promise<PurchaseOrder> {
  const formData = new FormData();
  formData.append("file", file);

  const updatedData = await fetchClient<PurchaseOrder>("/orders/upload", {
    method: "POST",
    body: formData,
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("purchase_order", JSON.stringify(updatedData));
  }

  return updatedData;
}

export async function calculateOrderVolume(order: PurchaseOrder): Promise<PurchaseOrder> {
  const updatedData = await fetchClient<PurchaseOrder>("/orders/calculate", {
    method: "POST",
    body: JSON.stringify(order),
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("purchase_order", JSON.stringify(updatedData));
  }

  return updatedData;
}

export async function quoteOrderFreight(order: PurchaseOrder): Promise<PurchaseOrder> {
  const updatedData = await fetchClient<PurchaseOrder>("/orders/quote", {
    method: "POST",
    body: JSON.stringify(order),
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("purchase_order", JSON.stringify(updatedData));
  }

  return updatedData;
}

export async function saveOrderToDatabase(order: PurchaseOrder): Promise<SaveOrderResponseDTO> {
  const result = await fetchClient<SaveOrderResponseDTO>("/orders/save", {
    method: "POST",
    body: JSON.stringify(order),
  });

  if (result.status === "success" && typeof window !== "undefined") {
    localStorage.removeItem("purchase_order");
  }

  return result;
}
