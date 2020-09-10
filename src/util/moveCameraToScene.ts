import { Game, Scene } from 'phaser';
import { SceneImports } from '../features/scenes/index';
import { SceneVariant } from '../features/game/gameState';
import { shallowEqual } from 'react-redux';
// console.log(' > SceneImports:', SceneImports);

interface SceneProps {
  game: Phaser.Game;
  propsDidChange?(nextProps?: {}): {};
}

export default async function moveCameraToScene(
  this: Game,
  {
    fromScene,
    toScene,
  }: { fromScene: SceneVariant | undefined; toScene: SceneVariant }
): Promise<any> {
  console.log('moveCameraToScene > fromScene:', fromScene);
  console.log(' > toScene:', toScene);
  const fromSceneId = fromScene?.sceneId;
  const toSceneId = toScene.sceneId;
  if (fromSceneId === toSceneId) {
    const propsAreEqual = shallowEqual(fromScene?.props, toScene.props);
    console.log(' > propsAreEqual:', propsAreEqual);
    if (!propsAreEqual) {
      const scene: SceneProps = this.scene.getScene(toSceneId);
      console.log(' > scene:', scene);
      scene && scene.propsDidChange && scene.propsDidChange(toScene.props);
    }
  } else {
    console.log('Navigating fromScene: ', fromScene);
    console.log('  toScene:', toScene);
    // console.log(' > this.scene:', this.scene);
    // const label = Date.now().toString();
    // console.time(label);

    const keys: Record<string, any> = this.scene.keys;
    const SceneClass = keys[toSceneId];
    if (SceneClass) {
      console.log('Scene already added  :');
      fromSceneId && this.scene.stop(fromSceneId);
      this.scene.start(toSceneId, toScene.props);
    } else {
      console.log('Scene not added yet. Adding scene dynamically... :');
      const sceneImporter = SceneImports[toSceneId];
      if (sceneImporter) {
        const value = await sceneImporter();
        const SceneClass: Scene = value.default;
        this.scene.add(toSceneId, SceneClass, true, toScene.props);
        fromSceneId && this.scene.stop(fromSceneId);
      } else {
        console.warn('Warning: No scene importer for sceneId', toSceneId);
      }
    }
    // console.timeEnd(label);
  }
}
