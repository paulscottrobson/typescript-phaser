/// <reference path="../lib/phaser.comments.d.ts"/>

class Controller {
    protected ball:Ball;
    protected bat:Bat;
    constructor(ball:Ball,bat:Bat) {        
        this.ball = ball;
        this.bat = bat;
    }

    getMovement(): number {
        return 0;
    }
    destroy(): void {        
        this.ball = null;
        this.bat = null;
    }
}

class KeyboardController extends Controller {
    private static cursors:Phaser.CursorKeys = null;
    private static instanceCount:number = 0;

    constructor(game:Phaser.Game,ball:Ball,bat:Bat) {
        super(ball,bat);
        if (KeyboardController.instanceCount == 0) {            
            KeyboardController.cursors = game.input.keyboard.createCursorKeys();
        }
        KeyboardController.instanceCount++;
    }

    getMovement() : number {
        var move:number = 0;
        if (KeyboardController.cursors.down.isDown) { move = 1; }
        if (KeyboardController.cursors.up.isDown) { move = -1; }
        return move;
    }

    destroy() : void {
        KeyboardController.instanceCount--;
        if (KeyboardController.instanceCount == 0) {
            KeyboardController.cursors = null;
        }
    }
}

class AIController extends Controller {    
    getMovement(): number {
        var move:number = 0;
        if (this.ball.y > this.bat.y) { move = 1; }
        if (this.ball.y < this.bat.y) { move = -1; }
        return move;
    }
}