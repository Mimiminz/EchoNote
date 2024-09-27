package com.echonote.domain.Voice.service;

import com.amazonaws.HttpMethod;
import com.echonote.domain.Voice.dto.PresignedUrlResponse;
import com.echonote.domain.Voice.dto.VoiceProcessRequest;
import com.echonote.domain.Voice.entity.STT;

import java.util.List;

public interface VoiceService {
	PresignedUrlResponse generatePreSignUrl(String filePath,
		String bucketName,
		HttpMethod httpMethod);

	void insertSTT(STT stt);

	STT getSTT(long id);

	void updateSTT(STT stt);

	void deleteSTT(long id, List<Long> sttId);

	void sendVoice(Long userId, VoiceProcessRequest voiceCreateRequest);
}
