export type Cell = {
  row: number;
  col: number;
  isMine: boolean;
  isFlagged: boolean;
  isRevealed: boolean;
  surroundingMines: number;
};
