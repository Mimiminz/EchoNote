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
}
