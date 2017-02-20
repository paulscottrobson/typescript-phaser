/// <reference path="../lib/phaser.comments.d.ts"/>

class GameState extends Phaser.State {

    private sfx:SoundCollection;

    private static RIVER_ROWS:number = 5;
    private static ROAD_ROWS:number = 5;
    private static GAME_ROWS:number = GameState.ROAD_ROWS+GameState.RIVER_ROWS+5;
    private rowSize:number;
    private level:number;
    private scrollers:Scroller[];

    init(level:number): void {
        this.level = level;
    }

    create() : void {
        // Load the sounds.
        this.sfx = PreloadState.getSounds(this);
        // Calculate row size
        this.rowSize = this.game.height / GameState.GAME_ROWS;
        // Add water area
        this.game.add.tileSprite(0,0,this.game.width,this.rowSize*(3+GameState.RIVER_ROWS),"sprites","water");
        // Add the two paths and the home area
        this.createPath("path",GameState.GAME_ROWS-1,false);
        this.createPath("path",GameState.GAME_ROWS-1-GameState.ROAD_ROWS-1,false);
        this.createPath("home",2,true);
        // Create the 'traffic'
        this.scrollers = [];
        for (var row = 1;row <= GameState.RIVER_ROWS;row++) {
            var n:number = row + 2;
            var velocity:number = (10+(GameState.RIVER_ROWS-row)*5) * ((row % 2 == 0) ? 1 : -1);
            this.scrollers[n] = new RiverScroller(this.game,this.rowSize*n+this.rowSize/2,this.rowSize,this.level,velocity);
        }
        for (var row = 1;row <= GameState.ROAD_ROWS;row++) {
            var n:number = row + 3 + GameState.RIVER_ROWS;
            var velocity:number = (10+(GameState.RIVER_ROWS-row)*5) * ((row % 2 == 0) ? 1 : -1);
            this.scrollers[n] = new RoadScroller(this.game,this.rowSize*n+this.rowSize/2,this.rowSize,this.level,velocity);
        }
    }

    destroy() {
        this.sfx = null;
    }

    update() {
    }

    
    /**
     * Create a solid line of a tile. The 'home' positions take up 1.5 rows rather than
     * one row, which go up into the previos row.
     * 
     * @param {string} tile to use
     * @param {number} rowY horizontal position
     * @param {boolean} isHome is the 'home' line.
     * 
     * @memberOf GameState
     */
    createPath(tile:string,rowY:number,isHome:boolean): void {
        // Calculate vertical position
        var y:number = rowY * this.rowSize
        // Adjust half a row up for home.
        if (isHome) { y = y - this.rowSize / 2; }
        // Need this image to be able to rescale the tile.
        var image:Phaser.Image = new Phaser.Image(this.game,0,0,"sprites",tile);
        var tspr:Phaser.TileSprite;
        // Create the tiled sprite.
        tspr = new Phaser.TileSprite(this.game,0,y,this.game.width,
                                     isHome ? this.rowSize*3/2:this.rowSize,"sprites",tile);
        this.game.add.existing(tspr);
        // Scale the tile so one instance fills the row height.
        tspr.tileScale.x = tspr.tileScale.y = this.rowSize / image.height;
        // Fixed up differently for the home slots.
        if (isHome) {
            tspr.tileScale.x = this.game.width / image.width / 5;
            tspr.x = - this.game.width * 0.15;
            tspr.width = this.game.width - tspr.x;
            tspr.tileScale.y = this.rowSize * 3 / 2 / image.height;            
        }
        // We don't need this image any more.
        image.destroy();
    }
    /**
     * Retrieve a sound instance.
     * 
     * @param {string} key
     * @returns {Phaser.Sound}
     * 
     * @memberOf GameState
     */
    getSound(key:string) : Phaser.Sound {
        return this.sfx[key];
    }
}
