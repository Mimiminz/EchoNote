package com.echonote.domain.Voice.entity;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import com.echonote.domain.Voice.dto.STTRequest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@ToString
@Document(collection = "STT")
public class STT {
	private String processId;
	private long id;
	private List<STTRequest> result;
}
