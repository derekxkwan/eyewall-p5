precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D cam;
uniform float texel_h;
uniform float texel_w;
uniform float copy_x;
uniform float copy_y;
uniform float copy_w;
uniform float copy_h;
uniform float y_off;

//uniform int time;

vec2 map_to_cam(vec2 co)
{
  return vec2(mod(co.x, copy_w)+copy_x, mod(co.y + (copy_h * y_off), copy_h) + copy_h);
}

void main() {

  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  //uv = 1.0 - uv;
  uv = vec2(uv.x, 1.0-uv.y);

  // get the webcam as a vec4 using texture2D
  //vec4 cam = texture2D(cam0, uv);
  vec4 cur = texture2D(cam, map_to_cam(uv));

  // lets invert the colors just for kicks
  //tex.rgb = 1.0 - tex.rgb;

  gl_FragColor = cur;
}
