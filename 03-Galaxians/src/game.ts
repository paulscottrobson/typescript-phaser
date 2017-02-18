/// <reference path="../lib/phaser.comments.d.ts"/>

class GameState extends Phaser.State {

    private waveMgr:WaveManager;
    private score:Score;
    private ship:Ship;
    private lives:Lives;
    public  sfx:SoundCollection;

    create() : void {
        var s:Phaser.Sprite;
        // Start up physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        // Draw the stars
        for (var i = 0;i < 50;i++) {
            new FlashingStar(this.game);
        }
        // Create main objects
        this.waveMgr = new WaveManager(this.game,this.game.width/2,120);
        this.score = new Score(this.game);
        this.ship = new Ship(this.game);
        this.lives = new Lives(this.game);
        // Load all the SFX
        this.sfx = PreloadState.getSounds(this);
        // Put first text on screen
        var btx:Phaser.BitmapText = this.game.add.bitmapText(this.game.width/2,this.game.height/2,
                                    "font","Player One",40);
        btx.anchor.setTo(0.5);btx.tint = 0xFF0000;
        // After 2.5s remove it, start things, start the looped sfx.
        this.game.time.events.add(2500,
            () => { this.setAction(true);
                    this.sfx["loop"].play().loopFull().volume = 0.5;
                    btx.destroy(); },
        this);
        // Play little tune.
        this.sfx["start"].play();
    }


    /**
     * Stops or starts active parts of game. Ship and Enemies still move, but nothing
     * aggressive can happen.
     * 
     * @param {boolean} state
     * 
     * @memberOf GameState
     */
    setAction(state:boolean) : void {
        this.waveMgr.running = this.ship.running = state;
    }

    destroy() {
        this.sfx = this.waveMgr = this.score = this.ship = this.lives = null;
    }

    update() {
        this.game.physics.arcade.collide(this.waveMgr.enemies,this.ship.playerMissileGroup,
                                         this.shoot,null,this);
        this.game.physics.arcade.collide(this.ship,this.waveMgr.enemyMissiles,
                                         this.lostLife,null,this);                                         
        this.game.physics.arcade.collide(this.ship,this.waveMgr.enemies,
                                         this.lostLife,null,this);                                         
    }


    /**
     * Handle ship / missile or enemy collision
     * 
     * @param {Ship} ship
     * @param {*} object enemy or missile group
     * 
     * @memberOf TestState
     */
    lostLife(ship:Ship,object:any) {
        // If ship is actually running (stops multiple kills)
        if (ship.running) {
            this.sfx["death"].play();
            // Destroy the killing object            
            object.destroy();
            // Lose a life
            this.lives.removeLife();
            // Stop the action. (no shooting, diving)
            this.setAction(false);
            // Show an explosion
            new Explosion(this.game,ship.x,ship.y);
            // Restart after 1 second if lives left
            if (this.lives.getLives() > 0) {
                this.game.time.events.add(1000,() => { this.setAction(true); },this);
            } else {
                // Display game over.
                var t:Phaser.BitmapText = this.game.add.bitmapText(this.game.width/2,
                                                                   this.game.height/2,
                                                                   "font",
                                                                   "Game Over",
                                                                   48);
                t.anchor.setTo(0.5);
                t.tint = 0xFF0000;                                                                   
            }
        }
    }

    /**
     * Handle player missile / enemy collisions.
     * 
     * @param {BaseEnemy} enemy
     * @param {Missile} missile
     * 
     * @memberOf TestState
     */
    shoot(enemy:BaseEnemy,missile:Missile) : void {
        this.sfx["explosion"].play();
        // Get its value in points
        var value:number = enemy.getScore();
        // If 100 or more, show a little shimmering score
        if (value >= 100) {
            new ShortTermDisplayScore(this.game,
                                      enemy.x+BaseEnemy.WIDTH/2,enemy.y+BaseEnemy.HEIGHT/2,
                                      value);
        }
        // Add to score
        this.score.addPoints(value);
        // Destroy both objects
        new Explosion(this.game,enemy.x,enemy.y);
        enemy.destroy();
        missile.destroy();
        // If destroyed all enemies create a new wave of them after 2 seconds.
        if (this.waveMgr.enemies.children.length == 0) {
            this.game.time.events.add(2000,this.waveMgr.createWave,this.waveMgr);
        }
    }
}

