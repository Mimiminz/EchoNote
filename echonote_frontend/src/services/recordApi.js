import apiClient from "@services/apiConfig";

// GET 요청: presigned URL 가져오기
export const getPresignedUrl = async () => {
  try {
    const response = await apiClient.get("/voice/url");
    if (response.status === 200) {
      return response.data; // presigned_url과 object_url 반환
    } else {
      console.error("Failed to fetch presigned URL");
      throw new Error("Failed to fetch presigned URL");
    }
  } catch (error) {
    console.error("Error fetching presigned URL:", error);
    throw error;
  }
};

// POST 요청: object_url을 통해 파일을 서버에 저장
export const saveRecordedFile = async (noteId, objectUrl, pageMovement) => {
  try {
    const payload = {
      note_id: noteId, // note_id는 0으로 설정하거나 필요에 따라 변경
      object_url: objectUrl,
      page_movement: pageMovement,
    };

    console.log(pageMovement);

    const response = await apiClient.post("/voice", payload);
    if (response.status === 200) {
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
export const S3UploadRecord = async (uploadUrl, file) => {
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
