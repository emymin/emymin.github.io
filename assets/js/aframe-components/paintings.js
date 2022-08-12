AFRAME.registerComponent('paintings', {
    schema: {
        painting1: { type: 'asset', default: '' },
        painting2: { type: 'asset', default: '' },
        painting3: { type: 'asset', default: '' },
        painting4: { type: 'asset', default: '' },
        painting5: { type: 'asset', default: '' },
        painting6: { type: 'asset', default: '' },
        painting7: { type: 'asset', default: '' },
        painting8: { type: 'asset', default: '' },
        painting9: { type: 'asset', default: '' },
        painting10: { type: 'asset', default: '' },
        painting11: { type: 'asset', default: '' },
        painting12: { type: 'asset', default: '' },

        lightmap : {type:'asset',default:''}
    },
    init: function () {
        
        this.el.addEventListener('model-loaded', () => {
            var obj = this.el.object3D;
            
            obj.traverse(node=>{
                if(node.geometry){
                    const materialName = node.material.name;
                    node.material = new THREE.MeshBasicMaterial();
                    if(materialName!="frame"){
                        const i = materialName
                        let texture = new THREE.Texture();
                        texture.image = this.data["painting"+i];
                        node.material.color = new THREE.Color("white");
                        node.material.map = texture;
                        node.material.map.needsUpdate = true;
                    }
                }
            });

            this.lightMap = new THREE.Texture();
            this.lightMap.image = this.data.lightmap;
            this.lightMap.flipY = false;
        });

    }
});