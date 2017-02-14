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
    protected batGroup:Phaser.Group;
    protected ball:Ball;
    protected ballNumber:number;
    private score:Score[];
    private serveOver:boolean;

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
        // Create sound effect instances.
        this.sndWall = this.add.audio("short");
        this.sndBat = this.add.audio("medium");
        this.sndScore = this.add.audio("long");
        // Groups for the solid wall objects and the bats.
        this.wallGroup = new Phaser.Group(this.game);
        this.batGroup = new Phaser.Group(this.game);
        // The top and bottom lines everything has.
        this.addDashedWall(ObjectPos.Top);        
        this.addDashedWall(ObjectPos.Bottom);
        // Score objects.
        this.score = [];
        var s:number = 64;
        this.score.push(new Score(this.game,this.game.width/2-s*7/4,s*5/4,s,s*4/3));
        this.score.push(new Score(this.game,this.game.width/2+s*7/4,s*5/4,s,s*4/3));
        // Create wall bits relevant to the actual game.
        this.createGameArea();
        // Create a new ball to play with.
        this.ball = new Ball(this.game,this.ballSpeed ? this.game.width : this.game.width / 2);
        this.ballNumber = 0;
        // Create the players
        this.createPlayers();
        // And start the game. Randomly pick left or right hand side.
        this.serve(this.rnd.between(0,1) ? ObjectPos.Left : ObjectPos.Right);
        // Create accessor for the parent game as a PongGame object so we can access methods.
        var game:PongGame = <PongGame>this.game;
        // Set up keyboard functionality.  Space changes game. B bat. A angles. S speed.
        this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(
            () => { (game).nextGame(); },
        game);
        this.game.input.keyboard.addKey(Phaser.Keyboard.B).onDown.add(
            () => { this.batSize = !this.batSize; (game).restartGame(); },
        game);
        this.game.input.keyboard.addKey(Phaser.Keyboard.A).onDown.add(
            () => { this.ballAngles = !this.ballAngles; (game).restartGame(); },
        game);
        this.game.input.keyboard.addKey(Phaser.Keyboard.S).onDown.add(
            () => { this.ballSpeed = !this.ballSpeed; (game).restartGame(); },
        game);
    }

    destroy(): void {
        this.ball = null;
        this.wallGroup = null;
        this.batGroup = null;
        this.score = null;
    }

    update(): void {
        // For hitting the wall the physics does the work.
        this.game.physics.arcade.collide(this.ball,this.wallGroup,
                                                (b,w) => { this.sndWall.play(); });
        // For hitting a bat, we work out the new angle (depends where the ball hit the bat)                                                
        this.game.physics.arcade.overlap(this.ball,this.batGroup,this.ballBatHandler,null,this);

        // If off the screen and in play (e.g. serve not over)
        if ((this.ball.x < 0 || this.ball.x > this.game.width) && (!this.serveOver)) {
            // Play scoring soud.
            this.sndScore.play();
            // Update score getWinner() is overridable. 
            var s:Score = this.score[this.getWinner()];
            var n:number = s.getValue() + 1;
            s.setValue(n);
            // Note : AY-3-8500 the winner serves, not the loser.
            var serveSide:ObjectPos = this.ball.x < 0 ? ObjectPos.Right:ObjectPos.Left;
            // Stop this off screen code being re-called and hide it.
            this.serveOver = true;
            // At 15 game over, effectively stop.
            if (n < 15) {
                this.game.time.events.add(1000,() => { this.serve(serveSide); })                
            }
        }
    }

    /**
     * Get the winner dependent on the ball state. For most games this depends whether 
     * ball is off left or right, but for Squash types it depends whose turn it is.
     * 
     * @returns {number} 0 left score/player 1 right score/player.
     * 
     * @memberOf AbstractGame
     */
    getWinner() : number {
        return (this.ball.x < 0) ? 1 : 0;
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
        // Ball in play again
        this.serveOver = false;
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
     * @param {boolean} useAI           use AI player.
     * @memberOf AbstractGame
     */
    protected addBat(direction:ObjectPos,xPercent:number,useAI:boolean) {
        var batHeight:number = this.game.height / (this.batSize ? 10 : 5);
        var r:Bat = new Bat(this.game,xPercent,direction,batHeight);
        r.setController(!useAI ? new KeyboardController(this.game,this.ball,r) : 
                                 new SimpleAIController(this.ball,r));

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

