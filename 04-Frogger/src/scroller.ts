/// <reference path="../lib/phaser.comments.d.ts"/>

/**
 * A scroller is a phaser group consisting of all the objects in one river row
 * or road row.
 * 
 * @class Scroller
 * @extends {Phaser.Group}
 */
abstract class Scroller extends Phaser.Group {

    protected rheight:number;
    private velocity:number;
    private currentScroll:number;
    private xSize:number;

    constructor(game:Phaser.Game,y:number,height:number,level:number,velocity:number) {
        // Create the group object
        super(game);
        this.position.setTo(0,y);
        game.add.existing(this);
        // This is the height of the things in the rows, allow a little spacing.
        this.rheight = height * 0.7;
        // Adjust level so it starts at 1 and goes in 10% steps.
        level = (level - 1) * 0.1 + 1;
        // Speed it moves at.
        this.velocity = velocity * level * 3;
        // Now create a row of them with spacing.
        var x:number = 0;
        // Fill row with overflow
        while (x < this.game.width*5/4) {
            // Create object
            var s:ScrollerObject = this.objectFactory(x,level);
            this.add(s);
            // Work out next right position. Note abs() for width sign.
            x = x + Math.abs(s.width) + this.getSpacing(level);
            // Flip if going the other way.
            if (this.velocity < 0) {
                s.scale.x = -s.scale.x;
            }
        }
        // How wide the whole lot is.
        this.xSize = x;
        // Reset scroll position to zero.
        this.currentScroll = 0;
        // Scroll whole thing partly in so looks mixed up.
        this.scrollTo(32);
    }

    abstract objectFactory(x:number,level:number): ScrollerObject;
    abstract getSpacing(level:number) : number;

    /**
     * Scroll this roll to a particular position.
     * 
     * @param {number} scroll
     * 
     * @memberOf Scroller
     */
    scrollTo(scroll:number) {
        this.forEachAlive((obj:ScrollerObject,offset:number) => {
            // Adjust it
            obj.x = obj.x + offset;
            // Wrap around.
            if (this.velocity > 0 && obj.x + obj.width < 0) {
                obj.x = obj.x + this.xSize;
            }
            if (this.velocity < 0 && obj.x > this.game.width) {
                obj.x = obj.x - this.xSize;
            }
            
        },this,this.currentScroll-scroll);
        this.currentScroll = scroll;
    }

    /**
     * Move objects on update.
     * 
     * 
     * @memberOf Scroller
     */
    update(): void {
        this.scrollTo(this.currentScroll+this.velocity*this.game.time.elapsed / 1000);
    }
}

/**
 * This one implements the road graphics
 * 
 * @class RoadScroller
 * @extends {Scroller}
 */
class RoadScroller extends Scroller {

    objectFactory(x:number,level:number): ScrollerObject {
        return new ScrollerObject(this.game,"car1,car2,car3,car4,car5",x,this.rheight);
    }

    getSpacing(level:number) : number {
        var n:number = this.game.rnd.between(15,40/level);
        return this.game.width * n / 100;
    }
}

/**
 * River Scroller - sometimes creates a TurtleScrollerObject which is animated
 * to "swim"
 * 
 * @class RiverScroller
 * @extends {Scroller}
 */
class RiverScroller extends Scroller {

    objectFactory(x:number,level:number): ScrollerObject {
        if (this.game.rnd.between(0,100/level) < 10) {
            return new TurtleScrollerObject(this.game,x,this.rheight);
        }
        return new RideableScrollerObject(this.game,"log1,log2,log3,log1",x,this.rheight);
    }

    getSpacing(level:number) : number {
        var n:number = this.game.rnd.between(5*level,35*level);
        return this.game.width * n / 100;
    }
}

/**
 * Standard scroller object, picks one of the sprites
 * 
 * @class ScrollerObject
 * @extends {Phaser.Sprite}
 */
class ScrollerObject extends Phaser.Sprite {

    constructor(game:Phaser.Game,spriteList:string,x:number,height:number) {
        var sprites:string[] = spriteList.split(",");
        super(game,x,0,"sprites",sprites[game.rnd.between(0,sprites.length-1)]);
        game.add.existing(this);
        this.anchor.setTo(0.5,0.5);
        this.x = this.x + this.width / 2;
        var scale:number = height / this.height;
        this.scale.setTo(scale,scale);
    }

    isFatal() : boolean { return true;}
    isRideable(): boolean { return false; }
}

/**
 * Scroll object you can ride (logs)
 * 
 * @class RideableScrollerObject
 * @extends {ScrollerObject}
 */

class RideableScrollerObject extends ScrollerObject {
    isFatal() : boolean { return false;}
    isRideable(): boolean { return true; }    
}

/**
 * Special turtle scroller object.
 * 
 * @class TurtleScrollerObject
 * @extends {ScrollerObject}
 */
class TurtleScrollerObject extends ScrollerObject {
    constructor (game:Phaser.Game,x:number,height:number) {
        super(game,"turtle21,turtle31",x,height);
        var tName = "turtle"+this.game.rnd.between(2,3).toString();
        var anim:string[] = [];
        for (var n = 1;n <= 9;n++) {
            var f = (n <= 5) ? n : 10-n;
            anim.push(tName+f.toString());
        }
        this.animations.add("swim",anim,this.game.rnd.between(40,60)/100,true,true);
        this.animations.play("swim");
        this.animations.currentAnim.setFrame(this.game.rnd.between(0,8));
    }

    isFatal() : boolean { 
        return (this.animations.currentFrame.index == 5); 
    }

    isRideable(): boolean { return !this.isFatal();; }    
}
