import { z } from "zod";

// Saudi phone: Starts with 05 and is 10 digits total, OR starts with 5 and is 9 digits total.
export const SAUDI_PHONE_REGEX = /^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;

export const RegisterSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون أكثر من حرفين"),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
  phone: z.string().regex(SAUDI_PHONE_REGEX, "رقم الجوال غير صحيح (يجب أن يكون رقم سعودي)"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
});

export const LoginSchema = z.object({
  phone: z.string().regex(SAUDI_PHONE_REGEX, "رقم الجوال غير صحيح (يجب أن يكون رقم سعودي)"),
});

export const VerifySchema = z.object({
  phone: z.string(),
  code: z.string().length(4, "رمز التحقق يجب أن يكون 4 أرقام"),
});

export function formatToE164(phone: string): string {
  // Strip leading 0 if exists
  const clean = phone.startsWith("0") ? phone.substring(1) : phone;
  return `+966${clean}`;
}
