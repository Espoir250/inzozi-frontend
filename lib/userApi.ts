const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1").replace(/\/$/, "");

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
