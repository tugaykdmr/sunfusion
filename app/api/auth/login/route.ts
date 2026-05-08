import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const AUTH_JWT_SECRET = process.env.AUTH_JWT_SECRET;

console.log("[auth/login] env check", {
  NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: SUPABASE_SERVICE_ROLE_KEY,
  AUTH_JWT_SECRET: AUTH_JWT_SECRET,
});

type LoginRequest = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !AUTH_JWT_SECRET) {
    console.error("[auth/login] missing env variables", {
      NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: SUPABASE_SERVICE_ROLE_KEY,
      AUTH_JWT_SECRET: AUTH_JWT_SECRET,
    });

    return NextResponse.json(
      {
        message:
          "Sunucu ortam degiskenleri eksik veya bos. Vercel Project Settings > Environment Variables altinda NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY ve AUTH_JWT_SECRET degiskenlerinin tanimli oldugunu kontrol edin.",
      },
      { status: 500 }
    );
  }

  let body: LoginRequest;
  try {
    body = (await request.json()) as LoginRequest;
  } catch {
    return NextResponse.json(
      { message: "Invalid request payload." },
      { status: 400 }
    );
  }

  const username = body.username?.trim();
  const password = body.password ?? "";

  if (!username || !password) {
    return NextResponse.json(
      { message: "Username ve password zorunludur." },
      { status: 400 }
    );
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("id, tenant_id, username, password_hash, role")
    .eq("username", username)
    .single();

  if (error || !user) {
    return NextResponse.json(
      { message: "Kullanıcı adı veya şifre hatalı." },
      { status: 401 }
    );
  }

  const isValidPassword = await compare(password, user.password_hash);
  if (!isValidPassword) {
    return NextResponse.json(
      { message: "Kullanıcı adı veya şifre hatalı." },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    {
      sub: user.id,
      tenant_id: user.tenant_id,
      username: user.username,
      role: user.role,
    },
    AUTH_JWT_SECRET,
    { expiresIn: "12h" }
  );

  const redirectTo = user.role === "SUPERADMIN" ? "/admin" : "/dashboard";
  const response = NextResponse.json({ success: true, redirectTo });

  response.cookies.set("sunfusion_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
