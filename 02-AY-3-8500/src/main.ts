/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Simulation of GI AY-8-3500 chip (see datasheet)
 */
window.onload = function() {
    var game = new PongGame();
}

/**
 * Game Class
 * @class PongGame
 * @extends {Phaser.Game}
 */
class PongGame extends Phaser.Game {
    constructor() {
        // Call the super constructor.
        super(960,640,Phaser.AUTO,"");
        // Create a new state and switch to it.
        this.state.add("Preload", new PreloadState());
        this.state.add("DemoGame",new SoccerGame());
        this.state.add("Dead",new Phaser.State());
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
        //this.game.load.image("block","assets/sprites/block.png");
        for (var sound of ["short","medium","long"]) {
            this.game.load.audio("short",["assets/sounds/"+sound+".mp3","assets/sounds/"+sound+".ogg"]);
        }
        this.game.load.onLoadComplete.add(() => { this.game.state.start("DemoGame"); },this);
    }    
}
