import * as constant from './constant';

export default class mainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'mainMenu' });
    }
    public backgroundColour: string = "#224";
    public levelGroup: Phaser.GameObjects.Container;

    preload() {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";
    }

    create() {
        // Set background
        this.cameras.main.setBackgroundColor(this.backgroundColour);
        
        let title = this.add.text(-100, -300, 'Select a Level', { fontSize: '32px', color: '#ffffff' });
        this.input.setDefaultCursor('default');

        const levelButtons: any[] = []

        for (let i = 1; i <= constant.commands.length; i++) {
            let levelText = this.add.text(-40, -250 + i * 50, `> Level ${i}`, { fontSize: "24px", color: "#0f0" })
                .setInteractive()
                .on("pointerover", () => this.input.setDefaultCursor("pointer"))
                .on("pointerout", () => this.input.setDefaultCursor("default"))
                .on('pointerdown', () => { this.scene.start(`level${i}`)});

                levelButtons.push(levelText)
        }

        // Create a container for all elements
        this.levelGroup = this.add.container(this.scale.width / 2, this.scale.height / 2, [title, ...levelButtons as any])

        this.scale.on("resize", this.resizeGame, this);
    }

    resizeGame(gameSize) {
        let { width, height } = gameSize;
      
        // Ensure camera covers full size
        this.cameras.resize(width, height);
        // Reposition Images within Group
        this.levelGroup.setPosition(width / 2, height / 2);
      }
}
