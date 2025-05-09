import { Credentials } from "@/interfaces/credentials.interface";
import { RegisterCredentials } from "@/interfaces/register.interface";
import Cookies from "js-cookie";
import { fetchWithInterceptor } from "./fetch.interceptor";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL; // https://clownfish-app-8pq82.ondigitalocean.app/api/auth    http://127.0.0.1:8000/api/auth

export const authenticationService = {
  login: async (credentials: Credentials) => {
    try {
      const response = await fetchWithInterceptor(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error logging in:", (error as Error).message);
      return false;
    }
  },
  logOut: async () => {
    try {
      const token = Cookies.get("token");

      const response = await fetchWithInterceptor(
        `${BACKEND_URL}/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error logging out:", (error as Error).message);
      return false;
    }
  },
  register: async (credentials: RegisterCredentials) => {
    try {
      const response = await fetchWithInterceptor(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, errors: data };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error registering:", (error as Error).message);
      return { success: false, errors: { message: (error as Error).message } };
    }
  },

  userDetails: async () => {
    const token = Cookies.get("token");

    if (!token) {
      console.error("No token found! Redirecting to login...");

      window.location.href = "/";

      return false;
    }

    try {
      const response = await fetchWithInterceptor(`${BACKEND_URL}/auth/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error getting user details:", (error as Error).message);
      return false;
    }
  },

  updateUser: async (userData: FormData) => {
    try {
      const token = Cookies.get("token");
      const response = await fetchWithInterceptor(
        `${BACKEND_URL}/auth/update-profile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: userData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating user:", (error as Error).message);
      throw error;
    }
  },
};
