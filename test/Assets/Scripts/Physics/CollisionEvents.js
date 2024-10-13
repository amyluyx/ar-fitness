// CollisionEvents.js
// Version: 0.1.0
// Event: Initialized
// Description: This script demonstrates basic usage for collision events 

// @input Component.ScriptComponent playNote
// @input bool printCollisionEvents
// @input bool printCollisionContacts

var obj = script.getSceneObject();
var collider = obj.getComponent("Physics.ColliderComponent");

// For API coverage purposes, print every field of collision event
function printCollisionEvent(e, event) {
    if (!script.printCollisionEvents) {
        return;
    }
    print("[" + obj.name + "] Collision"+ event +"(" + e.collision.id + "): contacts=" 
    + e.collision.contactCount + " ---> " + e.collision.collider);    
}

// For API coverage purposes, print every field of contacts
function printCollisionContacts(e,event) {
    if (!script.printCollisionContacts) {
        return;
    }
    var contacts = e.collision.contacts;
    var contactCount = e.collision.contactCount;

    var points = [];    
    for (var i = 0; i < contactCount; ++i) {
        var contact = contacts[i];
        var distance = contact.distance;
        var impulse = contact.impulse;
        var n = contact.normal;
        var p0 = contact.position;
        var p1 = p0.add(n.uniformScale(10.0));
        points[2*i + 0] = p0;
        points[2*i + 1] = p1;
        print("[" + obj.name + "] Collision"+ event +"(" + e.collision.id + 
        "): contact position = "+ p0 + " ---> " + 
        "contact normal = " +  n + " ---> " + 
        "contact distance = " + distance + " ---> " + 
        "contact impulse = " + impulse);
    }
    
}

function collisionEnter(e) {
    var collision = e.collision;
    var collideObject = collision.collider.getSceneObject(); 
    printCollisionEvent(e,"Enter");
    printCollisionContacts(e,"Enter");
    if (!collideObject) {
        return;
    }
    pressKey(collideObject);
}

function collisionStay(e) {
    printCollisionEvent(e,"Stay");
    printCollisionContacts(e,"Stay");
}

function collisionExit(e) {
    var collision = e.collision;   
    var collideObject = collision.collider.getSceneObject();
    printCollisionEvent(e,"Exit");
    printCollisionContacts(e,"Exit");

    if (!collideObject) {
        return;
    }
    releaseKey(collideObject);

}

function pressKey(collideObject) {

    if (script.playNote.pressKey) {
        script.playNote.pressKey(collideObject);
    }

}

function releaseKey(collideObject) {

    if (script.playNote.releaseKey) {
        script.playNote.releaseKey(collideObject);
    }

}

function initialize() {

    if (checkInputValues()) {
        collider.onCollisionEnter.add(collisionEnter);
        collider.onCollisionStay.add(collisionStay);
        collider.onCollisionExit.add(collisionExit);
    }
       
}

function checkInputValues() {

    if (script.playNote == null) {
        print("ERROR: Make sure to assign play note script component");
        return false;
    } 
    
    if (collider == null) {
        print("ERROR: Make sure to attach physics body component to this scene object");
        return false;
    }

    return true;
}

initialize();


