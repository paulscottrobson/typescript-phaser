/// <reference path="../lib/phaser.comments.d.ts"/>
/// <reference path="whiterect.ts"/>

/**
 * Ball Class
 * 
 * @class Ball
 * @extends {WhiteRect}
 */
class Ball extends WhiteRect {

    private static BALL_SIZE:number = 24;

    /**
     * Creates an instance of Ball
     * 
     * @param {Phaser.Game} game
     * 
     * @memberOf Ball
     */
    constructor(game:Phaser.Game) {
        super(game,game.width/2,game.height/2,Ball.BALL_SIZE,Ball.BALL_SIZE,false);
        game.physics.arcade.enableBody(this);
        this.body.bounce.set(1,1);
        this.body.velocity.setTo(500,300);
        this.anchor.set(0.5,0.5);
    }
}
