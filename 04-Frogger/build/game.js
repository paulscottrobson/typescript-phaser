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
    GameState.prototype.create = function () {
        this.sfx = PreloadState.getSounds(this);
        this.rowSize = this.game.height / GameState.GAME_ROWS;
        this.game.add.tileSprite(0, 0, this.game.width, this.rowSize * (3 + GameState.RIVER_ROWS), "sprites", "water");
        this.createPath("path", GameState.GAME_ROWS - 1, false);
        this.createPath("path", GameState.GAME_ROWS - 1 - GameState.ROAD_ROWS - 1, false);
        this.createPath("home", 2, true);
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
PreloadState.sfxList = ["extra", "hop", "splash", "squash", "tune"];
