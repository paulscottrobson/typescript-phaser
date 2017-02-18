/// <reference path="../lib/phaser.comments.d.ts"/>

class WaveManager extends Phaser.Sprite {

    private static VELOCITY:number = 20;

    public enemies:Phaser.Group;
    public enemyMissiles:Phaser.Group;
    private direction:number;
    public running:boolean;

    /**
     * Creates an instance of WaveManager. WaveManager controls the wave of Galaxian
     * ships.
     * 
     * @param {Phaser.Game} game owner
     * @param {number} x position, centrally.
     * @param {number} y position, centrally.
     * 
     * @memberOf WaveManager
     */
    constructor(game:Phaser.Game,x:number,y:number) {
        super(game,x,y,"sprites","cross");
        game.add.existing(this);
        this.position.setTo(x,y);
        this.anchor.setTo(0.5,0.5);
        this.visible = false;
        this.enemies = new Phaser.Group(game);
        this.enemyMissiles = new Phaser.Group(game);
        // Start moving right
        this.direction = 1;
        // Create the attack wave.
        this.createWave();
        // Start an attack at some time in the future.
        game.time.events.add(3000,this.launch,this);
        this.running = false;
    }

    /**
     * Update the horizontal movement of the wave. The ships themselves check they
     * are in the correct position so are not moved by this method.
     * 
     * @memberOf WaveManager
     */
    update() {
        // Change position
        this.x += this.direction * WaveManager.VELOCITY * this.game.time.elapsed / 1000;
        
        // Stop at edge of screen. Enemies also will set direction if required
        if (this.x < 0) { this.direction = 1; }
        if (this.x > this.game.width) { this.direction = -1; }
    }

    /**
     * Set direction of wave movement
     * 
     * @param {number} newDir new direction
     * 
     * @memberOf WaveManager
     */
    setDirection(newDir:number) {
        this.direction = newDir;
    }

    /**
     * Destructor, cleans up references.
     * 
     * @memberOf WaveManager
     */
    destroy(): void {
        super.destroy();
        this.enemies = this.enemyMissiles = null;
    }

    /**
     * Cause a random object to swoop down
     * 
     * @memberOf WaveManager
     */
    launch() : void {
        // Don't launch if no baddies
        if (this.enemies.children.length > 0 && this.running) {
            // Pick one randomly and set it to attack.
            var n:number = this.game.rnd.between(0,this.enemies.children.length-1);
            // Get that enemies cell number
            var xLaunch:number = (<BaseEnemy>this.enemies.children[n]).xCell;
            var yLaunch:number = (<BaseEnemy>this.enemies.children[n]).yCell;
            // Which way to attack.
            var onLeft:boolean = (xLaunch < 0);
            (<BaseEnemy>this.enemies.children[n]).attack(onLeft);
            // Launch enemies below left and below right if they exist.
            for (var enemy of this.enemies.children) {
                (<BaseEnemy>enemy).attackIf(xLaunch-1,yLaunch+1,onLeft);
                (<BaseEnemy>enemy).attackIf(xLaunch+1,yLaunch+1,onLeft);
            }
            (<GameState>(this.game.state.getCurrentState())).sfx["swoop"].play();
        }
        // Fire another launch 1s - 4s in the future.
        this.game.time.events.add(this.game.rnd.between(1500,6000),this.launch,this);
    }

    /**
     * Create a wave of Galaxian enemies
     * 
     * @memberOf WaveManager
     */
    createWave(): void {
        this.enemies.add(new Alien4(this.game,this,-2,0));
        this.enemies.add(new Alien4(this.game,this,1,0));

        for (var n:number = -3;n <= 2;n++) {
            this.enemies.add(new Alien3(this.game,this,n,1));
        }
        for (var n:number = -4;n <= 3;n++) {
            this.enemies.add(new Alien2(this.game,this,n,2));
        }
        for (var n:number = -5;n <= 4;n++) {
            this.enemies.add(new Alien1(this.game,this,n,3));
            this.enemies.add(new Alien1(this.game,this,n,4));
            this.enemies.add(new Alien1(this.game,this,n,5));
        }
    }

    /**
     * Missile firing is delegated to the manager so they can track it.
     * 
     * @param {number} x
     * @param {number} y
     * 
     * @memberOf WaveManager
     */
    fireMissile(x:number,y:number) : void {
        var m:Missile = new Missile(this.game,x,y,500);
        this.enemyMissiles.add(m);
    }

    getX() : number { return this.x; }
    getY() : number { return this.y; }
}
