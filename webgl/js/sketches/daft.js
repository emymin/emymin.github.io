import { ACESFilmicToneMapping, AmbientLight, BoxBufferGeometry, BoxGeometry, Color, DirectionalLight, DoubleSide, EquirectangularReflectionMapping, HemisphereLight, Light, LinearToneMapping, Material, Mesh, MeshBasicMaterial, MeshStandardMaterial, NormalBlending, Plane, PlaneGeometry, PointLight, RectAreaLight, RepeatWrapping, Scene, ShaderMaterial, SphereGeometry, sRGBEncoding, TextureLoader, Vector3, VideoTexture } from '../../../libs/three/build/three.module.js';
import { FBXLoader } from '/libs/three/examples/jsm/loaders/FBXLoader.js';
import { EffectComposer } from '/libs/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '/libs/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '/libs/three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {SSRPass} from '/libs/three/examples/jsm/postprocessing/SSRPass.js';
import { RectAreaLightUniformsLib } from '/libs/three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { OrbitControls } from '/libs/three/examples/jsm/controls/OrbitControls.js';
import * as THREE from '/libs/three/build/three.module.js';
import { RGBELoader } from '/libs/three/examples/jsm/loaders/RGBELoader.js';
import { GetCustomStandard } from '../CustomStandardShader.js';
import { degToRad,clamp } from '/libs/three/src/math/MathUtils.js';
import { GUI } from '/libs/three/examples/jsm/libs/dat.gui.module.js'



const loader = new FBXLoader().setPath("/webgl/assets/models/DaftPunk/");
const texloader = new TextureLoader().setPath("/webgl/assets/textures/DaftPunk/");
const rgbeloader = new RGBELoader().setPath("/webgl/assets/textures/DaftPunk/");
const uniforms = {
  time: { value: 0 },
  spectrum: {type:"fv",value:[0,0,0,0,0,0,0,0]}
};

export function setMaterials(child,materials){
  if(child.material){
    const isArray = Array.isArray(child.material);;
    if(isArray){
      for(let i=0;i<child.material.length;i++){
        const materialName = child.material[i].name;
        if(materials.has(materialName)){
          const newMaterial = materials.get(materialName);
          child.material[i] = newMaterial;
        }
      
      }
    }else{
      const materialName = child.material.name
      if(materials.has(materialName)){
        const newMaterial = materials.get(materialName);
        child.material = newMaterial;
      }
    }
  }
}
export function setTextureRepeat(texture,x,y){
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(x,y);
  return texture;
}

