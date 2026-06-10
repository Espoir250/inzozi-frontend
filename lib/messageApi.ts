export type BackendMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  message: string;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  sender?: { id: string; name: string; email: string; role: string; profileImage?: string | null };
  receiver?: { id: string; name: string; email: string; role: string; profileImage?: string | null };
};

export type BackendConversation = {
  conversationId: string;
  participant: {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string | null;
  };
  latestMessage?: {
    id: string;
    senderId: string;
    receiverId: string;
    message: string;
    readAt?: string | null;
    createdAt: string;
  };
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://inzozi-market-api-lzd6.onrender.com/api/v1"
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
  init: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...init,
    headers: { ...authHeaders(), ...init.headers },
  });

  const text = await response.text().catch(() => "");
  let body: any = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = text;
  }

  if (!response.ok) {
    const method = (init.method ?? "GET").toUpperCase();
    const bodyString = typeof body === "object" ? JSON.stringify(body) : String(body);
    console.error(
      `API request failed: ${response.status} ${response.statusText} ${method} ${url} - ${bodyString}`,
      { url, method, status: response.status, body }
    );
    throw new Error(body?.error ?? body?.message ?? `Request failed (status ${response.status})`);
  }

  return body as T;
};

// ─── Send a message ───────────────────────────────────────────────────────────

export const sendMessageApi = async (
  receiverId: string,
  message: string
): Promise<{ ok: boolean; message: string; data?: BackendMessage }> => {
  try {
    const data = await requestJsonWithAuth<BackendMessage | { message?: string; data: BackendMessage }>(
      "/messages",
      { method: "POST", body: JSON.stringify({ receiverId, message }) }
    );
    const created = "data" in data && data.data ? data.data : (data as BackendMessage);
    return { ok: true, message: "Message sent.", data: created };
  } catch (err: any) {
    return { ok: false, message: err.message };
  }
};

// ─── List all conversations for the logged-in user ───────────────────────────

export const listConversationsApi = async (): Promise<{
  ok: boolean;
  data?: BackendConversation[];
  message?: string;
}> => {
  try {
    const data = await requestJsonWithAuth<BackendConversation[] | { data: BackendConversation[] }>(
      "/messages/conversations",
      { method: "GET" }
    );
    return { ok: true, data: Array.isArray(data) ? data : data.data };
  } catch (err: any) {
    return { ok: false, message: err.message };
  }
};

// ─── Get full message thread for a conversation ───────────────────────────────

export const getConversationThreadApi = async (
  convId: string
): Promise<{ ok: boolean; data?: BackendMessage[]; message?: string }> => {
  try {
    const data = await requestJsonWithAuth<
      { conversationId: string; messages: BackendMessage[] } | { data: BackendMessage[] }
    >(`/messages/conversations/${convId}`, { method: "GET" });
    return {
      ok: true,
      data: "messages" in data ? data.messages : data.data,
    };
  } catch (err: any) {
    return { ok: false, message: err.message };
  }
};