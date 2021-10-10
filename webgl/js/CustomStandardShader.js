import { MeshStandardMaterial, UniformsUtils } from "../../libs/three/build/three.module.js";

export function GetCustomStandard({name,customMain,customFunctions,uniforms,customHeader}={}){
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
		
	};
	customMaterial.customProgramCacheKey = ()=>{return name;};
	return customMaterial;
}