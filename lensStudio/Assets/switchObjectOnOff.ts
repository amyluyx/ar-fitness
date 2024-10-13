import { Interactable } from 'SpectaclesInteractionKit/Components/Interaction/Interactable/Interactable';
import { InteractorEvent } from 'SpectaclesInteractionKit/Core/Interactor/InteractorEvent';
import WorldCameraFinderProvider from 'SpectaclesInteractionKit/Providers/CameraProvider/WorldCameraFinderProvider';
import { SIK } from 'SpectaclesInteractionKit/SIK';


@component
export class ExampleInteractionScript extends BaseScriptComponent {
  //@input
  //toggleScript : ScriptComponent
  @input
  props : SceneObject

  @input
  sObject : SceneObject

  @input
  close : SceneObject
  onAwake() {
    this.createEvent('OnStartEvent').bind(() => {
      this.onStart();
    });
  }

  onStart() {
    let interactionManager = SIK.InteractionManager;

    // This script assumes that an Interactable (and Collider) component have already been instantiated on the SceneObject.
    let interactable = this.sceneObject.getComponent(
      Interactable.getTypeName()
    );

    // You could also retrieve the Interactable component like this:
    interactable = interactionManager.getInteractableBySceneObject(
      this.sceneObject
    );

    // Define the desired callback logic for the relevant Interactable event.
    let onTriggerStartCallback = (event: InteractorEvent) => {
      this.sObject.enabled = true;
      this.close.enabled = false;
      this.props.enabled = true;

      let pos = this.props.getTransform().getWorldPosition();
      const cpos = WorldCameraFinderProvider.getInstance().getWorldPosition();
      pos.x = cpos.x;
      pos.z = cpos.z;
      this.props.getTransform().setWorldPosition(pos);
      // Function to switch the scene object on or off based on the toggle value
      function switchObjectOnOff(toggleValue: boolean): void {
        this.sObject.enabled = toggleValue;
      }

      // Add the function as a callback to the toggle event
      //this.toggleScript.onToggle.add(switchObjectOnOff);
    };

    interactable.onInteractorTriggerStart(onTriggerStartCallback);
  }
}