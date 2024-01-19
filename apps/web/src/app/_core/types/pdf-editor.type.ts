export type Pagination = {page: number, limit: number};
export type FabriCanvasState = { version: string; objects: fabric.Object[] };

export type ToolData = {cursor: string, type: string};
export type TextBoxOptions = {font: string, size: number, color: string};
export type EraserOptions = { size: number };
export type PenOptions = { size: number, color: string };
