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
    private ball:Ball;

    private static WALL_WIDTH:number = 8;
    private static WALL_HEIGHT:number = 8;
    private static GOAL_PERCENT:number = 55;

    create(): void {
        // Groups for the solid wall objects and the bats.
        this.wallGroup = new Phaser.Group(this.game);
        this.batGroup = new Phaser.Group(this.game);
        // The top and bottom lines everything has.
        this.addDashedWall(ObjectPos.Top);        
        this.addDashedWall(ObjectPos.Bottom);
        // Create wall bits relevant to the actual game.
        this.createGameArea();
        // Create a new ball to play with.
        this.ball = new Ball(this.game);
        // Create the players
        this.createPlayers();
    }

    destroy(): void {
        this.wallGroup = null;
    }

    update(): void {
        this.game.physics.arcade.collide(this.ball,this.wallGroup);
    }

    createGameArea(): void {
        console.log("Calling abstract method createGameArea()");
    }
    createPlayers(): void {
        console.log("Calling abstract method createPlayers()");
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
}


class SoccerGame extends AbstractGame {

    createGameArea() : void {
        this.centreLine();
        this.backWall(ObjectPos.Left,true);
        this.backWall(ObjectPos.Right,true);        
    }

    createPlayers(): void {

    }
}