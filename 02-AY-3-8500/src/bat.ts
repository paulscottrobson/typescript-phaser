/// <reference path="../lib/phaser.comments.d.ts"/>
/// <reference path="whiterect.ts"/>

/**
 * Bat class
 * 
 * @class Bat
 * @extends {WhiteRect}
 */
class Bat extends WhiteRect {

    private static BAT_WIDTH:number = 16;
    private direction:ObjectPos;
    private batHeight:number;


    /**
     * Creates an instance of Bat.
     * 
     * @param {Phaser.Game} game owner
     * @param {number} xPercent position
     * @param {ObjectPos} direction play direction
     * @param {number} height bat height
     * 
     * @memberOf Bat
     */

    constructor(game:Phaser.Game,xPercent:number,direction:ObjectPos,height:number) {
        if (direction == ObjectPos.Left) {
            xPercent = 100-xPercent;
        }
        var x:number = game.width * xPercent / 100;
        var y:number = game.rnd.between(height,game.height-height);
        super(game,x,y,Bat.BAT_WIDTH,height,false);
        this.anchor.setTo(0.5,0.5);
        this.direction = direction;
        this.batHeight = height;
    }


    /**
     * Find resulting angle when ball hits bat.
     * 
     * @param {number} yBall y position of ball
     * @param {boolean} isFourBounce true if four bounce angles rather than two
     * @returns {number} angle to bounce off at
     * 
     * @memberOf Bat
     */
    getBounceAngle(yBall:number,isFourBounce:boolean) : number {
        // Calculate offset from centre 0-1
        var offset:number = Math.abs((yBall - this.y) / (this.batHeight / 2));
        // Bounce angle (initially up)
        var angle:number = 40;
        // Four angles, and closer to half way, angle is 20
        if (isFourBounce && offset < 0.5) {
            angle = 20;
        }
        // Angle down if ball below bat.
        if (yBall > this.y) {
            angle = -angle;
        }
        // Adjust for Left/Right
        if (this.direction == ObjectPos.Left) {
            angle = 180-angle;
        }
        return angle;
    }
}