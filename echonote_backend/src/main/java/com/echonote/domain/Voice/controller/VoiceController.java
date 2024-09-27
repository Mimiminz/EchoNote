package com.echonote.domain.Voice.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.amazonaws.HttpMethod;
import com.echonote.domain.Voice.dto.PresignedUrlResponse;
import com.echonote.domain.Voice.dto.VoiceProcessRequest;
import com.echonote.domain.Voice.entity.STT;
import com.echonote.domain.Voice.service.VoiceService;
import com.echonote.domain.note.dto.NoteCreateResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/voice")
@Tag(name = "voice", description = "voice api")
public class VoiceController {
	private final VoiceService voiceService;

	@Value("${amazon.aws.bucket}")
	private String bucketName;

	// 확장자명에 따라 presigned url 반환
	@GetMapping
	@Operation(summary = "녹음본 Presigned url 요청", description = "녹음본 S3 업로드를 위한 presigned url 요청")
	public ResponseEntity<PresignedUrlResponse> generatePresignedUrl() {

		PresignedUrlResponse response = voiceService.generatePreSignUrl(UUID.randomUUID() + ".wav", bucketName,
			HttpMethod.PUT);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping
	@Operation(summary = "음성 저장 및 분석", description = "녹음본의 S3 URL과 STT 처리 결과를 저장")
	public ResponseEntity<NoteCreateResponse> processVoice(@RequestBody VoiceProcessRequest voiceCreateRequest) {

		Long userId = 1L;

		voiceService.sendVoice(userId, voiceCreateRequest);

		return new ResponseEntity<>(null, HttpStatus.OK);

	}

	@GetMapping("/stt")
	@Operation(summary = "note_id에 대응되는 stt 결과물 반환", description = "result가 processiong중이면 null값으로 들어옵니다.")
	public ResponseEntity<STT> saveSTT(@RequestParam long id) {
		STT stt = voiceService.getSTT(id);
		return new ResponseEntity<>(stt, HttpStatus.OK);
	}

	@PostMapping("/stt")
	@Operation(summary = "stt 저장", description = "stt를 저장하는 API. flask 서버와 연동된다.")
	public ResponseEntity<STT> saveSTT(@RequestBody STT result) {
		voiceService.insertSTT(result);

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PutMapping("/stt")
	@Operation(summary = "stt 업데이트", description = "note_id와 stt 정보를 보내주면 mongoDB에서 업데이트 할 수 있다.")
	public ResponseEntity<STT> updateSTT(@RequestBody STT result) {

		voiceService.updateSTT(result);

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@DeleteMapping("/stt")
	@Operation(summary = "stt 삭제")
	public ResponseEntity<STT> deleteSTT(@RequestHeader("X-Note-Id") long id,
		@RequestHeader("X-Target-STT-Ids") List<Long> sttIds) {
		voiceService.deleteSTT(id, sttIds);

		return new ResponseEntity<>(HttpStatus.OK);
	}

}
