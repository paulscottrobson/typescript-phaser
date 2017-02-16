/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Self destructing short score class
 * 
 * @class ShortTermDisplayScore
 * @extends {Phaser.BitmapText}
 */
class ShortTermDisplayScore extends Phaser.BitmapText {
    constructor(game:Phaser.Game,x:number,y:number,score:number) {
        // Create the string object
        super(game,x,y,"font",score.toString(),20);
        game.add.existing(this);
        this.anchor.setTo(0.5);
        this.position.setTo(x,y);
        // Tween it to invisible over 0.4s after 0.3s
        var tw:Phaser.Tween = this.game.add.tween(this).to({"alpha":0.0 },400,
                                                Phaser.Easing.Linear.None,true,300);
        // After that tween is complete, then self destruct.                                                
        tw.onComplete.add(() => { this.destroy(); },this);
    }

    update(): void {
        // Makes it shimmer.
        this.tint = this.game.rnd.integer();
    }
}