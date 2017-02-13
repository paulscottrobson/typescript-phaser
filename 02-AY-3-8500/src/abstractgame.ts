/// <reference path="../lib/phaser.comments.d.ts"/>
/// <reference path="whiterect.ts"/>

/**
 * Abstract class which is the base of all game types.
 * 
 * @class AbstractGame
 * @extends {Phaser.State}
 */

enum ObjectPos { Left,Right,Top,Bottom,Middle };

class AbstractGame extends Phaser.State {

    private wallGroup:Phaser.Group;
    private batGroup:Phaser.Group;
    protected ball:Ball;
    protected ballNumber:number;


    // Switch posiions.
    private ballAngles:boolean = true;
    private batSize:boolean = false;
    private ballSpeed:boolean = false;

    private static WALL_WIDTH:number = 8;
    private static WALL_HEIGHT:number = 8;
    private static GOAL_PERCENT:number = 55;

    private sndWall:Phaser.Sound;
    private sndBat:Phaser.Sound;
    private sndScore:Phaser.Sound;
    
    /**
     * Create game space
     * 
     * @memberOf AbstractGame
     */
    create(): void {
        this.sndWall = this.add.audio("short");
        this.sndBat = this.add.audio("medium");
        this.sndScore = this.add.audio("long");
        // Groups for the solid wall objects and the bats.
        this.wallGroup = new Phaser.Group(this.game);
        this.batGroup = new Phaser.Group(this.game);
        // The top and bottom lines everything has.
        this.addDashedWall(ObjectPos.Top);        
        this.addDashedWall(ObjectPos.Bottom);
        // Create wall bits relevant to the actual game.
        this.createGameArea();
        // Create a new ball to play with.
        this.ball = new Ball(this.game,this.ballSpeed ? this.game.width : this.game.width / 2);
        this.ballNumber = 0;
        // Create the players
        this.createPlayers();
        // And start the game. Randomly pick left or right hand side.
        this.serve(this.rnd.between(0,1) ? ObjectPos.Left : ObjectPos.Right);
    }

    destroy(): void {
        this.ball = null;
        this.wallGroup = null;
        this.batGroup = null;
    }

    update(): void {
        // For hitting the wall the physics does the work.
        this.game.physics.arcade.collide(this.ball,this.wallGroup,
                                                (b,w) => { this.sndWall.play(); });
        // For hitting a bat, we work out the new angle (depends where the ball hit the bat)                                                
        this.game.physics.arcade.overlap(this.ball,this.batGroup,this.ballBatHandler,null,this);
    }

    /**
     * Serve a ball from either the left side or the right. 
     * Can be overridden for games like Squash.
     * 
     * @param {ObjectPos} side
     * 
     * @memberOf AbstractGame
     */
    serve(side:ObjectPos) : void {
        // Count is available for squash and similar
        this.ballNumber++;
        // Work out ball position.
        this.ball.x = (side == ObjectPos.Left ? 10 : 90) * this.game.width / 100;
        this.ball.y = this.rnd.between(25,75) * this.game.height / 100;
        // Work out serve angle
        var angle = this.rnd.between(1,2) * 20
        if (this.rnd.between(0,1) != 0) { angle = -angle; }
        if (side == ObjectPos.Right) { angle = 180-angle; }
        // And go !
        this.ball.launch(angle);
    }

    /**
     * Handle bat/ball collision.
     * 
     * @param {Ball} ball   Ball 
     * @param {Bat} bat Bat
     * 
     * @memberOf AbstractGame
     */
    ballBatHandler(ball:Ball,bat:Bat) : void {
        // Work out which way to fire the ball
        var angle = bat.getBounceAngle(ball.y,this.ballAngles); 
        // And fire it.
        ball.launch(angle);
        this.sndBat.play();
    }

