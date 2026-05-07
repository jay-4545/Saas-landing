type ApiOptions = RequestInit & { errorMessage?: string };

async function request<T>(url: string, options: ApiOptions = {}): Promise<T> {
  const { errorMessage = "Request failed", ...init } = options;
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error ?? errorMessage);
  }
  return data as T;
}

export const fetchBlogs = () => request<unknown[]>("/api/blog");
export const createBlog = (data: unknown) =>
  request("/api/blog", { method: "POST", body: JSON.stringify(data) });
export const updateBlog = (id: string, data: unknown) =>
  request(`/api/blog/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteBlog = (id: string) =>
  request(`/api/blog/${id}`, { method: "DELETE" });

export const fetchTestimonials = () => request<unknown[]>("/api/testimonials");
export const createTestimonial = (data: unknown) =>
  request("/api/testimonials", { method: "POST", body: JSON.stringify(data) });
export const updateTestimonial = (id: string, data: unknown) =>
  request(`/api/testimonials/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteTestimonial = (id: string) =>
  request(`/api/testimonials/${id}`, { method: "DELETE" });

export const fetchMessages = () => request<unknown[]>("/api/messages");
export const markMessageRead = (id: string) =>
  request(`/api/messages/${id}`, { method: "PATCH", body: JSON.stringify({ status: "read" }) });
export const deleteMessage = (id: string) =>
  request(`/api/messages/${id}`, { method: "DELETE" });

export const fetchSettings = () => request<unknown>("/api/settings");
export const updateSettings = (data: unknown) =>
  request("/api/settings", { method: "PUT", body: JSON.stringify(data) });

export const fetchDashboardStats = () =>
  request<{
    totalBlogs: number;
    publishedBlogs: number;
    totalMessages: number;
    unreadMessages: number;
    totalTestimonials: number;
  }>("/api/dashboard");
