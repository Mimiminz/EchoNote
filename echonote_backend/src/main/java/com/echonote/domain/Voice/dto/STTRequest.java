package com.echonote.domain.Voice.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class STTRequest {

	private long id;
	private String start;
	private String end;
	private String text;

	@Builder.Default
	private boolean anomaly = false;

	@Builder.Default
	private int page = 1;

	public void changeAnomaly(boolean anomaly) {
		this.anomaly = anomaly;
	}

	public void changePageNo(int page) {
		this.page = page;
	}
}
