// LaunchCannonBall.js
// Version: 0.1.0
// Event: Initialized
// Description: This script demonstrates how to set velocity for physics body

// @input SceneObject cannonBall
// @input SceneObject cannonBallParent
// @input int speed = 500 
// @input int angularSpeed = 20

var obj = script.getSceneObject();
var initialized = false;

// Creates a deep copy of CannonBall object and set velocity to the physics body attach to the CannonBall object
script.launch = function() {

    if (!initialized) {
        print("ERROR: This script is not initialized");
        return;
    }

    var newCannonBall = script.cannonBallParent.copyWholeHierarchy(script.cannonBall);
    newCannonBall.enabled = true;

    var cannonBallPos = script.cannonBall.getTransform().getWorldPosition();
    newCannonBall.getTransform().setWorldPosition(cannonBallPos);

    var bodyComponent = newCannonBall.getComponent("Physics.BodyComponent");
    if (!bodyComponent) {
        print("ERROR: New cannonBall Object is missing the Physics Body Component");
        return;
    }
    bodyComponent.velocity = obj.getTransform().left.uniformScale(script.speed);
    bodyComponent.angularVelocity = vec3.up().uniformScale(script.angularSpeed);
  
};

function initialize() {

    if (checkInputValues()) {
        initialized = true;
    }
       
}

function checkInputValues() {

    if (script.cannonBall == null) {
        print("ERROR: Make sure to assign cannonBall Scene Object");
        return false;
    }  

    if (script.cannonBallParent == null) {
        print("ERROR: Make sure to assign cannonBall Parent Scene Object");
        return false;
    } 
    return true;
}

initialize();