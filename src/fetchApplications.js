import axios from "axios";

export default async function fetchApplications() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_GEOCODE_API_BASE_URL}/api/applications`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении заявок:", error);
    return [];
  }
}
