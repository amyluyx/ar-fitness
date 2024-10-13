//@input SceneObject menu // The menu scene object
//@input Component.HandTracking handTracking // Hand Tracking component

function updateHandTracking() {
    // Check if hand tracking is properly initialized
    
    // Get hand tracking data
    var handData = script.handTracking.getHand(0); // Get the first tracked hand
    
    if (handData) {
        // Get palm's facing direction (palmNormal vector)
        var palmNormal = handData.palmNormal;
        
        // Check if the palm is facing the camera
        if (palmNormal.z > 0.7) {
            // Show the menu when palm faces the camera
            script.menu.enabled = true;

            // Move the menu to follow the palm's position
            var palmPosition = handData.wristPosition;
            script.menu.getTransform().setWorldPosition(palmPosition);
        } else {
            // Hide the menu if the palm is not facing the camera
            script.menu.enabled = false;
        }
    } else {
        // Hide the menu if no hand is tracked
        script.menu.enabled = false;
    }
}

// Update the hand tracking every frame
script.createEvent("UpdateEvent").bind(updateHandTracking);
