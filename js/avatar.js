var SNAKE_SIZE = 6;
var ITEMS = 10;

var current_avatar_index = 0;
var initial_av_index;
var avatars = [];

function createAvatars() {
    initial_av_index = TILES.length;
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
        
        dctx.fillStyle = TILES[0]["item"];
        dctx.fillRect(0, 0, item_size_1, item_size_1);
        
        x = -(s18);
        y = -(s18);
        
        w = item_size_1 + s28;
        h = item_size_1 + s28;
        
        var canvas_snake = document.createElement("canvas");
        canvas_snake.height = item_size;
        canvas_snake.width = item_size;
        
        var dctx_snake = canvas_snake.getContext("2d");
        drawCircle(dctx_snake, s18, colors[i][2], colors[i][3], colors[i][4], false);
        
        dctx.drawImage(canvas_snake, x, y, w, h);
        
        TILES[initial_av_index + i] = {item: canvas, off: false, image: true};
    }
}

function drawAvatar(a_index) {
    var s = item_size / 8;
    var avatar = TILES[a_index];
    
    head_canvas = colors[a_index - initial_av_index][1] == "#FFFFFF" ? head_white : head_black;
    
    x = s;
    var start = window.innerWidth < SMALL_SCREEN? 0 : 1;
    var end = window.innerWidth < SMALL_SCREEN? 6 : 7;
    for (i = 0; i < end; i++) {
        if (i > start) {
            avatar_ctx.drawImage(avatar["item"], x, s * 2, item_size, item_size);
            
            if (i == end  - 1) {
                avatar_ctx.drawImage(head_canvas["right"], x, s * 2, item_size, item_size);
            }
        }
        
        x += item_size;
    }
}

function changeAvatar(event) {
    if (event.currentTarget.className === "fa fa-arrow-right") {
        current_avatar_index++;
        
        if (current_avatar_index == TILES.length) {
            current_avatar_index = initial_av_index;
        }
    } else {
        current_avatar_index--;
        
        if (current_avatar_index == initial_av_index - 1) {
            current_avatar_index = TILES.length - 1;
        }
    }
    
    drawAvatar(current_avatar_index);
}

function initAvatarChooser() {
    var s = 0.2 * item_size;
    
    if (window.innerWidth < SMALL_SCREEN) {
        ITEMS -= 2;
    }
    
    var width = (window.innerWidth < SMALL_SCREEN? ITEMS - 1 : ITEMS) * item_size + 2 * s;;
    
    avatar_canvas.height = 1.0 * item_size + 2 * s;
    avatar_canvas.width = width;
    
    avatar_ctx.fillStyle = TILES[0].item;
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
    var end = window.innerWidth < SMALL_SCREEN? 8 : 9;
    for (i = 0; i < end; i++) {
        avatar_ctx.beginPath();
        avatar_ctx.moveTo(x, 0);
        avatar_ctx.lineTo(x, avatar_canvas.height);
        avatar_ctx.stroke();
        
        x += item_size;
    }
    
    createAvatars();
    drawAvatar(current_avatar_index);
    
    $(".fa-arrow-left, .fa-arrow-right").on("click", changeAvatar);
}
