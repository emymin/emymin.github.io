import * as THREE from '/libs/three/build/three.module.js';
import { RGBELoader } from '/libs/three/examples/jsm/loaders/RGBELoader.js';
import '/libs/jquery.js';
import { OrbitControls } from '/libs/three/examples/jsm/controls/OrbitControls.js';
import { EquirectangularReflectionMapping,PlaneGeometry,MeshStandardMaterial,Mesh,TextureLoader, Plane } from '../../../libs/three/build/three.module.js';
import { GetCustomStandard } from '../CustomStandardShader.js';
import { degToRad } from '/libs/three/src/math/MathUtils.js';

const texloader = new TextureLoader();

function loadSVGTex(url,callback){

}

const uniforms = {
  time: { value: 0 }
};



function makeFlag(nationName,flagURL,index,scene,flags){
  console.log(nationName+":"+flagURL);  
  
  const loadFunc = (flagURL.endsWith(".svg")) ? loadSVGTex : texloader.load;

  const callback = (texture)=>{

    const flagMat = GetCustomStandard({name:"waveFlag_"+nationName,customVert:`
    vec4 origin = modelMatrix * vec4(0,0,0,1);
    float offset = sin(dot(origin.xz,vec2(23233.435,21234.534))*654523.12)*53431.23;
    transformed.z+=sin(time*2.+uv.x*8.+offset)*0.1*uv.x;
    `,uniforms:uniforms,customVertHeader:"uniform float time;"});
    flagMat.map = texture;
    flagMat.side=THREE.DoubleSide;

    const xpos = (index%5)*3;
    const zpos = (index/5)*-1;

    const ratio = texture.image.width/texture.image.height;
    const flagGeom = new PlaneGeometry(1*ratio,1,10*ratio,1);
    const flag = new THREE.Mesh(flagGeom,flagMat);
    flag.name=nationName;
    flag.position.set(xpos,5,zpos);

    scene.add(flag);
    flags.push(flag);

    const poleGeom = new THREE.CylinderGeometry(0.05,0.05,5.5,10);
    const poleMat = new THREE.MeshStandardMaterial();
    poleMat.metalness=0.5;
    poleMat.roughness=0.5;
    const pole = new THREE.Mesh(poleGeom,poleMat);
    pole.position.set(xpos-ratio*0.5,2.75,zpos);
    pole.parent = flag;
    scene.add(pole);

    const poleTopGeom = new THREE.SphereGeometry(0.075,8,8);
    const poleTop = new THREE.Mesh(poleTopGeom,poleMat);
    poleTop.position.set(xpos-ratio*0.5,5.5,zpos);
    poleTop.parent=pole;
    scene.add(poleTop);
    
  }

  if(flagURL.endsWith(".svg")){

  }else{
    texloader.load(flagURL,callback);
  }

  

}

/*function flagsFromApi(flags,scene){ //NOPE, NationStates flag CORS doesn't allow them being loaded from browsers, using fetchNationStates.py to generate the data statically and load it
  $.ajax({
    type:"GET",
    url:"https://www.nationstates.net/cgi-bin/api.cgi?region=the_lands_of_the_great_oh",
    dataType:"xml",
    success:function(xml){
      $(xml).find("NATIONS").each(function(){
        const nations = this.textContent.split(":");
        nations.forEach((nationName,index)=>{
          $.ajax({
            type:"GET",
            url:"https://www.nationstates.net/cgi-bin/api.cgi?region="+nationName,
            dataType:"xml",
            success:function(xml){
              $(xml).find("FLAG").each(function(){
                const flagURL = this.textContent;
                makeFlag(nationName,flagURL,index,scene,flags);
              });
            }
          })
        })
      });
    }
  });
}*/

function flagsFromData(flags,scene,data){
  for (const [index, [nationName, nationData]] of Object.entries(Object.entries(data))){
    const flagURL = "/webgl/assets/data/flags/flags/"+nationData["flag"];
    makeFlag(nationName,flagURL,index,scene,flags);

  } 
}
function flagsFromJson(flags,scene,jsonPath){
  $.getJSON("/webgl/assets/data/flags/flags.json",function(data){
    console.log(data);
    flagsFromData(flags,scene,data);
  });
}

function main() {
  
  const canvas = document.querySelector('#canvas');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.autoClearColor=false;
  const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );

  const scene = new THREE.Scene();
  

  const rgbeloader = new RGBELoader().setPath("/webgl/assets/textures/Flags/");
  rgbeloader.load("skybox.hdr",(hdr)=>{
    hdr.mapping = EquirectangularReflectionMapping;
    scene.background=hdr;
    scene.environment=hdr;
  });

  
  camera.position.set(0,0,10);
  const controls = new OrbitControls(camera,renderer.domElement);
  controls.target.set(6,0,-2);
  controls.maxPolarAngle = (Math.PI/2)*0.9;
  controls.update();

  const planeGeom = new PlaneGeometry(100,100);
  const planeMat = new MeshStandardMaterial();
  const plane = new THREE.Mesh(planeGeom,planeMat);
  plane.rotation.set(degToRad(-90),0,0);
  scene.add(plane);

  const flagsMeshes = [];
  flagsFromJson(flagsMeshes,scene,"/webgl/assets/data/flags.json");


  
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
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

      renderer.render(scene, camera);
     
      requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
    
}
const title = document.createElement("p");
title.classList.add("lower_left");
title.innerHTML = "Flags from <a href=https://www.nationstates.net/region=the_lands_of_the_great_oh>the Lands of the Great Oh</a>";
document.body.appendChild(title);
main();