import styled from "styled-components";
import xIcon from "/xIcon.svg";

export default function SearchBar() {
  return (
    <Search>
      <SearchInput placeholder="" />
      <ClearButton type="button" aria-label="검색어 지우기">
        <Image src={xIcon} alt="검색어 지우기" />
      </ClearButton>
    </Search>
  );
}

const Search = styled.div`
  position: relative;
  background: #fff;
  border-radius: 999px;
  padding: 8px 55px 8px 11px;
  box-sizing: border-box;

  border: solid 5px var(--main-color2);
  box-shadow: 0 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

const SearchInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  font-size: 18px;

  padding: 13px 0;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);

  width: 40px;
  height: 40px;
  border-radius: 999px;

  border: 0;
  background: var(--main-color2);
  color: #fff;
  font-size: 18px;
  line-height: 28px;
  cursor: pointer;
`;

const Image = styled.img`
  width: 40px;
  transform: translatex(-15%);
`;
