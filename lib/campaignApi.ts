export type CampaignStatus =
  | "DRAFT"
  | "ACTIVE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type ApplicationStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export type BackendApplication = {
  id: string;
  campaignId: string;
  creatorId: string;
  status: ApplicationStatus;
  proposal?: string | null;
  creator?: {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string | null;
  };
  campaign?: BackendCampaign;
};

export type BackendCampaign = {
  id: string;
  title: string;
  description?: string | null;
  budget: number;
  startDate?: string | null;
  endDate?: string | null;
  deadline_at?: string | null;
  niche_filter?: string | null;
  min_audience_size?: number | null;
  max_creators?: number | null;
  status: CampaignStatus;
  businessId: string;
  applications?: BackendApplication[];
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"
).replace(/\/$/, "");

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("inzozi_accessToken") : null;

const authHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const requestJsonWithAuth = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init.headers || {}) },
  });

  const text = await response.text().catch(() => "");
  let body: any = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = text;
  }

  if (!response.ok) {
    throw new Error(
      body?.error ?? body?.message ?? `Request failed (status ${response.status})`,
    );
  }

  return body as T;
};

// Create a campaign
export const createCampaignApi = async (payload: {
  title: string;
  description: string;
  budget: number;
  startDate?: string;
  endDate?: string;
  niche_filter?: string;
  min_audience_size?: number;
  max_creators?: number;
}): Promise<{ ok: boolean; data?: BackendCampaign; message?: string }> => {
  try {
    const data = await requestJsonWithAuth<BackendCampaign>("/campaigns", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        niche_filter: payload.niche_filter || "general",
        min_audience_size: payload.min_audience_size ?? 0,
        max_creators: payload.max_creators ?? 1,
      }),
    });
    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, message: err.message };
  }
};

// Fetch campaigns for the logged-in user
export const fetchUserCampaignsApi = async (
  userId: string,
): Promise<{ ok: boolean; data?: BackendCampaign[]; message?: string }> => {
  try {
    const data = await requestJsonWithAuth<
      BackendCampaign[] | { data: BackendCampaign[] }
    >(`/users/${userId}/campaigns`, {
      method: "GET",
    });
    return { ok: true, data: Array.isArray(data) ? data : (data as any).data };
  } catch (err: any) {
    return { ok: false, message: err.message };
  }
};

// Fetch all campaigns
export const fetchCampaignsListApi = async (): Promise<{
  ok: boolean;
  data?: BackendCampaign[];
  message?: string;
}> => {
  try {
    const data = await requestJsonWithAuth<
      BackendCampaign[] | { data: BackendCampaign[] }
    >("/campaigns", {
      method: "GET",
    });
    return { ok: true, data: Array.isArray(data) ? data : (data as any).data };
  } catch (err: any) {
    return { ok: false, message: err.message };
  }
};

// Create an application (business invites creator or creator applies)
export const createApplicationApi = async (
  campaignId: string,
  payload: { creatorId: string; proposal?: string },
): Promise<{ ok: boolean; data?: BackendApplication; message?: string }> => {
  try {
    const data = await requestJsonWithAuth<BackendApplication>(
      `/campaigns/${campaignId}/applications`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, message: err.message };
  }
};

// Create an offer
export const createOfferApi = async (
  campaignId: string,
  creatorId: string,
  proposal?: string,
): Promise<{ ok: boolean; data?: BackendApplication; message?: string }> => {
  return await createApplicationApi(campaignId, {
    creatorId,
    proposal,
  });
};

// Fetch applications/offers for the logged-in user
export const fetchCreatorOffersApi = async (): Promise<{
  ok: boolean;
  data?: BackendApplication[];
  message?: string;
}> => {
  try {
    const data = await requestJsonWithAuth<
      BackendApplication[] | { data: BackendApplication[] }
    >("/campaigns/my/applications", {
      method: "GET",
    });
    return { ok: true, data: Array.isArray(data) ? data : (data as any).data };
  } catch (err: any) {
    return { ok: false, message: err.message };
  }
};

// Respond to an offer using your backend route
export const respondToOfferApi = async (
  campaignId: string,
  creatorId: string,
  status: ApplicationStatus,
): Promise<{ ok: boolean; data?: BackendApplication; message?: string }> => {
  try {
    const data = await requestJsonWithAuth<BackendApplication>(
      `/campaigns/${campaignId}/applications`,
      {
        method: "PATCH",
        body: JSON.stringify({ creatorId, status }),
      },
    );
    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, message: err.message };
  }
};