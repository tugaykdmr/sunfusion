export const USER_ROLES = [
  "SUPERADMIN",
  "MUDUR",
  "YONETICI",
  "KULLANICI",
  "GOZLEMCI",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const MODULE_TYPES = [
  "SOLAR_OM",
  "SOLAR_DENETIM",
  "BESS_OM",
  "BESS_DENETIM",
  "SOLAR_KESIF",
  "TRAFO_BAKIM",
] as const;

export type Module = (typeof MODULE_TYPES)[number];

export type Tenant = {
  id: string;
  name: string;
  logo_url: string | null;
  contract_start: string;
  contract_end: string;
  active_modules: Module[];
  supported_languages: string[];
  theme: string;
};

export type User = {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
};
