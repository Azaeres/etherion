import { Scene } from 'phaser';

export default function preloadFonts(this: Scene, fonts: Set<string>) {
  // console.log('preloadFonts > fonts:', fonts);
  const fontsArr = Array.from(fonts);
  fontsArr.forEach((fontFamily) => {
    this.add.text(0, -100, '', {
      fontFamily,
    });
  });
}
