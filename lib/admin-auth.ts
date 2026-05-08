import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type AuthTokenPayload = {
  sub: string;
  tenant_id: string;
  username: string;
  role: string;
};

export async function requireSuperAdmin() {
  const token = (await cookies()).get("sunfusion_token")?.value;
  const authSecret = process.env.AUTH_JWT_SECRET;

  if (!token || !authSecret) {
    redirect("/login");
  }

  try {
    const payload = jwt.verify(token, authSecret) as AuthTokenPayload;
    if (payload.role !== "SUPERADMIN") {
      redirect("/dashboard");
    }
    return payload;
  } catch {
    redirect("/login");
  }
}
