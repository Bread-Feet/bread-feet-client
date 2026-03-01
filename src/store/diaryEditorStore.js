import { create } from "zustand";

const initialState = {
  date: null,
  bakery: null,
  stickerId: null,

  title: "",
  content: "",

  baseImage: null,
  strokes: [],
  undoneStrokes: [],

  tool: "pen",
  color: "#E33B3B",
  brushSize: 8,
  textFont: "pretendard",

  activeTab: null, // 'font' | 'text' | 'image' | 'sticker' | 'tag' | 'draw' | null
  isPublic: false,

  isStickerModalOpen: false,
  stickers: [],
};

export const useDiaryEditorStore = create((set, get) => ({
  ...initialState,

  setDate: (dateStr) => set({ date: dateStr }),
  setBakery: (bakery) => set({ bakery }),
  setStickerId: (stickerId) => set({ stickerId }),

  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),

  setBaseImage: (baseImage) =>
    set({
      baseImage,
      strokes: [],
      undoneStrokes: [],
    }),

  setStrokes: (strokes) =>
    set({
      strokes: Array.isArray(strokes) ? strokes : [],
      undoneStrokes: [],
    }),

  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),
  setBrushSize: (brushSize) => set({ brushSize }),
  setTextFont: (textFont) => set({ textFont }),

  setActiveTab: (tab) =>
    set((state) => ({
      activeTab: state.activeTab === tab ? null : tab,
    })),

  setIsPublic: (val) => set({ isPublic: val }),

  addStroke: (stroke) =>
    set((state) => ({
      strokes: [...state.strokes, stroke],
      undoneStrokes: [],
    })),

  undoStroke: () => {
    const { strokes, undoneStrokes } = get();
    if (strokes.length === 0) return;

    const last = strokes[strokes.length - 1];
    set({
      strokes: strokes.slice(0, -1),
      undoneStrokes: [...undoneStrokes, last],
    });
  },

  redoStroke: () => {
    const { strokes, undoneStrokes } = get();
    if (undoneStrokes.length === 0) return;

    const last = undoneStrokes[undoneStrokes.length - 1];
    set({
      strokes: [...strokes, last],
      undoneStrokes: undoneStrokes.slice(0, -1),
    });
  },

  clearStrokes: () => set({ strokes: [], undoneStrokes: [] }),

  openStickerModal: () => set({ isStickerModalOpen: true }),
  closeStickerModal: () => set({ isStickerModalOpen: false }),

  removeSticker: (id) =>
    set((state) => ({
      stickers: state.stickers.filter((s) => s.id !== id),
    })),

  updateSticker: (id, patch) =>
    set((state) => ({
      stickers: state.stickers.map((s) =>
        s.id === id ? { ...s, ...patch } : s,
      ),
    })),

  selectSticker: (id) => set({ stickerId: id, isStickerModalOpen: false }),

  resetEditor: () => set({ ...initialState }),
}));
