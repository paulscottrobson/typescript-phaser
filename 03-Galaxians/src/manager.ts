/// <reference path="../lib/phaser.comments.d.ts"/>

class WaveManager extends Phaser.Sprite {

    private enemies:Phaser.Group;

    constructor(game:Phaser.Game,x:number,y:number) {
        super(game,x,y,"sprites","cross");
        game.add.existing(this);
        this.position.setTo(x,y);
        this.anchor.setTo(0.5,0.5);
        this.enemies = new Phaser.Group(game);
        this.createWave();
    }

    destroy(): void {
        super.destroy();
        this.enemies = null;
    }

    createWave(): void {
        this.enemies.add(new Alien4(this.game,this,-2,0));
        this.enemies.add(new Alien4(this.game,this,2,0));
        for (var n:number = -5;n <= 5;n++) {
            if (n != 0) {
                if (Math.abs(n) <= 3) { this.enemies.add(new Alien3(this.game,this,n,1)); }
                if (Math.abs(n) <= 4) { this.enemies.add(new Alien2(this.game,this,n,2)); }
                this.enemies.add(new Alien1(this.game,this,n,3));
                this.enemies.add(new Alien1(this.game,this,n,4));
                this.enemies.add(new Alien1(this.game,this,n,5));
            }
        }
    }

    getX() : number { return this.x; }
    getY() : number { return this.y; }
}