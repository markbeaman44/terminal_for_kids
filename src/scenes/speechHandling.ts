/// <reference path="../types/responsivevoice.d.ts" />

export default class speechHandler {
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }
    private scene: Phaser.Scene;
    private speechEnabled: boolean = false;
    private isTagalog: boolean = false;
    private speechButton!: Phaser.GameObjects.Text;
    private languageButton!: Phaser.GameObjects.Text;
    private lastSpokenText: string = "";
    private voiceName = "Filipino Female";

    public createSpeechButton(x: number, y: number): Phaser.GameObjects.Text {
        return this.speechButton = this.scene.add.text(x, y, "🔇 Sound: OFF", {
            fontSize: "24px",
            color: "#ffffff",
            backgroundColor: "#333",
            padding: { x: 10, y: 5 }
        })
        .setInteractive()
        .on('pointerover', () => { this.scene.input.setDefaultCursor('pointer') })
        .on('pointerout', () => { this.scene.input.setDefaultCursor('default') })
        .on("pointerdown", async () => {
            this.speechEnabled = !this.speechEnabled;
            this.speechButton.setText(this.speechEnabled ? "🔊 Sound: ON" : "🔇 Sound: OFF");
            await this.toggleSpeech();
        });
    }

    public createLanguageButton(x: number, y: number): Phaser.GameObjects.Text {
        return this.languageButton = this.scene.add.text(x, y, "🌍 Language: English", {
            fontSize: "24px",
            color: "#ffffff",
            backgroundColor: "#333",
            padding: { x: 10, y: 5 }
        })
        .setInteractive()
        .on('pointerover', () => { this.scene.input.setDefaultCursor('pointer') })
        .on('pointerout', () => { this.scene.input.setDefaultCursor('default') })
        .on("pointerdown", async () => {
            this.isTagalog = !this.isTagalog;
            this.languageButton.setText(`🌍 Language: ${this.isTagalog ? "Tagalog" : "English"}`);
            await this.toggleSpeech();
        });
    }

    public async playWordPrompt(word: string) {
        this.lastSpokenText = word;
        // Use chosen voice if delay use default voice
        if (this.speechEnabled) {
            const availableVoices = responsiveVoice.getVoices().map(v => v.name);

            let translatedwords = this.isTagalog === true ? await this.translateText(word, "tl") : word;

            if (availableVoices.includes(this.voiceName)) {
                responsiveVoice.speak(translatedwords, this.voiceName);
            } else {
                console.log("Voice not found, falling back to default.");
                responsiveVoice.speak(translatedwords);
            }
        }
    }

    public async toggleSpeech() {
        if (!this.speechEnabled) {
            responsiveVoice.cancel();
        } else {
            if (this.lastSpokenText) {
                await this.playWordPrompt(this.lastSpokenText);
            }
        }
    }

    public async translateText(text: string, targetLang: string) {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.responseData?.translatedText || text; // Fallback if no response
        } catch (error) {
            console.error("Translation API Error:", error);
            return text; // Fallback to original text
        }
    }

}