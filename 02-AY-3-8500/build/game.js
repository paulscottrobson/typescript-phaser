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
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ballAngles = true;
        _this.batSize = false;
        _this.ballSpeed = false;
        return _this;
    }
    AbstractGame.prototype.create = function () {
        var _this = this;
        this.sndWall = this.add.audio("short");
        this.sndBat = this.add.audio("medium");
        this.sndScore = this.add.audio("long");
        this.wallGroup = new Phaser.Group(this.game);
        this.batGroup = new Phaser.Group(this.game);
        this.addDashedWall(ObjectPos.Top);
        this.addDashedWall(ObjectPos.Bottom);
        this.score = [];
        var s = 64;
        this.score.push(new Score(this.game, this.game.width / 2 - s * 7 / 4, s * 5 / 4, s, s * 4 / 3));
        this.score.push(new Score(this.game, this.game.width / 2 + s * 7 / 4, s * 5 / 4, s, s * 4 / 3));
        this.createGameArea();
        this.ball = new Ball(this.game, this.ballSpeed ? this.game.width : this.game.width / 2);
        this.ballNumber = 0;
        this.createPlayers();
        this.serve(this.rnd.between(0, 1) ? ObjectPos.Left : ObjectPos.Right);
        var game = this.game;
        this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(function () { (game).nextGame(); }, game);
        this.game.input.keyboard.addKey(Phaser.Keyboard.B).onDown.add(function () { _this.batSize = !_this.batSize; (game).restartGame(); }, game);
        this.game.input.keyboard.addKey(Phaser.Keyboard.A).onDown.add(function () { _this.ballAngles = !_this.ballAngles; (game).restartGame(); }, game);
        this.game.input.keyboard.addKey(Phaser.Keyboard.S).onDown.add(function () { _this.ballSpeed = !_this.ballSpeed; (game).restartGame(); }, game);
    };
    AbstractGame.prototype.destroy = function () {
        this.ball = null;
        this.wallGroup = null;
        this.batGroup = null;
        this.score = null;
    };
    AbstractGame.prototype.update = function () {
        var _this = this;
        this.game.physics.arcade.collide(this.ball, this.wallGroup, function (b, w) { _this.sndWall.play(); });
        this.game.physics.arcade.overlap(this.ball, this.batGroup, this.ballBatHandler, null, this);
        if ((this.ball.x < 0 || this.ball.x > this.game.width) && (!this.serveOver)) {
            this.sndScore.play();
            var s = this.score[this.getWinner()];
            var n = s.getValue() + 1;
            s.setValue(n);
            var serveSide = this.ball.x < 0 ? ObjectPos.Right : ObjectPos.Left;
            this.serveOver = true;
            if (n < 15) {
                this.game.time.events.add(1000, function () { _this.serve(serveSide); });
            }
        }
    };
    AbstractGame.prototype.getWinner = function () {
        return (this.ball.x < 0) ? 1 : 0;
    };
    AbstractGame.prototype.serve = function (side) {
        this.ballNumber++;
        this.ball.x = (side == ObjectPos.Left ? 10 : 90) * this.game.width / 100;
        this.ball.y = this.rnd.between(25, 75) * this.game.height / 100;
        var angle = this.rnd.between(1, 2) * 20;
        if (this.rnd.between(0, 1) != 0) {
            angle = -angle;
        }
        if (side == ObjectPos.Right) {
            angle = 180 - angle;
        }
        this.serveOver = false;
        this.ball.launch(angle);
    };
    AbstractGame.prototype.ballBatHandler = function (ball, bat) {
        var angle = bat.getBounceAngle(ball.y, this.ballAngles);
        ball.launch(angle);
        this.sndBat.play();
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
    AbstractGame.prototype.addBat = function (direction, xPercent, useAI) {
        var batHeight = this.game.height / (this.batSize ? 10 : 5);
        var r = new Bat(this.game, xPercent, direction, batHeight);
        r.setController(!useAI ? new KeyboardController(this.game, this.ball, r) :
            new SimpleAIController(this.ball, r));
        this.game.physics.arcade.enableBody(r);
        this.batGroup.add(r);
    };
    AbstractGame.prototype.createGameArea = function () {
        console.log("Calling abstract method createGameArea()");
    };
    AbstractGame.prototype.createPlayers = function () {
        console.log("Calling abstract method createPlayers()");
    };
    return AbstractGame;
}(Phaser.State));
AbstractGame.WALL_WIDTH = 8;
AbstractGame.WALL_HEIGHT = 8;
AbstractGame.GOAL_PERCENT = 55;
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball(game, velocity) {
        var _this = _super.call(this, game, game.width / 2, game.height / 2, Ball.BALL_SIZE, Ball.BALL_SIZE, false) || this;
        game.physics.arcade.enableBody(_this);
        _this.body.bounce.set(1, 1);
        _this.anchor.set(0.5, 0.5);
        _this.velocity = velocity;
        return _this;
    }
    Ball.prototype.launch = function (angle) {
        angle = angle / 360.0 * 2 * Math.PI;
        this.body.velocity.x = Math.cos(angle) * this.velocity;
        this.body.velocity.y = -Math.sin(angle) * this.velocity;
    };
    return Ball;
}(WhiteRect));
Ball.BALL_SIZE = 24;
var Bat = (function (_super) {
    __extends(Bat, _super);
    function Bat(game, xPercent, direction, height) {
        var _this = this;
        if (direction == ObjectPos.Left) {
            xPercent = 100 - xPercent;
        }
        var x = game.width * xPercent / 100;
        var y = game.rnd.between(height, game.height - height);
        _this = _super.call(this, game, x, y, Bat.BAT_WIDTH, height, false) || this;
        _this.anchor.setTo(0.5, 0.5);
        _this.direction = direction;
        _this.batHeight = height;
        _this.controller = null;
        return _this;
    }
    Bat.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.controller.destroy();
        this.controller = null;
    };
    Bat.prototype.setController = function (controller) {
        this.controller = controller;
    };
    Bat.prototype.update = function () {
        this.y = this.y + this.controller.getMovement() *
            this.game.time.elapsed / 1000.0 * this.game.height;
        this.y = Math.max(this.y, this.batHeight / 2);
        this.y = Math.min(this.y, this.game.height - this.batHeight / 2);
    };
    Bat.prototype.getBounceAngle = function (yBall, isFourBounce) {
        var offset = Math.abs((yBall - this.y) / (this.batHeight / 2));
        var angle = 40;
        if (isFourBounce && offset < 0.5) {
            angle = 20;
        }
        if (yBall > this.y) {
            angle = -angle;
        }
        if (this.direction == ObjectPos.Left) {
            angle = 180 - angle;
        }
        return angle;
    };
    return Bat;
}(WhiteRect));
Bat.BAT_WIDTH = 16;
var Controller = (function () {
    function Controller(ball, bat) {
        this.ball = ball;
        this.bat = bat;
    }
    Controller.prototype.getMovement = function () {
        return 0;
    };
    Controller.prototype.destroy = function () {
        this.ball = null;
        this.bat = null;
    };
    return Controller;
}());
var KeyboardController = (function (_super) {
    __extends(KeyboardController, _super);
    function KeyboardController(game, ball, bat) {
        var _this = _super.call(this, ball, bat) || this;
        if (KeyboardController.instanceCount == 0) {
            KeyboardController.cursors = game.input.keyboard.createCursorKeys();
        }
        KeyboardController.instanceCount++;
        return _this;
    }
    KeyboardController.prototype.getMovement = function () {
        var move = 0;
        if (KeyboardController.cursors.down.isDown) {
            move = 1;
        }
        if (KeyboardController.cursors.up.isDown) {
            move = -1;
        }
        return move;
    };
    KeyboardController.prototype.destroy = function () {
        KeyboardController.instanceCount--;
        if (KeyboardController.instanceCount == 0) {
            KeyboardController.cursors = null;
        }
    };
    return KeyboardController;
}(Controller));
KeyboardController.cursors = null;
KeyboardController.instanceCount = 0;
var SimpleAIController = (function (_super) {
    __extends(SimpleAIController, _super);
    function SimpleAIController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SimpleAIController.prototype.getMovement = function () {
        var move = 0;
        if (this.ball.y > this.bat.y) {
            move = 1;
        }
        if (this.ball.y < this.bat.y) {
            move = -1;
        }
        return move;
    };
    return SimpleAIController;
}(Controller));
var SquashGame = (function (_super) {
    __extends(SquashGame, _super);
    function SquashGame() {
        var _this = _super.call(this) || this;
        _this.inPlay = 0;
        return _this;
    }
    SquashGame.prototype.createGameArea = function () {
        this.backWall(ObjectPos.Left, false);
    };
    SquashGame.prototype.createPlayers = function () {
        this.addBat(ObjectPos.Left, 20, true);
        this.addBat(ObjectPos.Left, 16, false);
    };
    SquashGame.prototype.serve = function (side) {
        _super.prototype.serve.call(this, ObjectPos.Right);
        this.ball.x = this.game.width * 75 / 100;
    };
    SquashGame.prototype.ballBatHandler = function (ball, bat) {
        if (ball.body.velocity.x > 0) {
            if (this.batGroup.children[this.inPlay] == bat) {
                _super.prototype.ballBatHandler.call(this, ball, bat);
                this.inPlay = 1 - this.inPlay;
            }
        }
    };
    SquashGame.prototype.getWinner = function () {
        return 1 - this.inPlay;
    };
    return SquashGame;
}(AbstractGame));
var PracticeGame = (function (_super) {
    __extends(PracticeGame, _super);
    function PracticeGame() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PracticeGame.prototype.createGameArea = function () {
        this.backWall(ObjectPos.Left, false);
    };
    PracticeGame.prototype.createPlayers = function () {
        this.addBat(ObjectPos.Left, 16, false);
    };
    PracticeGame.prototype.serve = function (side) {
        _super.prototype.serve.call(this, ObjectPos.Right);
        this.ball.x = this.game.width * 75 / 100;
    };
    PracticeGame.prototype.getWinner = function () {
        return 0;
    };
    return PracticeGame;
}(AbstractGame));
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
        this.addBat(ObjectPos.Left, 5, false);
        this.addBat(ObjectPos.Left, 70, false);
        this.addBat(ObjectPos.Right, 5, true);
        this.addBat(ObjectPos.Right, 75, true);
    };
    return SoccerGame;
}(AbstractGame));
var TennisGame = (function (_super) {
    __extends(TennisGame, _super);
    function TennisGame() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TennisGame.prototype.createGameArea = function () {
        this.centreLine();
    };
    TennisGame.prototype.createPlayers = function () {
        this.addBat(ObjectPos.Left, 5, false);
        this.addBat(ObjectPos.Right, 5, true);
    };
    return TennisGame;
}(AbstractGame));
window.onload = function () {
    var game = new PongGame();
};
var PongGame = (function (_super) {
    __extends(PongGame, _super);
    function PongGame() {
        var _this = _super.call(this, 960, 640, Phaser.AUTO, "") || this;
        _this.state.add("Preload", new PreloadState());
        _this.state.add("0", new TennisGame());
        _this.state.add("1", new SoccerGame());
        _this.state.add("2", new SquashGame());
        _this.state.add("3", new PracticeGame());
        _this.currentGame = 0;
        _this.state.start("Preload");
        return _this;
    }
    PongGame.prototype.nextGame = function () {
        this.currentGame = (this.currentGame + 1) % 4;
        this.state.start(this.currentGame.toString());
    };
    PongGame.prototype.restartGame = function () {
        this.state.start(this.currentGame.toString());
    };
    return PongGame;
}(Phaser.Game));
var PreloadState = (function (_super) {
    __extends(PreloadState, _super);
    function PreloadState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreloadState.prototype.preload = function () {
        var _this = this;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        for (var _i = 0, _a = ["short", "medium", "long"]; _i < _a.length; _i++) {
            var sound = _a[_i];
            this.game.load.audio(sound, ["assets/sounds/" + sound + ".mp3", "assets/sounds/" + sound + ".ogg"]);
        }
        for (var n = 0; n <= 9; n++) {
            this.game.load.image(n.toString(), "assets/sprites/" + n.toString() + ".png");
        }
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("0"); }, this);
    };
    return PreloadState;
}(Phaser.State));
var Score = (function (_super) {
    __extends(Score, _super);
    function Score(game, x, y, w, h) {
        var _this = _super.call(this, game) || this;
        _this.position.setTo(x, y);
        game.add.existing(_this);
        for (var digit = 0; digit < 2; digit++) {
            var s = new Phaser.Sprite(game, 0, 0, (digit + 8).toString());
            s.anchor.setTo(0.5, 0.5);
            s.x = ((digit == 0) ? -1 : 1) * w * 0.6;
            s.height = h;
            s.width = w;
            _this.add(s, true, digit);
        }
        _this.setValue(0);
        return _this;
    }
    Score.prototype.getValue = function () { return this.value; };
    Score.prototype.setValue = function (n) {
        var s = this.children[0];
        s.visible = (n >= 10);
        s.loadTexture(Math.floor(n / 10).toString());
        this.children[1].loadTexture((n % 10).toString());
        this.value = n;
    };
    return Score;
}(Phaser.Group));
