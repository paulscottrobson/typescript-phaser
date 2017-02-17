/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Ship class
 * 
 * @class Ship
 * @extends {Phaser.Sprite}
 */
class Ship extends Phaser.Sprite {

    private static WIDTH:number = 40;
    private static HEIGHT:number = 48;
    private cursors:Phaser.CursorKeys;
    public playerMissileGroup:Phaser.Group;
    public running:boolean;

    /**
     * Creates an instance of Ship.
     * 
     * @param {Phaser.Game} game
     * 
     * @memberOf Ship
     */
    constructor(game:Phaser.Game) {
        super(game,game.width/2,game.height-64,"sprites","ship");
        // Set size and anchor
        this.anchor.setTo(0.5);
        this.width = Ship.WIDTH;
        this.height = Ship.HEIGHT;
        // Create cursors for it to use
        this.cursors = game.input.keyboard.createCursorKeys();
        // Set up physics including drag for deacceleration
        game.add.existing(this);
        game.physics.arcade.enableBody(this);            
        this.body.drag.x = 250;
        this.body.immovable = true;   
        // Add fire option
        game.input.keyboard.addKey(Phaser.Keyboard.CONTROL).onDown.add(this.fire,this);
        // Add Player missile group for all player missiles
        this.playerMissileGroup = new Phaser.Group(game);
        this.running = false;
    }

    update() : void {
        // Left and right change velocity to a maximum
        if (this.cursors.right.isDown) {
            this.body.velocity.x = Math.min(250,this.body.velocity.x+this.game.time.elapsed);
        }
        if (this.cursors.left.isDown) {
            this.body.velocity.x = Math.max(-250,this.body.velocity.x-this.game.time.elapsed);
        }
        // Force in screen range
        this.x = Math.max(0,Math.min(this.x,this.game.width));
    }

    fire() : void {
        // Only fire if no missiles in flight. Will become zero when missile destroyed.
        if (this.playerMissileGroup.children.length == 0 && this.running) {
            this.playerMissileGroup.add(new Missile(this.game,this.x,this.y,-1400));
        }
    }

    destroy(): void {
        this.playerMissileGroup.destroy();
        // Delete references.
        this.playerMissileGroup = this.cursors = null;
    }
}