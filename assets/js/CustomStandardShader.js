import { MeshStandardMaterial } from "/libs/three/build/three.module.js";

export function GetCustomStandard({name,customMain,customFunctions,uniforms,customHeader,customVert,customVertHeader}={}){
	const customMaterial = new MeshStandardMaterial();
	customMaterial.name=name;
	customMaterial.defines.USE_UV="";
	customMaterial.onBeforeCompile = shader => {
		if(uniforms){
			for(let uniform in uniforms){
				shader.uniforms[uniform]=uniforms[uniform];
			}
		}
		if(customHeader){
			shader.fragmentShader = customHeader+"\n"+shader.fragmentShader;
		}
		if(customVertHeader){
			shader.vertexShader = customVertHeader+"\n"+shader.vertexShader;
		}
		if(customFunctions){
			shader.fragmentShader = shader.fragmentShader.replace(
				"void main() {",
				customFunctions+"\nvoid main() {"
			);
		}
		if(customMain){
			shader.fragmentShader = shader.fragmentShader.replace(
				"#include <alphatest_fragment>",
				`
				#ifdef USE_UV
				vec2 uv = vUv;
				vec3 emissionColor=vec3(0);\n
				`+
				customMain+
				`
				totalEmissiveRadiance=emissionColor.rgb;
				#endif
				#include <alphatest_fragment>
				`
			);
		}
		if(customVert){
			shader.vertexShader = shader.vertexShader.replace("#include <displacementmap_vertex>","#include <displacementmap_vertex>\n"+customVert);
		}
		
	};
	customMaterial.customProgramCacheKey = ()=>{return name;};
	return customMaterial;
}