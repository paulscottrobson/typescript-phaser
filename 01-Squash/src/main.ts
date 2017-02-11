/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * 
 * This is a very simple Squash game, all in one file.
 * 
 */

window.onload = function() {
    var game = new SquashGame();
}

/**
 * This is the main game class.
 * 
 * @class SquashGame
 * @extends {Phaser.Game}
 */
class SquashGame extends Phaser.Game {
    constructor() {
        // Call the super constructor.
        super(640,960,Phaser.AUTO,"");
        // Create a new state and switch to it.
        this.state.add("Main", new MainState());
        this.state.start("Main");
    }
}

/**
 * The main, and indeed only state in the game, which plays the whole game.
 * 
 * @class MainState
 * @extends {Phaser.State}
 */
class MainState extends Phaser.State {

    private wallGroup:Phaser.Group;
    private ball:Ball;
    private bat:Bat;
    private beep:Phaser.Sound;
    private score:number;
    private scoreText:Phaser.Text;

    /**
     * Preload all audio and visual assets.
     * @memberOf MainState
     */
    preload(): void {
        this.game.load.image("block","assets/sprites/block.png");
        this.game.load.audio("short",["assets/sounds/short.mp3","assets/sounds/short.ogg"]);
    }
    /**
     * Create the state
     * @memberOf MainState
     */
    create() : void {
        // Make the game window fit the display area. Doesn't work in the Game constructor.
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // Create wall group for holding all walls.
        this.wallGroup = new Phaser.Group(this.game);
        // Create three walls and add to wall group , we don't keep references to them, not needed.
        this.wallGroup.add(new Wall(this.game,0,0,32,this.game.height));
        this.wallGroup.add(new Wall(this.game,this.game.width-32,0,32,this.game.height));
        this.wallGroup.add(new Wall(this.game,0,0,this.game.width,32));
        // Create a single Ball 
        this.ball = new Ball(this.game);
        // Create a single bat
        this.bat = new Bat(this.game);
        // Create a beep sound
        this.beep = this.add.audio("short");
        // Reset Score and Create Score Text.
        this.score = 0;
        this.scoreText = new Phaser.Text(this.game,64,64,"0",{ font:"80px Arial",fill:"#FFFF00"});
        this.game.add.existing(this.scoreText);
    }
    /**
     * Handle updates
     * @memberOf MainState
     */
    update() : void {
        // This is required to make the objects bounce off each other.
        this.game.physics.arcade.collide(this.wallGroup,this.ball,
                                    (w,b) => { this.beep.play(); },null,this);
        this.game.physics.arcade.collide(this.bat,this.ball,this.scorePoint,null,this);
    }

    /**
     * Score a point in squash. Beep, add a point, update the text display.
     * @memberOf MainState
     */
    scorePoint() : void {
        this.beep.play();
        this.score += 1;
        this.scoreText.text = this.score.toString();
    }
}

/**
 * This is a solid block sprite built out of the block.png sprite tinted.
 * @class SolidBlock
 * @extends {Phaser.Sprite}
 */
class SolidBlock extends Phaser.TileSprite {
    /**
     * Creates an instance of SolidBlock.
     * @param {Phaser.Game} game owning game
     * @param {number} x position
     * @param {number} y position
     * @param {number} w width 
     * @param {number} h height
     * @param {number} colour RRGGBB colour
     * 
     * @memberOf SolidBlock
     */
    constructor(game:Phaser.Game,x:number,y:number,w:number,h:number,colour:number) {
        // Create the block using super constructor
        super(game,x,y,w,h,"block");
        // Set colour
        this.tint = colour;
        // Add to game
        game.add.existing(this);
        // Enable physics on it.
        this.game.physics.enable(this,Phaser.Physics.ARCADE);
    }
}

/**
 * This extends the solid block into a wall object, which has a specific colour and is
 * immovable in physics.
 * 
 * @class Wall
 * @extends {SolidBlock}
 */
class Wall extends SolidBlock {
    /**
     * Creates an instance of Wall
     * @param {Phaser.Game} game owning game
     * @param {number} x position
     * @param {number} y position
     * @param {number} w width 
     * @param {number} h height
     * @memberOf Wall
     */
    constructor(game:Phaser.Game,x:number,y:number,w:number,h:number) {
        super(game,x,y,w,h,0xFF8000);
        // This means it will not respond to things hitting it.
        this.body.immovable = true;
    }
}

/**
 * Represents a ball.
 * 
 * @class Ball
 * @extends {SolidBlock}
 */
class Ball extends SolidBlock {

    private static BALL_SIZE:number = 32;
    private static BALL_SPEED:number = 400;

    /**
     * Creates an instance of Ball.
     * 
     * @param {Phaser.Game} game instance
     * 
     * @memberOf Ball
     */
    constructor(game:Phaser.Game) {
        // Figure out a horizontal position.
        var x:number = game.rnd.between(Ball.BALL_SIZE*2,game.width-Ball.BALL_SIZE*2);
        // Call super constructor
        super(game,320,game.height/2,Ball.BALL_SIZE,Ball.BALL_SIZE,0x00FFFF);
        // Anchor around the centre of the ball.
        this.anchor.set(0.5,0.5);
        // Set it's bounciness to 100% in all directions.
        this.body.bounce.setTo(1,1);
        // Work out what angle we want to fire the ball at.
        var angle:number = game.rnd.between(0,1)*60+60;
        // Convert to Radians. Javascripts trigonometry uses radians.
        angle = angle / 360.0 * 2 * Math.PI;
        // Apply velocity to that angle. 
        this.body.velocity.x = Math.cos(angle)*Ball.BALL_SPEED;
        this.body.velocity.y = -Math.sin(angle)*Ball.BALL_SPEED;
    }

    /**
     * Update restarts game if out of bounds
     * 
     * @memberOf Ball
     */
    update(): void {
        if (this.y > this.game.height * 3 / 2) {
            this.game.state.start("Main");
        }
    }
}

/**
 * Bat object.
 * 
 * @class Bat
 * @extends {SolidBlock}
 */
class Bat extends SolidBlock {

    private static BAT_WIDTH:number = 200;
    private static BAT_MOVE:number = 10;
    private xMin:number;
    private xMax:number;
    private cursorKeys:Phaser.CursorKeys;

    /**
     * Creates an instance of Bat.
     * 
     * @param {Phaser.Game} game instance
     * 
     * @memberOf Bat
     */
    constructor(game:Phaser.Game) {
        super(game,game.width/2,game.height*5/6,Bat.BAT_WIDTH,16,0x00FF00);
        // Anchor around the centre.
        this.anchor.set(0.5,0.5);
        // We don't want it to respond to being bounced off.
        this.body.immovable = true;
        // Work out range of x to keep it in the game area.
        this.xMin = 32 + Bat.BAT_WIDTH / 2;
        this.xMax = game.width - 32 - Bat.BAT_WIDTH / 2;
        // Create a cursor keys object
        this.cursorKeys = game.input.keyboard.createCursorKeys();
    }

    /**
     * Update the bat. No allowance for different update rates here :)
     * 
     * @memberOf Bat
     */
    update() : void {
        // Adjust for left/right down, keeping within limits.
        if (this.cursorKeys.left.isDown) {
            this.x = Math.max(this.xMin,this.x - Bat.BAT_MOVE);
        }
        if (this.cursorKeys.right.isDown) {
            this.x = Math.min(this.xMax,this.x + Bat.BAT_MOVE);
        }
    }
}