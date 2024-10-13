// RayCast.js
// Version: 0.1.0
// Event: Initialized
// Description: This script demonstrates basic usage for 
// from the touch position when a screen touch has started
// or point to point raycasting per frame
// @input string raycastOption {"values": [{"value": "On Screen Touch", "label": "On Screen Touch"}, {"value": "From Point To Point", "label": "From Point To Point"}], "widget": "combobox", "label": "RayCast Option"}
// @input Component.Camera camera {"showIf": "raycastOption", "showIfValue": "On Screen Touch"}
// @input SceneObject from {"showIf": "raycastOption", "showIfValue": "From Point To Point"}
// @input SceneObject to {"showIf": "raycastOption", "showIfValue": "From Point To Point"}
// @ui {"widget":"separator"}
// @input bool raycastAll
// @input bool rootOnly
// @input bool setWorldComponent
// @input Physics.WorldComponent worldComponent {"showIf":"setWorldComponent"}
// @ui {"widget":"separator"}
// @input bool hitDebug
// @input bool drawDebugLine {"showIf": "raycastOption", "showIfValue": "From Point To Point"}
// @input Asset.Material debugLineMaterial {"showIf":"drawDebugLine"}
// @ui {"widget":"separator"}

// @input string triggerEvents {"values": [{"label":"None", "value":"None"},{"value": "Behavior Script", "label": "Behavior Script"}, {"value": "Custom Script", "label": "Custom Script"}], "widget": "combobox", "label": "Trigger Events"}
// @input Component.ScriptComponent[] onTriggeredGlobalBehaviors {"showIf": "triggerEvents", "showIfValue": "Behavior Script", "label": "Behavior Script"}
// @input Component.ScriptComponent customScript {"showIf": "triggerEvents", "showIfValue": "Custom Script", "label": "Custom Script"}
// @input string functionName {"showIf": "triggerEvents", "showIfValue": "Custom Script", "label": "Function Name"}

var obj = script.getSceneObject();
var initialized = false;
var cameraTrans;
var fromTrans;
var toTrans;
var debugLine;

var RayCastOption = {
    "ON_SCREEN_TOUCH":"On Screen Touch",
    "FROM_POINT_TO_POINT":"From Point To Point",
};

//This function will trigger an array of behavior scripts as input
function triggerBehaviors(behaviors) {
    if (!behaviors) {
        return;
    }
    
    for (var i=0; i<behaviors.length; i++) {
        if (behaviors[i] && behaviors[i].trigger) {
            behaviors[i].trigger();    
        } else {
            print("WARNING: please assign the Behavior Script Component");
        }                                        
    }
    
}

// For API coverage purposes, print every field of hit.
function printHit(hit) {
    if (!script.hitDebug) {
        return;
    }
    print("normal: " + hit.normal);
    print("t: " + hit.t);
    print("skipRemaining: " + hit.skipRemaining);
}

// Set Hit State when ray casts to the nearest vaild physics body
function onHitNearest(hit) {
    if (hit == null) { 
        return;
    }
    printHit(hit);
    
    var colliderObj = hit.collider.getSceneObject();
    var bodyComponent = colliderObj.getComponent("Physics.BodyComponent");
    if (bodyComponent == null) {
        return;
    } 
    triggerHitEvent(bodyComponent);

}

function triggerHitEvent(bodyComponent) {
    
    switch (script.triggerEvents) {
        case "None":
        default:       
            break;
        case "Behavior Script":
            triggerBehaviors(script.onTriggeredGlobalBehaviors);
            break; 
        case "Custom Script":
            triggerCustomScript(bodyComponent);
            break;
    }
       
}

// Set Hit State when ray casts to all the vaild physics bodies
function onHitAll(hits) {
    var hitCount = hits.length;
    
    if (hitCount === 0) { 
        return;
    }
    for (var i = 0; i < hitCount; ++i) {
        var hit = hits[i];
        var colliderObj = hit.collider.getSceneObject();
        var bodyComponent = colliderObj.getComponent("Physics.BodyComponent");
        if (bodyComponent == null) {
            return;
        }     
        triggerHitEvent(bodyComponent);
        printHit(hit);
    }
}

