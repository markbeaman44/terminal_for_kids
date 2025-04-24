/// <reference path="../types/responsivevoice.d.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class speechHandler {
    constructor(scene) {
        this.speechEnabled = false;
        this.isTagalog = false;
        this.lastSpokenText = "";
        this.voiceName = "Filipino Female";
        this.scene = scene;
    }
    createSpeechButton(x, y) {
        return this.speechButton = this.scene.add.text(x, y, "🔇 Sound: OFF", {
            fontSize: "24px",
            color: "#ffffff",
            backgroundColor: "#333",
            padding: { x: 10, y: 5 }
        })
            .setInteractive()
            .on('pointerover', () => { this.scene.input.setDefaultCursor('pointer'); })
            .on('pointerout', () => { this.scene.input.setDefaultCursor('default'); })
            .on("pointerdown", () => __awaiter(this, void 0, void 0, function* () {
            this.speechEnabled = !this.speechEnabled;
            this.speechButton.setText(this.speechEnabled ? "🔊 Sound: ON" : "🔇 Sound: OFF");
            yield this.toggleSpeech();
        }));
    }
    createLanguageButton(x, y) {
        return this.languageButton = this.scene.add.text(x, y, "🌍 Language: English", {
            fontSize: "24px",
            color: "#ffffff",
            backgroundColor: "#333",
            padding: { x: 10, y: 5 }
        })
            .setInteractive()
            .on('pointerover', () => { this.scene.input.setDefaultCursor('pointer'); })
            .on('pointerout', () => { this.scene.input.setDefaultCursor('default'); })
            .on("pointerdown", () => __awaiter(this, void 0, void 0, function* () {
            this.isTagalog = !this.isTagalog;
            this.languageButton.setText(`🌍 Language: ${this.isTagalog ? "Tagalog" : "English"}`);
            yield this.toggleSpeech();
        }));
    }
    playWordPrompt(word) {
        return __awaiter(this, void 0, void 0, function* () {
            this.lastSpokenText = word;
            // Use chosen voice if delay use default voice
            if (this.speechEnabled) {
                const availableVoices = responsiveVoice.getVoices().map(v => v.name);
                // this.lastSpokenText = word;
                let translatedwords = this.isTagalog === true ? yield this.translateText(word, "tl") : word;
                if (availableVoices.includes(this.voiceName)) {
                    responsiveVoice.speak(translatedwords, this.voiceName);
                }
                else {
                    console.log("Voice not found, falling back to default.");
                    responsiveVoice.speak(translatedwords);
                }
            }
        });
    }
    toggleSpeech() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.speechEnabled) {
                responsiveVoice.cancel();
            }
            else {
                if (this.lastSpokenText) {
                    yield this.playWordPrompt(this.lastSpokenText);
                }
            }
        });
    }
    translateText(text, targetLang) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
            try {
                const response = yield fetch(url);
                const data = yield response.json();
                return ((_a = data.responseData) === null || _a === void 0 ? void 0 : _a.translatedText) || text; // Fallback if no response
            }
            catch (error) {
                console.error("Translation API Error:", error);
                return text; // Fallback to original text
            }
        });
    }
}
