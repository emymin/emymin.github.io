AFRAME.registerComponent('room-materials', {
    schema: {
        floor_albedo: { type: 'asset', default: '' }
    },
    init: function () {
        this.albedoMap = new THREE.Texture();
        this.albedoMap.image = this.data.floor_albedo;

        this.el.addEventListener('model-loaded', () => {
            var obj = this.el.object3D;
            obj.traverse(node => {
                if (node.geometry) {
                    const materialName = node.material.name;
                    if(materialName=="Floor"){
                        node.material.map = this.albedoMap;
                        console.log("DONE");
                    }
                }
            });
        });

    }
});