//@input SceneObject objectToShrink // Assign your object in the Inspector

// Register the tap event
var tapEvent = script.createEvent("TapEvent");

// When tapped, call this function
tapEvent.bind(function (eventData) {
    // Shrink the object (adjust the scale)
    script.objectToShrink.getTransform().setLocalScale(new vec3(0.5, 0.5, 0.5)); // Shrink to half size
    print("Object tapped and shrunk!");
});
