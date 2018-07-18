var ITEM_MAP_EMPTY = -1;
var ITEM_MOB_EMPTY = 0;

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
