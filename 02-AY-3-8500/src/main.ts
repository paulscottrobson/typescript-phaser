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
    private currentGame:number;

    constructor() {
        // Call the super constructor.
        super(960,640,Phaser.AUTO,"");
        // Create a new state and switch to it.
        this.state.add("Preload", new PreloadState());
        this.state.add("0",new TennisGame());
        this.state.add("1",new SoccerGame());
        this.state.add("2",new SquashGame());
        this.state.add("3",new PracticeGame());
        this.currentGame = 0;
        this.state.start("Preload");
    }

    nextGame(): void {
        this.currentGame = (this.currentGame+1) % 4;
        this.state.start(this.currentGame.toString());
    }
    restartGame() : void {
        this.state.start(this.currentGame.toString());        
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
        for (var sound of ["short","medium","long"]) {
            this.game.load.audio(sound,["assets/sounds/"+sound+".mp3","assets/sounds/"+sound+".ogg"]);
        }
        // Load Score Images
        for (var n:number = 0;n <= 9;n++) {
            this.game.load.image(n.toString(),"assets/sprites/"+n.toString()+".png");
        }
        // Switch at end.
        this.game.load.onLoadComplete.add(() => { this.game.state.start("0"); },this);
    }    
}
