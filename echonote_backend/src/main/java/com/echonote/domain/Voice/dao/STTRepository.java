package com.echonote.domain.Voice.dao;

import com.echonote.domain.Voice.entity.STT;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface STTRepository extends MongoRepository<STT, Long> {

}