export async function LoadGuyModel(){
  const guyscale = 0.005;
  const materials = new Map();
  const grunge = texloader.load("grunge.jpg");
  const customHeader = "uniform float time;";

  const gold = new MeshStandardMaterial();
  gold.roughnessMap=grunge;
  gold.roughness=0.2;
  gold.metalness=0.9;
  gold.color.set(new Color(1,0.61,0));
  gold.side = DoubleSide;
  gold.name="gold"
  materials.set(gold.name,gold);

  const wirestex = texloader.load("wires.jpg");
  const wires = new MeshStandardMaterial();
  wires.map = wirestex;
  wires.name="wires";
  materials.set(wires.name,wires);

  const lightstex = texloader.load("lights.png");
  const sidelights = new MeshStandardMaterial();
  sidelights.map=lightstex;
  sidelights.emissiveIntensity=1;
  sidelights.emissiveMap = lightstex;
  sidelights.name="lights";
  materials.set(sidelights.name,sidelights);

  const colorstex = texloader.load("colors.jpg");
  const colors = GetCustomStandard(
    {
      name:"colors",
      customMain:`
      #ifdef USE_MAP
        float n = uv.y;
        vec2 ledfac = uv;
        ledfac.y= fract(ledfac.y*8.)*1.25;
        n = floor(n*8.)/8.;
        
        vec4 colorsTex = texture2D(map,uv);
        vec3 c = colorsTex.rgb;
        c*=abs(sin(n+time));
        c*=LedFac(ledfac);
        diffuseColor=vec4(0);
        emissionColor=c;
      #endif
      `,
      customFunctions:`
      float LedFac(vec2 uv){
        uv-=.5;
        uv.x=fract(uv.x*4.)-.5;
        return clamp(1.-length(uv*2.),0.3,1.);
      }
      `,
      uniforms:uniforms,
      customHeader:customHeader
    }
  );
  colors.map=colorstex;
  colors.metalness=0;
  colors.roughness=0.2;
  colors.roughnessMap=grunge;
  materials.set(colors.name,colors);

  const panelUniforms = uniforms;
//  panelUniforms["spectrum"]={type:"fv",value:[0,0,0,0,0,0,0,0]};
  const panels = GetCustomStandard({
    name:"panels",
    customMain:`
  float n = floor(uv.x*2.);
  uv = vec2(fract(uv.x*2.),uv.y);
  vec4 c = n==0.?Rectangles(uv):Circles(uv);
  diffuseColor=vec4(0);
  emissionColor=c.rgb;
  `,customFunctions:`
  float TriangleWave(float x){
    return int(floor(x))%2==0?fract(x):1.-fract(x);
  }

  vec4 Circles(vec2 uv){
      vec4 color = vec4(0);
      vec2 id = vec2(floor(uv.x*2.),floor(uv.y*8.));
      uv.y = fract(uv.y*8.);
      uv.x = fract(uv.x*2.);
      uv-=0.5;
      float d = length(uv*3.);
      float fac = clamp( (1./d)*mix(1.,.01,d) ,0.,1.);
      float anim = 1.;
      float sweep = float(id.y==floor( TriangleWave(time*2.) *8.));
      float expand = step(1., clamp( 1.-abs(id.y-3.)+sin(time*4.)*4. ,0.,1.));
      anim = mix(expand,sweep, step(0.5, sin(time/2.)));
      color=vec4(fac*anim);
      return color;
  }

  vec4 Rectangles(vec2 uv){
      vec4 color = vec4(1);
      vec2 id = vec2(floor(uv.x*8.),floor(uv.y*8.));
      uv.y = fract(uv.y*8.);
      uv.x = fract(uv.x*8.);
      uv-=.5;
      color.rgb= id.x>2.? (id.x>5.? vec3(1,0,0) : vec3(1,1,0)) : vec3(0,1,0); //colors
      color.rgb*=1./(1.+length( vec2(uv.x,uv.y*2.)*0.7 )  ); //tiny bit of falloff
      color.rgb *= abs(uv.x)>0.4 || abs(uv.y)>0.4 ? vec3(0) : vec3(1); //borders
      float wave = 1.;
      #ifdef AUDIO
      wave = spectrum[int(id.y)];
      #else
      wave = ((TriangleWave(time*1.96666*2.) )) *(abs(sin(id.y+time*10.))+abs(cos(id.y+time*10.))*8.);
      #endif
      color.rgb *= id.x<=wave? vec3(1):vec3(0);
      return color;
  }
  `,uniforms:panelUniforms,customHeader:customHeader+"uniform float[8] spectrum;\n"});
  panels.metalness=0;
  panels.roughness=0.2;
  panels.roughnessMap=grunge;
  materials.set(panels.name,panels);

  const smiletex = texloader.load("smile.png");
  smiletex.generateMipmaps=false;
  smiletex.magFilter = THREE.LinearFilter;
  smiletex.minFilter = THREE.LinearFilter;
  const guyvisor = GetCustomStandard(
    {
      name:"black",
      customMain:`
      vec4 c = vec4(0);
      #ifdef USE_MAP
      c.a=1.;
      vec2 leduv = uv;
      vec2 id=floor(leduv*100.);
      leduv=fract(leduv*100.);
      leduv-=.5;
      float ledfac = mix(1.,0.,length(leduv*2.));
  
      uv = id/100.;
      uv=uv.yx;
      uv.y=1.-uv.y;
      uv+=vec2(-0.19,-0.36);
      vec2 idoffset = vec2(-60,-20);
      id+=idoffset;
  
      float eyesfac = float( abs(id.x) == 0. && abs(id.y) == 10.);
  
      uv*=7.;
      uv+=0.5;
      uv.y+=time;
      uv.y=fract(uv.y);
      vec4 image = texture2D(map,uv );
      float imagefac = float(image.a>0.);
  
      float mode = step(0.5,fract(time/16.));
      float fac = (mode == 0.) ? imagefac : eyesfac;
      vec3 tint = (mode == 0.) ? vec3(1,1,0) : vec3(0,1,0);
      c.rgb = clamp(ledfac,0.,1.)*tint*fac;
      #endif

      diffuseColor=vec4(0);
      emissionColor=c.rgb;
      `,uniforms:uniforms,customHeader:customHeader
    }
  );
  guyvisor.map=smiletex;
  guyvisor.metalness=0;
  guyvisor.roughnessMap=grunge;
  guyvisor.roughness=0.2;
  materials.set(guyvisor.name,guyvisor);

  const pulseTex = texloader.load("pulse.png")
  const heartbeat = GetCustomStandard({
    name:"heartbeat",
    customMain:`
    vec4 pulse = texture2D(map,uv);
    vec4 c = vec4(1);
    c.rgb = vec3(0,1,0)*pulse.a;
    c.rgb *= clamp(sin((uv.x-time)*(127./60.)),0.,1.);
    diffuseColor=vec4(0);
    emissionColor = c.rgb;
    `,uniforms:uniforms,customHeader:customHeader
  });
  heartbeat.map=pulseTex;
  heartbeat.metalness=0;
  heartbeat.roughness=1-0.727;
  materials.set(heartbeat.name,heartbeat);

  const model = await loader.loadAsync("GuyModel.fbx");
  model.name="DaftPunk_Guy";
  model.scale.set(guyscale,guyscale,guyscale);
  model.position.set(0.5,0,0);
  model.traverse((child)=>setMaterials(child,materials));
  model.materials=materials;

  return model;
}

