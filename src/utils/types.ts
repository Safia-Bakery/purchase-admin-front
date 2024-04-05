export enum Language {
  ru = "ru",
  uz = "uz",
}
export interface BasePaginate {
  total: number;
  page: number;
  size: number;
  pages: number;
}
export type UserType = {
  id: number;
  address: string;
  name: string;
  inn: string;
  email: string;
  company_name: string;
  phone: string;
  status: number;
  created_at: string;
  updated_at: string;
};

export interface CategoriesType extends BasePaginate {
  items: CategoryType[];
}

export interface SelectValues {
  id: number;
  name_uz: string;
  name_ru: string;
  status?: number;
}

export interface CategoryType extends SelectValues {
  created_at: string;
  updated_at: string;
}

export interface OredersType extends BasePaginate {
  items: OrderType[];
}

export interface OrderType {
  id: number;
  user_id: number;
  status: number;
  brend: string;
  product: string;
  role: string;
  sertificate: string;
  brochure: string;
  category_id: number;
  category: CategoryType;
  safia_worker: true;
  created_at: string;
  updated_at: string;
  user: UserType;
  deny_reason?: string;
}

export enum ModalTypes {
  image,
  deny_reason,
}
export enum FileType {
  other,
  video,
  photo,
}

export enum OrderStatus {
  new,
  received,
  done,
  denied,
}

export enum BtnTypes {
  success = "success",
  danger = "danger",
  warn = "warn",
  info = "info",
  primary = "primary",
}
