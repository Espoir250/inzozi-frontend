const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "https://inzozi-market-api-lzd6.onrender.com/api/v1").replace(/\/$/, "");

const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("inzozi_accessToken");
};

const getErrorMessage = async (response: Response) => {
  const body = await response.json().catch(() => ({}));
  return body.error ?? body.message ?? "Request failed. Please try again.";
};

export type UploadedProfileImage = {
  profileImage: string;
  publicId?: string;
};

export const uploadProfileImageWithApi = async (file: File): Promise<UploadedProfileImage> => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Please log in before updating your profile picture.");
  }

  const formData = new FormData();
  formData.append("profileImage", file);

  const response = await fetch(`${API_BASE_URL}/users/me/profile-image`, {
    method: "PUT",
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

export type BackendUser = {
  id: string;
  name: string;
  email: string;
  profileImage?: string | null;
  role: string;
  verificationStatus: string;
  creatorProfile?: {
    id: string;
    bio?: string | null;
    specialization?: string | null;
    socialLinks?: string | null;
    followers?: number | null;
    avatar?: string | null;
    location?: string | null;
    subscriptionFee?: number | null;
  } | null;
  _count?: {
    creatorSubscriptions?: number;
  };
};

export type BackendCreatorProfile = NonNullable<BackendUser["creatorProfile"]> & {
  userId: string;
  subscribersCount?: number;
};

export const fetchCreatorProfilesApi = async (): Promise<BackendCreatorProfile[]> => {
  const accessToken = getAccessToken();
  const response = await fetch(`${API_BASE_URL}/creator-profile?limit=100`, {
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  if (!response.ok) return [];
  return response.json();
};

export const subscribeToCreatorApi = async (
  creatorId: string
): Promise<{ subscribersCount?: number }> => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Please log in to subscribe.");
  }

  const response = await fetch(`${API_BASE_URL}/subscriptions/subscribe/${creatorId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

export const fetchUsersApi = async (): Promise<BackendUser[]> => {
  const accessToken = getAccessToken();
  const response = await fetch(`${API_BASE_URL}/users?limit=100`, {
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
  if (!response.ok) return [];
  const json = await response.json();
  return json.data ?? [];
};
