export default function authHeader() {
  try {
    const obj = JSON.parse(sessionStorage.getItem("authUser") || "null");
    const token = obj?.access_token || obj?.accessToken || obj?.token;

    if (token) {
      return { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` };
    }
  } catch (error) {
    // ignore invalid storage data
  }

  return {};
}
