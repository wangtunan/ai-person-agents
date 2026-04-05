const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  health: () => request<{ status: string }>("/api/health"),

  weather: (city: string) => {
    return request(`/api/weather?city=${encodeURIComponent(city)}`);
  },

  vsix: (url: string) => {
    return request("/api/vsix", {
      method: "POST",
      body: JSON.stringify({ url: encodeURIComponent(url) }),
    });
  },
};
