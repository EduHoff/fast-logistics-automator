import { VehicleType } from "../enums/VehicleType";

export class Vehicle {
  private capacityM3Attr: number;
  private typeAttr: VehicleType;
  private quantityAttr: number;

  constructor();

  constructor(capacity_m3: number, type: VehicleType, quantity: number);

  constructor(capacity_m3?: number, type?: VehicleType, quantity?: number) {
    this.capacityM3Attr = capacity_m3 ?? 0;
    this.typeAttr = type!;
    this.quantityAttr = quantity ?? 0;
  }

  public get capacity_m3(): number { return this.capacityM3Attr; }
  public set capacity_m3(value: number) { this.capacityM3Attr = value; }

  public get type(): VehicleType { return this.typeAttr; }
  public set type(value: VehicleType) { this.typeAttr = value; }

  public get quantity(): number { return this.quantityAttr; }
  public set quantity(value: number) { this.quantityAttr = value; }

  public toDict(): Record<string, number | VehicleType> {
    return {
      capacity_m3: this.capacity_m3,
      type: this.type,
      quantity: this.quantity
    };
  }
}