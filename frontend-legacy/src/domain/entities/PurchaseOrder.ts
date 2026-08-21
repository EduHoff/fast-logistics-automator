import { Product } from "./Product";
import { Vehicle } from "./Vehicle";
import { getUFAbbreviation, UF } from "../enums/UF";
import { VehicleType } from "../enums/VehicleType";
import { UnitType } from "../enums/UnitType";
import { Category } from "../enums/Category";

interface ProductJson {
  code: string;
  description: string;
  quantity: number;
  unit: string;
  category: string;
}

interface VehicleJson {
  capacity_m3: number;
  type: VehicleType;
  quantity: number;
}

interface PurchaseOrderJson {
  order_number: string;
  customer_name: string;
  city: string;
  uf: string;
  created_by_id: string;
  total_volume_m3: number;
  total_freight: number;
  items: ProductJson[];
  vehicles: VehicleJson[];
}

export type ApiDataPayload = Record<
  string, 
  string | number | boolean | ProductJson[] | VehicleJson[] | null | undefined
>;

export class PurchaseOrder {
  private orderNumberAttr: string;
  private customerNameAttr: string;
  private cityAttr: string;
  private ufAttr: UF;
  private createdByIdAttr: string;
  private totalVolumeM3Attr: number;
  private totalFreightAttr: number;
  private itemsAttr: Product[];
  private vehiclesAttr: Vehicle[];

  constructor();

  constructor(
    order_number: string,
    customer_name: string,
    city: string,
    uf: UF,
    created_by_id: string,
    total_volume_m3: number,
    total_freight?: number
  );

  constructor(
    order_number?: string,
    customer_name?: string,
    city?: string,
    uf?: UF,
    created_by_id?: string,
    total_volume_m3?: number,
    total_freight: number = 0
  ) {
    this.orderNumberAttr = order_number ?? "";
    this.customerNameAttr = customer_name ?? "";
    this.cityAttr = city ?? "";
    this.ufAttr = uf!;
    this.createdByIdAttr = created_by_id ?? "";
    this.totalVolumeM3Attr = total_volume_m3 ?? 0;
    this.totalFreightAttr = total_freight;
    this.itemsAttr = [];
    this.vehiclesAttr = [];

    if (total_volume_m3 !== undefined && total_volume_m3 < 0) {
      throw new Error("O volume total não pode ser negativo");
    }
  }

  public get order_number(): string { return this.orderNumberAttr; }
  public set order_number(value: string) { this.orderNumberAttr = value; }

  public get customer_name(): string { return this.customerNameAttr; }
  public set customer_name(value: string) { this.customerNameAttr = value; }

  public get city(): string { return this.cityAttr; }
  public set city(value: string) { this.cityAttr = value; }

  public get uf(): UF { return this.ufAttr; }
  public set uf(value: UF) { this.ufAttr = value; }

  public get created_by_id(): string { return this.createdByIdAttr; }
  public set created_by_id(value: string) { this.createdByIdAttr = value; }

  public get total_volume_m3(): number { return this.totalVolumeM3Attr; }
  public set total_volume_m3(value: number) {
    if (value < 0) {
      throw new Error("O volume total não pode ser negativo");
    }
    this.totalVolumeM3Attr = value;
  }

  public get total_freight(): number { return this.totalFreightAttr; }
  public set total_freight(value: number) {
    this.totalFreightAttr = Number(value.toFixed(2));
  }

  public get items(): Product[] { return this.itemsAttr; }
  public get vehicles(): Vehicle[] { return this.vehiclesAttr; }

  public add_item(product: Product): void {
    this.itemsAttr.push(product);
  }

  public add_vehicle(vehicle: Vehicle): void {
    this.vehiclesAttr.push(vehicle);
  }

  public get total_products_quantity(): number {
    return this.itemsAttr.reduce((sum, item) => sum + item.quantity, 0);
  }

  public get_linear_meters(capacity_ref: number = 60.0): number {
    if (this.total_volume_m3 === 0) {
      return 0.0;
    }
    return (this.total_volume_m3 * 12) / capacity_ref;
  }

  public get_meters_nvia(capacity_ref: number = 60.0): number {
    const meters = this.get_linear_meters(capacity_ref) * 1.10;
    return Number(meters.toFixed(2));
  }

  public get_meters_venda(capacity_ref: number = 60.0): number {
    const meters = this.get_linear_meters(capacity_ref) * 1.20;
    return Number(meters.toFixed(2));
  }

  public toDict(): PurchaseOrderJson {
    return {
      order_number: this.order_number,
      customer_name: this.customer_name,
      city: this.city,
      uf: getUFAbbreviation(this.uf),
      created_by_id: this.created_by_id,
      total_volume_m3: this.total_volume_m3,
      total_freight: this.total_freight,
      items: this.items.map((item) => ({
        code: item.code,
        description: item.description,
        quantity: item.quantity,
        unit: String(item.unit),
        category: String(item.category),
      })),
      vehicles: this.vehicles.map((v) => v.toDict() as unknown as Vehicle),
    };
  }

  static fromDict(data: ApiDataPayload): PurchaseOrder {
    const order = new PurchaseOrder(
      String(data.order_number ?? ""),
      String(data.customer_name ?? ""),
      String(data.city ?? ""),
      data.uf as UF,
      String(data.created_by_id ?? ""),
      Number(data.total_volume_m3 ?? 0),
      Number(data.total_freight ?? 0.0)
    );

    if (data.items && Array.isArray(data.items)) {
      (data.items as ProductJson[]).forEach((item) => {
        const product = new Product(
          item.code,
          item.description,
          Number(item.quantity),
          item.unit as UnitType,
          item.category as Category
        );
        order.add_item(product);
      });
    }

    if (data.vehicles && Array.isArray(data.vehicles)) {
      (data.vehicles as VehicleJson[]).forEach((v) => {
        const vehicle = new Vehicle(
          Number(v.capacity_m3),
          v.type,
          Number(v.quantity)
        );
        order.add_vehicle(vehicle);
      });
    }

    return order;
  }
}