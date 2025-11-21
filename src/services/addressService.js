import axios from "axios";

const API_URL = import.meta.env.VITE_GEOCODE_API_BASE_URL;

/**
 * Fetches the list of regions.
 * Expected response: [{ level_1_id: "...", name: "..." }, ...]
 */
export async function getRegions() {
  try {
    const response = await axios.get(`${API_URL}/regions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
}

/**
 * Searches for addresses within a specific region.
 * @param {string} query - The search text (min 3 chars).
 * @param {string} regionId - The ID of the region (level_1_id).
 */
export async function searchAddresses(query, regionId) {
  if (!query || query.length < 3 || !regionId) return [];
  
  try {
    const response = await axios.get(`${API_URL}/addresses/search`, {
      params: { q: query, region_id: regionId }
    });
    return response.data;
  } catch (error) {
    console.error("Error searching addresses:", error);
    return [];
  }
}
