import apiClient from "@services/apiConfig";

// 노트 리스트 가져오는 함수
export const getNoteList = async () => {
  try {
    const response = await apiClient.get(`/note/list`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to fetch note list");
      throw new Error("Failed to fetch note list");
    }
  } catch (error) {
    console.error("Error fetching note list:", error);
    throw error;
  }
};

export const getNoteDetail = async (id) => {
  try {
    const response = await apiClient.get(`/note`, {
      params: {
        noteId: id, // 쿼리 파라미터로 noteId 전달
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to fetch note detail");
      throw new Error("Failed to fetch note detail");
    }
  } catch (error) {
    console.error("Error fetching note detail:", error);
    throw error;
  }
};

export const getPdfPresignedUrl = async () => {
  try {
    const response = await apiClient.get("/note/url");
    if (response.status === 200) {
      return response.data; // presigned_url과 object_url 반환
    } else {
      console.error("Failed to fetch pdf presigned URL");
      throw new Error("Failed to fetch pdf presigned URL");
    }
  } catch (error) {
    console.error("Error fetching pdf presigned URL:", error);
    throw error;
  }
};

// POST 요청: object_url을 통해 파일을 서버에 저장
export const savePdfFile = async (objectUrl, noteName, keywords) => {
  try {
    const payload = {
      object_url: objectUrl,
      note_name: noteName,
      keywords: keywords,
    };

    const response = await apiClient.post("/note", payload);
    if (response.status === 201) {
      console.log("File saved successfully");
      return response.data;
    } else {
      console.error("Failed to save the file");
      throw new Error("Failed to save the file");
    }
  } catch (error) {
    console.error("Error saving the file:", error);
    throw error;
  }
};

// S3에 업로드 하는 함수
export const S3UploadPdf = async (uploadUrl, file) => {
  try {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to upload to S3");
    }
  } catch (error) {
    console.error("Error uploading:", error);
    throw error;
  }
};

// 노트 삭제
export const deleteNote = async (id) => {
  try {
    const response = await apiClient.delete(`/note`, {
      params: {
        noteId: id, // 쿼리 파라미터로 noteId 전달
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Failed to fetch note detail");
      throw new Error("Failed to fetch note detail");
    }
  } catch (error) {
    console.error("Error fetching note detail:", error);
    throw error;
  }
};
