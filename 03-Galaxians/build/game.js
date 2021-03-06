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
        game.physics.arcade.enableBody(_this);
        _this.body.immovable = true;
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
        var xStart = this.owner.getX() + (this.xCell + 0.5) * (BaseEnemy.WIDTH + BaseEnemy.SPACING);
        var yStart = this.owner.getY() + this.yCell * (BaseEnemy.HEIGHT + BaseEnemy.SPACING);
        if (this.state == EnemyState.Repositioning) {
            if (Math.abs(this.x - xStart) + Math.abs(this.y - yStart) > 2) {
                this.game.physics.arcade.moveToXY(this, xStart, yStart, 100);
            }
            else {
                this.state = EnemyState.InFormation;
            }
        }
        if (this.state == EnemyState.InFormation) {
            this.position.setTo(xStart, yStart);
            if (xStart < BaseEnemy.WIDTH / 2) {
                this.owner.setDirection(1);
            }
            if (xStart > this.game.width - BaseEnemy.WIDTH / 2) {
                this.owner.setDirection(-1);
            }
        }
        if (this.state == EnemyState.InFlight) {
            if (this.x < BaseEnemy.WIDTH / 2) {
                this.body.velocity.x = Math.abs(this.body.velocity.x);
            }
            if (this.x > this.game.width - BaseEnemy.WIDTH / 2) {
                this.body.velocity.x = -Math.abs(this.body.velocity.x);
            }
            if (this.y > this.game.height) {
                this.x = xStart;
                this.y = -BaseEnemy.HEIGHT;
                this.state = EnemyState.Repositioning;
                this.angle = 0;
            }
        }
        if (this.state != EnemyState.Repositioning && this.owner.running) {
            var chance = this.game.time.elapsed * 120;
            if (this.state == EnemyState.InFlight) {
                chance = Math.max(1, Math.floor(chance / 40));
            }
            if (this.game.rnd.between(0, chance) == 0) {
                this.owner.fireMissile(this.x, this.y + BaseEnemy.HEIGHT / 2);
            }
        }
    };
    BaseEnemy.prototype.attack = function (onLeft) {
        var _this = this;
        if (this.state == EnemyState.InFormation) {
            this.state = EnemyState.InFlight;
            var newState = { "angle": onLeft ? "-180" : "+180", "y": "-50", "x": onLeft ? "-50" : "+50" };
            var t = this.game.add.tween(this).to(newState, 500, Phaser.Easing.Linear.None, true);
            t.onComplete.add(function () {
                _this.body.velocity.y = 300;
                _this.body.velocity.x = onLeft ? 300 : -300;
            }, this);
        }
    };
    BaseEnemy.prototype.attackIf = function (xc, yc, onLeft) {
        if (this.xCell == xc && this.yCell == yc) {
            this.attack(onLeft);
        }
    };
    BaseEnemy.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.owner = null;
    };
    BaseEnemy.prototype.getScore = function () {
        return (this.state == EnemyState.InFlight ? this.getScoreInFlight() :
            this.getScoreInFormation());
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
    Alien1.prototype.getScoreInFormation = function () {
        return 30;
    };
    return Alien1;
}(BaseEnemy));
var Alien2 = (function (_super) {
    __extends(Alien2, _super);
    function Alien2(game, owner, x, y) {
        return _super.call(this, game, owner, x, y, "alien2") || this;
    }
    Alien2.prototype.getScoreInFormation = function () {
        return 40;
    };
    return Alien2;
}(BaseEnemy));
var Alien3 = (function (_super) {
    __extends(Alien3, _super);
    function Alien3(game, owner, x, y) {
        return _super.call(this, game, owner, x, y, "alien3") || this;
    }
    Alien3.prototype.getScoreInFormation = function () {
        return 50;
    };
    return Alien3;
}(BaseEnemy));
var Alien4 = (function (_super) {
    __extends(Alien4, _super);
    function Alien4(game, owner, x, y) {
        return _super.call(this, game, owner, x, y, "alien4") || this;
    }
    Alien4.prototype.getScoreInFormation = function () {
        return 60;
    };
    Alien4.prototype.getScoreInFlight = function () {
        return 300;
    };
    return Alien4;
}(BaseEnemy));
var Explosion = (function (_super) {
    __extends(Explosion, _super);
    function Explosion(game, x, y) {
        var _this = _super.call(this, game, x, y, 300) || this;
        game.add.existing(_this);
        _this.makeParticles("sprites", "dot");
        _this.forEach(function (particle) {
            particle.tint = _this.game.rnd.between(0, 1) ? 0xFF0000 : 0xFFFF00;
        }, _this);
        _this.start(true, 300, 0, 100);
        _this.game.time.events.add(1000, function () { _this.destroy(); }, _this);
        return _this;
    }
    return Explosion;
}(Phaser.Particles.Arcade.Emitter));
var GameState = (function (_super) {
    __extends(GameState, _super);
    function GameState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameState.prototype.create = function () {
        var _this = this;
        var s;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        for (var i = 0; i < 50; i++) {
            new FlashingStar(this.game);
        }
        this.waveMgr = new WaveManager(this.game, this.game.width / 2, 120);
        this.score = new Score(this.game);
        this.ship = new Ship(this.game);
        this.lives = new Lives(this.game);
        this.sfx = PreloadState.getSounds(this);
        var btx = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2, "font", "Player One", 40);
        btx.anchor.setTo(0.5);
        btx.tint = 0xFF0000;
        this.game.time.events.add(2500, function () {
            _this.setAction(true);
            _this.sfx["loop"].play().loopFull().volume = 0.5;
            btx.destroy();
        }, this);
        this.sfx["start"].play();
    };
    GameState.prototype.setAction = function (state) {
        this.waveMgr.running = this.ship.running = state;
    };
    GameState.prototype.destroy = function () {
        this.sfx = this.waveMgr = this.score = this.ship = this.lives = null;
    };
    GameState.prototype.update = function () {
        this.game.physics.arcade.collide(this.waveMgr.enemies, this.ship.playerMissileGroup, this.shoot, null, this);
        this.game.physics.arcade.collide(this.ship, this.waveMgr.enemyMissiles, this.lostLife, null, this);
        this.game.physics.arcade.collide(this.ship, this.waveMgr.enemies, this.lostLife, null, this);
    };
    GameState.prototype.lostLife = function (ship, object) {
        var _this = this;
        if (ship.running) {
            this.sfx["death"].play();
            object.destroy();
            this.lives.removeLife();
            this.setAction(false);
            new Explosion(this.game, ship.x, ship.y);
            if (this.lives.getLives() > 0) {
                this.game.time.events.add(1000, function () { _this.setAction(true); }, this);
            }
            else {
                var t = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2, "font", "Game Over", 48);
                t.anchor.setTo(0.5);
                t.tint = 0xFF0000;
            }
        }
    };
    GameState.prototype.shoot = function (enemy, missile) {
        this.sfx["explosion"].play();
        var value = enemy.getScore();
        if (value >= 100) {
            new ShortTermDisplayScore(this.game, enemy.x + BaseEnemy.WIDTH / 2, enemy.y + BaseEnemy.HEIGHT / 2, value);
        }
        this.score.addPoints(value);
        new Explosion(this.game, enemy.x, enemy.y);
        enemy.destroy();
        missile.destroy();
        if (this.waveMgr.enemies.children.length == 0) {
            this.game.time.events.add(2000, this.waveMgr.createWave, this.waveMgr);
        }
    };
    return GameState;
}(Phaser.State));
var Lives = (function (_super) {
    __extends(Lives, _super);
    function Lives(game) {
        var _this = _super.call(this, game) || this;
        game.add.existing(_this);
        _this.lives = 0;
        while (_this.lives < 3) {
            _this.addLife();
        }
        return _this;
    }
    Lives.prototype.getLives = function () {
        return this.lives;
    };
    Lives.prototype.addLife = function () {
        var x = this.lives * 40 + 8;
        var s = new Phaser.Sprite(this.game, x, this.game.height - 8, "sprites", "lives");
        s.width = 32;
        s.height = 40;
        s.anchor.setTo(0, 1);
        this.game.add.existing(s);
        this.add(s, true, this.lives);
        this.lives++;
    };
    Lives.prototype.removeLife = function () {
        if (this.lives > 0) {
            this.lives--;
            this.children[this.lives].destroy();
        }
    };
    return Lives;
}(Phaser.Group));
window.onload = function () {
    var game = new GalaxiansGame();
};
var GalaxiansGame = (function (_super) {
    __extends(GalaxiansGame, _super);
    function GalaxiansGame() {
        var _this = _super.call(this, 640, 960, Phaser.AUTO, "", null, false, false) || this;
        _this.state.add("Preload", new PreloadState());
        _this.state.add("Main", new GameState());
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
        for (var _i = 0, _a = PreloadState.sfxList; _i < _a.length; _i++) {
            var sound = _a[_i];
            this.game.load.audio(sound, ["assets/sounds/" + sound + ".mp3", "assets/sounds/" + sound + ".ogg"]);
        }
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Main"); }, this);
    };
    PreloadState.getSounds = function (state) {
        var sounds = {};
        for (var _i = 0, _a = PreloadState.sfxList; _i < _a.length; _i++) {
            var sound = _a[_i];
            sounds[sound] = state.add.audio(sound);
        }
        return sounds;
    };
    return PreloadState;
}(Phaser.State));
PreloadState.sfxList = ["death", "explosion", "fire", "loop", "start", "swoop"];
var WaveManager = (function (_super) {
    __extends(WaveManager, _super);
    function WaveManager(game, x, y) {
        var _this = _super.call(this, game, x, y, "sprites", "cross") || this;
        game.add.existing(_this);
        _this.position.setTo(x, y);
        _this.anchor.setTo(0.5, 0.5);
        _this.visible = false;
        _this.enemies = new Phaser.Group(game);
        _this.enemyMissiles = new Phaser.Group(game);
        _this.direction = 1;
        _this.createWave();
        game.time.events.add(3000, _this.launch, _this);
        _this.running = false;
        return _this;
    }
    WaveManager.prototype.update = function () {
        this.x += this.direction * WaveManager.VELOCITY * this.game.time.elapsed / 1000;
        if (this.x < 0) {
            this.direction = 1;
        }
        if (this.x > this.game.width) {
            this.direction = -1;
        }
    };
    WaveManager.prototype.setDirection = function (newDir) {
        this.direction = newDir;
    };
    WaveManager.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.enemies = this.enemyMissiles = null;
    };
    WaveManager.prototype.launch = function () {
        if (this.enemies.children.length > 0 && this.running) {
            var n = this.game.rnd.between(0, this.enemies.children.length - 1);
            var xLaunch = this.enemies.children[n].xCell;
            var yLaunch = this.enemies.children[n].yCell;
            var onLeft = (xLaunch < 0);
            this.enemies.children[n].attack(onLeft);
            for (var _i = 0, _a = this.enemies.children; _i < _a.length; _i++) {
                var enemy = _a[_i];
                enemy.attackIf(xLaunch - 1, yLaunch + 1, onLeft);
                enemy.attackIf(xLaunch + 1, yLaunch + 1, onLeft);
            }
            (this.game.state.getCurrentState()).sfx["swoop"].play();
        }
        this.game.time.events.add(this.game.rnd.between(1500, 6000), this.launch, this);
    };
    WaveManager.prototype.createWave = function () {
        this.enemies.add(new Alien4(this.game, this, -2, 0));
        this.enemies.add(new Alien4(this.game, this, 1, 0));
        for (var n = -3; n <= 2; n++) {
            this.enemies.add(new Alien3(this.game, this, n, 1));
        }
        for (var n = -4; n <= 3; n++) {
            this.enemies.add(new Alien2(this.game, this, n, 2));
        }
        for (var n = -5; n <= 4; n++) {
            this.enemies.add(new Alien1(this.game, this, n, 3));
            this.enemies.add(new Alien1(this.game, this, n, 4));
            this.enemies.add(new Alien1(this.game, this, n, 5));
        }
    };
    WaveManager.prototype.fireMissile = function (x, y) {
        var m = new Missile(this.game, x, y, 500);
        this.enemyMissiles.add(m);
    };
    WaveManager.prototype.getX = function () { return this.x; };
    WaveManager.prototype.getY = function () { return this.y; };
    return WaveManager;
}(Phaser.Sprite));
WaveManager.VELOCITY = 20;
var Missile = (function (_super) {
    __extends(Missile, _super);
    function Missile(game, x, y, velocity) {
        var _this = _super.call(this, game, x, y, "sprites", "missile") || this;
        game.add.existing(_this);
        game.physics.arcade.enableBody(_this);
        _this.body.velocity.y = velocity;
        _this.body.immovable = true;
        return _this;
    }
    Missile.prototype.update = function () {
        if (this.y < 0 || this.y > this.game.height) {
            this.destroy();
        }
    };
    return Missile;
}(Phaser.Sprite));
var Score = (function (_super) {
    __extends(Score, _super);
    function Score(game) {
        var _this = _super.call(this, game) || this;
        var t;
        t = _this.add(game.add.bitmapText(game.width / 2, 20, "font", "1 UP", 40), true, 0);
        t.anchor.setTo(0.5);
        t = _this.add(game.add.bitmapText(game.width / 2, 60, "font", "?", 40), true, 1);
        t.anchor.setTo(0.5);
        t.tint = 0xFF0000;
        _this.updateScore(0);
        return _this;
    }
    Score.prototype.addPoints = function (points) {
        this.updateScore(this.score + points);
    };
    Score.prototype.updateScore = function (score) {
        this.score = score;
        var s = ("00000" + score.toString()).slice(-6);
        this.children[1].text = s;
    };
    return Score;
}(Phaser.Group));
var Ship = (function (_super) {
    __extends(Ship, _super);
    function Ship(game) {
        var _this = _super.call(this, game, game.width / 2, game.height - 64, "sprites", "ship") || this;
        _this.anchor.setTo(0.5);
        _this.width = Ship.WIDTH;
        _this.height = Ship.HEIGHT;
        _this.cursors = game.input.keyboard.createCursorKeys();
        game.add.existing(_this);
        game.physics.arcade.enableBody(_this);
        _this.body.drag.x = 250;
        _this.body.immovable = true;
        game.input.keyboard.addKey(Phaser.Keyboard.CONTROL).onDown.add(_this.fire, _this);
        _this.playerMissileGroup = new Phaser.Group(game);
        _this.running = false;
        return _this;
    }
    Ship.prototype.update = function () {
        if (this.cursors.right.isDown) {
            this.body.velocity.x = Math.min(250, this.body.velocity.x + this.game.time.elapsed);
        }
        if (this.cursors.left.isDown) {
            this.body.velocity.x = Math.max(-250, this.body.velocity.x - this.game.time.elapsed);
        }
        this.x = Math.max(0, Math.min(this.x, this.game.width));
    };
    Ship.prototype.fire = function () {
        if (this.playerMissileGroup.children.length == 0 && this.running) {
            this.playerMissileGroup.add(new Missile(this.game, this.x, this.y, -1400));
            (this.game.state.getCurrentState()).sfx["fire"].play();
        }
    };
    Ship.prototype.destroy = function () {
        this.playerMissileGroup.destroy();
        this.playerMissileGroup = this.cursors = null;
    };
    return Ship;
}(Phaser.Sprite));
Ship.WIDTH = 40;
Ship.HEIGHT = 48;
var ShortTermDisplayScore = (function (_super) {
    __extends(ShortTermDisplayScore, _super);
    function ShortTermDisplayScore(game, x, y, score) {
        var _this = _super.call(this, game, x, y, "font", score.toString(), 20) || this;
        game.add.existing(_this);
        _this.anchor.setTo(0.5);
        _this.position.setTo(x, y);
        var tw = _this.game.add.tween(_this).to({ "alpha": 0.0 }, 400, Phaser.Easing.Linear.None, true, 300);
        tw.onComplete.add(function () { _this.destroy(); }, _this);
        return _this;
    }
    ShortTermDisplayScore.prototype.update = function () {
        this.tint = this.game.rnd.integer();
    };
    return ShortTermDisplayScore;
}(Phaser.BitmapText));
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
