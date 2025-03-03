export default class levelUI {
    constructor(scene: Phaser.Scene, fontSize: string) {
        this.scene = scene;
        this.fontSize = fontSize
    }
    private scene: Phaser.Scene;
    private fontSize: string;

    public addInteractiveText(
        x: number, y: number, title: string, onSuccessCallback: () => void
    ): Phaser.GameObjects.Text {
        return this.scene.add.text(x, y, title, { fontSize: this.fontSize, color: "#0f0" })
            .setInteractive()
            .on('pointerover', () => { this.scene.input.setDefaultCursor('pointer') })
            .on('pointerout', () => { this.scene.input.setDefaultCursor('default') })
            .on('pointerdown', onSuccessCallback );
    }
}
