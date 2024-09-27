package com.echonote.domain.Voice.dto;

import lombok.Data;

@Data
public class VoiceProcessRequest {

	private Long noteId;

	private String presignedUrl;

}
