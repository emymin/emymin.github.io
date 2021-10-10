import * as THREE from '../libs/three/build/three.module.js';
function main() {
  
  const canvas = document.querySelector('#canvas');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.autoClearColor=false;
  const camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 10000 );
  const scene = new THREE.Scene();
  
  const uniforms = {
    time: { value: 0 }
  };
  
  
  
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