import styled from "styled-components";

// --- Placeholder mode ---

export const EmptyFrame = styled.button`
  width: 330px;
  height: 235px;
  border-radius: 10px;
  background: transparent;
  border: 1.5px solid #ab9d8b;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(171, 157, 139, 0.06);
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const Placeholder = styled.div`
  padding: 18px;
  text-align: center;
  color: rgba(0, 0, 0, 0.55);
`;

export const PlaceholderTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
`;

export const PlaceholderDesc = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.4);
`;

// --- Drawing mode ---

export const Wrapper = styled.div`
  width: 330px;
  margin: 0 auto;
`;

export const DrawingArea = styled.div`
  position: relative;
  width: 330px;
  height: 235px;
  border-radius: 10px;
  overflow: hidden;
  border: 1.5px solid #ab9d8b;
`;

export const BackgroundImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
`;

export const DrawingCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  touch-action: none;
  cursor: ${({ $drawMode }) => ($drawMode ? "crosshair" : "default")};
  pointer-events: ${({ $drawMode }) => ($drawMode ? "auto" : "none")};
`;

export const DrawModeOverlay = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  pointer-events: none;
`;

export const DrawModeHint = styled.span`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(124, 70, 40, 0.55);
  padding: 2px 8px;
  border-radius: 10px;
  backdrop-filter: blur(4px);
`;
