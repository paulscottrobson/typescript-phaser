/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * A flashing star which heads downwards
 * 
 * @class FlashingStar
 * @extends {Phaser.Sprite}
 */

class FlashingStar extends Phaser.Sprite {
    private velocity:number;

    constructor(game:Phaser.Game) {
        // Create the sprite
        super(game,game.rnd.between(0,game.width),game.rnd.between(0,game.height),"sprites","dot");        
        game.add.existing(this);
        // Set size and speed
        this.width = this.height = game.width / 120;
        this.velocity = this.game.rnd.between(20,80);
    }

    update() : void {
        // Update and wrap round
        this.y = (this.y + this.game.time.elapsed / 1000 * this.velocity) % this.game.height;
        // Make it flicker.
        if (this.game.rnd.between(0,4) == 0) {
            this.tint = this.game.rnd.integer();
        }
    }
}