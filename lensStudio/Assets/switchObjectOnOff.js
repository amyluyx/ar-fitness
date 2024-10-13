//@input SceneObject object1

const SIK = require('SpectaclesInteractionKit/SIK').SIK;
const interactionManager = SIK.InteractionManager;
const interactionConfiguration = SIK.InteractionConfiguration;

function onAwake() {
  // Wait for other components to initialize by deferring to OnStartEvent.
  script.createEvent('OnStartEvent').bind(() => {
    onStart();
  });
}

function onStart() {
  // This script assumes that an Interactable (and Collider) component have already been instantiated on the SceneObject.
  var interactableTypename =
    interactionConfiguration.requireType('Interactable');
  var interactable = script.sceneObject.getComponent(interactableTypename);

  // You could also retrieve the Interactable component like this:
  interactable = interactionManager.getInteractableBySceneObject(
    script.sceneObject
  );

  // Define the desired callback logic for the relevant Interactable event.
  var onTriggerStartCallback = (event) => {
    toggleEnable();
  };

  interactable.onInteractorTriggerStart(onTriggerStartCallback);
}

function toggleEnable() {
    if (script.object1) {
        var isActive = script.object1.enabled;
        script.object1.enabled = !isActive;
    } else {
        print("Target object is not assigned.");
    }
}

onAwake();