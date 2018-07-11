function createCanvas(width, height, src) {
    var c = document.createElement("canvas");
    c.width = width;
    c.height = height;

    if (src !== undefined) {
        var ctx = c.getContext("2d");
        ctx.drawImage(src, 0, 0, width, height);
    }

    return c;
}

function createCrown(width, height, direction) {
    var crown = createCanvas(item_size, item_size);
    var crown_ctx = crown.getContext("2d");
    var s18 = item_size_1 / 8;
    var c_height = item_size_1 / 3;
    var st = s18 / 2;

    crown_ctx.fillStyle = "#DDC436";
    switch(direction) {
        case DIRECTION_DOWN:
            crown_ctx.fillRect(0, 0, item_size_1, c_height);
            crown_ctx.fillStyle = "#CAB43A";
            for (var cr = 0; cr < 4; cr++) {
                crown_ctx.fillRect(st + cr * 2 * s18, c_height, s18, s18);
            }

            crown_ctx.fillStyle = "#DDC436";
            crown_ctx.fillRect(st + 3 * s18, c_height, s18, 2 * s18);
            break;
        case DIRECTION_UP:
            crown_ctx.fillRect(0, height - c_height, item_size_1, c_height);
            crown_ctx.fillStyle = "#CAB43A";
            for (var cr = 0; cr < 4; cr++) {
                crown_ctx.fillRect(st + cr * 2 * s18, height - c_height - s18, s18, s18);
            }

            crown_ctx.fillStyle = "#DDC436";
            crown_ctx.fillRect(st + 3 * s18, height - c_height - (2 * s18), s18, 2 * s18);
            break;
        case DIRECTION_RIGHT:
            crown_ctx.fillRect(0, 0, c_height, item_size_1);
            crown_ctx.fillStyle = "#CAB43A";
            for (var cr = 0; cr < 4; cr++) {
                crown_ctx.fillRect(c_height, st + cr * 2 * s18, s18, s18);
            }

            crown_ctx.fillStyle = "#DDC436";
            crown_ctx.fillRect(c_height, st + 3 * s18, 2 * s18, s18);
            break;
        case DIRECTION_LEFT:
            crown_ctx.fillRect(width - c_height, 0, c_height, item_size_1);
            crown_ctx.fillStyle = "#CAB43A";
            for (var cr = 0; cr < 4; cr++) {
                crown_ctx.fillRect(width - c_height - s18, st + cr * 2 * s18, s18, s18);
            }

            crown_ctx.fillStyle = "#DDC436";
            crown_ctx.fillRect(width - c_height - (2 * s18), st + 3 * s18, 2 * s18, s18);
            break;
    }

    return crown;
}
