export type Cell = {
  row: number;
  col: number;
  isMine: boolean;
  isMarked: boolean;
  hidden: boolean;
  surroundingMines: number;
};
