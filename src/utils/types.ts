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
  permissions?: { [key: number]: boolean };
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

  purchaser: {
    user_id: number;
    user: UserType;
  }[];
}

export enum ModalTypes {
  image,
  deny_reason,
  add_prods,
  assign,
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

export interface ToolType {
  id: number;
  name: string;
  status: number;
  iiko_id: string;
  price: number;
  num: string;
  mainunit: string;
  code: string;
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
  label?: string;
  count?: number;
}

export enum Operations {
  decrement,
  increment,
}

export interface RoleTypes {
  id: number;
  name: string;
  description: string;
  status: number;
  access: {
    id: number;
    name?: string;
    permission?: PermissionsType;
    role_id: number;
    permission_id: number;
    status: number;
    created_at: string;
    updated_at: string;
  }[];

  created_at: string;
  updated_at: string;
}

export interface PermissionsType {
  id: number;
  parent_id: number;
  created_at: string;
  description: string;
  name: string;
  status: number;
  updated_at: string;
}

export enum MainPermissions {
  orders = 1,
  ordersAll = 2,
  categories = 3,
  categoriesAll = 5,
  foremanOrders = 5,
  foremanOrdersAdd = 6,
  buildingMaterials = 7,
  foremen = 8,
  foremenAll = 9,
  roles = 10,
  rolesAll = 11,
  users = 12,
  usersAll = 13,
}

export interface UserTypes {
  id: number;
  address: string;
  name: string;
  inn: string;
  email: string;
  company_name: string;
  phone: string;
  permission: PermissionsType;
  status: number;
  role: RoleTypes;
}

export interface UsersTypes extends BasePaginate {
  items: UserTypes[];
}

export interface PurchasersTypes extends BasePaginate {
  items: PurchaserType[];
}

export interface PurchaserType {
  id: number;
  address: null | string;
  name: null | string;
  inn: null | string;
  email: null | string;
  company_name: null | string;
  phone: string;
  status: number;
}
