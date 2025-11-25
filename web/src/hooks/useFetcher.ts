import { useAuth } from "@/context/AuthContext";

export function useFetcher() {
  const { user } = useAuth();

  return async (url: string) => {
    if (!user) {
      throw new Error("Not authenticated");
    }

    const token = await user.getIdToken();
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = new Error("An error occurred while fetching the data.");
      // Attach extra info to the error object.
      // @ts-expect-error
      error.info = await res.json();
      // @ts-expect-error
      error.status = res.status;
      throw error;
    }

    return res.json();
  };
}
