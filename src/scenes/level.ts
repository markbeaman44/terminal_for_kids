import * as constant from './constant';
export default class level extends Phaser.Scene {
    constructor(levelNumber: number, commands: Record<string, string>[]) {
        super({ key: `level${levelNumber}` });
        this.levelNumber = levelNumber;
        this.commands = commands;
        this.progress = Array(this.commands.length).fill(0);
    }
    public backgroundColour: string = "#224";
    public levelNumber: number;
    public commands: Record<string, string>[];
    public progress: number[];
    public levelTitle!: Phaser.GameObjects.Text;
    public backMenu!: Phaser.GameObjects.Text;
    public restartButton!: Phaser.GameObjects.Text;
    public changeColour!: Phaser.GameObjects.Text;
    public arrowText!: Phaser.GameObjects.Text;
    public inputText!: Phaser.GameObjects.Text;
    public instructionText!: Phaser.GameObjects.Text;
    public feedbackText!: Phaser.GameObjects.Text;
    public robot!: Phaser.GameObjects.Image;
    public progressText!: Phaser.GameObjects.Text;
    public imageGroup!: Phaser.GameObjects.Container;
    public currentCommand: string = "";
    public currentCommandIndex = 0;

    init() {
        this.currentCommandIndex = 0;
        this.currentCommand = "";
        this.progress = Array(this.commands.length).fill(0);
    }
    
    preload() {
        this.load.image('robot', 'assets/robot.png');

        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";
    }

    create() {
        let fontSize = this.scale.width < 800 ? '16px' : '24px';

        // Set background
        this.cameras.main.setBackgroundColor(this.backgroundColour);

        // title level
        this.levelTitle = this.add.text(-60, -300, `Level ${this.levelNumber}`, { fontSize: '32px', color: '#ffffff' });
        this.input.setDefaultCursor('default');
        
        // back to menu
        this.backMenu = this.add.text(-280, -260, `> Menu`, { fontSize: fontSize, color: "#0f0" })
            .setInteractive()
            .on('pointerover', () => { this.input.setDefaultCursor('pointer') })
            .on('pointerout', () => { this.input.setDefaultCursor('default') })
            .on('pointerdown', () => { this.scene.start('mainMenu') });

        // restart
        this.restartButton = this.add.text(-280, -230, `> Restart`, { fontSize: fontSize, color: "#0f0" })
            .setInteractive()
            .on('pointerover', () => { this.input.setDefaultCursor('pointer') })
            .on('pointerout', () => { this.input.setDefaultCursor('default') })
            .on('pointerdown', () => { this.scene.restart() });
        
        // change colour
        this.changeColour = this.add.text(-280, -200, `> Change \n  Colour`, { fontSize: fontSize, color: "#0f0" })
            .setInteractive()
            .on('pointerover', () => { this.input.setDefaultCursor('pointer') })
            .on('pointerout', () => { this.input.setDefaultCursor('default') })
            .on('pointerdown', () => { 
                const randomColor = Phaser.Display.Color.RandomRGB().color;
                this.robot.setTint(randomColor);
             });

        // Add robot image
        this.robot = this.add.image(0, -50, 'robot').setScale(0.3);

        // Show instructions for the current level
        this.instructionText = this.add.text(-190, 120, this.commands[this.currentCommandIndex]['message'], {
            fontSize: "20px",
            color: "#fff",
            wordWrap: { width: 480 }
        });

        // Add arrow and input text
        this.arrowText = this.add.text(-190, 200, ">", { fontSize: fontSize, color: "#0f0" });
        this.inputText = this.add.text(-170, 200, "", { fontSize: fontSize, color: "#0f0" });

        // Feedback text and progress
        this.feedbackText = this.add.text(-180, 300, "", { fontSize: "20px", color: "#ff0" });
        this.progressText = this.add.text(0, 80, `Score: ${this.progress.join(" ")}`, {
            fontSize: "20px",
            color: "#0ff"
        });

        // Create a container for all elements
        this.imageGroup = this.add.container(this.scale.width / 2, this.scale.height / 2, [
            this.robot, this.instructionText, this.arrowText, this.inputText,
            this.feedbackText, this.progressText, this.restartButton, this.backMenu,
            this.levelTitle, this.changeColour
        ]);

        // Handle keyboard input
        this.input?.keyboard?.on('keydown', (event) => {
            if (this.inputText.text.trim().toLowerCase() === 'elie') {
                this.flyAround();
            }
            if (this.inputText.text.trim().toLowerCase() === 'restart') {
                this.scene.restart();
            }
            if (this.inputText.text.trim().toLowerCase() === 'menu') {
                this.scene.start('mainMenu');
            }
            if (this.inputText.text.trim().toLowerCase() === 'change colour') {
                const randomColor = Phaser.Display.Color.RandomRGB().color;
                this.robot.setTint(randomColor);
            }
            if (event.key === "Enter") {
                this.checkCommand();
            } else if (event.key === "Backspace") {
                this.inputText.text = this.inputText.text.slice(0, -1);
            } else if (event.key.length === 1) {
                this.inputText.text += event.key;
            }
        });

        this.scale.on("resize", this.resizeGame, this);
    }

