import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "../../assets/font.css";

export default function TopRightControls({ onSelectFont }) {
  const wrapRef = useRef(null);
  const [open, setOpen] = useState(null);

  const toggle = (key) => {
    setOpen((prev) => (prev === key ? null : key));
  };

  const pickFont = (font) => {
    onSelectFont?.(font);
    setOpen(null);
  };

  useEffect(() => {
    const onDown = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <Root>
      <Wrap ref={wrapRef}>
        <Btn
          type="button"
          onClick={() => toggle("font")}
          data-active={open === "font"}
        >
          font
        </Btn>
        <Btn
          type="button"
          onClick={() => toggle("design")}
          data-active={open === "design"}
        >
          design
        </Btn>

        {open === "font" && (
          <Popover>
            <Title>폰트</Title>
            <List>
              <Item type="button" onClick={() => pickFont("Pretendard")}>
                Pretendard
              </Item>
              <Item
                type="button"
                onClick={() => pickFont("BelovedMyoeunttobak")}
              >
                BelovedMyoeunttobak
              </Item>
              <Item type="button" onClick={() => pickFont("YoonChoWooSan")}>
                YoonChoWooSan
              </Item>
              <Item type="button" onClick={() => pickFont("OngleIpSeaBreeze")}>
                OngleIpSeaBreeze
              </Item>
            </List>
          </Popover>
        )}

        {open === "design" && (
          <Popover>
            <Title>디자인</Title>
            <Grid>
              <Chip type="button">기본</Chip>
              <Chip type="button">design1</Chip>
              <Chip type="button">design2</Chip>
              <Chip type="button">design3</Chip>
            </Grid>
          </Popover>
        )}
      </Wrap>
    </Root>
  );
}

const Root = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 50;
`;

const Wrap = styled.div`
  position: relative;
  display: flex;
  gap: 8px;
`;

const Btn = styled.button`
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;

  &[data-active="true"] {
    border-color: #bbb;
    font-weight: 600;
  }
`;

const Popover = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 220px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  padding: 10px;
`;

const Title = styled.div`
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 8px;
`;

const List = styled.div`
  display: grid;
  gap: 6px;
`;

const Item = styled.button`
  text-align: left;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: #fff;
  cursor: pointer;

  &:hover {
    background: #fafafa;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
`;

const Chip = styled.button`
  padding: 10px 8px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: #fff;
  cursor: pointer;

  &:hover {
    background: #fafafa;
  }
`;
