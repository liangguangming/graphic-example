export default class Canvas2D {
  private id: string;
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private currentProgram: WebGLProgram;
  constructor(id: string) {
    this.id = id;
    this.init();
  }

  private init() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 500;
    this.canvas.height = 500;
    this.gl = this.canvas.getContext("webgl2");
    document.body.appendChild(this.canvas);
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  public createProgram(vs: string, fs: string) {
    const vsShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    const fsShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

    this.gl.shaderSource(vsShader, vs);
    this.gl.shaderSource(fsShader, fs);

    this.gl.compileShader(vsShader);
    let isSuccess = this.gl.getShaderParameter(vsShader, this.gl.COMPILE_STATUS);
    if (!isSuccess) {
      const vsShaderLog = this.gl.getShaderInfoLog(vsShader);
      console.warn("vsShaderLog", vsShaderLog);
      return;
    }
    this.gl.compileShader(fsShader);
    isSuccess = this.gl.getShaderParameter(fsShader, this.gl.COMPILE_STATUS);

    if (!isSuccess) {
      const fsShaderLog = this.gl.getShaderInfoLog(vsShader);
      console.warn("fsShaderLog", fsShaderLog);
      return;
    }

    const program = this.gl.createProgram();
    this.gl.attachShader(program, vsShader);
    this.gl.attachShader(program, fsShader);
    this.gl.linkProgram(program);
    isSuccess = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
    if (!isSuccess) {
      const programlog = this.gl.getProgramInfoLog(program);
      console.log("programlog", programlog);
      return;
    }
    this.gl.useProgram(program);
    this.currentProgram = program;

    return program;
  }

  public setMeshData(key: string, data: Array<number>, attribPoint: {
    size: number,
    type: number,
    normalized: boolean,
    stride: number,
    offset: number
  }) {
    const location = this.gl.getAttribLocation(this.currentProgram, key);

    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data) ,this.gl.STATIC_DRAW);

    this.gl.enableVertexAttribArray(location);
    this.gl.vertexAttribPointer(location, attribPoint.size, attribPoint.type, attribPoint.normalized, attribPoint.stride, attribPoint.offset);
  }

  public setUniformMatrix(key: string, data: Array<number>) {
    const location = this.gl.getUniformLocation(this.currentProgram, key);

    this.gl.uniformMatrix4fv(location, false, new Float32Array(data));
  }

  public setTexture(textureSource: HTMLImageElement) {
    const textureID = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, textureID);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.texParameterf(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, textureSource.width, textureSource.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, textureSource);
  }

  public draw() {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  /**
   * 重置颜色
   */
  public clear() {
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  // public 
}