    checkCommand() {
        let typedCommand = this.inputText.text.trim().toLowerCase();
        if (typedCommand === 'change colour') {
            this.inputText.setText("");
            return;
        };
        if (typedCommand === this.commands[this.currentCommandIndex]['value']) {
            this.moveRobotSuccess();
            this.feedbackText.setText("Robo: 'Yay! You did it! ⭐'");
            this.progress[this.currentCommandIndex] = 1;
            this.progressText.setText(`Score: ${this.progress.join(" ")}`);
            this.nextCommand();
        } else {
            this.fallRobotFail();
            this.feedbackText.setText("Robo: 'Hmm... Try again!'");
        }
        this.inputText.setText("");

        // Make feedback text disappear after 2 seconds
        this.time.delayedCall(2000, () => this.feedbackText.setText(""));
    }

    nextCommand() {
        this.currentCommandIndex++;
        if (this.currentCommandIndex < this.commands.length) {
            this.instructionText.setText(this.commands[this.currentCommandIndex]['message']);
        } else {
            this.feedbackText.setText("");
            this.instructionText.setText(
                "Robo: 'You fixed everything! You're a real hacker! 🎉' \n\n        Click to Continue"
            )
            .setInteractive()
            .on('pointerover', () => { this.input.setDefaultCursor('pointer') })
            .on('pointerout', () => { this.input.setDefaultCursor('default') })
            .on('pointerdown', () => { this.loadNextLevel()});;
        }
    }

    resizeGame(gameSize) {
        let { width, height } = gameSize;

        let scaleFactor = width < 800 ? 0.9 : 1;
        this.imageGroup.setScale(scaleFactor);
      
        // Ensure camera covers full size
        this.cameras.resize(width, height);
        // Reposition Images within Group
        this.imageGroup.setPosition(width / 2, height / 2);
      }

      loadNextLevel() {
        let nextLevel = this.levelNumber + 1;
        if (nextLevel <= constant.commands.length) {
            this.scene.start(`level${nextLevel}`);
        } else {
            this.scene.start('mainMenu');
        }
    }

    moveRobotSuccess() {
        this.tweens.add({
            targets: this.robot,
            x: this.robot.x + 300,
            duration: 500,
            yoyo: true,
            ease: 'Power1' // Smooth easing
        });
        this.time.delayedCall(1000, () => {
            this.tweens.add({
                targets: this.robot,
                x: this.robot.x - 300,
                duration: 500,
                yoyo: true,
                ease: 'Power1'
            });
        })
    }

    fallRobotFail() {
        this.tweens.add({
            targets: this.robot,
            angle: 90, // Rotate 90 degrees (fall over)
            duration: 500,
            ease: 'Bounce.easeOut' // Add bounce effect
        });
    
        this.time.delayedCall(1500, () => {
            this.tweens.add({
                targets: this.robot,
                angle: 0, // Reset rotation
                duration: 500,
                ease: 'Power1'
            });
        });
    }

    flyAround() {
        const xDirection = Phaser.Math.Between(0, 1) === 0 ? -100 : 100;
        const yDirection = Phaser.Math.Between(0, 1) === 0 ? -200 : 200;
        this.tweens.add({
            targets: this.robot,
            x: Phaser.Math.Between(xDirection, this.scale.width - 100),
            y: Phaser.Math.Between(yDirection, this.scale.height - 250), 
            duration: Phaser.Math.Between(500, 1500),
            yoyo: true, 
            ease: 'Quad.In' // Smooth easing
        });
    }
}
