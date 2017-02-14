/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Controllers control a bat. All are derived from this 
 * 
 * @class Controller
 */
class Controller {
    protected ball:Ball;
    protected bat:Bat;

    /**
     * Creates an instance of Controller.
     * 
     * @param {Ball} ball   Ball bat is trying to hit
     * @param {Bat} bat Bat trying to hit ball with.
     * 
     * @memberOf Controller
     */
    constructor(ball:Ball,bat:Bat) {        
        this.ball = ball;
        this.bat = bat;
    }


    /**
     * Find out what to do
     * 
     * @returns {number} y offset for controller (-1 0 1, -1 is up)
     * 
     * @memberOf Controller
     */
    getMovement(): number {
        return 0;
    }

    destroy(): void {        
        this.ball = null;
        this.bat = null;
    }
}


/**
 * This uses the up down arrow keys. I don't know if the code used to only
 * have one cursors object (hence the static) is necessary.
 * 
 * @class KeyboardController
 * @extends {Controller}
 */
class KeyboardController extends Controller {
    
    private static cursors:Phaser.CursorKeys = null;
    private static instanceCount:number = 0;

    /**
     * Creates an instance of KeyboardController, and an instance of Phaser.Cursorkeys
     * if this is the first keyboard controller which is shared by all.
     * 
     * @param {Phaser.Game} game
     * @param {Ball} ball
     * @param {Bat} bat
     * 
     * @memberOf KeyboardController
     */
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

/**
 * This is a very simple controller which just manically chases the ball. You can't win
 * 
 * @class SimpleAIController
 * @extends {Controller}
 */
class SimpleAIController extends Controller {    
    getMovement(): number {
        var move:number = 0;
        if (this.ball.y > this.bat.y) { move = 1; }
        if (this.ball.y < this.bat.y) { move = -1; }
        return move;
    }
}

/**
 * This is a controller which chases the ball, but updates periodically rather than
 * chasing perpetually.
 * 
 * @class AIController
 * @extends {Controller}
 */
class AIController extends Controller {
    private currentMove:number = 0;
    private game:Phaser.Game;

    constructor(game:Phaser.Game,ball:Ball,bat:Bat) {
        super(ball,bat);
        this.game = game;
        this.rethink();
    }

    /**
     * Method fired every 100-300ms and re-thinks the bat move direction each call.
     * 
     * 
     * @memberOf AIController
     */
    rethink() : void {
        this.currentMove = 0;
        if (this.ball.x >= 0 && this.ball.x < this.game.width) {
            this.currentMove = (this.ball.y > this.bat.y) ? 1 : -1;
        }
        this.game.time.events.add(this.game.rnd.between(100,300),this.rethink,this);
    }

    getMovement(): number { return this.currentMove; } 
}