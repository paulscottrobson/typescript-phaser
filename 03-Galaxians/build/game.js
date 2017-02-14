var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
window.onload = function () {
    var game = new GalaxiansGame();
};
var GalaxiansGame = (function (_super) {
    __extends(GalaxiansGame, _super);
    function GalaxiansGame() {
        var _this = _super.call(this, 960, 640, Phaser.AUTO, "", null, false, false) || this;
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
        s = new Phaser.Sprite(this.game, 64, 64, "sprites", "ship");
        s.animations.add("test", ["alien31", "alien32"], 5, true);
        s.animations.play("test");
        this.game.add.existing(s);
        s.width = 256;
        s.height = 256;
        s = new Phaser.Sprite(this.game, 364, 64, "sprites", "ship");
        s.animations.add("test", ["alien21", "alien22"], 5, true);
        s.animations.play("test");
        this.game.add.existing(s);
        s.width = 256;
        s.height = 256;
    };
    return TestState;
}(Phaser.State));
