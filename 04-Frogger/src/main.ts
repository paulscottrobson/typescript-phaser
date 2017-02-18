/// <reference path="../lib/phaser.comments.d.ts"/>

window.onload = function() {
    var game = new GalaxiansGame();
}

/**
 * Game Class
 * @class GalaxiansGame
 * @extends {Phaser.Game}
 */
class GalaxiansGame extends Phaser.Game {

    constructor() {
        // Call the super constructor.
        super(640,960,Phaser.AUTO,"",null,false,false);
        // Create a new state and switch to it.
        this.state.add("Preload", new PreloadState());
        this.state.add("Main",new GameState());
        this.state.start("Preload");
    }
}

/**
 * Preloader class
 * @class PreloadState
 * @extends {Phaser.State}
 */

interface SoundCollection {
    [key:string] : Phaser.Sound;
}

class PreloadState extends Phaser.State {

    public static sfxList:string[] = ["death","explosion","fire","loop","start","swoop"];

    preload(): void {
        // Make the game window fit the display area. Doesn't work in the Game constructor.
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;        
        // Load the sprite atlas.
        this.game.load.atlas("sprites","assets/sprites/sprites.png","assets/sprites/sprites.json");
        // Load the font
        this.game.load.bitmapFont("font","assets/fonts/font.png","assets/fonts/font.fnt");
        // Load SFX
        for (var sound of PreloadState.sfxList) {
            this.game.load.audio(sound,["assets/sounds/"+sound+".mp3","assets/sounds/"+sound+".ogg"]);
        }
        // Switch to game state when load complete.
        this.game.load.onLoadComplete.add(() => { this.game.state.start("Main"); },this);
    }


    /**
     * Static method which creates a hash of all the sound effects loaded. So you can use
     * the return value of this method (saved in an instance variable) as this.sfx["swoop"].play();
     * 
     * @static
     * @param {Phaser.State} state
     * @returns {SoundCollection}
     * 
     * @memberOf PreloadState
     */
    static getSounds(state:Phaser.State): SoundCollection {
        var sounds:SoundCollection = {};
        for (var sound of PreloadState.sfxList) {
            sounds[sound] = state.add.audio(sound);
        }
        return sounds;
    }    
}