    /**
     * Draw a back wall
     * 
     * @protected
     * @param {ObjectPos} pos     left or right side
     * @param {boolean} hasGoal solid wall or goal space
     * 
     * @memberOf AbstractGame
     */
    protected backWall(pos:ObjectPos,hasGoal:boolean) {
        var x = (pos == ObjectPos.Left) ? 0 : this.game.width - AbstractGame.WALL_WIDTH;
        if (hasGoal) {
            var gwSize = (this.game.height) * (100-AbstractGame.GOAL_PERCENT) / 100 / 2;
            this.addWall(x,0,AbstractGame.WALL_WIDTH,gwSize,false,true);
            this.addWall(x,this.game.height-gwSize,AbstractGame.WALL_WIDTH,gwSize,false,true);
        } else {
            this.addWall(x,0,AbstractGame.WALL_WIDTH,this.game.height,false,true);
        }
    }

    /**
     * Draw a centre line (not part of the game, just visual)
     * 
     * @protected
     * 
     * @memberOf AbstractGame
     */
    protected centreLine(): void {        
        this.addWall(this.game.width/2-AbstractGame.WALL_WIDTH/2,
                                    0,AbstractGame.WALL_WIDTH,this.game.height,true,false);
    }
    
    /**
     * Add a horizontal dashed wall
     * 
     * @private
     * @param {ObjectPos} pos top or bottom of screen
     * 
     * @memberOf AbstractGame
     */
    private addDashedWall(pos:ObjectPos) : void {
        var y = (pos == ObjectPos.Top) ? 0 : this.game.height - AbstractGame.WALL_HEIGHT;
        this.addWall(0,y,this.game.width,AbstractGame.WALL_HEIGHT,true,true);
    }

    /**
     * Add a wall 
     * 
     * @protected
     * @param {number} x    position
     * @param {number} y    position
     * @param {number} w    width
     * @param {number} h    height
     * @param {boolean} dashed horizontally dashed
     * @param {boolean} solid solid e.g. ball bounces off it.
     * 
     * @memberOf AbstractGame
     */
    protected addWall(x:number,y:number,w:number,h:number,dashed:boolean,solid:boolean) : void {
        var r:WhiteRect = new WhiteRect(this.game,x,y,w,h,dashed);   
        if (solid) {
            this.game.physics.arcade.enableBody(r);
            r.body.immovable = true;        
            this.wallGroup.add(r);
        }
    }

    
    /**
     * Add a bat.
     * 
     * @protected
     * @param {ObjectPos} direction     playing left or right
     * @param {number} xPercent         percent across the screen from own 'goal line'.
     * 
     * @memberOf AbstractGame
     */
    protected addBat(direction:ObjectPos,xPercent:number) {
        var batHeight:number = this.game.height / (this.batSize ? 10 : 5);
        var r:Bat = new Bat(this.game,xPercent,direction,batHeight);
        r.setController(direction == ObjectPos.Left ? new KeyboardController(this.game,this.ball,r) : 
                                                      new AIController(this.ball,r));

        this.game.physics.arcade.enableBody(r);
        this.batGroup.add(r);
    }

    createGameArea(): void {
        console.log("Calling abstract method createGameArea()");
    }
    createPlayers(): void {
        console.log("Calling abstract method createPlayers()");
    }

}

class SoccerGame extends AbstractGame {

    createGameArea() : void {
        this.centreLine();
        this.backWall(ObjectPos.Left,true);
        this.backWall(ObjectPos.Right,true);        
    }

    createPlayers(): void {
        this.addBat(ObjectPos.Left,5);
        this.addBat(ObjectPos.Left,70);
        this.addBat(ObjectPos.Right,5);
        this.addBat(ObjectPos.Right,75);
    }
}

class TennisGame extends AbstractGame {

    createGameArea() : void {
        this.centreLine();
    }

    createPlayers(): void {
        this.addBat(ObjectPos.Left,5);
        this.addBat(ObjectPos.Right,5);
    }
}