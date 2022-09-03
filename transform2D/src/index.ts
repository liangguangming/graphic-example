import {Mat4, Vec3} from "ogl-typescript"

import Canvas2D from "./canvas2D";
import { convertCoordinate, loadImage } from "./utils";

console.log("webgl transform 2D");

async function launch() {
  const canvas2D = new Canvas2D("lgm");

  const vs = await (await fetch("shaders/transform.vs")).text();

  const fs = await (await fetch("shaders/transform.fs")).text();

  canvas2D.createProgram(vs, fs);

  let x1 = 0;
  let x2 = 250;
  let y1 = 0;
  let y2 = 250;

  const xy1 = convertCoordinate({
    x: x1,
    y: y1,
    canvasWidth: canvas2D.width,
    canvasHeight: canvas2D.height
  });

  x1 = xy1.x;
  y1 = xy1.y;

  const xy2 = convertCoordinate({
    x: x2,
    y: y2,
    canvasWidth: canvas2D.width,
    canvasHeight: canvas2D.height
  });

  x2 = xy2.x;
  y2 = xy2.y;

  canvas2D.setMeshData("a_position", [
    x1, y2,
    x2, y2,
    x1, y1,
    x1, y1,
    x2, y2,
    x2, y1
  ], {
    size: 2,
    type: WebGL2RenderingContext.FLOAT,
    normalized: false,
    stride: 0,
    offset: 0
  });

  const img = await loadImage("4k_2.jpg");

  canvas2D.setTexture(img);

  canvas2D.setMeshData("a_texture", [
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1
  ], {
    size: 2,
    type: WebGL2RenderingContext.FLOAT,
    normalized: false,
    stride: 0,
    offset: 0
  });

  const TAU = 2 * Math.PI;

  let rad = TAU * Math.random();

  let scale = 0.2;

  function loop() {
    canvas2D.clear();
    if (rad > TAU * 5) {
      rad = 0;
    }

    if (scale > 3) {
      scale = 0.2;
    }

    scale *= 1.1;

    rad += 0.2;
    const originMat = new Mat4().identity();

    let translateMat = new Mat4().identity();
    translateMat.x = 0.5;
    translateMat.y = -0.5;

    const rotateMat = new Mat4().identity();
    rotateMat[0] = Math.cos(rad);
    rotateMat[1] = -Math.sin(rad);
    rotateMat[4] = Math.sin(rad);
    rotateMat[5] = Math.cos(rad);

    originMat.multiply(translateMat, originMat);

    originMat.multiply(rotateMat, originMat);

    // originMat.multiply(translateMat.inverse(), originMat);

    const scaleMat = new Mat4().identity();
    scaleMat.scale(new Vec3(scale, scale, 0));

    // originMat.multiply(translateMat, originMat);

    originMat.multiply(scaleMat, originMat);

    originMat.multiply(translateMat.inverse(), originMat);

    canvas2D.setUniformMatrix("u_matrix", originMat.toArray());

    canvas2D.draw();

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop)
}

launch();