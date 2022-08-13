AFRAME.registerComponent('hide-hallway', {
    init: function () {
        
        this.el.addEventListener('model-loaded', () => {
            var obj = this.el.object3D;
            console.log(obj);
            obj.traverse(node=>{
                if(node.name=="hallway"){
                    node.visible=false;
                }
            });
        });

    }
});