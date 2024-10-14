package com.echonote.domain.Memo.service;

import com.echonote.domain.Memo.dao.MemoRepository;
import com.echonote.domain.Memo.dto.MemoRequest;
import com.echonote.domain.Memo.entity.Memo;
import com.echonote.domain.note.dao.NoteRepository;
import com.echonote.domain.note.entity.Note;
import com.echonote.global.aop.exception.BusinessLogicException;
import com.echonote.global.aop.exception.ErrorCode;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class MemoServiceImpl implements MemoService {

    private final MemoRepository memoRepository;
    private final NoteRepository noteRepository;

    private final MongoTemplate mongoTemplate;

    // MongoDB에 메모 추가
    @Override
    public Memo saveMemo(Memo list) {
        Memo result = memoRepository.save(list);

        return result;

    }


    // 메모 업데이트
    @Override
    public Memo updateMemo(Memo list) {

            Note note = noteRepository.findById(list.getId())
                    .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND));
            note.setUpdate_at(LocalDateTime.now());
            noteRepository.save(note);

            Memo result = memoRepository.save(list);
            return result;

//        long memoId = list.getId();
//
//        Map<String, Map<String, List<MemoRequest.MemoText>>> fieldsToUpdate = new HashMap<>();
//        fieldsToUpdate.put("text", list.getText());
//        fieldsToUpdate.put("rectangle", list.getRectangle());
//        fieldsToUpdate.put("circle", list.getCircle());
//        fieldsToUpdate.put("drawing", list.getDrawing());
//
//        for (Map.Entry<String, Map<String, List<MemoRequest.MemoText>>> entry : fieldsToUpdate.entrySet()) {
//            String fieldName = entry.getKey();
//            Map<String, List<MemoRequest.MemoText>> fieldValue = entry.getValue();
//
//            if (fieldValue != null) {
//                for (Map.Entry<String, List<MemoRequest.MemoText>> groupEntry : fieldValue.entrySet()) {
//                    String groupKey = groupEntry.getKey();
//                    List<MemoRequest.MemoText> memoTexts = groupEntry.getValue();
//
//                    for (MemoRequest.MemoText memoText : memoTexts) {
//                        String updatePath = fieldName + "." + groupKey;
//                        Query query = new Query(Criteria.where("_id").is(memoId)
//                                .and(updatePath).elemMatch(Criteria.where("id").is(memoText.getId())));
//                        String updateDetail = memoText.getDetail();
//
//                        Update update;
//                        if (updateDetail.isEmpty()) {
//                            // Delete the item if detail is empty
//                            update = new Update().pull(updatePath,
//                                    Query.query(Criteria.where("id").is(memoText.getId())));
//                        } else {
//                            // Update the item if detail is not empty
//                            update = new Update().set(updatePath + ".$.detail", updateDetail);
//                        }
//
//                        try {
//                            UpdateResult result = mongoTemplate.updateFirst(query, update, Memo.class);
//                            if (result.getMatchedCount() == 0 && !updateDetail.isEmpty()) {
//                                // If no matching document found and detail is not empty, add a new item
//                                Query addQuery = new Query(Criteria.where("_id").is(memoId));
//                                Update addUpdate = new Update().push(updatePath, memoText);
//                                mongoTemplate.updateFirst(addQuery, addUpdate, Memo.class);
//                                log.info("Added new item to " + fieldName + "." + groupKey + ": " + memoText);
//                            } else if (updateDetail.isEmpty()) {
//                                log.info("Deleted item from " + fieldName + "." + groupKey + ": " + memoText.getId());
//                            } else {
//                                log.info("Updated existing item in " + fieldName + "." + groupKey + ": " + memoText);
//                            }
//                        } catch (DataIntegrityViolationException e) {
//                            log.error("Memo data integrity violation for " + fieldName + ": " + e.getMessage());
//                        }
//                    }
//                }
//            }
//        }
    }

    // 메모 삭제하기(전체 삭제가 아니라 특정 메모만 삭제합니다.)
    @Override
    public void deleteMemo(long id, List<Long> memoId) {
        for (long memo : memoId) {
            // memoId는 전체 메모 ID (부모 ID), targetMemoId는 삭제할 메모의 ID입니다.
            Query query = new Query(Criteria.where("id").is(id).and("memo.id").is(memo));
            // 업데이트 명령어로 해당 메모 ID를 삭제
            Update update = new Update().pull("memo", new Query(Criteria.where("id").is(memo)));

            // 삭제 실행
            try {
                UpdateResult result = mongoTemplate.updateFirst(query, update, Memo.class);

                if (result.getMatchedCount() > 0) {
                    log.info(id + "번 Note " + memo + "번 memo 삭제");
                } else {
                    log.warn(id + "번 Note " + memo + "번 memo 삭제 실패");
                }
            } catch (DataIntegrityViolationException e) {
                log.error("memo 데이터 삭제 실패: " + e);
            }
        }

    }

    // 전체 메모 삭제
    public void deleteAllMemo(long id) {
        memoRepository.deleteById(id);
    }


    // 특정 ID로 데이터를 가져오기
    @Override
    public Memo findById(long id) {
        return memoRepository.findById(id).orElse(null);
    }

}
