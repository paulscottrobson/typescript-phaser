/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Class which manages score display.
 * 
 * @class Score
 * @extends {Phaser.Group}
 */
class Score extends Phaser.Group {

    private score:number;

    constructor(game:Phaser.Game) {
        super(game);
        var t:Phaser.BitmapText;
        t = this.add(game.add.bitmapText(game.width/2,20,"font","1 UP",40),true,0);
        t.anchor.setTo(0.5);
        t = this.add(game.add.bitmapText(game.width/2,60,"font","?",40),true,1);
        t.anchor.setTo(0.5);
        t.tint = 0xFF0000;
        this.updateScore(0);
    }

    addPoints(points:number) : void {
        this.updateScore(this.score+points);
    }
    
    updateScore(score:number) : void {
        this.score = score; 
        var s:string = ("00000"+score.toString()).slice(-6);
        (<Phaser.BitmapText>this.children[1]).text = s;
    }
}