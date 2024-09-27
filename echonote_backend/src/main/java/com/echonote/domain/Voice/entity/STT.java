package com.echonote.domain.Voice.entity;

import com.echonote.domain.Voice.dto.STTRequest;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@ToString
@Document(collection = "STT")
public class STT {
    private long id;
    private List<STTRequest> result;
}
