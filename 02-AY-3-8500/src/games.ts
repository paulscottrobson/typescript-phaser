/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * Squash 2 player game
 * 
 * @class SquashGame
 * @extends {AbstractGame}
 */
class SquashGame extends AbstractGame {

    private inPlay:number; 

    constructor() {
        super();
        this.inPlay = 0;
    }

    createGameArea() : void {
        this.backWall(ObjectPos.Left,false);
    }

    createPlayers(): void {
        this.addBat(ObjectPos.Left,20,true);
        this.addBat(ObjectPos.Left,16,false);
    }    

    serve(side:ObjectPos) {
        // Always serve right to left, from 3/4 of way across.
        super.serve(ObjectPos.Right);
        this.ball.x = this.game.width * 75 / 100;
    }

    ballBatHandler(ball:Ball,bat:Bat) : void {
        // If ball going left->right don't collide.
        if (ball.body.velocity.x > 0) {
            // If current bat collision, execute collision and switch bats.
            if (this.batGroup.children[this.inPlay] == bat) {
                super.ballBatHandler(ball,bat);
                this.inPlay = 1 - this.inPlay;
            }
        }
    }

    getWinner(): number {
        return 1 - this.inPlay;
    }
}

/**
 * Practice one player game
 * 
 * @class PracticeGame
 * @extends {AbstractGame}
 */
class PracticeGame extends AbstractGame {

    createGameArea() : void {
        this.backWall(ObjectPos.Left,false);
    }

    createPlayers(): void {
        this.addBat(ObjectPos.Left,16,false);
    }    

    serve(side:ObjectPos) {
        super.serve(ObjectPos.Right);
        this.ball.x = this.game.width * 75 / 100;
    }

    getWinner(): number {
        return 0;
    }
}

/**
 * Soccer 2 player game
 * 
 * @class SoccerGame
 * @extends {AbstractGame}
 */
class SoccerGame extends AbstractGame {

    createGameArea() : void {
        this.centreLine();
        this.backWall(ObjectPos.Left,true);
        this.backWall(ObjectPos.Right,true);        
    }

    createPlayers(): void {
        this.addBat(ObjectPos.Left,5,false);
        this.addBat(ObjectPos.Left,70,false);
        this.addBat(ObjectPos.Right,5,true);
        this.addBat(ObjectPos.Right,75,true);
    }
}

/**
 * Tennis two player game
 * 
 * @class TennisGame
 * @extends {AbstractGame}
 */
class TennisGame extends AbstractGame {

    createGameArea() : void {
        this.centreLine();
    }

    createPlayers(): void {
        this.addBat(ObjectPos.Left,5,false);
        this.addBat(ObjectPos.Right,5,true);
    }
}