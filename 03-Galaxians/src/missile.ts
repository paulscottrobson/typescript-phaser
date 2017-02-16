/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Simple missile class, self destructs if off the top/bottom.
 * These especially and the explosions should be pooled.
 * Do that next game with lots of things.
 * 
 * @class Missile
 * @extends {Phaser.Sprite}
 */
class Missile extends Phaser.Sprite {
    constructor(game:Phaser.Game,x:number,y:number,velocity:number) {
        super(game,x,y,"sprites","missile");
        game.add.existing(this);
        game.physics.arcade.enableBody(this);        
        this.body.velocity.y = velocity;
        this.body.immovable = true;
    }

    update() : void {
        if (this.y < 0 || this.y > this.game.height) {
            this.destroy();
        }
    }
}