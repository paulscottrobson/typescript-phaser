var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WhiteRect = (function (_super) {
    __extends(WhiteRect, _super);
    function WhiteRect(game, x, y, w, h, dashed) {
        var _this = this;
        var bmd = new Phaser.BitmapData(game, "", w, h);
        _this = _super.call(this, game, x, y, bmd) || this;
        _this.bitmapData = bmd;
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, w, h);
        bmd.ctx.fillStyle = "#FFFFFF";
        bmd.ctx.fill();
        if (dashed) {
            var step = game.width / 24;
            for (var x = 0; x < w; x = x + step) {
                bmd.ctx.beginPath();
                bmd.ctx.rect(x + step * 3 / 4, 0, step / 4, h);
                bmd.ctx.fillStyle = "#000000";
                bmd.ctx.fill();
            }
        }
        game.add.existing(_this);
        return _this;
    }
    WhiteRect.prototype.destroy = function () {
        this.bitmapData.destroy();
        this.bitmapData = null;
        _super.prototype.destroy.call(this);
    };
    return WhiteRect;
}(Phaser.Sprite));
var ObjectPos;
(function (ObjectPos) {
    ObjectPos[ObjectPos["Left"] = 0] = "Left";
    ObjectPos[ObjectPos["Right"] = 1] = "Right";
    ObjectPos[ObjectPos["Top"] = 2] = "Top";
    ObjectPos[ObjectPos["Bottom"] = 3] = "Bottom";
    ObjectPos[ObjectPos["Middle"] = 4] = "Middle";
})(ObjectPos || (ObjectPos = {}));
;
var AbstractGame = (function (_super) {
    __extends(AbstractGame, _super);
    function AbstractGame() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractGame.prototype.create = function () {
        this.wallGroup = new Phaser.Group(this.game);
        this.batGroup = new Phaser.Group(this.game);
        this.addDashedWall(ObjectPos.Top);
        this.addDashedWall(ObjectPos.Bottom);
        this.createGameArea();
        this.ball = new Ball(this.game);
        this.createPlayers();
    };
    AbstractGame.prototype.destroy = function () {
        this.wallGroup = null;
    };
    AbstractGame.prototype.update = function () {
        this.game.physics.arcade.collide(this.ball, this.wallGroup);
    };
    AbstractGame.prototype.createGameArea = function () {
        console.log("Calling abstract method createGameArea()");
    };
    AbstractGame.prototype.createPlayers = function () {
        console.log("Calling abstract method createPlayers()");
    };
    AbstractGame.prototype.backWall = function (pos, hasGoal) {
        var x = (pos == ObjectPos.Left) ? 0 : this.game.width - AbstractGame.WALL_WIDTH;
        if (hasGoal) {
            var gwSize = (this.game.height) * (100 - AbstractGame.GOAL_PERCENT) / 100 / 2;
            this.addWall(x, 0, AbstractGame.WALL_WIDTH, gwSize, false, true);
            this.addWall(x, this.game.height - gwSize, AbstractGame.WALL_WIDTH, gwSize, false, true);
        }
        else {
            this.addWall(x, 0, AbstractGame.WALL_WIDTH, this.game.height, false, true);
        }
    };
    AbstractGame.prototype.centreLine = function () {
        this.addWall(this.game.width / 2 - AbstractGame.WALL_WIDTH / 2, 0, AbstractGame.WALL_WIDTH, this.game.height, true, false);
    };
    AbstractGame.prototype.addDashedWall = function (pos) {
        var y = (pos == ObjectPos.Top) ? 0 : this.game.height - AbstractGame.WALL_HEIGHT;
        this.addWall(0, y, this.game.width, AbstractGame.WALL_HEIGHT, true, true);
    };
    AbstractGame.prototype.addWall = function (x, y, w, h, dashed, solid) {
        var r = new WhiteRect(this.game, x, y, w, h, dashed);
        if (solid) {
            this.game.physics.arcade.enableBody(r);
            r.body.immovable = true;
            this.wallGroup.add(r);
        }
    };
    return AbstractGame;
}(Phaser.State));
AbstractGame.WALL_WIDTH = 8;
AbstractGame.WALL_HEIGHT = 8;
AbstractGame.GOAL_PERCENT = 55;
var SoccerGame = (function (_super) {
    __extends(SoccerGame, _super);
    function SoccerGame() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SoccerGame.prototype.createGameArea = function () {
        this.centreLine();
        this.backWall(ObjectPos.Left, true);
        this.backWall(ObjectPos.Right, true);
    };
    SoccerGame.prototype.createPlayers = function () {
    };
    return SoccerGame;
}(AbstractGame));
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball(game) {
        var _this = _super.call(this, game, game.width / 2, game.height / 2, Ball.BALL_SIZE, Ball.BALL_SIZE, false) || this;
        game.physics.arcade.enableBody(_this);
        _this.body.bounce.set(1, 1);
        _this.body.velocity.setTo(500, 300);
        _this.anchor.set(0.5, 0.5);
        return _this;
    }
    return Ball;
}(WhiteRect));
Ball.BALL_SIZE = 24;
window.onload = function () {
    var game = new PongGame();
};
var PongGame = (function (_super) {
    __extends(PongGame, _super);
    function PongGame() {
        var _this = _super.call(this, 960, 640, Phaser.AUTO, "") || this;
        _this.state.add("Preload", new PreloadState());
        _this.state.add("DemoGame", new SoccerGame());
        _this.state.add("Dead", new Phaser.State());
        _this.state.start("Preload");
        return _this;
    }
    return PongGame;
}(Phaser.Game));
var PreloadState = (function (_super) {
    __extends(PreloadState, _super);
    function PreloadState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreloadState.prototype.preload = function () {
        var _this = this;
        for (var _i = 0, _a = ["short", "medium", "long"]; _i < _a.length; _i++) {
            var sound = _a[_i];
            this.game.load.audio("short", ["assets/sounds/" + sound + ".mp3", "assets/sounds/" + sound + ".ogg"]);
        }
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("DemoGame"); }, this);
    };
    return PreloadState;
}(Phaser.State));
