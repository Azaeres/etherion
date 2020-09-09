import { Game, Scene } from 'phaser';
import { SceneImports } from '../features/scenes/index';
import { CameraV2 } from '../features/game/gameState';
import { shallowEqual } from 'react-redux';
// console.log(' > SceneImports:', SceneImports);

interface SceneProps {
  game: Phaser.Game;
  propsDidChange?(nextProps?: {}): {};
}

export default function moveCameraToScene(
  this: Game,
  {
    fromCamera,
    toCamera,
  }: { fromCamera: CameraV2 | undefined; toCamera: CameraV2 }
) {
  console.log('moveCameraToScene > fromCamera:', fromCamera);
  console.log(' > toCamera:', toCamera);
  // console.log(' > oldToCamera:', oldToCamera);
  const fromScene = fromCamera?.scene;
  const toScene = toCamera.scene;
  console.log(' > fromScene:', fromScene);
  console.log(' > toScene:', toScene);
  if (fromScene === toScene) {
    const propsAreEqual = shallowEqual(fromCamera?.props, toCamera.props);
    console.log(' > propsAreEqual:', propsAreEqual);
    if (!propsAreEqual) {
      const scene: SceneProps = this.scene.getScene(toScene);
      console.log(' > scene:', scene);
      scene && scene.propsDidChange && scene.propsDidChange(toCamera.props);
    }
  } else {
    console.log('Navigating fromCamera: ', fromCamera);
    console.log('  toCamera:', toCamera);
    // console.log(' > this.scene:', this.scene);
    const label = Date.now().toString();
    console.time(label);

    const keys: Record<string, any> = this.scene.keys;
    const SceneClass = keys[toScene];
    if (SceneClass) {
      console.log('Scene already added  :');
      fromCamera?.scene && this.scene.stop(fromCamera?.scene);
      this.scene.start(toScene, toCamera.props);
    } else {
      console.log('Scene not added yet. Adding scene dynamically... :');
      console.log(' > SceneImports:', SceneImports);
      console.log(' > toScene:', toScene);
      const sceneImporter = SceneImports[toScene];

      sceneImporter &&
        sceneImporter().then((value) => {
          const SceneClass: Scene = value.default;
          console.log(' > SceneClass:', SceneClass);
          this.scene.add(toScene, SceneClass, true, toCamera.props);
          fromCamera?.scene && this.scene.stop(fromCamera?.scene);
        });
    }
    console.timeEnd(label);
  }
}
