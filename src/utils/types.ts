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

export interface FileTypes {
  id: number;
  url: string;
}

export interface OrderType {
  id: number;
  user_id: number;
  status: number;
  brend: null | string;
  product: string;
  role: string;
  category_id: number;
  safia_worker: true;
  created_at: string;
  updated_at: string | null;
  category: CategoryType;
  user: UserType;
  price: number;
  product_images: FileTypes[];

  brochures: FileTypes[];
  deny_reason?: string;
  sertificates: FileTypes[];
}

export enum ModalTypes {
  image,
  deny_reason,
  add_prods,
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
  brown = "brown",
}
export type ToolsType = {
  folders: [
    {
      id: string;
      name: string;
      category: null;
      parent_id: string;
      num: string;
      code: string;
      description: string;
    }
  ];
  tools: ExpenditureType[];
};

export interface ExpenditureToolType {
  id: number;
  tool_id: number;
  tool: {
    id: number;
    name: string;
    code: string;
    status: number;
    iiko_id: string;
    price: number;
    mainunit?: string;
    num: string;
  };
  amount: number;
}

export interface ToolsSearchType {
  id: number;
  name: string;
  status: number;
  iiko_id: string;
  price: number;
}

export interface ToolsSearchTypes extends BasePaginate {
  items: ToolsSearchType[];
}

export interface ExpenditureType {
  id: number;
  client_id: number;
  client: {
    id: number;
    name: string;
    phone: string;
    status: number;
  };
  branch: {
    id: number;
    name: string;
    status: number;
  };
  branch_id: number;
  status: number;
  comment: string;
  total_sum: number;
  expendituretool: ExpenditureToolType[];
  created_at: string;
  updated_at: string;
  deny_reason?: string;
  user?: { name?: string };
}

export interface ExpendituresType extends BasePaginate {
  items: ExpenditureType[];
}

export interface BranchType {
  id: number;
  name: string;
  status: number;
}

export interface BranchesType extends BasePaginate {
  items: BranchType[];
}
export interface ClientType {
  id: number;
  name: string;
  status: number;
  phone: string;
}

export interface ClientsType extends BasePaginate {
  items: ClientType[];
}
export interface SelectValue {
  value: number;
  label: string;
  count: number;
}

export enum Operations {
  decrement,
  increment,
}
