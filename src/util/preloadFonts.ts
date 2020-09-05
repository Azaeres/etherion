import { Scene } from 'phaser';

export default function preloadFonts(this: Scene, fonts: string[]) {
  // Dedupe
  const fontSet = new Set(fonts);
  const fontsArr = Array.from(fontSet);

  fontsArr.forEach((fontFamily) => {
    this.add.text(0, -100, '', {
      fontFamily,
    });
  });
}
