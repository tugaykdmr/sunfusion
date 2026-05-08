import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Module } from "@/lib/types";

type AuthTokenPayload = {
  sub: string;
  tenant_id: string;
  username: string;
  role: string;
};

type DashboardContext = {
  user: {
    id: string;
    username: string;
    full_name: string;
    role: string;
  };
  tenant: {
    id: string;
    name: string;
    active_modules: Module[];
  };
};

export async function requireDashboardContext(): Promise<DashboardContext> {
  const token = (await cookies()).get("sunfusion_token")?.value;
  const authSecret = process.env.AUTH_JWT_SECRET;

  if (!token || !authSecret) {
    redirect("/login");
  }

  let payload: AuthTokenPayload;
  try {
    payload = jwt.verify(token, authSecret) as AuthTokenPayload;
  } catch {
    redirect("/login");
  }

  const { data: user, error: userError } = await supabaseAdmin
    .from("users")
    .select("id, username, full_name, role, tenant_id")
    .eq("id", payload.sub)
    .eq("tenant_id", payload.tenant_id)
    .single();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: tenant, error: tenantError } = await supabaseAdmin
    .from("tenants")
    .select("id, name, active_modules")
    .eq("id", user.tenant_id)
    .single();

  if (tenantError || !tenant) {
    redirect("/login");
  }

  return {
    user: {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
    },
    tenant: {
      id: tenant.id,
      name: tenant.name,
      active_modules: (tenant.active_modules ?? []) as Module[],
    },
  };
}
