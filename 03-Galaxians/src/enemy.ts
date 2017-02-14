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
    private xCell:number;
    private yCell:number;
    private owner:WaveManager;

    constructor(game:Phaser.Game,owner:WaveManager,x:number,y:number,baseImage:string) {
        super(game,0,0,"sprites","ship");
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.anchor.setTo(0.5,0.5);
        this.animations.add("normal",[baseImage+"1",baseImage+"2"],5,true);
        this.animations.play("normal");
        this.xCell = x;this.yCell = y;
        this.width = BaseEnemy.WIDTH;
        this.height = BaseEnemy.HEIGHT;
        this.state = EnemyState.InFormation;
        this.owner = owner;
    }

    update(): void {
        // Work out where it is supposed to be on the screen relative to the owner
        var xStart:number = this.owner.getX()+this.xCell * (BaseEnemy.WIDTH+BaseEnemy.SPACING);
        var yStart:number = this.owner.getY()+this.yCell * (BaseEnemy.HEIGHT+BaseEnemy.SPACING);
        xStart = xStart + ((this.xCell > 0) ? -1 : 1)*(BaseEnemy.WIDTH+BaseEnemy.SPACING) / 2;

        // If repositioning, move towards start position if not there yet, else change state.   
        if (this.state == EnemyState.Repositioning) {
            if (Math.abs(this.x-xStart)+Math.abs(this.y-yStart) > 2) {
                this.game.physics.arcade.moveToXY(this,xStart,yStart);
            } else {
                this.state = EnemyState.InFormation;
            }
        }
        // If in formation, move to whatever that position is
        if (this.state == EnemyState.InFormation) {
            this.position.setTo(xStart,yStart);
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

class Alien1 extends BaseEnemy {
    constructor(game:Phaser.Game,owner:WaveManager,x:number,y:number) {
        super(game,owner,x,y,"alien1");
    }
}

class Alien2 extends BaseEnemy {
    constructor(game:Phaser.Game,owner:WaveManager,x:number,y:number) {
        super(game,owner,x,y,"alien2");
    }
}
class Alien3 extends BaseEnemy {
    constructor(game:Phaser.Game,owner:WaveManager,x:number,y:number) {
        super(game,owner,x,y,"alien3");
    }
}
class Alien4 extends BaseEnemy {
    constructor(game:Phaser.Game,owner:WaveManager,x:number,y:number) {
        super(game,owner,x,y,"alien4");
    }
}