// Trigger function with Custom Script, pass collider Object.
function triggerCustomScript(bodyComponent) {
      
    if (!script.customScript) {
        return;
    }
    var targetAPI = script.customScript;
    
    if (!targetAPI[script.functionName]) {
        print("ERROR: Make sure to define valid function name for Custom Script");
        return;
    }
    
    targetAPI[script.functionName](bodyComponent);
  
}

// Form a ray starting at the camera through the touch position into the world.
function getRayEnd(touchPos, rayStart, rayLen) {
    var touchWorldPos = script.camera.screenSpaceToWorldSpace(touchPos, 0.0);
    var rayDir = touchWorldPos.sub(rayStart).normalize();
    return rayStart.add(rayDir.uniformScale(rayLen));
}

// On touch, cast the ray into the world.
script.createEvent("TouchStartEvent").bind(function(data) {

    if (!initialized || script.raycastOption!==RayCastOption.ON_SCREEN_TOUCH) {
        return;
    }
    var touchPos = data.getTouchPosition();
    var rayStart = cameraTrans.getWorldPosition();
    var rayEnd = getRayEnd(touchPos, rayStart, 10000.0);
    
    rayCast(rayStart,rayEnd);

});

function rayCast(rayStart, rayEnd) {
    
    var probe = null;
    if (script.setWorldComponent) {
        probe = script.worldComponent.createProbe();
    } else if (script.rootOnly) {
        probe = Physics.createRootProbe();
    } else {
        probe = Physics.createGlobalProbe();
    }
    
    if (script.raycastAll) {
        probe.rayCastAll(rayStart, rayEnd, onHitAll);
    } else {
        probe.rayCast(rayStart, rayEnd, onHitNearest);
    }
    
}



// On update, cast a ray from point to point into the world for raycast.
function update(e) {
    if (script.raycastOption!== RayCastOption.FROM_POINT_TO_POINT) {
        return;          
    }

    var fromPos = fromTrans.getWorldPosition();
    var toPos = toTrans.getWorldPosition();

    rayCast(fromPos,toPos);
    
    // Update debug line
    if (script.drawDebugLine && debugLine!= null) {
        debugLine.update(fromPos,toPos);
    }

}


function initialize() {

    if (checkInputValues()) {
        if (script.raycastOption === RayCastOption.ON_SCREEN_TOUCH) {
            cameraTrans = script.camera.getTransform();            
        } else {
            fromTrans = script.from.getTransform();
            toTrans = script.to.getTransform();           
        }

        if (script.drawDebugLine) {            
            // Create a new debug line
            debugLine = new global.debugLine(obj,script.debugLineMaterial);
            debugLine.create();
        }
        initialized = true;
        script.createEvent("UpdateEvent").bind(update);
    }
       
}

function checkInputValues() {
    
    if (script.raycastOption === RayCastOption.ON_SCREEN_TOUCH && script.camera == null) {
        print("ERROR: Make sure to attach Camera Component");
        return false;
    }
    
    if (script.raycastOption === RayCastOption.FROM_POINT_TO_POINT && script.from == null) {
        print("ERROR: Make sure to attach From Object");
        return false;
    }
    if (script.raycastOption === RayCastOption.FROM_POINT_TO_POINT  && script.to == null) {
        print("ERROR: Make sure to attach To Object");
        return false;
    }

    if (script.setWorldComponent && script.worldComponent==null) {
        print("ERROR: Make sure to attach the World Component");
        return false;        
    }
    if (script.raycastOption === "From Point To Point" && script.drawDebugLine && script.debugLineMaterial==null) {
        print("ERROR: Make sure to attach Debug Line Material");
        return false;
    }


    return true;
}

initialize();
