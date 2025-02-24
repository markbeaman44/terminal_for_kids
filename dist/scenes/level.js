export default class level extends Phaser.Scene {
    constructor(levelNumber, commands) {
        super({ key: `level${levelNumber}` });
        this.backgroundColour = "#224";
        this.currentCommand = "";
        this.currentCommandIndex = 0;
        this.levelNumber = levelNumber;
        this.commands = commands;
        this.progress = Array(this.commands.length).fill(0);
    }
    preload() {
        this.load.image('robot', 'assets/robot.png');
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";
    }
    create() {
        var _a, _b;
        // Set background
        this.cameras.main.setBackgroundColor(this.backgroundColour);
        // title level
        this.levelTitle = this.add.text(-60, -300, `Level ${this.levelNumber}`, { fontSize: '32px', color: '#ffffff' });
        this.input.setDefaultCursor('default');
        // back to menu
        this.backMenu = this.add.text(-280, -260, `> Menu`, { fontSize: "24px", color: "#0f0" })
            .setInteractive()
            .on('pointerover', () => { this.input.setDefaultCursor('pointer'); })
            .on('pointerout', () => { this.input.setDefaultCursor('default'); })
            .on('pointerdown', () => { this.scene.start('mainMenu'); });
        // restart
        this.restartButton = this.add.text(-280, -230, `> Restart`, { fontSize: "24px", color: "#0f0" })
            .setInteractive()
            .on('pointerover', () => { this.input.setDefaultCursor('pointer'); })
            .on('pointerout', () => { this.input.setDefaultCursor('default'); })
            .on('pointerdown', () => { this.restartLevel(); });
        // change colour
        this.changeColour = this.add.text(-280, -200, `> Change \n  Colour`, { fontSize: "24px", color: "#0f0" })
            .setInteractive()
            .on('pointerover', () => { this.input.setDefaultCursor('pointer'); })
            .on('pointerout', () => { this.input.setDefaultCursor('default'); })
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
            wordWrap: { width: 450 }
        });
        // Add arrow and input text
        this.arrowText = this.add.text(-190, 200, ">", { fontSize: "24px", color: "#0f0" });
        this.inputText = this.add.text(-170, 200, "", { fontSize: "24px", color: "#0f0" });
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
        (_b = (_a = this.input) === null || _a === void 0 ? void 0 : _a.keyboard) === null || _b === void 0 ? void 0 : _b.on('keydown', (event) => {
            if (this.inputText.text.trim().toLowerCase() === 'restart') {
                this.restartLevel();
            }
            if (this.inputText.text.trim().toLowerCase() === 'menu') {
                this.scene.start('mainMenu');
            }
            if (event.key === "Enter") {
                this.checkCommand();
            }
            else if (event.key === "Backspace") {
                this.inputText.text = this.inputText.text.slice(0, -1);
            }
            else if (event.key.length === 1) {
                this.inputText.text += event.key;
            }
        });
        this.scale.on("resize", this.resizeGame, this);
    }
    restartLevel() {
        this.scene.restart();
        this.currentCommandIndex = 0;
        this.currentCommand = "";
        this.progress = Array(this.commands.length).fill(0);
    }
    checkCommand() {
        let typedCommand = this.inputText.text.trim().toLowerCase();
        if (typedCommand === this.commands[this.currentCommandIndex]['value']) {
            this.feedbackText.setText("Robo: 'Yay! You did it! ⭐'");
            this.progress[this.currentCommandIndex] = 1;
            this.progressText.setText(`Score: ${this.progress.join(" ")}`);
            this.nextCommand();
        }
        else {
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
        }
        else {
            this.feedbackText.setText("");
            this.instructionText.setText("Robo: 'You fixed everything! You're a real hacker! 🎉'");
        }
    }
    resizeGame(gameSize) {
        let { width, height } = gameSize;
        // Ensure camera covers full size
        this.cameras.resize(width, height);
        // Reposition Images within Group
        this.imageGroup.setPosition(width / 2, height / 2);
    }
}
