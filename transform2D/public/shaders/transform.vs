attribute vec2 a_position;
attribute vec2 a_texture;

varying vec2 v_text;
uniform mat4 u_matrix;

void main(){
  v_text = a_texture;
  gl_Position = u_matrix * vec4(a_position, 0, 1);
}