import { Game, Scene } from 'phaser';
import { SceneImports } from '../features/scenes/index';
import { Camera } from '../features/game/gameState';
import { shallowEqual } from 'react-redux';
// console.log(' > SceneImports:', SceneImports);

interface SceneProps {
  game: Phaser.Game;
  propsDidChange?(nextProps?: {}): {};
}

export default function moveCameraToScene(
  this: Game,
  { fromCamera, toCamera }: { fromCamera: Camera | undefined; toCamera: Camera }
) {
  if (fromCamera?.toScene === toCamera.toScene) {
    console.log(' > fromCamera:', fromCamera);
    console.log(' > toCamera:', toCamera);
    const propsAreEqual = shallowEqual(fromCamera.props, toCamera.props);
    console.log(' > propsAreEqual:', propsAreEqual);
    if (!propsAreEqual) {
      const scene: SceneProps = this.scene.getScene(toCamera.toScene);
      console.log(' > scene:', scene);
      scene.propsDidChange && scene.propsDidChange(toCamera.props);
    }
  } else {
    console.log('Navigating fromCamera: ', fromCamera);
    console.log('  toCamera:', toCamera);
    // console.log(' > this.scene:', this.scene);
    const label = Date.now().toString();
    console.time(label);

    const keys: Record<string, any> = this.scene.keys;
    const SceneClass = keys[toCamera.toScene];
    if (SceneClass) {
      console.log('Scene already added  :');
      fromCamera?.toScene && this.scene.stop(fromCamera?.toScene);
      this.scene.start(toCamera.toScene, toCamera.props);
    } else {
      console.log('Scene not added yet. Adding scene dynamically... :');
      console.log(' > SceneImports:', SceneImports);
      console.log(' > toCamera.toScene:', toCamera.toScene);
      SceneImports[toCamera.toScene]().then((value) => {
        const SceneClass: Scene = value.default;
        const nextScene = this.scene.add(toCamera.toScene, SceneClass, false);
        if (nextScene) {
          fromCamera?.toScene && this.scene.stop(fromCamera?.toScene);
          this.scene.start(toCamera.toScene, toCamera.props);
        }
      });
    }
    console.timeEnd(label);
  }
}
