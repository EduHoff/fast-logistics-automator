import { Category } from "../enums/Category";
import { UnitType } from "../enums/UnitType";

export class Product {
  private codeAttr: string;
  private descriptionAttr: string;
  private quantityAttr: number;
  private unitAttr: UnitType;
  private categoryAttr: Category;
  private itemsPerM3Attr: number;
  private lengthAttr: number;
  private widthAttr: number;
  private heightAttr: number;

  constructor();
  
  constructor(
    code: string,
    description: string,
    quantity: number,
    unit: UnitType,
    category: Category,
    items_per_m3?: number,
    length?: number,
    width?: number,
    height?: number
  );

  constructor(
    code?: string,
    description?: string,
    quantity?: number,
    unit?: UnitType,
    category?: Category,
    items_per_m3: number = 0,
    length: number = 0,
    width: number = 0,
    height: number = 0
  ) {
    this.codeAttr = code ?? "";
    this.descriptionAttr = description ?? "";
    this.quantityAttr = quantity !== undefined ? quantity : 0;
    this.unitAttr = unit!;
    this.categoryAttr = category!;
    this.itemsPerM3Attr = items_per_m3;
    this.lengthAttr = length;
    this.widthAttr = width;
    this.heightAttr = height;

    if (quantity !== undefined && quantity < 0) {
      throw new Error("Quantity cannot be negative");
    }
  }

  public get code(): string { return this.codeAttr; }
  public set code(value: string) { this.codeAttr = value; }

  public get description(): string { return this.descriptionAttr; }
  public set description(value: string) { this.descriptionAttr = value; }

  public get quantity(): number { return this.quantityAttr; }
  public set quantity(value: number) {
    if (value < 0) {
      throw new Error("Quantity cannot be negative");
    }
    this.quantityAttr = value;
  }

  public get unit(): UnitType { return this.unitAttr; }
  public set unit(value: UnitType) { this.unitAttr = value; }

  public get category(): Category { return this.categoryAttr; }
  public set category(value: Category) { this.categoryAttr = value; }

  public get items_per_m3(): number { return this.itemsPerM3Attr; }
  public set items_per_m3(value: number) { this.itemsPerM3Attr = value; }

  public get length(): number { return this.lengthAttr; }
  public set length(value: number) { this.lengthAttr = value; }

  public get width(): number { return this.widthAttr; }
  public set width(value: number) { this.widthAttr = value; }

  public get height(): number { return this.heightAttr; }
  public set height(value: number) { this.heightAttr = value; }
}