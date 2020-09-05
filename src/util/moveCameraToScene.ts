import { Game, Scene } from 'phaser';
import { SceneIds, SceneImports } from '../features/scenes/index';

export default function moveCameraToScene(
  this: Game,
  {
    fromSceneId,
    toSceneId,
  }: { fromSceneId: SceneIds | void; toSceneId: SceneIds }
) {
  if (fromSceneId === toSceneId) {
    return;
  }

  console.log('Navigating from: ', fromSceneId);
  console.log('  to > toSceneId:', toSceneId);
  console.log(' > this.scene:', this.scene);
  const label = Date.now().toString();
  console.time(label);

  const keys: Record<string, any> = this.scene.keys;
  const SceneClass = keys[toSceneId];
  if (SceneClass) {
    console.log('Scene already added  :');
    fromSceneId && this.scene.stop(fromSceneId);
    this.scene.start(toSceneId);
  } else {
    console.log('Scene not added yet. Adding scene dynamically... :');
    SceneImports[toSceneId]().then((value) => {
      const SceneClass: Scene = value.default;
      const nextScene = this.scene.add(toSceneId, SceneClass, false);
      if (nextScene) {
        fromSceneId && this.scene.stop(fromSceneId);
        this.scene.start(toSceneId);
      }
    });
  }
  console.timeEnd(label);
}
