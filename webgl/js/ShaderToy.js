import * as THREE from '/libs/three/build/three.module.js';


export function shadertoy(fragmentShader) {

    const canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.autoClearColor=false;

    const camera = new THREE.OrthographicCamera(
        -1, // left
        1, // right
        1, // top
        -1, // bottom
        -1, // near,
        1, // far
    );
    const scene = new THREE.Scene();

    const uniforms = {
        iTime: { value: 0 },
        iResolution:  { value: new THREE.Vector3() },
    };

    const material = new THREE.ShaderMaterial({
        fragmentShader,
        uniforms,
    });

    const plane = new THREE.PlaneBufferGeometry(2, 2);

    scene.add(new THREE.Mesh(plane, material));



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
        
        uniforms.iResolution.value.set(canvas.width,canvas.height,1);
        uniforms.iTime.value = time;

        
        renderer.render(scene, camera);
        
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
        
}