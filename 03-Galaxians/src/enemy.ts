/// <reference path="../lib/phaser.comments.d.ts"/>

enum EnemyState {
    InFormation,                // In formation
    InFlight,                   // In flight down
    Repositioning               // Repositioning in formation
}

/**
 * Base enemy class.
 * 
 * @class BaseEnemy
 * @extends {Phaser.Sprite}
 */
class BaseEnemy extends Phaser.Sprite {

    public static WIDTH:number = 32;
    public static HEIGHT:number = 24;
    public static SPACING:number = 10;

    private state:EnemyState;
    public  xCell:number;
    public  yCell:number;
    private owner:WaveManager;

    /**
     * Creates an instance of BaseEnemy.
     * 
     * @param {Phaser.Game} game
     * @param {WaveManager} owner wavemanager that it belongs to
     * @param {number} x cell offset horizontal
     * @param {number} y cell offset vertical
     * @param {string} baseImage stem name of animation "alien1"
     * 
     * @memberOf BaseEnemy
     */
    constructor(game:Phaser.Game,owner:WaveManager,x:number,y:number,baseImage:string) {
        super(game,0,0,"sprites","ship");
        game.add.existing(this);
        game.physics.arcade.enableBody(this);
        this.body.immovable = true;
        this.anchor.setTo(0.5,0.5);
        this.animations.add("normal",[baseImage+"1",baseImage+"2"],5,true);
        this.animations.play("normal");
        this.xCell = x;this.yCell = y;
        this.width = BaseEnemy.WIDTH;
        this.height = BaseEnemy.HEIGHT;
        this.state = EnemyState.InFormation;
        this.owner = owner;
    }

    /**
     * Update the enemy
     * 
     * @memberOf BaseEnemy
     */
    update(): void {
        // Work out where it is supposed to be on the screen relative to the owner
        var xStart:number = this.owner.getX()+(this.xCell+0.5) * (BaseEnemy.WIDTH+BaseEnemy.SPACING);
        var yStart:number = this.owner.getY()+this.yCell * (BaseEnemy.HEIGHT+BaseEnemy.SPACING);

        // If repositioning, move towards start position if not there yet, else change state.   
        if (this.state == EnemyState.Repositioning) {
            if (Math.abs(this.x-xStart)+Math.abs(this.y-yStart) > 2) {
                this.game.physics.arcade.moveToXY(this,xStart,yStart,100);
            } else {
                this.state = EnemyState.InFormation;
            }
        }
        // If in formation, move to whatever that position is
        if (this.state == EnemyState.InFormation) {
            this.position.setTo(xStart,yStart);
            // Check on edge of screen and if so set formation direction.
            if (xStart < BaseEnemy.WIDTH/2) { this.owner.setDirection(1); }
            if (xStart > this.game.width-BaseEnemy.WIDTH/2) { this.owner.setDirection(-1); }
        }
        // If In flight
        if (this.state == EnemyState.InFlight) {
            // Check off left/right
            if (this.x < BaseEnemy.WIDTH/2) { 
                this.body.velocity.x = Math.abs(this.body.velocity.x);                
            }
            if (this.x > this.game.width - BaseEnemy.WIDTH/2) { 
                this.body.velocity.x = -Math.abs(this.body.velocity.x);                
            }
            // Off the bottom, reposition ...
            if (this.y > this.game.height) {
                this.x = xStart;
                this.y = -BaseEnemy.HEIGHT;
                this.state = EnemyState.Repositioning;
                this.angle = 0;
            }
        }
        // If not in repositioning option to shoot.
        if (this.state != EnemyState.Repositioning) {
            var chance:number = this.game.time.elapsed * 120;
            if (this.state == EnemyState.InFlight) {
                chance = Math.max(1,Math.floor(chance / 40));
            }
            if (this.game.rnd.between(0,chance) == 0) {
                this.owner.fireMissile(this.x,this.y+BaseEnemy.HEIGHT/2);
            }
        }
    }

    /**
     * Launch the enemy into attack mode (e.g. roll over and dive)
     * 
     * @memberOf BaseEnemy
     */
    attack(onLeft:boolean): void {
        if (this.state == EnemyState.InFormation) {
            this.state = EnemyState.InFlight;
            var newState = { "angle" : onLeft ? "-180":"+180", "y": "-50", "x":onLeft ? "-50":"+50" }
            var t:Phaser.Tween = this.game.add.tween(this).to(newState,500,Phaser.Easing.Linear.None,true);
            t.onComplete.add(() => {
                this.body.velocity.y = 300;
                this.body.velocity.x = onLeft ? 300 : -300;
            },this);
        }
    }

    /**
     * Launch an attack if at this cell position. Used to get the enemies "wingmen"
     * 
     * @param {number} xc
     * @param {number} yc
     * 
     * @memberOf BaseEnemy
     */
    attackIf(xc:number,yc:number,onLeft:boolean) {
        if (this.xCell == xc && this.yCell == yc) {
            this.attack(onLeft);
        }
    }

    destroy(): void {
        super.destroy();
        this.owner = null;
    }

    getScoreInFlight(): number { 
        return this.getScoreInFormation() * 2; 
    }

    getScoreInFormation(): number { 
        return 50; 
    }

}

//
//  Classes of Aliens. On a standard game of galaxians, 4 is the topmost, 1 the
//  bottom most on the display.
//

class Alien1 extends BaseEnemy {
    constructor(game:Phaser.Game,owner:WaveManager,x:number,y:number) {
        super(game,owner,x,y,"alien1");
    }
    getScoreInFormation(): number { 
        return 30; 
    }
}

class Alien2 extends BaseEnemy {
    constructor(game:Phaser.Game,owner:WaveManager,x:number,y:number) {
        super(game,owner,x,y,"alien2");
    }
    getScoreInFormation(): number { 
        return 40; 
    }
}

class Alien3 extends BaseEnemy {
    constructor(game:Phaser.Game,owner:WaveManager,x:number,y:number) {
        super(game,owner,x,y,"alien3");
    }
    getScoreInFormation(): number { 
        return 50; 
    }
}

class Alien4 extends BaseEnemy {
    constructor(game:Phaser.Game,owner:WaveManager,x:number,y:number) {
        super(game,owner,x,y,"alien4");
    }
    getScoreInFormation(): number { 
        return 60; 
    }
    getScoreInFlight(): number { 
        return 300;
    }
}