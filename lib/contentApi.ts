export type FrontendContentType = "text" | "image" | "video";
export type FrontendVisibility = "public" | "subscriber" | "premium";

export type BackendContent = {
  id: string;
  title: string;
  description: string | null;
  contentUrl: string;
  type: "article" | "image" | "video" | "audio";
  visibility: "public" | "paid";
  price: number | null;
  currency: string | null;
  creatorId: string;
  // Engagement fields returned by the enriched API
  likes?: number;
  liked?: boolean;
  comments?: {
    id: string;
    userId: string;
    user: string;
    text: string;
    createdAt: string;
  }[];
};

export type CreateContentPayload = {
  title: string;
  description: string;
  type: FrontendContentType;
  visibility: FrontendVisibility;
  price?: number;
  mediaUrl?: string;
  mediaFile?: File;
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"
).replace(/\/$/, "");

const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("inzozi_accessToken");
};

const toBackendType = (type: FrontendContentType) =>
  type === "text" ? "article" : type;

const toBackendVisibility = (visibility: FrontendVisibility) =>
  visibility === "public" ? "public" : "paid";

const getErrorMessage = async (response: Response) => {
  const body = await response.json().catch(() => ({}));
  return body.error ?? body.message ?? "Request failed. Please try again.";
};

// ---------------------------------------------------------------------------
// Fetch content list
// Sends auth token when available so the API can return the correct
// `liked` boolean for the logged-in user.
// ---------------------------------------------------------------------------
export const fetchContentList = async (): Promise<BackendContent[]> => {
  const accessToken = getAccessToken();

  const response = await fetch(`${API_BASE_URL}/content`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

// ---------------------------------------------------------------------------
// Create content
// ---------------------------------------------------------------------------
export const createContentWithApi = async (
  payload: CreateContentPayload
): Promise<BackendContent> => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Please log in before publishing content.");
  }

  const formData = new FormData();
  const backendType = toBackendType(payload.type);
  const backendVisibility = toBackendVisibility(payload.visibility);

  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("type", backendType);
  formData.append("visibility", backendVisibility);

  if (payload.mediaFile) {
    formData.append("media", payload.mediaFile);
  } else if (payload.mediaUrl) {
    formData.append("contentUrl", payload.mediaUrl);
  } else {
    formData.append(
      "contentUrl",
      `https://local-storage.inzozi.test/articles/${Date.now()}`
    );
  }

  if (backendVisibility === "paid") {
    formData.append("price", String(payload.price ?? 0));
    formData.append("currency", "USD");
  }

  const response = await fetch(`${API_BASE_URL}/content`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

// ---------------------------------------------------------------------------
// Like / unlike a post
// Returns the updated like count and whether the current user has liked it.
// The API toggles: calling it twice will like then unlike.
// ---------------------------------------------------------------------------
export const likeContentApi = async (
  contentId: string
): Promise<{ contentId: string; likes: number; liked: boolean }> => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Please log in to like content.");
  }

  const response = await fetch(`${API_BASE_URL}/content/${contentId}/like`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

// ---------------------------------------------------------------------------
// Comment on a post
// Returns the saved comment object including the commenter's name.
// ---------------------------------------------------------------------------
export const commentOnContentApi = async (
  contentId: string,
  text: string
): Promise<{
  id: string;
  contentId: string;
  userId: string;
  user: string;
  text: string;
  createdAt: string;
}> => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Please log in to comment.");
  }

  const response = await fetch(`${API_BASE_URL}/content/${contentId}/comment`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};