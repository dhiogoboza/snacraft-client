var ITEM_MAP_EMPTY = -1;
var ITEM_MOB_EMPTY = 0;
var ITEM_EMPTY = 0;

/**
* Map item from map matrix
**/
function MapPixel(map) {
    this.snake = ITEM_EMPTY;
    this.mob = ITEM_EMPTY;
    this.map = map;
}

MapPixel.prototype.setSnake = function(snake) {
    //this.snake = snake;
    //this.mob = ITEM_EMPTY;
    this.mob = snake;
};

MapPixel.prototype.setMob = function(mob) {
    //this.snake = ITEM_EMPTY;
    this.mob = mob;
};

/**
* Screen item from screen matrix
**/
function ScreenPixel(x, y) {
    this.x = x;
    this.y = y;
    this.map_off = true;
    this.map = ITEM_MAP_EMPTY;
    this.mob = ITEM_MOB_EMPTY;
}
