export const ACCESS_KEY = "accessToken";
export const REFRESH_KEY = "refreshToken";

export const getToken = () => localStorage.getItem(ACCESS_KEY);
export const setToken = (t) => localStorage.setItem(ACCESS_KEY, t);
export const clearToken = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);
export const setRefreshToken = (t) => localStorage.setItem(REFRESH_KEY, t);
