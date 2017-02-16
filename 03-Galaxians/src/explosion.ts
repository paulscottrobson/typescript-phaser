/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Simple Explosion Class
 * 
 * @class Explosion
 * @extends {Phaser.Particles.Arcade.Emitter}
 */

class Explosion extends Phaser.Particles.Arcade.Emitter {
    constructor(game:Phaser.Game,x:number,y:number) {
        // Create the emitter
        super(game,x,y,300);
        game.add.existing(this);
        // Select graphics
        this.makeParticles("sprites","dot");
        // Make each yellow or red randomly
        this.forEach((particle) => {
            particle.tint = this.game.rnd.between(0,1) ? 0xFF0000:0xFFFF00;
        },this);
        // Start it.
        this.start(true,300,0,100);
        // Destroy after 1 second.
        this.game.time.events.add(1000,()=> { this.destroy(); },this);
    }
}
