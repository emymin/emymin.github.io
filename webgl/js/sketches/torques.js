import { shadertoy } from "../ShaderToy.js";

export const fragmentShader = `
#include <common>

uniform vec3 iResolution;
uniform float iTime;


//just a little raymarched shader I made, also on ShaderToy

#define MAX_STEPS 1000
#define MAX_DIST 100000.
#define SURF_DIST .001
//#define PI 3.14159

#define S smoothstep
#define T iTime

mat2 Rot(float a) {
float s=sin(a), c=cos(a);
return mat2(c, -s, s, c);
}

float Hash21(vec2 p) {
p = fract(p*vec2(123.34,233.53));
p += dot(p, p+23.234);
return fract(p.x*p.y);
}


float opSmoothUnion( float d1, float d2, float k ) {
float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
return mix( d2, d1, h ) - k*h*(1.0-h); }

float repeat(float x, float margin){
return (mod(x+0.5*margin,margin)-0.5*margin);
}

vec2 repeat_id(float x, float margin){
float p = mod(x+0.5*margin,margin)-0.5*margin;
float id = floor((x+0.5*margin)/margin);
return vec2(p,id);
}

float sdBox(vec3 p, vec3 s) {
p = abs(p)-s;
return length(max(p, 0.))+min(max(p.x, max(p.y, p.z)), 0.);
}
float archimedes(vec3 p){
p.y = repeat(p.y,2.);
p.xz = p.xz*Rot(p.y*PI*0.5);   
float d = sdBox(p, vec3(1));
return d-.5;
}

vec2 GetDist_id(vec3 p) {
vec2 ax = repeat_id(p.x,20.);
vec2 az = repeat_id(p.z,20.);
vec3 repeatedspace = vec3(ax.x,p.y,az.x);
vec3 randomoffsetspace = repeatedspace+vec3(0.,1.,0.)*Hash21(vec2(ax.y,az.y))*20.+vec3(0.,1.,0.)*(80.*Hash21(vec2(az.y,ax.y)) + iTime*-10.  );
randomoffsetspace.y = (repeat(randomoffsetspace.y,100.))/1.5;
float sphered = length(randomoffsetspace)-Hash21(vec2(ax.y,az.y))*8.;
float d=archimedes(repeatedspace);
float id=0.;
d=opSmoothUnion(d,sphered,2.5);
return vec2(d*.5,sphered/d);
}
float GetDist(vec3 p){
return vec2(GetDist_id(p)).x;   
}

vec2 RayMarch(vec3 ro, vec3 rd) {
float dO=0.;
float id=0.;

for(int i=0; i<MAX_STEPS; i++) {
vec3 p = ro + rd*dO;
vec2 dist = GetDist_id(p);
id = dist.y;
float dS = dist.x;
dO += dS*1.;
if(dO>MAX_DIST || abs(dS)<SURF_DIST) break;
}

return vec2(dO,id);
}

vec3 GetNormal(vec3 p) {
float d = GetDist(p);
vec2 e = vec2(.001, 0);

vec3 n = d - vec3(
GetDist(p-e.xyy),
GetDist(p-e.yxy),
GetDist(p-e.yyx));

return normalize(n);
}

vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
vec3 f = normalize(l-p),
r = normalize(cross(vec3(0,1,0), f)),
u = cross(f,r),
c = f*z,
i = c + uv.x*r + uv.y*u,
d = normalize(i);
return d;
}



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
//vec2 m = iMouse.xy/iResolution.xy;

vec3 col;
vec3 ro = vec3(5.+sin(iTime/10.)*100., 0,5.+cos(iTime/10.)*100.);
//vec3 ro = vec3(10.,0,0);
//ro.yz *= Rot(-m.y*3.14+1.);
//ro.xz *= Rot(-m.x*6.2831);

vec3 rd = GetRayDir(uv, ro, ro+vec3(2.*PI,0,10), 1.);

vec2 result = RayMarch(ro, rd);
float d = result.x;
float id = result.y;
if(d<MAX_DIST) {
vec3 p = ro + rd * d;
vec3 n = GetNormal(p);

col = clamp(mix(vec3(1,0,0),vec3(0,0,0),id/1000.),vec3(0,0,0),vec3(1,0,0));
float dif = dot(n, normalize(vec3(1,2,3)))*.5+.5;
col += dif;
col *= 1.-(d/200.);
    //col*=id/float(MAX_STEPS)*10.;
    //col=vec3(id);
}
if(d<0.){col=vec3(0.5,0.5,0.5);}
col = pow(col, vec3(.4545));	// gamma correction
//col=vec3(id);
fragColor = vec4(col,1.0);
}

void main() {
mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

shadertoy(fragmentShader);