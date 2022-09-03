export function convertCoordinate(op: {
  x: number,
  y: number,
  canvasWidth: number,
  canvasHeight: number
}) {

  const translateXY = {
    x: 0,
    y: 0
  };

  translateXY.x = 2 / op.canvasWidth * op.x - 1;
  translateXY.y = 2 / op.canvasHeight * op.y - 1;

  translateXY.y *= -1;

  return translateXY;
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve(image);
    };

    image.src = url;
  });
}