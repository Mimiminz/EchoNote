import apiClient from "@services/apiConfig";

export const saveMemo = async (data) => {
  try {
    const response = await apiClient.post("/memo", data);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to save the memo");
      throw new Error("Failed to save the memo");
    }
  } catch (error) {
    console.error("Error saving the memo:", error);
    throw error;
  }
};
