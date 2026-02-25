import { create } from "zustand";

const initialState = {
  date: null,
  bakery: null,
  stikerId: null,

  title: "",
  content: "",

  baseImage: null,
  strokes: [],
  undoneStrokes: [],

  tool: "pen",
  color: "#FF9EC4",
  brushSize: 8,
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

  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),
  setBrushSize: (brushSize) => set({ brushSize }),

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

  resetEditor: () => set({ ...initialState }),
}));
