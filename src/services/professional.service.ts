import Cookies from "js-cookie";
import { fetchWithInterceptor } from "./fetch.interceptor";

const BACKEND_URL = "http://127.0.0.1:8080/api"; // TODO: Move to env variable

export const professionalService = {
  getProfessionalByUser: async (userId: number) => {
    try {
      const token = Cookies.get("token");
      const response = await fetchWithInterceptor(
        `${BACKEND_URL}/professional-by-user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching professional data:", error);
      throw error;
    }
  },

  updateProfessional: async (professionalId: number, data: any) => {
    try {
      const token = Cookies.get("token");
      const response = await fetchWithInterceptor(
        `${BACKEND_URL}/professional/${professionalId}/update-me`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating professional:", error);
      throw error;
    }
  },
};
