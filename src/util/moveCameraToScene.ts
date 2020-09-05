import { Scene } from 'phaser';
import { SceneIds, SceneImports } from '../features/scenes/index';

export default function moveCameraToScene(
  this: Scene,
  { toSceneId }: { toSceneId: SceneIds }
) {
  console.log('Navigating to: ', toSceneId);
  const label = Date.now().toString();
  console.time(label);

  // const toSceneId: SceneIds = 'CounterScene';
  const keys: Record<string, any> = this.scene.manager.keys;
  const SceneClass = keys[toSceneId];
  // const hasBeenAdded = !!SceneClass;
  // console.log(' > hasBeenAdded:', hasBeenAdded);

  if (SceneClass) {
    console.log('Scene already added  :');
    this.scene.stop();
    this.scene.start(toSceneId);
  } else {
    console.log('Scene not added yet. Adding scene dynamically... :');
    SceneImports[toSceneId]().then((value) => {
      const SceneClass: Scene = value.default;
      const nextScene = this.game.scene.add(toSceneId, SceneClass, false);
      if (nextScene) {
        this.scene.stop();
        this.scene.start(toSceneId);
      }
    });
  }
  console.timeEnd(label);
}
