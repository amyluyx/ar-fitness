// UpdateTexture.js
// Version: 0.1.0
// Event: Initialized
// Description: This script provides functions for updating color textures

// @input Component.RenderMeshVisual bike
// @input Component.RenderMeshVisual pizzaBox
// @input Component.RenderMeshVisual helmet
// @input Asset.Texture bikeRed
// @input Asset.Texture bikeBlue
// @input Asset.Texture helmetRed
// @input Asset.Texture helmetBlue

var initialized = false;
var bikeMaterial;
var pizzaBoxMaterial;
var helmetMaterial;

script.setRedColor = function() {
    if (!initialized) {
        print("ERROR: This script is not initialized");
        return;
    }

    script.pizzaBox.mainMaterial.mainPass.baseTex = script.bikeRed;
    script.bike.mainMaterial.mainPass.baseTex = script.bikeRed;
    script.helmet.mainMaterial.mainPass.baseTex = script.helmetRed;
};

script.setBlueColor = function() {
    if (!initialized) {
        print("ERROR: This script is not initialized");
        return;
    }
    script.pizzaBox.mainMaterial.mainPass.baseTex = script.bikeBlue;
    script.bike.mainMaterial.mainPass.baseTex = script.bikeBlue;
    script.helmet.mainMaterial.mainPass.baseTex= script.helmetBlue;
};


function checkInputValues() {

    if (script.bike == null) {
        print("ERROR: Make sure to assign the Bike Render Mesh Visual Component");
        return false;
    }
    if (script.pizzaBox == null) {
        print("ERROR: Make sure to assign the PizzaBox Render Mesh Visual Component");
        return false;
    }  
    if (script.helmet == null) {
        print("ERROR: Make sure to assign the Helmet Render Mesh Visual Component");
        return false;
    }  
    if (script.bikeRed == null) {
        print("ERROR: Make sure to assign the Bike Red Texture");
        return false;
    }
    if (script.bikeBlue == null) {
        print("ERROR: Make sure to assign the Bike Blue Texture");
        return false;
    }    
    if (script.helmetRed == null) {
        print("ERROR: Make sure to assign the Helmet Red Texture");
        return false;
    } 
    if (script.helmetBlue == null) {
        print("ERROR: Make sure to assign the Helmet Blue Texture");
        return false;
    }        

    return true;
}

function initialize() {
   
    if (checkInputValues()) {
        bikeMaterial = script.bike.mainMaterial;
        script.bike.mainMaterial = bikeMaterial.clone();

        pizzaBoxMaterial = script.pizzaBox.mainMaterial;
        script.pizzaBox.mainMaterial = pizzaBoxMaterial.clone();

        helmetMaterial = script.helmet.mainMaterial;
        script.helmet.mainMaterial = helmetMaterial.clone();
        initialized = true;
    }
    
}


initialize();