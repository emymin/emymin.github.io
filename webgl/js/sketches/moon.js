import { shadertoy } from "../ShaderToy.js";


export const fragmentShader = `
#include <common>

uniform vec3 iResolution;
uniform float iTime; //ALWAYS KEEP



float random (vec2 st) {
return fract(sin(dot(st.xy,
                    vec2(12.9898,78.233)))*
43758.5453123);
}

vec2 rotate(vec2 v, float a) {
float s = sin(a);
float c = cos(a);
mat2 m = mat2(c, -s, s, c);
return m * v;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
vec2 uv = fragCoord/iResolution.xy;
uv-=0.5;
vec2 uv1 = uv;
float cells=100.;
vec2 orig_uv = uv;
vec2 ratio = vec2(iResolution.x/iResolution.y,iResolution.y/iResolution.x);
uv.x*=cells*ratio.x;
uv.y*=cells;
uv=floor(uv);

float time = floor(iTime*10.);
float random_col = clamp(  sqrt(sqrt(random(uv.yx+time+(random(vec2(time)))))), 0.01 , 1.  );
if(length(uv)>cells/3.) random_col*= 0.;
random_col = random_col*clamp( 0.15+(-uv.x/10.) , 0.1 , 1.);


float rings = floor(length(uv)/cells*20.);
float lines=0.;
if(int(rings+floor(iTime*5.))%2==0)lines=1./rings;


float result = lines;
if(random_col>0.){
result=random_col;
}
vec3 col=vec3(result);
fragColor = vec4(col,1.0);
}






//ALWAYS KEEP THIS 
void main() {
mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

shadertoy(fragmentShader);