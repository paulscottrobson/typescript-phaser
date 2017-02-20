var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameState = (function (_super) {
    __extends(GameState, _super);
    function GameState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameState.prototype.init = function (level) {
        this.level = level;
    };
    GameState.prototype.create = function () {
        this.sfx = PreloadState.getSounds(this);
        this.rowSize = this.game.height / GameState.GAME_ROWS;
        this.game.add.tileSprite(0, 0, this.game.width, this.rowSize * (3 + GameState.RIVER_ROWS), "sprites", "water");
        this.createPath("path", GameState.GAME_ROWS - 1, false);
        this.createPath("path", GameState.GAME_ROWS - 1 - GameState.ROAD_ROWS - 1, false);
        this.createPath("home", 2, true);
        this.scrollers = [];
        for (var row = 1; row <= GameState.RIVER_ROWS; row++) {
            var n = row + 2;
            var velocity = (10 + (GameState.RIVER_ROWS - row) * 5) * ((row % 2 == 0) ? 1 : -1);
            this.scrollers[n] = new RiverScroller(this.game, this.rowSize * n + this.rowSize / 2, this.rowSize, this.level, velocity);
        }
        for (var row = 1; row <= GameState.ROAD_ROWS; row++) {
            var n = row + 3 + GameState.RIVER_ROWS;
            var velocity = (10 + (GameState.RIVER_ROWS - row) * 5) * ((row % 2 == 0) ? 1 : -1);
            this.scrollers[n] = new RoadScroller(this.game, this.rowSize * n + this.rowSize / 2, this.rowSize, this.level, velocity);
        }
    };
    GameState.prototype.destroy = function () {
        this.sfx = null;
    };
    GameState.prototype.update = function () {
    };
    GameState.prototype.createPath = function (tile, rowY, isHome) {
        var y = rowY * this.rowSize;
        if (isHome) {
            y = y - this.rowSize / 2;
        }
        var image = new Phaser.Image(this.game, 0, 0, "sprites", tile);
        var tspr;
        tspr = new Phaser.TileSprite(this.game, 0, y, this.game.width, isHome ? this.rowSize * 3 / 2 : this.rowSize, "sprites", tile);
        this.game.add.existing(tspr);
        tspr.tileScale.x = tspr.tileScale.y = this.rowSize / image.height;
        if (isHome) {
            tspr.tileScale.x = this.game.width / image.width / 5;
            tspr.x = -this.game.width * 0.15;
            tspr.width = this.game.width - tspr.x;
            tspr.tileScale.y = this.rowSize * 3 / 2 / image.height;
        }
        image.destroy();
    };
    GameState.prototype.getSound = function (key) {
        return this.sfx[key];
    };
    return GameState;
}(Phaser.State));
GameState.RIVER_ROWS = 5;
GameState.ROAD_ROWS = 5;
GameState.GAME_ROWS = GameState.ROAD_ROWS + GameState.RIVER_ROWS + 5;
window.onload = function () {
    var game = new FroggerGame();
};
var FroggerGame = (function (_super) {
    __extends(FroggerGame, _super);
    function FroggerGame() {
        var _this = _super.call(this, 640, 960, Phaser.AUTO, "", null, false, false) || this;
        _this.state.add("Preload", new PreloadState());
        _this.state.add("Main", new GameState());
        _this.state.start("Preload");
        return _this;
    }
    return FroggerGame;
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
        this.game.load.onLoadComplete.add(function () { _this.game.state.start("Main", true, false, 1); }, this);
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
PreloadState.sfxList = ["extra", "hop", "splash", "squash", "tune"];
var Scroller = (function (_super) {
    __extends(Scroller, _super);
    function Scroller(game, y, height, level, velocity) {
        var _this = _super.call(this, game) || this;
        _this.position.setTo(0, y);
        game.add.existing(_this);
        _this.rheight = height * 0.7;
        level = (level - 1) * 0.1 + 1;
        _this.velocity = velocity * level * 3;
        var x = 0;
        while (x < _this.game.width * 5 / 4) {
            var s = _this.objectFactory(x, level);
            _this.add(s);
            x = x + Math.abs(s.width) + _this.getSpacing(level);
            if (_this.velocity < 0) {
                s.scale.x = -s.scale.x;
            }
        }
        _this.xSize = x;
        _this.currentScroll = 0;
        _this.scrollTo(32);
        return _this;
    }
    Scroller.prototype.scrollTo = function (scroll) {
        var _this = this;
        this.forEachAlive(function (obj, offset) {
            obj.x = obj.x + offset;
            if (_this.velocity > 0 && obj.x + obj.width < 0) {
                obj.x = obj.x + _this.xSize;
            }
            if (_this.velocity < 0 && obj.x > _this.game.width) {
                obj.x = obj.x - _this.xSize;
            }
        }, this, this.currentScroll - scroll);
        this.currentScroll = scroll;
    };
    Scroller.prototype.update = function () {
        this.scrollTo(this.currentScroll + this.velocity * this.game.time.elapsed / 1000);
    };
    return Scroller;
}(Phaser.Group));
var RoadScroller = (function (_super) {
    __extends(RoadScroller, _super);
    function RoadScroller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RoadScroller.prototype.objectFactory = function (x, level) {
        return new ScrollerObject(this.game, "car1,car2,car3,car4,car5", x, this.rheight);
    };
    RoadScroller.prototype.getSpacing = function (level) {
        var n = this.game.rnd.between(15, 40 / level);
        return this.game.width * n / 100;
    };
    return RoadScroller;
}(Scroller));
var RiverScroller = (function (_super) {
    __extends(RiverScroller, _super);
    function RiverScroller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RiverScroller.prototype.objectFactory = function (x, level) {
        if (this.game.rnd.between(0, 100 / level) < 10) {
            return new TurtleScrollerObject(this.game, x, this.rheight);
        }
        return new RideableScrollerObject(this.game, "log1,log2,log3,log1", x, this.rheight);
    };
    RiverScroller.prototype.getSpacing = function (level) {
        var n = this.game.rnd.between(5 * level, 35 * level);
        return this.game.width * n / 100;
    };
    return RiverScroller;
}(Scroller));
var ScrollerObject = (function (_super) {
    __extends(ScrollerObject, _super);
    function ScrollerObject(game, spriteList, x, height) {
        var _this = this;
        var sprites = spriteList.split(",");
        _this = _super.call(this, game, x, 0, "sprites", sprites[game.rnd.between(0, sprites.length - 1)]) || this;
        game.add.existing(_this);
        _this.anchor.setTo(0.5, 0.5);
        _this.x = _this.x + _this.width / 2;
        var scale = height / _this.height;
        _this.scale.setTo(scale, scale);
        return _this;
    }
    ScrollerObject.prototype.isFatal = function () { return true; };
    ScrollerObject.prototype.isRideable = function () { return false; };
    return ScrollerObject;
}(Phaser.Sprite));
var RideableScrollerObject = (function (_super) {
    __extends(RideableScrollerObject, _super);
    function RideableScrollerObject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RideableScrollerObject.prototype.isFatal = function () { return false; };
    RideableScrollerObject.prototype.isRideable = function () { return true; };
    return RideableScrollerObject;
}(ScrollerObject));
var TurtleScrollerObject = (function (_super) {
    __extends(TurtleScrollerObject, _super);
    function TurtleScrollerObject(game, x, height) {
        var _this = _super.call(this, game, "turtle21,turtle31", x, height) || this;
        var tName = "turtle" + _this.game.rnd.between(2, 3).toString();
        var anim = [];
        for (var n = 1; n <= 9; n++) {
            var f = (n <= 5) ? n : 10 - n;
            anim.push(tName + f.toString());
        }
        _this.animations.add("swim", anim, _this.game.rnd.between(40, 60) / 100, true, true);
        _this.animations.play("swim");
        _this.animations.currentAnim.setFrame(_this.game.rnd.between(0, 8));
        return _this;
    }
    TurtleScrollerObject.prototype.isFatal = function () {
        return (this.animations.currentFrame.index == 5);
    };
    TurtleScrollerObject.prototype.isRideable = function () { return !this.isFatal(); ; };
    return TurtleScrollerObject;
}(ScrollerObject));
