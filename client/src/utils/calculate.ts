export const calculateBox = ({
  startX,
  startY,
  endX,
  endY,
}: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}) => {
  const width = Math.abs(startX - endX);
  const height = Math.abs(startY - endY);
  const realStartX = startX < endX ? startX : endX;
  const realStartY = startY < endY ? startY : endY;

  return [realStartX, realStartY, width, height];
};
