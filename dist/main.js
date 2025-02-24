import mainMenu from './scenes/mainMenu';
import levels from './scenes/levels';
const backgroundColour = "#224";
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
    },
    backgroundColor: backgroundColour,
    scene: [mainMenu, ...levels]
};
const game = new Phaser.Game(config);
