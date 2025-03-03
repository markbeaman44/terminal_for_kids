export default class levelUI {
    constructor(scene, fontSize) {
        this.scene = scene;
        this.fontSize = fontSize;
    }
    addInteractiveText(x, y, title, onSuccessCallback) {
        return this.scene.add.text(x, y, title, { fontSize: this.fontSize, color: "#0f0" })
            .setInteractive()
            .on('pointerover', () => { this.scene.input.setDefaultCursor('pointer'); })
            .on('pointerout', () => { this.scene.input.setDefaultCursor('default'); })
            .on('pointerdown', onSuccessCallback);
    }
}