export async function LoadThomasModel(){
  const thomasScale = 0.005*1.487191;
  const materials = new Map();

  const grunge = texloader.load("grunge.jpg");
  const customHeader = "uniform float time;"

  const silver = new MeshStandardMaterial();
  silver.roughnessMap=grunge;
  silver.roughness=0.2;
  silver.metalness=0.9;
  silver.side = DoubleSide;
  silver.color.set(new Color(0.6,0.6,0.6));
  silver.name="silver";
  materials.set(silver.name,silver);

  const colorstex = texloader.load("colors.jpg");
  const ears = GetCustomStandard({
    name:"ears",
    customMain:`
    float id = floor(floor(uv.x*32.)/4.)/4.;
    uv = vec2(fract(uv.x*8.),uv.y);

    vec4 c = texture2D(map,vec2(0,fract(id)));
    c*=LedFac(uv);
    c*=1.-abs(sin(id+time));

    c.rgb*=0.8;

    diffuseColor=vec4(0,0,0,1);
    emissionColor = c.rgb;
    `,
    customFunctions:`
    float LedFac(vec2 uv){
      uv-=.5;
      uv.x=fract(uv.x*4.)-.5;
      return clamp(1.-length(uv*2.),0.3,1.);
    }
    `,
    uniforms:uniforms,
    customHeader:customHeader
  });
  ears.map=colorstex;
  ears.roughness=1;
  ears.metalness=0;
  materials.set(ears.name,ears);

  const side = GetCustomStandard({
    name:"side",
    customMain:`
    vec2 inuv = uv;
    vec2 paneluv = vec2(inuv.x,fract(inuv.y*2.));
    float panelid = floor(inuv.y*2.);

    vec4 c = mix( HorizontalLines(paneluv), LeftPanel(paneluv),panelid);
    diffuseColor=vec4(0,0,0,1);
    emissionColor=c.rgb;
    `,
    customFunctions:`
    float TriangleWave(float x){
        return int(floor(x))%2==0?fract(x):1.-fract(x);
    }

    vec4 HorizontalLines(vec2 uv){
        vec4 col=vec4(1);
        float lineid = floor(uv.x*3.);
        uv.y=fract(uv.x*3.);
        uv-=.5;
        col.rgb = lineid==0.? vec3(0,1,0) : (lineid==1.? vec3(1,1,0) : vec3(1,0,0) );
        float border = float(!(abs(uv.x)>0.45 || abs(uv.y)>0.4));
        float anim = float(lineid == floor(fract(time)*3.));
        col.rgb*=anim;
        col.rgb*=border;
        return col;
    }
    vec4 LeftPanel(vec2 uv){
        vec4 col=vec4(1);
        vec2 id = floor(uv*vec2(10,5));
        uv = fract(uv*vec2(10,5));
        uv-=.5;

        float d = length(uv*3.);
        float ledfac = clamp( (1./d)*mix(1.,.01,d) ,0.,1.);
        
        float panelid = float(id.x<3. || id.x>6. );
        vec3 ledcolor = panelid==1. ? vec3(1,0,0) : vec3(0,1,1);

        float verticalanim = float(abs(id.x-fract(time)*10.) <= 1.);
        float horizontalanim = float(abs(id.y-TriangleWave(time)*5.)<=1.);

        col.rgb = ledfac*ledcolor;
        col.rgb *= panelid==1. ? verticalanim : horizontalanim;

        return col;
    }
    `,
    uniforms:uniforms,customHeader:customHeader
  });
  side.roughness=0.2;
  side.roughnessMap=grunge;
  side.metalness=0;
  materials.set(side.name,side);

  const daftTextTex = texloader.load("DaftPunkScrolling.png");
  daftTextTex.generateMipmaps=false;
  daftTextTex.magFilter = THREE.LinearFilter;
  daftTextTex.minFilter = THREE.LinearFilter
  const thomasvisor = GetCustomStandard({
    name:"visor",
    customMain:`
    vec2 inuv = uv;
    vec2 grid = vec2(20,60);
    vec2 extuv = inuv*grid;
    vec2 fuv = fract(extuv)-.5;
    vec2 id = floor(extuv);
    float d = length(fuv*3.);
    float ledfac = clamp( (1./d)*mix(1.,.01,d) ,0.,1.);

    //float linefac = (id.x>=grid.x/3 && id.x<(2*grid.x/3)); //epic line in the middle of the visor, decided to leave it out but can be easily readded

    float wave = TriangleWave(time*1.5)*grid.y;
    float sweep = float(abs(id.y-wave)<=1.);
    sweep = (id.x>=grid.x/3. && id.x<(2.*grid.x/3.)) ? sweep : 0.;

    vec2 iduv = id/grid;
    iduv.y*=-1.;
    vec4 text = texture2D(map,vec2(fract(iduv.y+time/4.),iduv.x));
    float textfac = float(text.rgb!=vec3(1));

    vec4 c = vec4(1);
    c.rgb = ledfac*vec3(1,0,0);
    c *= mix(textfac, sweep, step(0.5,TriangleWave(time/4.)));

    diffuseColor=vec4(0,0,0,1);
    emissionColor = c.rgb;
    `,
    customFunctions:`
    float TriangleWave(float x){
      return int(floor(x))%2==0?fract(x):1.-fract(x);
    }
    `,
    uniforms:uniforms,
    customHeader:customHeader
  });
  thomasvisor.map=daftTextTex;
  thomasvisor.roughness=0.2;
  thomasvisor.roughnessMap=grunge;
  thomasvisor.metalness=0;
  materials.set(thomasvisor.name,thomasvisor);

  const model = await loader.loadAsync("ThomasModel.fbx");
  model.name="DaftPunk_Thomas";
  model.scale.set(thomasScale,thomasScale,thomasScale);
  model.position.set(-0.5,-0.32,0);
  model.traverse((child)=>setMaterials(child,materials));
  model.materials=materials;

  return model;
}

