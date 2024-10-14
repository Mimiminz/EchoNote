import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  SearchContainer,
  SearchInput,
  SearchResultCount,
  SearchIconContainer,
  SearchButton,
} from "@components/common/NoteSearchBar.style";
import { FaXmark } from "react-icons/fa6";

const NoteSearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState(""); // 입력된 검색어 상태
  const searchRef = useRef(null);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value); // 입력된 값 업데이트
    onSearch(event.target.value); // 상위 컴포넌트에 검색어 전달
  };

  const handleResetSearch = () => {
    setSearchTerm("");
  };

  return (
    <SearchContainer ref={searchRef}>
      <SearchInput
        placeholder="파일명을 검색해보세요"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <SearchResultCount>
        <SearchIconContainer>
          <SearchButton onClick={handleResetSearch}>
            <FaXmark />
          </SearchButton>
        </SearchIconContainer>
      </SearchResultCount>
    </SearchContainer>
  );
};

NoteSearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default NoteSearchBar;
