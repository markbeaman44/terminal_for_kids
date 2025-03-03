import * as constant from "./constant.js";
import speechHandler from "./speechHandling.js";
import robotAnimations from "./robotAnimations.js";
import levelUI from "./levelUI.js";
export default class level extends Phaser.Scene {
    constructor(levelNumber, commands) {
        super({ key: `level${levelNumber}` });
        this.backgroundColour = "#224";
        this.currentCommandIndex = 0;
        this.currentCommand = "";
        this.levelNumber = levelNumber;
        this.commands = commands;
        this.progress = Array(this.commands.length).fill(0);
    }
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
        var _a, _b;
        // Set font size
        this.fontSize = this.scale.width < 800 ? '16px' : '24px';
        // Initialize classes
        this.speechHandler = new speechHandler(this);
        this.robotAnimations = new robotAnimations(this);
        this.levelUI = new levelUI(this, this.fontSize);
        // Set background
        this.cameras.main.setBackgroundColor(this.backgroundColour);
        // sound on/off
        this.speechButton = this.speechHandler.createSpeechButton(200, -230);
        // sound on/off
        this.languageButton = this.speechHandler.createLanguageButton(200, -260);
        // title level
        this.levelTitle = this.add.text(-60, -300, `Level ${this.levelNumber}`, { fontSize: '32px', color: '#ffffff' });
        this.input.setDefaultCursor('default');
        // back to menu
        this.backMenu = this.levelUI.addInteractiveText(-280, -260, `> Menu`, () => {
            this.scene.start('mainMenu');
            responsiveVoice.cancel();
        });
        // restart
        this.restartButton = this.levelUI.addInteractiveText(-280, -230, `> Restart`, () => { this.scene.restart(); });
        // change colour
        this.changeColour = this.levelUI.addInteractiveText(-280, -200, `> Change \n  Colour`, () => {
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
        this.speechHandler.playWordPrompt(this.commands[this.currentCommandIndex]['message'].split('Robo:')[1]);
        // Add arrow and input text
        this.arrowText = this.add.text(-190, 200, ">", { fontSize: this.fontSize, color: "#0f0" });
        this.inputText = this.add.text(-170, 200, "", { fontSize: this.fontSize, color: "#0f0" });
        // Feedback text and progress
        this.feedbackText = this.add.text(-180, 300, "", { fontSize: "20px", color: "#ff0" });
        this.progressText = this.add.text(0, 80, `Score: ${this.progress.join(" ")}`, {
            fontSize: "20px",
            color: "#0ff"
        });
        // Create a container for all elements
        this.imageGroup = this.add.container(this.scale.width / 2, this.scale.height / 2, [
            this.robot, this.instructionText, this.arrowText, this.inputText,
            this.feedbackText, this.progressText, this.restartButton,
            this.levelTitle, this.changeColour, this.backMenu, this.speechButton, this.languageButton
        ]);
        // Handle keyboard input
        (_b = (_a = this.input) === null || _a === void 0 ? void 0 : _a.keyboard) === null || _b === void 0 ? void 0 : _b.on('keydown', (event) => {
            if (this.inputText.text.trim().toLowerCase() === 'repeat') {
                this.speechHandler.toggleSpeech();
            }
            if (this.inputText.text.trim().toLowerCase() === 'elie') {
                this.robotAnimations.flyAround(this.robot);
            }
            if (this.inputText.text.trim().toLowerCase() === 'restart') {
                this.scene.restart();
            }
            if (this.inputText.text.trim().toLowerCase() === 'menu') {
                this.scene.start('mainMenu');
                responsiveVoice.cancel();
            }
            if (this.inputText.text.trim().toLowerCase() === 'change colour') {
                const randomColor = Phaser.Display.Color.RandomRGB().color;
                this.robot.setTint(randomColor);
            }
            if (this.inputText.text.trim().toLowerCase() === 'continue' &&
                this.currentCommandIndex === this.commands.length) {
                this.loadNextLevel();
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
    checkCommand() {
        const commandList = ['change colour', 'repeat', 'elie'];
        let typedCommand = this.inputText.text.trim().toLowerCase();
        if (commandList.includes(typedCommand)) {
            this.inputText.setText("");
            return;
        }
        ;
        if (typedCommand === this.commands[this.currentCommandIndex]['value']) {
            this.robotAnimations.moveRobotSuccess(this.robot);
            this.feedbackText.setText("Robo: 'Yay! You did it! ⭐'");
            this.progress[this.currentCommandIndex] = 1;
            this.progressText.setText(`Score: ${this.progress.join(" ")}`);
            this.nextCommand();
        }
        else {
            this.robotAnimations.fallRobotFail(this.robot);
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
            this.speechHandler.playWordPrompt(this.commands[this.currentCommandIndex]['message'].split('Robo:')[1]);
        }
        else {
            this.feedbackText.setText("");
            this.speechHandler.playWordPrompt("You fixed everything! You're a real hacker");
            this.instructionText.setText("Robo: 'You fixed everything! You're a real hacker! 🎉' \n\n        Click to Continue")
                .setInteractive()
                .on('pointerover', () => { this.input.setDefaultCursor('pointer'); })
                .on('pointerout', () => { this.input.setDefaultCursor('default'); })
                .on('pointerdown', () => { this.loadNextLevel(); });
            ;
        }
    }
    loadNextLevel() {
        let nextLevel = this.levelNumber + 1;
        if (nextLevel <= constant.commands.length) {
            this.scene.start(`level${nextLevel}`);
        }
        else {
            this.scene.start('mainMenu');
            responsiveVoice.cancel();
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
}
