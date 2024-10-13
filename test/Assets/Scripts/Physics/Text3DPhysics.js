// @input Component.Text3D text3d {"label":"Text3D"}
// @input string colliderType = "Box" {"widget":"combobox", "values":[{"label":"Box", "value":"Box"}, {"label":"Sphere", "value":"Sphere"}]}
//@input string groupType = "Letter" {"label": "Grouping", "widget": "combobox", "values": [{"label":"Letter","value":"Letter"},{"label":"Word","value":"Word"},{"label":"Whole","value":"Whole"}]}
// @input bool dynamic = true
// @input bool debugVisuals = false


var currentSpaceInd = 0;

var currentGroup = null;
var groups = [];

script.createEvent("TapEvent").bind(function(eventData) {
    
    var text3d = script.text3d || script.getSceneObject().getComponent("Component.Text3D");
    
    if (isNull(text3d)) {
        print("Text3D must be set or present on the SceneObject!");
        return;
    }
    var cubeMesh = makeUnitCubeMesh();
    
    var text3dTransform = text3d.getTransform();
    var visuals = text3d.split();
    
    var spaceInds = getSpaceIndices(text3d.text);
    
    for (var i=0; i<visuals.length; i++) {
        var obj = visuals[i].getSceneObject();
    
        var parent = global.scene.createSceneObject("Parent");
        parent.setParent(obj.getParent());
        
        var parentTransform = parent.getTransform();
        parentTransform.setWorldTransform(obj.getTransform().getWorldTransform());
        
        var aabbMax = visuals[i].worldAabbMax();
        var aabbMin = visuals[i].worldAabbMin();
        
        var size = aabbMax.sub(aabbMin);
        var center = vec3.lerp(aabbMax, aabbMin, 0.5);
        var collider;
        
        switch (script.groupType) {
            case "Letter":
                currentGroup = null;
                break;
            case "Word":
                if (i == spaceInds[currentSpaceInd]) {
                    currentSpaceInd++;
                    currentGroup = null;
                }
                break;
            case "Whole":
            default:
                break;
        }
        
        if (currentGroup == null) {
            currentGroup = new ColliderGroup(text3dTransform.getSceneObject());
            groups.push(currentGroup);
        }
        
        collider = parent.createComponent("Physics.ColliderComponent");
        
        collider.fitVisual = true;
        collider.debugDrawEnabled = script.debugVisuals;
        currentGroup.colliders.push(collider);
        
        var shape;
        switch (script.colliderType) {
            case "Box":
            default:
                shape = Shape.createBoxShape();
                break;
            case "Sphere":
                shape = Shape.createSphereShape();
                break;
        }
        collider.shape = shape;    
        
        var meshViz = parent.createComponent("Component.RenderMeshVisual");
        meshViz.mesh = cubeMesh;
        meshViz.enabled = false;
        
        parentTransform.setWorldPosition(center);
        parentTransform.setLocalScale(size.div(text3dTransform.getWorldScale()));
        
        obj.setParentPreserveWorldTransform(parent);
    }

    for (var j=0; j<groups.length; j++) {
        groups[j].finalize();
    }

});




function getSpaceIndices(text) {
    var inds = [];
    var curInd = 0;
    var pastSpace = false;
    for (var i=0; i<text.length; i++) {
        if (text[i].trim() === "") {
            pastSpace = true;
        } else {
            if (pastSpace) {
                inds.push(curInd);
                pastSpace = false;
            }
            curInd++;
        }
    }
    return inds;
}

function ColliderGroup(holderObject) {
    this.colliders = [];
    this.holderObject = holderObject;
    this.parentBody = null;
}

ColliderGroup.prototype.finalize = function() {
    var parent = global.scene.createSceneObject("TextParent");
    parent.setParent(this.holderObject || null);
    
    var parentTransform = parent.getTransform();
    if (this.holderObject) {
        parentTransform.setWorldTransform(this.holderObject.getTransform().getWorldTransform());
    }
    
    var body = parent.createComponent("Physics.BodyComponent");
    body.dynamic = script.dynamic;
    body.shape = Shape.createSphereShape();
    body.shape.radius = 0;
    
    function getColliderPos(collider) {
        return collider.getTransform().getWorldPosition();
    }
    
    var currentCenter = vec3.zero();
    for (var i=0; i<this.colliders.length; i++) {
        currentCenter = currentCenter.add(getColliderPos(this.colliders[i]));
    }
    currentCenter = currentCenter.uniformScale(1/this.colliders.length);
    
    parentTransform.setWorldPosition(currentCenter);
    
    for (var j=0; j<this.colliders.length; j++) {
        this.colliders[j].getSceneObject().setParentPreserveWorldTransform(parent);
    }
    
    return body;
};



function makeUnitCubeMesh() {
    var builder = new MeshBuilder([{ name: "position", components: 3 } ]);

    // Append data for 4 vertices in a quad shape
    function addQuadVerts(builder, positions) {
        positions.forEach(function(v) {
            builder.appendVertices([v]);
        });
    }
    
    // Append the indices for two triangles, forming a quad
    function addQuadIndices(meshBuilder, topLeft, bottomLeft, bottomRight, topRight) {
        meshBuilder.appendIndices([topLeft, bottomLeft, bottomRight, bottomRight, topRight, topLeft]);
    }
    
    // Define the vertex positions for each side of the cube
    var sides = [
        [[-.5,.5,.5], [-.5,-.5,.5], [.5,-.5,.5], [.5,.5,.5]],
        [[.5,.5,-.5], [.5,-.5,-.5], [-.5,-.5,-.5], [-.5,.5,-.5]],
        [[.5,.5,.5], [.5,-.5,.5], [.5,-.5,-.5], [.5,.5,-.5]],
        [[-.5,.5,-.5], [-.5,-.5,-.5], [-.5,-.5,.5], [-.5,.5,.5]],
        [[-.5,.5,-.5], [-.5,.5,.5], [.5,.5,.5], [.5,.5,-.5]],
        [[-.5,-.5,.5], [-.5,-.5,-.5], [.5,-.5,-.5], [.5,-.5,.5]]
    ];
    
    // For each side, append the vertex data and indices
    for (var i=0; i<sides.length; i++) {
        var index = i * 4;
        addQuadVerts(builder, sides[i]);
        addQuadIndices(builder, index, index+1, index+2, index+3);
    }
    
    var cubeMesh = builder.getMesh();
    builder.updateMesh();
    return cubeMesh;
}
