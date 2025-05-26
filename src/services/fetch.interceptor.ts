import Cookies from "js-cookie";

export const fetchWithInterceptor = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);

  if (response.status === 401) {
    console.error("Unauthorized! Redirecting to login...");
    Cookies.remove("token");
    window.location.href = "/";
  }

  return response;
};
