import { fetchClient } from "./client";
import { PurchaseOrder } from "@/types";

export async function uploadOrderFile(file: File): Promise<PurchaseOrder> {
  const formData = new FormData();
  formData.append("file", file, file.name);

  const rawData = await fetchClient<PurchaseOrder>("/scan", {
    method: "POST",
    body: formData,
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("purchase_order", JSON.stringify(rawData));
  }

  return rawData;
}
