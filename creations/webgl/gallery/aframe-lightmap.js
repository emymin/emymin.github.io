AFRAME.registerComponent('lightmap', {
    multiple: true,
    schema: {
        texture: { type: 'asset', default: '' },
        key: { type: 'string', default: '' }
    },
    init: function () {
        this.lightMap = new THREE.Texture();
        this.lightMap.image = this.data.texture;
        this.lightMap.flipY = false;

        this.el.addEventListener('model-loaded', () => {
            var obj = this.el.object3D;
            obj.traverse(node => {
                if (node.geometry) {
                    const materialName = node.material.name;
                    if(materialName==this.data.key){
                        node.material = new THREE.MeshBasicMaterial();
                        node.geometry.addAttribute( 'uv2', new THREE.BufferAttribute( node.geometry.attributes.uv.array, 2 ) );
                        node.material.lightMap = this.lightMap;
                        node.material.lightMap.needsUpdate = true;
                    }
                }
            });
        });

    }
});