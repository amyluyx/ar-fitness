// SetHitState.js
// Version: 0.1.0
// Event: Initialized
// Description: This script sets Chick from Kinematic State to Hit State.

var obj = script.getSceneObject();
// Set phyics body to dynamic, detach rotating parent with current position and pause the animation
script.setHitState = function(bodyComponent) {
    if (!bodyComponent.dynamic) {
        bodyComponent.dynamic = true;
    } 
    var colliderObj = bodyComponent.getSceneObject();
    var localPos = colliderObj.getTransform().getWorldPosition();
    colliderObj.getTransform().setLocalPosition(localPos);
    colliderObj.setParent(obj);
   
};