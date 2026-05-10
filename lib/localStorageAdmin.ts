export const LS_TESTIMONIALS_KEY = "admin-testimonials";
export const LS_USER_TYPE_KEY = "admin-user-type";
export const LS_TOKEN_KEY = "admin-auth-token";

export type UserType = "static" | "env";

export type LocalTestimonial = {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating: number;
  quote: string;
};

export function getUserType(): UserType | null {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem(LS_USER_TYPE_KEY);
  if (val === "static" || val === "env") return val;
  // Legacy fallback: infer type from the token value itself
  const token = localStorage.getItem(LS_TOKEN_KEY);
  if (token === "static-admin-token" || token === "demo-admin-token") return "static";
  if (token === "env-admin-token") return "env";
  return null;
}

export function isStaticUser(): boolean {
  return getUserType() === "static";
}

export function getLocalTestimonials(): LocalTestimonial[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_TESTIMONIALS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as LocalTestimonial[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalTestimonials(items: LocalTestimonial[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_TESTIMONIALS_KEY, JSON.stringify(items));
}

export function createLocalTestimonial(
  data: Omit<LocalTestimonial, "_id">
): LocalTestimonial {
  const item: LocalTestimonial = {
    ...data,
    _id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  };
  saveLocalTestimonials([...getLocalTestimonials(), item]);
  return item;
}

export function updateLocalTestimonial(
  id: string,
  data: Partial<Omit<LocalTestimonial, "_id">>
): void {
  saveLocalTestimonials(
    getLocalTestimonials().map((item) =>
      item._id === id ? { ...item, ...data } : item
    )
  );
}

export function deleteLocalTestimonial(id: string): void {
  saveLocalTestimonials(
    getLocalTestimonials().filter((item) => item._id !== id)
  );
}
