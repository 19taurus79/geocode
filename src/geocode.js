import axios from "axios";

export default async function fetchGeocode(address) {
  console.log("Fetching geocode for address:", address);
  try {
    const response = await axios.get(`${import.meta.env.VITE_GEOCODE_API_BASE_URL}/data/geocode`, {
      params: { address },
    });
    const data = response.data;

    console.log(data);
    return data;
  } catch (error) {
    console.error("Ошибка при получении геокода:", error);
    return {};
  }
}
