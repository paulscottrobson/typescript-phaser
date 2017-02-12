/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * White rectangle sprite class. Like a sprite but a solid white rectangle
 * which can be dotted
 * 
 * @class WhiteRect
 * @extends {Phaser.Sprite}
 */
class WhiteRect extends Phaser.Sprite {

    private bitmapData:Phaser.BitmapData;

    /**
     * Creates an instance of WhiteRect.
     * 
     * @param {Phaser.Game} game owner
     * @param {number} x x position
     * @param {number} y y position
     * @param {number} w width
     * @param {number} h height
     * @param {boolean} dashed horizontally dashed.
     * 
     * @memberOf WhiteRect
     */
    constructor(game:Phaser.Game,x:number,y:number,w:number,h:number,dashed:boolean) {
        // Create the bitmap. Disposed of in destroy()
        var bmd:Phaser.BitmapData = new Phaser.BitmapData(game,"",w,h);
        // Call super constructor and keep a reference when this exists
        super(game,x,y,bmd);
        this.bitmapData = bmd;
        // Draw solid white
        bmd.ctx.beginPath();
        bmd.ctx.rect(0,0,w,h);
        bmd.ctx.fillStyle = "#FFFFFF";
        bmd.ctx.fill();
        // Optionally draw dashes
        if (dashed) {
            var step:number = game.width / 24;
            for (var x:number = 0;x < w;x = x + step) {
                bmd.ctx.beginPath();
                bmd.ctx.rect(x+step*3/4,0,step/4,h);
                bmd.ctx.fillStyle = "#000000";
                bmd.ctx.fill();
            }
        }
        // Add to game space
        game.add.existing(this);
    }

    /**
     * Overrides destroy to delete the bitmap data object
     * @memberOf WhiteRect
     */
    destroy() : void {
        // Delete the bitmap object and its associated reference.
        this.bitmapData.destroy();
        this.bitmapData = null;
        // Call super method
        super.destroy();
    }
}
