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
    this.snake = snake;
    this.mob = ITEM_EMPTY;
};

MapPixel.prototype.setMob = function(mob) {
    this.snake = ITEM_EMPTY;
    this.mob = mob;
};
