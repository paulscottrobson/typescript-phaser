/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Simple Life Display for Galaxians.
 * 
 * @class Lives
 * @extends {Phaser.Group}
 */
class Lives extends Phaser.Group {
    private lives:number;

    constructor(game:Phaser.Game) {
        super(game);
        game.add.existing(this);
        this.lives = 0;
        while (this.lives < 3) {
            this.addLife();
        }
    }

    getLives(): number {
        return this.lives;
    }

    addLife(): void {
        var x:number = this.lives * 40+8;
        var s:Phaser.Sprite = new Phaser.Sprite(this.game,x,this.game.height-8,"sprites","lives");
        s.width = 32;s.height = 40;
        s.anchor.setTo(0,1);
        this.game.add.existing(s);
        this.add(s,true,this.lives);
        this.lives++;
    }

    removeLife(): void {
        if (this.lives > 0) {
            this.lives--;
            (<Phaser.Sprite>this.children[this.lives]).destroy();
        }
    }
}