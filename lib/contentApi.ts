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

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1").replace(/\/$/, "");

const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("inzozi_accessToken");
};

const toBackendType = (type: FrontendContentType) => type === "text" ? "article" : type;
const toBackendVisibility = (visibility: FrontendVisibility) => visibility === "public" ? "public" : "paid";

const getErrorMessage = async (response: Response) => {
  const body = await response.json().catch(() => ({}));
  return body.error ?? body.message ?? "Request failed. Please try again.";
};

export const fetchContentList = async (): Promise<BackendContent[]> => {
  const response = await fetch(`${API_BASE_URL}/content`);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

export const createContentWithApi = async (payload: CreateContentPayload): Promise<BackendContent> => {
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
    formData.append("contentUrl", `https://local-storage.inzozi.test/articles/${Date.now()}`);
  }

  if (backendVisibility === "paid") {
    formData.append("price", String(payload.price ?? 0));
    formData.append("currency", "USD");
  }

  const response = await fetch(`${API_BASE_URL}/content`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};
