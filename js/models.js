var ITEM_MAP_EMPTY = -1;
var ITEM_EMPTY = 0;

function Position(x, y) {
    this.x = x;
    this.y = y;
}

function Pixel(x, y, item) {
    this.position = new Position(0, 0);
    this.item = item;
}

/**
* Map item from map matrix
**/
function MapPixel(map) {
    this.snake = ITEM_EMPTY;
    this.mob = ITEM_EMPTY;
    this.map = map;
}

MapPixel.prototype.setSnake = function(snake_id) {
    this.snake = snake_id;
    this.mob = ITEM_EMPTY;
};

MapPixel.prototype.setMob = function(mob) {
    this.snake = ITEM_EMPTY;
    this.mob = mob;
};

/**
* Screen item from screen matrix
**/
function ScreenPixel(x, y) {
    this.position = new Position(x, y);
    this.map_off = true;
    this.direction = ITEM_MAP_EMPTY;
    this.map = ITEM_MAP_EMPTY;
    this.mob = ITEM_EMPTY;
}