export function DaftPunkShowcaseScene(){
  const scene = new THREE.Scene();
  rgbeloader.load("ShowcaseSkybox.hdr",(hdr)=>{
    hdr.mapping = EquirectangularReflectionMapping;
    scene.background=hdr;
    scene.environment=hdr;
  });
  const dirlight = new DirectionalLight((1,0.95,0.83),1);
  dirlight.rotation.set(50,-30,0);
  scene.add(dirlight);

  const ambient = new AmbientLight( 0xffffff,1);
  scene.add( ambient );
  
  LoadGuyModel().then(model=>scene.add(model));
  LoadThomasModel().then(model=>scene.add(model));


  return scene;
}

function setHDR(scene,name){
  rgbeloader.load("HDR/"+name+".hdr",(hdr)=>{
    hdr.mapping = EquirectangularReflectionMapping;
    scene.background=hdr;
    scene.environment=hdr;
  });

}

function floorPlane(){
  const planeGeom = new PlaneGeometry(100,100);
  const planeMat = new MeshStandardMaterial();
  const repeat = {x:20,y:20};
  planeMat.color.set(new Color(0,0,0));
  planeMat.metalnessMap = setTextureRepeat(texloader.load("Floor/metallic.jpg"),repeat.x,repeat.y);
  planeMat.normalMap = setTextureRepeat(texloader.load("Floor/normal.jpg"),repeat.x,repeat.y);
  planeMat.roughnessMap = setTextureRepeat(texloader.load("Floor/roughness.jpg"),repeat.x,repeat.y);
  const plane = new THREE.Mesh(planeGeom,planeMat);
  plane.rotation.set(degToRad(-90),0,0);
  plane.position.set(0,0,0);
  return plane;
}
function skySphere(){
  const sphereGeom = new SphereGeometry(100,50,50);
  const sphereMat = new ShaderMaterial({
    uniforms:{audioData:{type:"fv",value:new Array(128)}},
    vertexShader:`
    varying vec3 vUv; 

    void main() {
      vec3 dir = normalize(position.xyz)*-1.;
      vUv.x = atan(dir.x, dir.z);
      vUv.y = acos(-dir.y); 
      vUv = vUv / 3.14159265359;

      vUv.x = vUv.x*0.5 + 0.5;
      vUv.y = 1. - vUv.y;

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `,
    fragmentShader:`
    varying vec3 vUv;
    uniform float[128] audioData;

    void main(){
      gl_FragColor=vec4(vUv.x,vUv.y,0,1);
    }
    `
  });
  sphereMat.side = DoubleSide;
  const sphere = new Mesh(sphereGeom,sphereMat);
  return sphere;
}

