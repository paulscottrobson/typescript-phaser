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
    private velocity:number;

    /**
     * Creates an instance of Ball
     * 
     * @param {Phaser.Game} game
     * 
     * @memberOf Ball
     */
    constructor(game:Phaser.Game,velocity:number) {
        super(game,game.width/2,game.height/2,Ball.BALL_SIZE,Ball.BALL_SIZE,false);
        game.physics.arcade.enableBody(this);
        this.body.bounce.set(1,1);
        this.anchor.set(0.5,0.5);
        this.velocity = velocity;
    }

    launch(angle:number) : void {
        // Convert to radians.
        angle = angle / 360.0 * 2 * Math.PI;
        // Launch that way
        this.body.velocity.x = Math.cos(angle) * this.velocity;
        this.body.velocity.y = -Math.sin(angle) * this.velocity;
    }
}
