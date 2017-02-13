/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Represents a single 2 digit score item
 * 
 * @class Score
 * @extends {Phaser.Group}
 */
class Score extends Phaser.Group {

    private value:number;

    /**
     * Creates an instance of Score and sets it to zero.
     * 
     * @param {Phaser.Game} game
     * @param {number} x    x centre position
     * @param {number} y    y centre position
     * @param {number} w    digit width
     * @param {number} h    digit height
     * 
     * @memberOf Score
     */
    constructor(game:Phaser.Game,x:number,y:number,w:number,h:number) {
        // Create the group and position it, add to game.
        super(game);
        this.position.setTo(x,y);
        game.add.existing(this);
        // Add two digits to it
        for (var digit:number = 0;digit < 2;digit++) {
            var s:Phaser.Sprite = new Phaser.Sprite(game,0,0,(digit+8).toString());
            s.anchor.setTo(0.5,0.5);
            s.x = ((digit == 0) ? -1 : 1) * w * 0.6;
            s.height = h;s.width = w;
            this.add(s,true,digit)
        }
        this.setValue(0);
    }

    /**
     * Retreive the value
     * @returns {number}
     * @memberOf Score
     */
    getValue(): number { return this.value; }

    /**
     * Set the value of the score
     * 
     * @param {number} n score value to set it to.
     * 
     * @memberOf Score
     */
    setValue(n:number): void {
        var s:Phaser.Sprite = <Phaser.Sprite>this.children[0];
        s.visible = (n >= 10);
        s.loadTexture(Math.floor(n/10).toString());    
        (<Phaser.Sprite>this.children[1]).loadTexture((n % 10).toString());
        this.value = n;
    }
}