"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutUser(lang: string) {
  (await cookies()).delete("reef_session");
  redirect(`/${lang}/login`);
}
