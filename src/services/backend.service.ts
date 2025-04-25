import Cookies from "js-cookie";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

const handleUnauthorizedError = () => {
  Cookies.remove("token");
  window.location.href = "/";
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = Cookies.get("token");
  const defaultOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, defaultOptions);
    console.log('Respuesta raw:', response);

    if (response.status === 401) {
      Cookies.remove("token");
      handleUnauthorizedError();
      throw new Error("Unauthorized - Redirecting to login");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Datos parseados:', data);
    return data;
  } catch (error) {
    console.error("API request error:", (error as Error).message);
    return null;
  }
};

export const backendService = {
  professionalList: async () => {
    return await fetchWithAuth(`${BACKEND_URL}/specialties`);
  },

  getNotifications: async () => {
    return await fetchWithAuth(`${BACKEND_URL}/notifications`);
  },

  getFavorites: async () => {
    const data = await fetchWithAuth(`${BACKEND_URL}/favorite-health-professional`);
    console.log('Datos en getFavorites:', data);
    return data;
  },

  removeFavorite: async (id: number) => {
    return await fetchWithAuth(`${BACKEND_URL}/favorite-health-professional/${id}`, {
      method: 'DELETE',
    });
  },

  filteredProfessionals: async (body: any) => {
    return await fetchWithAuth(`${BACKEND_URL}/find-availaibility-filter`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  appointment: async (body: any) => {
    return await fetchWithAuth(`${BACKEND_URL}/appointments`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  listAppointments: async (currentPage: number, status: string) => {
    return await fetchWithAuth(
      `${BACKEND_URL}/appointments/${status}?page=${currentPage}`
    );
  },

  listMyPatients: async (currentPage: number, status: string) => {
    return await fetchWithAuth(
      `${BACKEND_URL}/professional/appointments/${status}?page=${currentPage}`
    );
  },

  getMessages: async (sender_id: number, receiver_id: number) => {
    return await fetchWithAuth(`${BACKEND_URL}/messages`, {
      method: "POST",
      body: JSON.stringify({ receiver_id }),
    });
  },

  registerProfesional: async (body: any) => {
    return await fetchWithAuth(`${BACKEND_URL}/health-professionals`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  getProfessionalAppointments: async () => {
    return await fetchWithAuth(`${BACKEND_URL}/professional/appointments`);
  },

  professionalAvailabilities: async () => {
    return await fetchWithAuth(`${BACKEND_URL}/availabilities`);
  },
};
