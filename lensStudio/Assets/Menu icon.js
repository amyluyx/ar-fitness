//@input SceneObject menu // The menu object (e.g. "Menu")
//@input Component.ScriptComponent menuButton // The button to trigger the toggle

script.menu.enabled = false; // Initially hide the menu

// Function to toggle menu visibility
function toggleMenuVisibility() {
    script.menu.enabled = !script.menu.enabled; // Toggle visibility on or off
}

// Bind the tap event to the menu button
script.menuButton.api.onTapEvent = toggleMenuVisibility;
