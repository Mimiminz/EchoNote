package com.echonote.domain.Voice.dto;

import java.util.List;

import lombok.Data;

@Data
public class VoiceSendRequest {

	private Long noteId;

	private String objectUrl;

	private List<PageMovement> pageMovement;

	@Data
	public static class PageMovement {
		private String timestamp;
		private int page;
	}

}
