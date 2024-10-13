// OverlapEvents.js
// Version: 0.1.0
// Event: Initialized
// Description: This script demonstrates basic usage for overlap events 

// @input string zoneColor {"widget":"combobox", "values":[{"label":"Blue", "value":"blue"}, {"label":"Red", "value":"red"}]}
// @input bool printOverlapEvents

var obj = script.getSceneObject();
var collider = obj.getComponent("Physics.ColliderComponent");
var ZoneColor = {
    BLUE:"blue",
    RED:"red",
};


// Update object's color based on Zone Color
function updateColor(overlapObj) {

    if (!overlapObj.getComponent("Component.ScriptComponent")) {
        return;
    }

    if (script.zoneColor === ZoneColor.BLUE && overlapObj.getComponent("Component.ScriptComponent").setBlueColor) {

        overlapObj.getComponent("Component.ScriptComponent").setBlueColor();
               
    } else if (script.zoneColor === ZoneColor.RED && overlapObj.getComponent("Component.ScriptComponent").setRedColor) {

        overlapObj.getComponent("Component.ScriptComponent").setRedColor();

    }

}

// For API coverage purposes, print every field of overlap events
function printOverlapEvent(e, event) {
    if (!script.printOverlapEvents) {
        return;       
    }
    var overlapCount = e.currentOverlapCount;
    if (overlapCount === 0) {
        return;
    }
    var overlaps = e.currentOverlaps;
    for (var i = 0; i < overlaps.length; ++i) {
        var overlap = overlaps[i];
        print("[" + obj.name + "] Overlap" + event + "[" + i + "]: id=" + overlap.id + ", collider=" + overlap.collider);
    }
    
}


function overlapEnter(e) {
    
    printOverlapEvent(e,"Enter");           
    
    var overlapCount = e.currentOverlapCount;
    if (overlapCount == 0) {
        return;
    }
    
    var overlaps = e.currentOverlaps;
    for (var i = 0; i < overlaps.length; ++i) {
        var overlap = overlaps[i];
        var overlapObj = overlap.collider.getSceneObject();
        updateColor(overlapObj);
    }
}

function overlapStay(e) {
    printOverlapEvent(e,"Stay");

}

function overlapExit(e) {

    printOverlapEvent(e,"Exit");

}

function initialize() {

    if (checkInputValues()) {
        // Set Overlap Filter
        collider.overlapFilter.includeIntangible = false;
        collider.overlapFilter.includeDynamic = true;
        collider.overlapFilter.includeStatic = true;

        collider.onOverlapEnter.add(overlapEnter);
        collider.onOverlapStay.add(overlapStay);
        collider.onOverlapExit.add(overlapExit);
    }
       
}

function checkInputValues() {
    
    if (collider == null) {
        print("ERROR: Make sure to attach physics body component to this scene object");
        return false;
    }

    return true;
}

initialize();
