import { useAuth } from "@/context/AuthContext";

export function useFetcher() {
  const { user, apiBaseUrl } = useAuth();

  return async (url: string) => {
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Ensure we don't double slash if url starts with /
    const fullUrl = `${apiBaseUrl}${url.startsWith("/") ? "" : "/"}${url}`;

    const token = await user.getIdToken();
    const res = await fetch(fullUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = new Error("An error occurred while fetching the data.");
      // Attach extra info to the error object.
      // @ts-expect-error - Error object extension
      error.info = await res.json();
      // @ts-expect-error - Error object extension
      error.status = res.status;
      throw error;
    }

    return res.json();
  };
}
