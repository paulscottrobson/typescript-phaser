var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
window.onload = function () {
    var game = new SquashGame();
};
var SquashGame = (function (_super) {
    __extends(SquashGame, _super);
    function SquashGame() {
        var _this = _super.call(this, 640, 960, Phaser.AUTO, "") || this;
        _this.state.add("Main", new MainState());
        _this.state.start("Main");
        return _this;
    }
    return SquashGame;
}(Phaser.Game));
var MainState = (function (_super) {
    __extends(MainState, _super);
    function MainState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainState.prototype.preload = function () {
        this.game.load.image("block", "assets/sprites/block.png");
        this.game.load.audio("short", ["assets/sounds/short.mp3", "assets/sounds/short.ogg"]);
    };
    MainState.prototype.create = function () {
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.wallGroup = new Phaser.Group(this.game);
        this.wallGroup.add(new Wall(this.game, 0, 0, 32, this.game.height));
        this.wallGroup.add(new Wall(this.game, this.game.width - 32, 0, 32, this.game.height));
        this.wallGroup.add(new Wall(this.game, 0, 0, this.game.width, 32));
        this.ball = new Ball(this.game);
        this.bat = new Bat(this.game);
        this.beep = this.add.audio("short");
        this.score = 0;
        this.scoreText = new Phaser.Text(this.game, 64, 64, "0", { font: "80px Arial", fill: "#FFFF00" });
        this.game.add.existing(this.scoreText);
    };
    MainState.prototype.update = function () {
        var _this = this;
        this.game.physics.arcade.collide(this.wallGroup, this.ball, function (w, b) { _this.beep.play(); }, null, this);
        this.game.physics.arcade.collide(this.bat, this.ball, this.scorePoint, null, this);
    };
    MainState.prototype.scorePoint = function () {
        this.beep.play();
        this.score += 1;
        this.scoreText.text = this.score.toString();
    };
    return MainState;
}(Phaser.State));
var SolidBlock = (function (_super) {
    __extends(SolidBlock, _super);
    function SolidBlock(game, x, y, w, h, colour) {
        var _this = _super.call(this, game, x, y, w, h, "block") || this;
        _this.tint = colour;
        game.add.existing(_this);
        _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
        return _this;
    }
    return SolidBlock;
}(Phaser.TileSprite));
var Wall = (function (_super) {
    __extends(Wall, _super);
    function Wall(game, x, y, w, h) {
        var _this = _super.call(this, game, x, y, w, h, 0xFF8000) || this;
        _this.body.immovable = true;
        return _this;
    }
    return Wall;
}(SolidBlock));
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball(game) {
        var _this = this;
        var x = game.rnd.between(Ball.BALL_SIZE * 2, game.width - Ball.BALL_SIZE * 2);
        _this = _super.call(this, game, 320, game.height / 2, Ball.BALL_SIZE, Ball.BALL_SIZE, 0x00FFFF) || this;
        _this.anchor.set(0.5, 0.5);
        _this.body.bounce.setTo(1, 1);
        var angle = game.rnd.between(0, 1) * 60 + 60;
        angle = angle / 360.0 * 2 * Math.PI;
        _this.body.velocity.x = Math.cos(angle) * Ball.BALL_SPEED;
        _this.body.velocity.y = -Math.sin(angle) * Ball.BALL_SPEED;
        return _this;
    }
    Ball.prototype.update = function () {
        if (this.y > this.game.height * 3 / 2) {
            this.game.state.start("Main");
        }
    };
    return Ball;
}(SolidBlock));
Ball.BALL_SIZE = 32;
Ball.BALL_SPEED = 400;
var Bat = (function (_super) {
    __extends(Bat, _super);
    function Bat(game) {
        var _this = _super.call(this, game, game.width / 2, game.height * 5 / 6, Bat.BAT_WIDTH, 16, 0x00FF00) || this;
        _this.anchor.set(0.5, 0.5);
        _this.body.immovable = true;
        _this.xMin = 32 + Bat.BAT_WIDTH / 2;
        _this.xMax = game.width - 32 - Bat.BAT_WIDTH / 2;
        _this.cursorKeys = game.input.keyboard.createCursorKeys();
        return _this;
    }
    Bat.prototype.update = function () {
        if (this.cursorKeys.left.isDown) {
            this.x = Math.max(this.xMin, this.x - Bat.BAT_MOVE);
        }
        if (this.cursorKeys.right.isDown) {
            this.x = Math.min(this.xMax, this.x + Bat.BAT_MOVE);
        }
    };
    return Bat;
}(SolidBlock));
Bat.BAT_WIDTH = 200;
Bat.BAT_MOVE = 10;
