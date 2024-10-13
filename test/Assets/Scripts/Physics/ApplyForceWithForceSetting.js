// ApplyForceWithForceSetting.js
// Version: 0.1.0
// Event: Initialized
// Description: This script provides functions to apply different forces
// to the physics body.

var ForceMode = {
    VELOCITY_CHANGE:"VelocityChange",
    ACCELERATION:"Acceleration",
    IMPULSE:"Impulse",
    FORCE:"Force"
};

var applyForceTimer = 0.0;
var forceSettingComponent;

// Get force setting from Force Setting component attach to the collider object
// Apply force when Force Mode is VelocityChange and Impulse
script.applyForceWithForceSetting = function(bodyComponent) {
    var colliderObj = bodyComponent.getSceneObject();
    
    forceSettingComponent = colliderObj.getComponent("Component.ScriptComponent");
    if (!forceSettingComponent || !forceSettingComponent.getMode) {
        return;
    }
    var mode = forceSettingComponent.getMode();
    if (mode === ForceMode.ACCELERATION || mode === ForceMode.FORCE) {
        if (!forceSettingComponent.getDuration) {
            return;          
        }

        applyForceTimer = forceSettingComponent.getDuration();
    
    } else {
        
        if (!forceSettingComponent.addForceWithBodySetting) {
            return;          
        }
        forceSettingComponent.addForceWithBodySetting(); 

    }
      
};


// On Update, apply force when Force Mode is Acceleration or Force with duration
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function(e) {
    var dt = getDeltaTime();
    applyForceTimer -= dt;
    if (applyForceTimer <= 0.0) {
        return;       
    }

    if (!forceSettingComponent.addForceWithBodySetting) {
        return;          
    }
    
    forceSettingComponent.addForceWithBodySetting();   

});