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

export const getMemo = async (noteId) => {
  try {
    const response = await apiClient.get(`/memo`, {
      params: {
        id: noteId,
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to fetch memo");
      throw new Error("Failed to fetch memo");
    }
  } catch (error) {
    console.error("Error fetching memo:", error);
    throw error;
  }
};
