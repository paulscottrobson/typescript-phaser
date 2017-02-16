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
        this.state.add("Test",new TestState());
        this.state.start("Preload");
    }
}

/**
 * Preloader class
 * @class PreloadState
 * @extends {Phaser.State}
 */
class PreloadState extends Phaser.State {
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
        //for (var sound of ["short","medium","long"]) {
        //    this.game.load.audio(sound,["assets/sounds/"+sound+".mp3","assets/sounds/"+sound+".ogg"]);
        //}
        // Switch to game state when load complete.
        this.game.load.onLoadComplete.add(() => { this.game.state.start("Test"); },this);
    }    
}

class TestState extends Phaser.State {
    create() : void {
        var s:Phaser.Sprite;
        for (var i = 0;i < 50;i++) {
            new FlashingStar(this.game);
        }
        new WaveManager(this.game,this.game.width/2,120);
        new Score(this.game);
        new Ship(this.game);
    }
}

