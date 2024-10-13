// ForceSetting.js
// Version: 0.1.0
// Event: Initialized
// Description: This script provides functions to define different force
// settings.

// Force Mode: 
// 1. VelocityChange : Instantaneous change in velocity, applied without respect to mass.
// 2. Acceleration : Continuous acceleration, applied without respect to mass.
// 3. Impulse : Instantaneous force impulse.
// 4. Force : Continuous force.

// Force Type:
// 1. Position: Apply linear force at the object's center-of-mass.
// 2. Position With Offset: Apply force at a point offset from the object's origin, effectively generating torque.
// 3. Rotation: Apply torque (angular force).

// isRelative: Relative to local rotation.

// @input string forceMode {"widget":"combobox", "values":[{"label":"VelocityChange","value":"VelocityChange"}, {"label":"Acceleration","value":"Acceleration"}, {"label":"Impulse","value":"Impulse"},{"label":"Force","value":"Force"}]}
// @input float accelerationDuration {"label":"Duration","showIf":"forceMode", "showIfValue":"Acceleration" }
// @input float forceDuration {"label":"Duration","showIf":"forceMode", "showIfValue":"Force" }

// @input string forceType {"widget":"combobox", "values":[{"label":"Position","value":"Position"}, {"label":"PositionWithOffset","value":"PositionWithOffset"}, {"label":"Rotation","value":"Rotation"}]}
// @input vec3 forceValue 
// @input vec3 offset {"showIf":"forceType", "showIfValue":"PositionWithOffset"}

// @input bool isRelative

var mode = script.forceMode;
var obj = script.getSceneObject();
var body = obj.getComponent("Physics.BodyComponent");
var initialized = false;

var ForceMode = {
    VELOCITY_CHANGE:"VelocityChange",
    ACCELERATION:"Acceleration",
    IMPULSE:"Impulse",
    FORCE:"Force"
};

var ForceType = {
    POSITION:"Position",
    POSITION_WITH_OFFSET:"PositionWithOffset",
    ROTATION:"Rotation",
};

script.getMode = getMode;
script.getDuration = getDuration;
script.addForceWithBodySetting = addForceWithBodySetting;

//Add force to the physics body with force setting
function addForceWithBodySetting() {
   
    if (!initialized) {
        return;
    }
    
    if (script.isRelative) {
        if (script.forceType === ForceType.ROTATION) {
            body.addRelativeTorque(script.forceValue, mode);
        } else if (script.forceType === ForceType.POSITION_WITH_OFFSET) {
            body.addRelativeForceAt(script.forceValue, script.offset, mode);
        } else {
            body.addRelativeForce(script.forceValue, mode);
        }
    } else {
        if (script.forceType === ForceType.ROTATION) {
            body.addTorque(script.forceValue, mode);
        } else if (script.forceType === ForceType.POSITION_WITH_OFFSET) {
            body.addForceAt(script.forceValue, script.offset, mode);
        } else {           
            body.addForce(script.forceValue, mode);
        }
    }
    
}

// return force mode
function getMode() {
    return script.forceMode;
}

// return force duration  
function getDuration() {
    if (script.forceMode === ForceMode.ACCELERATION) {
        return script.accelerationDuration;        
    } else if (script.forceMode === ForceMode.FORCE) {
        return script.forceDuration;
    } else {
        return 0;
    }

}


function initialize() {

    if (checkInputValues()) {
        switch (script.forceMode) {
            case ForceMode.VELOCITY_CHANGE:
                mode = Physics.ForceMode.VelocityChange;
                break;
            case ForceMode.ACCELERATION:
                mode = Physics.ForceMode.Acceleration;               
                break;
            case ForceMode.IMPULSE:
                mode = Physics.ForceMode.Impulse;
                break;
            case ForceMode.FORCE:
                mode = Physics.ForceMode.Force;
                break;
            default:
                print("ERROR: No physics mode");
    
        }

        initialized = true;
    }            
       
}



function checkInputValues() {

    if (!body) {
        print("ERROR: Make sure to attach Physics Body Component");
        return false;
    }

    return true;
}

initialize();
