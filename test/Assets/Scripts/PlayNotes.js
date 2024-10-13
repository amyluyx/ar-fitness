// PlayNotes.js
// Version: 0.1.0
// Event: Initialized
// Description: This script provides functions for press and release piano's keys

//@input Asset.Material pressedWhiteMaterial
//@input Asset.Material originalWhiteMaterial
//@input Asset.Material pressedBlackMaterial
//@input Asset.Material originalBlackMaterial

var initialized = false;

script.pressKey = function(note) {
    if (!initialized) {
        print("ERROR: This script is not initialized");
        return;
    }
    if (!note.getComponent("Component.RenderMeshVisual")) {
        print("ERROR: Collide Object is missing the Render Mesh Visual Component.");
        return; 
    }
    if (!note.getParent()) {
        print("ERROR: Collide Object has no Parent Object");
        return;
    }
    var audioComponent = note.getParent().getComponent("Component.AudioComponent");
    if (!audioComponent) {
        print("ERROR: Collide Object's parent object is missing the Audio Component");
        return;
    }
    if (audioComponent.isPlaying()) {
        return;
    }
    audioComponent.play(1);
    note.getComponent("Component.RenderMeshVisual").clearMaterials();
    if (note.name.includes("#")) {       
        note.getComponent("Component.RenderMeshVisual").addMaterial(script.pressedBlackMaterial);
    } else {
        note.getComponent("Component.RenderMeshVisual").addMaterial(script.pressedWhiteMaterial); 
    }
};

script.releaseKey = function(note) {
    if (!initialized) {
        print("ERROR: This script is not initialized");
        return;
    }
    if (!note.getComponent("Component.RenderMeshVisual")) {
        print("ERROR: Collide Object is missing the Render Mesh Visual Component.");
        return; 
    }
    note.getComponent("Component.RenderMeshVisual").clearMaterials();
    if (note.name.includes("#")) {       
        note.getComponent("Component.RenderMeshVisual").addMaterial(script.originalBlackMaterial);
    } else {
        note.getComponent("Component.RenderMeshVisual").addMaterial(script.originalWhiteMaterial); 
    }    
};


function checkInputValues() {

    if (script.pressedWhiteMaterial == null) {
        print("ERROR: Make sure to assign the Pressed White Material");
        return false;
    }
    if (script.originalWhiteMaterial == null) {
        print("ERROR: Make sure to assign the Original White Material");
        return false;
    }  
    if (script.pressedBlackMaterial == null) {
        print("ERROR: Make sure to assign the Pressed Black Material");
        return false;
    }  
    if (script.originalBlackMaterial == null) {
        print("ERROR: Make sure to assign the Original Black Material");
        return false;
    }    

    return true;
}

function initialize() {
   
    if (checkInputValues()) {
        initialized = true;
    }
    
}


initialize();