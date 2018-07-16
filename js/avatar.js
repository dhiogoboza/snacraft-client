var SNAKE_SIZE = 8;
var ITEMS = 10;

var items, snake_size;

var current_avatar_index = 0;
var max_avatar_index;
var initial_av_index;
var avatars = [];

var avatar_ctx;
var avatar_canvas;

function debug(c, x, y, s) {
    ctx.drawImage(c, x, y, s, s);
}

function createAvatars() {
    initial_av_index = TILES.length;
    console.log(initial_av_index)
    current_avatar_index = initial_av_index;

    var s = item_size / 8;
    var w = item_size + (s);
    var h = item_size + (s);

    var s18 = item_size / 8;
    var s28 = 2 * s18;

    for (var i = 0; i < colors.length; i++) {
        canvas = document.createElement("canvas");
        canvas.height = item_size;
        canvas.width = item_size;

        dctx = canvas.getContext("2d");
        dctx.fillStyle = grid_color;
        dctx.fillRect(0, 0, item_size, item_size);

        dctx.fillStyle = TILES[0]["i"];
        dctx.fillRect(0, 0, item_size_1, item_size_1);

        x = -(s18);
        y = -(s18);

        w = item_size_1 + s28;
        h = item_size_1 + s28;

        var canvas_avatar = document.createElement("canvas");
        canvas_avatar.height = item_size;
        canvas_avatar.width = item_size;

        // set head
        colors[i][1] = heads[colors[i][1]];

        var dctx_avatar = canvas_avatar.getContext("2d");
        if (colors[i][2] == "rect") {
            drawCircle(dctx_avatar, s18, colors[i][3], colors[i][4], colors[i][5], false);
        } else if (colors[i][2] == "bow") {
            drawCircle(dctx_avatar, s18, colors[i][3], colors[i][4], colors[i][4], false);

            var m = s18 / 2;
            var s38 = 3 * s18;
            var s48 = 4 * s18;
            var s58 = 5 * s18;
            var s68 = 6 * s18;
            var s78 = 7 * s18;
            var s88 = 8 * s18;

            var x_bow = s28;
            var y_bow = h - s48;
            dctx_avatar.fillStyle = colors[i][5];
            for (var j = 0; j < 3; j++) {
                //dctx_avatar.fillRect(s28, h - s48, s18, s18);
                dctx_avatar.fillRect(x_bow, y_bow, s18, s18);
                x_bow += m;
                y_bow -= 2 * m;
            }
            
            for (var j = 0; j < 3; j++) {
                //dctx_avatar.fillRect(s28, h - s48, s18, s18);
                dctx_avatar.fillRect(x_bow, y_bow, s18, s18);
                x_bow += 2 * m;
                y_bow -= m;
            }

            dctx_avatar.strokeStyle = colors[i][6];
            dctx_avatar.beginPath();
            dctx_avatar.moveTo(s28 + m, h - s38);
            dctx_avatar.lineTo(w - s38, s28);
            dctx_avatar.stroke();

            dctx.drawImage(canvas_avatar, x, y, w, h);
        }

        // draw avatar at base avatar canvas
        dctx.drawImage(canvas_avatar, x, y, w, h);

        TILES[initial_av_index + i] = {item: canvas, off: false, image: true};

        if (colors[i][0] === "Zombie") {
            ZOMBIE_INDEX = TILES.length - 1;
            ZOMBIE_SHIRT = ZOMBIE_INDEX + 1;
            ZOMBIE_PANT = ZOMBIE_SHIRT + 1;
            
            console.log(ZOMBIE_INDEX)
        } else if (colors[i][0] === "Skeleton") {
            SKELETON_INDEX = TILES.length - 1;
            SKELETON_BOW = SKELETON_INDEX + 1;
        } else if (i == 4) {
            max_avatar_index = TILES.length;
        }
    }
}

function drawAvatar(a_index) {
    var item_size = 33;
    var s = item_size / 8;
    var avatar = TILES[a_index];

    head_canvas = colors[a_index - initial_av_index][1];

    x = s;
    var start = parseInt((items - snake_size) / 2);
    var end = snake_size + start;
    for (i = 0; i < end; i++) {
        if (i >= start) {
            avatar_ctx.drawImage(avatar["item"], x, s * 2, item_size, item_size);

            if (i == end  - 1) {
                avatar_ctx.drawImage(head_canvas["right"], x, s * 2, item_size, item_size);
            }
        }

        x += item_size;
    }
}

function changeAvatar(event) {
    if (event.currentTarget.className === "mn-button arrow-right") {
        current_avatar_index++;

        if (current_avatar_index === max_avatar_index) {
            current_avatar_index = initial_av_index;
        }
    } else {
        current_avatar_index--;

        if (current_avatar_index === initial_av_index - 1) {
            current_avatar_index = max_avatar_index - 1;
        }
    }

    drawAvatar(current_avatar_index);
}

function initAvatarChooser() {
    var item_size = 33;

    avatar_ctx = avatar_canvas.getContext("2d");

    var s = 0.2 * item_size;

    if (smallScreen) {
        items = ITEMS - 4;
    } else {
        items = ITEMS;
    }
    snake_size = items - 2;

    var width = items * item_size + 2 * s;

    avatar_canvas.height = 1.0 * item_size + 2 * s;
    avatar_canvas.width = width;

    avatar_ctx.fillStyle = TILES[0]["i"];
    avatar_ctx.fillRect(0, 0, avatar_canvas.width, avatar_canvas.height);

    avatar_ctx.strokeStyle = grid_color;

    avatar_ctx.beginPath();
    avatar_ctx.moveTo(0, s);
    avatar_ctx.lineTo(avatar_canvas.width, s);
    avatar_ctx.stroke();

    avatar_ctx.beginPath();
    avatar_ctx.moveTo(0, s + item_size);
    avatar_ctx.lineTo(avatar_canvas.width, s + item_size);
    avatar_ctx.stroke();

    x = s;
    for (i = 0; i < items; i++) {
        avatar_ctx.beginPath();
        avatar_ctx.moveTo(x, 0);
        avatar_ctx.lineTo(x, avatar_canvas.height);
        avatar_ctx.stroke();

        x += item_size;
    }

    createAvatars();
    drawAvatar(current_avatar_index);

    document.getElementById("avatar-arrow-left").addEventListener("click", changeAvatar);
    document.getElementById("avatar-arrow-right").addEventListener("click", changeAvatar);
}