function main() {
  
  const canvas = document.querySelector('#canvas');

  //const videoElement = document.createElement("video");
  //videoElement.src="/webgl/assets/videos/TooLong/video.mp4";
  //videoElement.type="video/mp4";
  //document.body.appendChild(videoElement);

  const audioElement = document.createElement("audio");
  audioElement.src="/webgl/assets/videos/TooLong/audio.webm";
  audioElement.type="audio/webm";
  document.body.appendChild(audioElement)
  
  //videoElement.play();
  audioElement.play();

  const audioCtx = new AudioContext();
  const analyzer = audioCtx.createAnalyser();
  analyzer.fftSize = 2048;
  const audioSource = audioCtx.createMediaElementSource(audioElement);
  audioSource.connect(analyzer);
  audioSource.connect(audioCtx.destination);
  const audioData = new Uint8Array(analyzer.frequencyBinCount);


  const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.autoClearColor=false;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure=1;
  renderer.outputEncoding = sRGBEncoding;
  renderer.gammaOutput = true;
  renderer.gammaFactor = 2.2;
  
  RectAreaLightUniformsLib.init();

  
  const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.2, 50 );
  camera.position.set(0,0,5);
  camera.far=4000;
  
  const scene = new Scene();

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene,camera);
  composer.addPass(renderPass);
  const ssrPass = new SSRPass({renderer:renderer,scene:scene,camera:camera,width:128,height:128});
  composer.addPass(ssrPass);
  const bloomPass = new UnrealBloomPass(512,0.2);
  composer.addPass(bloomPass);
  
  let panelsMaterial;

  LoadGuyModel().then(model=>{
    scene.add(model);
    panelsMaterial=model.materials.get("panels");
    panelsMaterial.defines.AUDIO="";
    model.rotation.set(degToRad(-19),0,0);
    model.position.set(0.5,0.42,0);
  });


  LoadThomasModel().then(model=>{
    console.log(model);
    scene.add(model);
    model.rotation.set(degToRad(-16),0,0);
    model.position.set(-0.5,0.05,0);
  })

  const light1 = new PointLight(new Color(1,0,0),1);
  light1.position.set(-1,1,0);
  scene.add(light1);

  const light2 = new PointLight(new Color(0,0,1),1);
  light2.position.set(1,1,0);
  scene.add(light2);


  scene.add(floorPlane());

  const controls = new OrbitControls(camera,renderer.domElement);
  controls.target.set(0,0,0);
  controls.maxPolarAngle = (Math.PI/2)*0.9;
  controls.maxDistance=20;
  controls.update();
  
  const params={hdri:"market",ssr:false,bloom:true};
  let currenthdri;
  let ssrEnabled;
  let bloomEnabled;

  const gui = new GUI();
  const lightingFolder = gui.addFolder("Lighting");
  lightingFolder.add(params,"hdri",{Market:"market",Room:"room",Night:"night",Studio:"studio",Garden:"garden",Machinery:"machinery"}).name("Environment map");
  lightingFolder.add(params,"ssr").name("Use SSR (GPU intensive)");
  lightingFolder.add(params,"bloom").name("Use bloom");
  gui.open();
  
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
      composer.setSize(width,height);
    }
    return needResize;
  }
  
  
  function render(time) {
      time *= 0.001;
      
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        
        
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      
      uniforms.time.value = time;
      analyzer.getByteFrequencyData(audioData);

      light1.position.set(-1+Math.cos(time),1,Math.sin(time));
      light1.intensity=0.02*audioData[0];
      light2.position.set(1+Math.sin(time),1,Math.cos(time));
      light2.intensity=0.02*audioData[0];

      for(let i=0;i<8;i++){
        uniforms.spectrum.value[i]=audioData[i+40*i]*0.05;
      }

      if(currenthdri!=params.hdri){
        currenthdri=params.hdri;
        setHDR(scene,currenthdri);
      }
      if(ssrEnabled!=params.ssr){
        ssrEnabled=params.ssr;
        ssrPass.enabled = ssrEnabled;
      }
      if(bloomEnabled!=params.bloom){
        bloomEnabled=params.bloom;
        bloomPass.enabled=bloomEnabled;
      }

      requestAnimationFrame(render);
      composer.render();
  }
  requestAnimationFrame(render);
    
}

const canvas = document.querySelector('#canvas');
canvas.style.display="none";
document.body.style.backgroundColor="black";

const title = document.createElement("h1");
title.classList.add("center");
title.innerHTML = "Click to start";
document.body.appendChild(title);

let clicked=false
document.body.addEventListener("click",()=>{
  if(!clicked){
    canvas.style.display="block";
    title.style.display="none";
    clicked=true;
    main();
  }
});