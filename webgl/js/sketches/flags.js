import * as THREE from '/libs/three/build/three.module.js';
import { RGBELoader } from '/libs/three/examples/jsm/loaders/RGBELoader.js';
import '/libs/jquery.js';
import { OrbitControls } from '/libs/three/examples/jsm/controls/OrbitControls.js';
import { EquirectangularReflectionMapping,PlaneGeometry,MeshStandardMaterial,Mesh,TextureLoader } from '../../../libs/three/build/three.module.js';

const texloader = new TextureLoader();

function loadSVGTex(url,callback){

}


function makeFlag(nationName,flagURL,index,scene,flags){
  console.log(nationName+":"+flagURL);
  const subdivs = 50;
  
  
  const loadFunc = (flagURL.endsWith(".svg")) ? loadSVGTex : texloader.load;

  const callback = (texture)=>{
    const flagMat = new MeshStandardMaterial();
    flagMat.map = texture;
    const flagGeom = new PlaneGeometry(1,1,50,50);
    const flag = new THREE.Mesh(flagGeom,flagMat);
    flag.name=nationName;
    flag.position.set(index*2,0,0);
    scene.add(flag);
    flags.push(flag);
  }

  if(flagURL.endsWith(".svg")){

  }else{
    texloader.load(flagURL,callback);
  }

  

}
function flagsFromApi(flags,scene){
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
            url:"https://www.nationstates.net/cgi-bin/api.cgi?nation="+nationName,
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
}

function flagsFromData(flags,scene,data){
  for (const [index, [nationName, flagURL]] of Object.entries(Object.entries(data))){
    makeFlag(nationName,flagURL,index,scene,flags);

  } 
}
function flagsFromJson(flags,scene,jsonPath){
  $.getJSON("/webgl/assets/data/flags.json",function(data){
    console.log(data);
    flagsFromData(flags,scene,data);
  });
}

function main() {
  
  const canvas = document.querySelector('#canvas');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.autoClearColor=false;
  const camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 10000 );
  const scene = new THREE.Scene();
  
  const uniforms = {
    time: { value: 0 }
  };

  const rgbeloader = new RGBELoader().setPath("/webgl/assets/textures/Flags/");
  rgbeloader.load("skybox.hdr",(hdr)=>{
    hdr.mapping = EquirectangularReflectionMapping;
    scene.background=hdr;
    scene.environment=hdr;
  });

  
  camera.position.set(0,0,5);
  const controls = new OrbitControls(camera,renderer.domElement);
  controls.update();

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
main();