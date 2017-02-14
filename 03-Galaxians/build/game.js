var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EnemyState;
(function (EnemyState) {
    EnemyState[EnemyState["InFormation"] = 0] = "InFormation";
    EnemyState[EnemyState["InFlight"] = 1] = "InFlight";
    EnemyState[EnemyState["Repositioning"] = 2] = "Repositioning";
})(EnemyState || (EnemyState = {}));
var BaseEnemy = (function (_super) {
    __extends(BaseEnemy, _super);
    function BaseEnemy(game, owner, x, y, baseImage) {
        var _this = _super.call(this, game, 0, 0, "sprites", "ship") || this;
        game.add.existing(_this);
        game.physics.arcade.enable(_this);
        _this.anchor.setTo(0.5, 0.5);
        _this.animations.add("normal", [baseImage + "1", baseImage + "2"], 5, true);
        _this.animations.play("normal");
        _this.xCell = x;
        _this.yCell = y;
        _this.width = BaseEnemy.WIDTH;
        _this.height = BaseEnemy.HEIGHT;
        _this.state = EnemyState.InFormation;
        _this.owner = owner;
        return _this;
    }
    BaseEnemy.prototype.update = function () {
        var xStart = this.owner.getX() + this.xCell * (BaseEnemy.WIDTH + BaseEnemy.SPACING);
        var yStart = this.owner.getY() + this.yCell * (BaseEnemy.HEIGHT + BaseEnemy.SPACING);
        xStart = xStart + ((this.xCell > 0) ? -1 : 1) * (BaseEnemy.WIDTH + BaseEnemy.SPACING) / 2;
        if (this.state == EnemyState.Repositioning) {
            if (Math.abs(this.x - xStart) + Math.abs(this.y - yStart) > 2) {
                this.game.physics.arcade.moveToXY(this, xStart, yStart);
            }
            else {
                this.state = EnemyState.InFormation;
            }
        }
        if (this.state == EnemyState.InFormation) {
            this.position.setTo(xStart, yStart);
        }
    };
    BaseEnemy.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.owner = null;
    };
    BaseEnemy.prototype.getScoreInFlight = function () {
        return this.getScoreInFormation() * 2;
    };
    BaseEnemy.prototype.getScoreInFormation = function () {
        return 50;
    };
    return BaseEnemy;
}(Phaser.Sprite));
BaseEnemy.WIDTH = 32;
BaseEnemy.HEIGHT = 24;
BaseEnemy.SPACING = 10;
var Alien1 = (function (_super) {
    __extends(Alien1, _super);
    function Alien1(game, owner, x, y) {
        return _super.call(this, game, owner, x, y, "alien1") || this;
    }
    return Alien1;
}(BaseEnemy));
var Alien2 = (function (_super) {
    __extends(Alien2, _super);
    function Alien2(game, owner, x, y) {
        return _super.call(this, game, owner, x, y, "alien2") || this;
    }
    return Alien2;
}(BaseEnemy));
var Alien3 = (function (_super) {
    __extends(Alien3, _super);
    function Alien3(game, owner, x, y) {
        return _super.call(this, game, owner, x, y, "alien3") || this;
    }
    return Alien3;
}(BaseEnemy));
var Alien4 = (function (_super) {
    __extends(Alien4, _super);
    function Alien4(game, owner, x, y) {
        return _super.call(this, game, owner, x, y, "alien4") || this;
    }
    return Alien4;
}(BaseEnemy));
window.onload = function () {
    var game = new GalaxiansGame();
};
var GalaxiansGame = (function (_super) {
    __extends(GalaxiansGame, _super);
    function GalaxiansGame() {
        var _this = _super.call(this, 640, 960, Phaser.AUTO, "", null, false, false) || this;
        _this.state.add("Preload", new PreloadState());
        _this.state.add("Test", new TestState());
        _this.state.start("Preload");
        return _this;
    }
    return GalaxiansGame;
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
        this.game.load.atlas("sprites", "assets/sprites/sprites.png", "assets/sprites/sprites.json");
        this.game.load.bitmapFont("font", "assets/fonts/font.png", "assets/fonts/font.fnt");
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Test"); }, this);
    };
    return PreloadState;
}(Phaser.State));
var TestState = (function (_super) {
    __extends(TestState, _super);
    function TestState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestState.prototype.create = function () {
        var s;
        for (var i = 0; i < 50; i++) {
            new FlashingStar(this.game);
        }
        new WaveManager(this.game, this.game.width / 2, 100);
    };
    return TestState;
}(Phaser.State));
var WaveManager = (function (_super) {
    __extends(WaveManager, _super);
    function WaveManager(game, x, y) {
        var _this = _super.call(this, game, x, y, "sprites", "cross") || this;
        game.add.existing(_this);
        _this.position.setTo(x, y);
        _this.anchor.setTo(0.5, 0.5);
        _this.enemies = new Phaser.Group(game);
        _this.createWave();
        return _this;
    }
    WaveManager.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.enemies = null;
    };
    WaveManager.prototype.createWave = function () {
        this.enemies.add(new Alien4(this.game, this, -2, 0));
        this.enemies.add(new Alien4(this.game, this, 2, 0));
        for (var n = -5; n <= 5; n++) {
            if (n != 0) {
                if (Math.abs(n) <= 3) {
                    this.enemies.add(new Alien3(this.game, this, n, 1));
                }
                if (Math.abs(n) <= 4) {
                    this.enemies.add(new Alien2(this.game, this, n, 2));
                }
                this.enemies.add(new Alien1(this.game, this, n, 3));
                this.enemies.add(new Alien1(this.game, this, n, 4));
                this.enemies.add(new Alien1(this.game, this, n, 5));
            }
        }
    };
    WaveManager.prototype.getX = function () { return this.x; };
    WaveManager.prototype.getY = function () { return this.y; };
    return WaveManager;
}(Phaser.Sprite));
var FlashingStar = (function (_super) {
    __extends(FlashingStar, _super);
    function FlashingStar(game) {
        var _this = _super.call(this, game, game.rnd.between(0, game.width), game.rnd.between(0, game.height), "sprites", "dot") || this;
        game.add.existing(_this);
        _this.width = _this.height = game.width / 120;
        _this.velocity = _this.game.rnd.between(20, 80);
        return _this;
    }
    FlashingStar.prototype.update = function () {
        this.y = (this.y + this.game.time.elapsed / 1000 * this.velocity) % this.game.height;
        if (this.game.rnd.between(0, 4) == 0) {
            this.tint = this.game.rnd.integer();
        }
    };
    return FlashingStar;
}(Phaser.Sprite));
