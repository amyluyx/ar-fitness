// DebugLine.js
// Version: 0.0.1
// Description: Declares DebugLine class.

var DebugLine = function(parent, material) {
    this.parent = parent;  
    this.material = material; 
    this.so = null;
};

DebugLine.prototype.create = function() {
    var builder = new MeshBuilder([
        { name: "position", components: 2 },
    
    ]);
    
    builder.topology = MeshTopology.Lines;
    builder.indexType = MeshIndexType.UInt16;
    
    builder.appendVerticesInterleaved([
        // Position
        -1, 0, 0, 
        1, 0, 0,
    ]);
    
    builder.appendIndices([
        0,1
    ]);
    
    if (builder.isValid()) {
        this.so = global.scene.createSceneObject("Debug Line");
        this.so.setParent(this.parent);
        this.transform = this.so.getTransform();
        var meshVisual = this.so.createComponent("Component.RenderMeshVisual");
        meshVisual.mainMaterial = this.material;    
        meshVisual.mesh = builder.getMesh();
        builder.updateMesh();
    } else {
        print("Mesh data invalid!");
    }

};

DebugLine.prototype.update = function(startPos, endPos) {

    var distance = startPos.distance(endPos);
    var dir = endPos.sub(startPos);       
    var left = dir.cross(vec3.left());
    var rot = quat.lookAt(left,dir);
    this.transform.setWorldPosition(startPos);    
    this.transform.setWorldScale(new vec3(1,distance,1));   
    this.transform.setWorldRotation(rot); 

};

DebugLine.prototype.destroy = function() {
    if (this.so!= null) {
        this.so.destroy();        
    }

};

global.debugLine = DebugLine;
