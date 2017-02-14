/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Simulation of GI AY-8-3500 chip (see datasheet)
 */
window.onload = function() {
    var game = new GalaxiansGame();
}

/**
 * Game Class
 * @class PongGame
 * @extends {Phaser.Game}
 */
class GalaxiansGame extends Phaser.Game {

    constructor() {
        // Call the super constructor.
        super(960,640,Phaser.AUTO,"",null,false,false);
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
        // Load SFX
        //for (var sound of ["short","medium","long"]) {
        //    this.game.load.audio(sound,["assets/sounds/"+sound+".mp3","assets/sounds/"+sound+".ogg"]);
        //}
        this.game.load.atlas("sprites","assets/sprites/sprites.png","assets/sprites/sprites.json");
        this.game.load.onLoadComplete.add(() => { this.game.state.start("Test"); },this);
    }    
}

class TestState extends Phaser.State {
    create() : void {
        var s:Phaser.Sprite;
        s = new Phaser.Sprite(this.game,64,64,"sprites","ship");
        s.animations.add("test",["alien31","alien32"],5,true)
        s.animations.play("test")
        this.game.add.existing(s);
        s.width = 256;s.height = 256;              
         s = new Phaser.Sprite(this.game,364,64,"sprites","ship");
        s.animations.add("test",["alien21","alien22"],5,true)
        s.animations.play("test")
        this.game.add.existing(s);
        s.width = 256;s.height = 256;       }
}