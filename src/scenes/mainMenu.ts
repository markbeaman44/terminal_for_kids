import * as constant from './constant';
import levelUI from './levelUI';

export default class mainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'mainMenu' });
    }
    private backgroundColour: string = "#224";
    private levelUI!: levelUI;
    private levelGroup!: Phaser.GameObjects.Container;
    private inputText!: Phaser.GameObjects.Text;
    private arrowText!: Phaser.GameObjects.Text;
    private fontSize!: string;

    preload() {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";
    }

    create() {
         // Set font size
        this.fontSize = this.scale.width < 800 ? '16px' : '24px';

        // Initialize classes
        this.levelUI = new levelUI(this, this.fontSize)

        // Set background
        this.cameras.main.setBackgroundColor(this.backgroundColour);

        this.arrowText = this.add.text(-190, 200, ">", { fontSize: this.fontSize, color: "#0f0" });
        this.inputText = this.add.text(-170, 200, "", { fontSize: this.fontSize, color: "#0f0" });
        
        let title = this.add.text(-100, -300, 'Select Level', { fontSize: '32px', color: '#ffffff' });
        this.input.setDefaultCursor('default');

        const levelButtons: any[] = []
    
        for (let i = 1; i <= constant.commands.length; i++) {
            let levelText = this.levelUI.addInteractiveText(
                -40, -250 + i * 50, `> Level ${i}`, () => { this.scene.start(`level${i}`)}
            )
            levelButtons.push(levelText)
        }

        // Create a container for all elements
        this.levelGroup = this.add.container(this.scale.width / 2, this.scale.height / 2,
            [title, this.inputText, this.arrowText, ...levelButtons as any]
        )

        this.scale.on("resize", this.resizeGame, this);

        // Handle keyboard input
        this.input?.keyboard?.on('keydown', (event) => {
            if (event.key === "Enter") {
                let typedCommand = this.inputText.text.trim().toLowerCase();
                let levelNumber = Number(typedCommand.split('level ')[1]);
                if (typedCommand === `level ${levelNumber}` && levelNumber <= constant.commands.length) {
                    this.scene.start(`level${levelNumber}`);
                }
                this.inputText.setText("");
            } else if (event.key === "Backspace") {
                this.inputText.text = this.inputText.text.slice(0, -1);
            } else if (event.key.length === 1) {
                this.inputText.text += event.key;
            }
        });
    }

    resizeGame(gameSize) {
        let { width, height } = gameSize;

        let scaleFactor = width < 800 ? 0.9 : 1;
        this.levelGroup.setScale(scaleFactor);
      
        // Ensure camera covers full size
        this.cameras.resize(width, height);
        // Reposition Images within Group
        this.levelGroup.setPosition(width / 2, height / 2);
      }
}
