import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  NoteListContainer,
  NoteGrid,
  NoteItem,
  NoteImage,
  NoteTitle,
  NewNoteButton,
  SortButtonContainer,
  SortButton,
  NoteHeader,
} from "@pages/styles/NoteListPage.style";
import { getNoteList } from "@services/noteApi";
import { LuPenLine } from "react-icons/lu";
import NewNoteModal from "@components/modal/NewNoteModal";
import NoteSearchBar from "@/components/common/NoteSearchBar";

const NoteListPage = () => {
  const [notes, setNotes] = useState([]);
  const [searchResultNotes, setSearchResultNotes] = useState([]); //검색 결과 저장
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState("asc");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNoteList();
        if (data) {
          // 받아온 데이터를 notes 상태에 저장
          const formattedNotes = data.map((note) => ({
            id: note.note_id,
            title: note.note_name,
            createdAt: note.create_at,
            image:
              "https://timeisnullnull.s3.ap-northeast-2.amazonaws.com/noteExample.avif", // 필요 시, 이미지 경로를 설정
          }));
          setNotes(formattedNotes);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchData();
  }, []);

  const handleSortChange = (option) => {
    setSortOption(option);
    const sortedNotes = [...notes].sort((a, b) => {
      if (option === "asc") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (option === "desc") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (option === "update") {
        return new Date(a.update_at) - new Date(b.update_at);
      }
    });
    setNotes(sortedNotes);
  };

  const handleSearch = (keyword) => {
    // keyword를 포함하는 note들을 필터링하여 searchResultNotes에 저장
    const filteredNotes = notes.filter((note) =>
      note.title.toLowerCase().includes(keyword.toLowerCase())
    );
    setSearchResultNotes(filteredNotes);
  };

  return (
    <NoteListContainer>
      <NoteHeader>
        <h1>Echo Note</h1>
        <NoteSearchBar onSearch={handleSearch} />
      </NoteHeader>
      <SortButtonContainer>
        <SortButton
          active={sortOption === "asc"}
          onClick={() => handleSortChange("asc")}
        >
          최신순
        </SortButton>
        <SortButton
          active={sortOption === "desc"}
          onClick={() => handleSortChange("desc")}
        >
          오래된순
        </SortButton>
        <SortButton
          active={sortOption === "update"}
          onClick={() => handleSortChange("update")}
        >
          수정순
        </SortButton>
      </SortButtonContainer>
      <NoteGrid>
        {(searchResultNotes && searchResultNotes.length > 0
          ? searchResultNotes
          : notes
        ).map((note) => (
          <NoteItem key={note.id}>
            <Link to={`/note/${note.id}`}>
              <NoteImage src={note.image} alt={`${note.title} 이미지`} />
              <NoteTitle>{note.title}</NoteTitle>
            </Link>
          </NoteItem>
        ))}
      </NoteGrid>

      <NewNoteButton to="#" onClick={openModal}>
        <LuPenLine />
      </NewNoteButton>

      <NewNoteModal isOpen={isModalOpen} onClose={closeModal} />
    </NoteListContainer>
  );
};

export default NoteListPage;
