// @input Physics.ColliderComponent collider

// @input vec3 force = {0, 400, 0}
// @input bool relative

var collider = script.collider || script.getSceneObject().getComponent("Physics.ColliderComponent");

if (!collider) {
    print("Collider must be set or present on this SceneObject!");
    return;
}


collider.onOverlapStay.add(function(eventArgs) {
    var overlap = eventArgs.overlap;
    var otherCollider = overlap.collider;
    var otherBody = otherCollider.getSceneObject().getComponent("Physics.BodyComponent");
    if (otherBody) {
        var forceToAdd = script.force;
        if (script.relative) {
            var matrix = script.getTransform().getWorldTransform();
            var mag = forceToAdd.length;
            forceToAdd = matrix.multiplyDirection(forceToAdd).normalize().uniformScale(mag);
        }
        
        otherBody.addForce(forceToAdd, Physics.ForceMode.Force);
    }
});