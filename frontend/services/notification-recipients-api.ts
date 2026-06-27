import axios from "axios";

export interface NotificationRecipient {
  _id?: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const API_BASE_URL = "http://localhost:8000/api/v1";

export const getNotificationRecipients = async (): Promise<NotificationRecipient[]> => {
  const response = await axios.get(`${API_BASE_URL}/notification-recipients/`);
  return response.data;
};

export const createNotificationRecipient = async (recipient: NotificationRecipient): Promise<void> => {
  await axios.post(`${API_BASE_URL}/notification-recipients/`, recipient);
};

export const updateNotificationRecipient = async (id: string, recipient: Partial<NotificationRecipient>): Promise<void> => {
  await axios.put(`${API_BASE_URL}/notification-recipients/${id}`, recipient);
};

export const deleteNotificationRecipient = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/notification-recipients/${id}`);
};
