var KEY_UP = 87;
var KEY_DOWN = 83;
var KEY_LEFT = 65;
var KEY_RIGHT = 68;
var KEY_UP_1 = 38;
var KEY_DOWN_1 = 40;
var KEY_LEFT_1 = 37;
var KEY_RIGHT_1 = 39;

var DIRECTION_DOWN = 0;
var DIRECTION_RIGHT = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_UP = 3;

var ZOMBIE_INDEX;
var ZOMBIE_SHIRT;
var ZOMBIE_PANT;

var SKELETON_INDEX;
var SKELETON_BOW;

var SMALL_SCREEN = 680;

var RANKING_SIZE = 8;
var rankingSize;

// flag to indicate that screen size changed in game
// and game matrix must be recalculated
var mustPrepare = false;

var smallScreen = false;

var FOCUS_OFFSET_PERCENTAGE = 0.2;

var TILE_MOVE_SPEED = 5;

var NAMES_HEIGHT = 15;

var server_matrix = [];
var current_screen_matrix = [];

// aray with mobs
var mobs_data;

// snakes variables
var cur_i, cur_j, cur_id;
var k, l;
var size_most, size_less;
var room_leader = null;

// room leader arrows
var arrow_top;
var arrow_right;
var arrow_bottom;
var arrow_left;
var crown = {};

var players_list = new Map();

var connected = false;
var socket;
var nickname;
var id;
var leaderboard = [];
var first = true;
var my_snake = null;
var snakes_count;
var lines = 0, columns = 0;
var snake_size;

// Draw loop variables
var tile, previous, snake;
var current_screen, current_server;

var center_i = 0, center_j = 0;
var head_i = 0, head_j = 0;

var heads;

var data = null;
var eyes_color = "#000000";

var offset_i_left = 0, offset_j_left = 0, offset_i_right = 0, offset_j_right = 0;
var i_start, i_end, j_start = 0, j_end = 0;

var horizontal_items, vertical_items;
var vertical_items_half, horizontal_items_half;
var focus_offset_i, focus_offset_j;

var grid_color = "#6d953e"; // D5D5D5

// avatares colors
var colors;

// map tiles
var TILES;

// sounds map
var sounds;

// canvas context
var ctx_below;
var ctx;
var ctx_above;

// canvas size
var width;
var height;

var DESIRED_HORIZONTAL_ITEMS = 55;
var item_size = 26, item_size_1 = item_size - 2;
var i, j;

// ui items
var leaderBoardTable;
var tBodyElem;
var snakeRanking;

function randomInt(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function initTilesArray() {
    TILES = [
        // empty
        {i: "#80af49", off: false},

        // stones
        {i: "#686868", off: true}, {i: "#6e6e6e", off: true},
        {i: "#747474", off: true}, {i: "#7e7e7e", off: true}, {i: "#8e8e8e", off: true},

        // clay
        {i: "#2b1608", off: true}, {i: "#3b2711", off: true}, {i: "#593d2a", off: true},
        {i: "#715036", off: true}, {i: "#76553a", off: true},

        // grass
        {i: "#346a2c", off: true}, {i: "#4b8435", off: true}, {i: "#508935", off: true},
        {i: "#548c35", off: true}, {i: "#7da658", off: true},

        // eat
        {i: "CHICKEN", off: false}, // 16
        {i: "PIG", off: false}, // 17
        {i: "COW", off: false}, // 18
        {i: "SHEEP", off: false}, // 19

        // corpse
        {i: "XP1", off: false},
        {i: "XP2", off: false},
        {i: "XP3", off: false},
        {i: "XP4", off: false},

        // move speed
        {i: "MOVE_SPEED", off: false}
    ];

    colors = [
        ["Diamond", "#000000", "rect", "#006064", "#00BCD4", "#B2EBF2"],
        ["Purple", "#FFFFFF", "rect", "#4A148C", "#8E24AA", "#E1BEE7"],
        ["Wood", "#FFFFFF", "rect", "#322114", "#8d6b3c", "#9d7942"],
        ["Indigo", "#FFFFFF", "rect", "#1A237E", "#303F9F", "#9FA8DA"],
        ["Teal", "#000000", "rect", "#009688", "#4DB6AC", "#00897B"],

        // bots
        ["Zombie", "#000000", "rect", "#1e2c13", "#385a27", "#567943"],
        ["ZombieShirt", "#000000", "rect", "#007876", "#007e7b", "#007e7b"],
        ["ZombiePant", "#000000", "rect", "#3a3189", "#463aa5", "#463aa5"],

        ["Skeleton", "#000000", "rect", "#686868", "#939393", "#939393"],
        ["SkeletonBow", "#000000", "bow", "#686868", "#939393", "#896727", "#444444"],

        ["Spider", "#b50c0f", "rect", "#050404", "#18151c", "#211d27"]
    ];
}

function drawGrid(only_header) {
    var y = 0, x;

    var footer_first = true;
    var header_height = (smallScreen? 3 : 5) * item_size;
    var footer_start = (vertical_items - 6) * item_size;

    var head_colors = ["#323232", "#373737", "#3a3a3a", "#3f3f3f", "#474747"];
    var grass_colors = ["#1a3516", "#183114", "#223d18", "#274018", "#3e532c"];
    var clay_colors = ["#150b04", "#1d1308", "#2c1e15", "#38281b", "#3b2a1d"];

    // clear another canvas
    ctx_above.clearRect(0, 0, width, height);

    ctx.clearRect(0, 0, width, header_height + item_size);
    ctx.clearRect(0, footer_start, width, height);

    for (i = 0; i < vertical_items + 1; i++) {
        x = 0;
        for (j = 0; j < horizontal_items + 1; j++) {
            if (y >= footer_start) {
                if (footer_first) {
                    ctx_below.fillStyle = grass_colors[randomInt(0, 4)];
                    ctx_below.fillRect(x, y, item_size, item_size);
                } else {
                    ctx_below.fillStyle = clay_colors[randomInt(0, 4)];
                    ctx_below.fillRect(x, y, item_size, item_size);
                }
            } else if (y <= header_height) {
                ctx_below.fillStyle = head_colors[randomInt(0, 4)];
                ctx_below.fillRect(x, y, item_size, item_size);
            } else if (only_header) {
                break;
            } else {
                ctx_below.fillStyle = TILES[0]["i"];
                ctx_below.fillRect(x, y, item_size_1, item_size_1);
            }

            x += item_size;
        }

        if (y >= footer_start) {
            footer_first = false;
        }

        y += item_size;
    }
}

function resetCurrentMatrix() {
    // clear canvas
    ctx.clearRect(0, 0, width, height);

    // reset snakes array
    players_list.clear();

    // clear snakes name
    ctx_above.clearRect(0, 0, width, height);

    // reset my snake
    my_snake = {};

    var line;
    var y = -item_size, x;
    current_matrix_screen = [];
    for (i = 0; i < vertical_items; i++) {
        lineMobs = [];
        line = [];
        x = -item_size;
        for (j = 0; j < horizontal_items; j++) {
            line.push(new ScreenPixel(x, y));

            x += item_size;
        }

        y += item_size;

        current_matrix_screen.push(line);
    }
}

function initMatrix(matrix_data) {
    var matrix_split = matrix_data.split(",");

    lines = parseInt(matrix_split[1]);
    columns = parseInt(matrix_split[2]);

    server_matrix = [];

    var c = 3;
    var line;
    for (i = 0; i < lines; i++) {
        line = [];

        for (j = 0; j < columns; j++) {
            line.push(new MapPixel(parseInt(matrix_split[c])));

            c++;
        }

        server_matrix[i] = line;
    }
}

function connect(server) {

    socket = new WebSocket("ws://" + server);
    socket.binaryType = "arraybuffer";

    // Connection opened
    socket.addEventListener('open', function (event) {
        connected = true;

        var button = document.getElementById("connect");
        button.disabled = false;
        button.style.cursor = "pointer";

        startGame();

        // setup nickname
        nickname = document.getElementById("nickname").value;
        if (!nickname) {
            nickname = 'snake-' + parseInt(Math.random() * 1e5).toString();
        } else if (nickname.length > 10) {
            nickname = nickname.substr(0, 10)
        }
        socket.send(nickname + "," + current_avatar_index);
        document.getElementById("snake-nickname").innerHTML = nickname;
    });

    // Connection closed
    socket.addEventListener('close', function (event) {
        closeGame();
    });

    // Connection failed
    socket.addEventListener('error', function (event) {
        closeGame();
    });

    // Listen for messages
    socket.addEventListener('message', onMessage);
}

function startGame() {
    document.getElementById('game-container').style.display = "block";
    document.getElementById('game-stats').style.display = "block";
    document.getElementById('keyboard').style.display = "block";
    document.getElementById('arrows').style.display = "block";
    document.getElementById('connect-form').style.display = "none";
    document.getElementById('navbar').style.display = "none";
    document.getElementById('footer').style.display = "none";
    document.getElementById('beta').style.display = "none";
    var ads = document.getElementById('ads');
    if (ads) {
        ads.style.display = "none";
    }

    if (navigator.userAgent != "snacraft-app") {
        document.getElementById('social-buttons').style.display = "none";
    }

    // init ui items
    leaderBoardTable = document.getElementById("leader-board-table");
    tBodyElem = document.createElement("tbody");
    leaderBoardTable.innerHTML = "";
    leaderBoardTable.appendChild(tBodyElem);
    snakeRanking = document.getElementById("snake-ranking");

    if (typeof app !== 'undefined') {
        app.hideAds();
    }

    startSound();
}

function closeGame() {
    socket = null;
    connected = false;

    document.getElementById("connect").disabled = false;
    document.getElementById('game-stats').style.display = "none";
    document.getElementById('arrows').style.display = "none";
    if (smallScreen) {
        document.getElementById('keyboard').style.display = "none";
    }

    document.getElementById('connect-form').style.display = "block";
    document.getElementById('navbar').style.display = "block";
    document.getElementById('footer').style.display = "block";
    document.getElementById('beta').style.display = "block";
    var ads = document.getElementById('ads');
    if (ads) {
        ads.style.display = "block";
    }

    if (navigator.userAgent != "snacraft-app") {
        document.getElementById('social-buttons').style.display = "block";
    }

    if (typeof app !== 'undefined') {
        app.showAds();
    }

    stopSound();
}

function onMessage(event) {
    // FIXME: handle blob event.data type
    if (event.data instanceof ArrayBuffer) {
        data = new Uint8Array(event.data);
        switch (data[0]) {
            case 1:
                id = data[1];
                color = data[2];
                // Head
                head_i = data[3];
                head_j = data[4];

                center_i = head_i;
                center_j = head_j;

                my_snake["id"] = id;
                my_snake["name"] = nickname;
                my_snake["i"] = head_i;
                my_snake["j"] = head_j;
                my_snake["direction"] = DIRECTION_UP;
                my_snake["position"] = players_list.size;
                my_snake["color"] = color;
                my_snake["eyes"] = colors[color - initial_av_index][1];
                my_snake["head"] = colors[color - initial_av_index][1]["up"];

                initPlayer(my_snake);

                players_list.set(id, my_snake);

                break;
            case 12:
                // all mobs
                mobs_data = data;
                getServerMobs();
                drawMobsAtMap();
                drawRoomLeader();

                first = false;
                drawLeaderboard();
                break;
            case 2:
                // mobs changes
                mobs_data = data;
                i = 1;
                j = 1;
                getServerMobsChanges();
                drawMobsAtMap();
                drawRoomLeader();
                break;
            case 7:
                // Players list
                initPlayersList(data);
                break;
            case 8:
                // Player left the game
                snake = players_list.get(data[1]);
                if (snake) {
                    ctx_above.clearRect(snake["name_x"] - 2, snake["name_y"] - 2, snake["name_w"], snake["name_h"]);
                    players_list.delete(data[1]);
                }

                break;
            case 9:
                // TODO: what?
                break;
            case 10:
                playSound(data[1]);
                break;
            case 11:
                my_snake["speed"] = data[1];
                drawSpeed();
                break;
            case 13:
                leaderboard = [];
                for (var i = 1; i < data.length; i++) {
                    leaderboard.push(data[i]);
                }
                // room leader: first snake
                room_leader = players_list.get(leaderboard[0]);
                drawLeaderboard();
                break;
        }
    } else if (typeof event.data === "string") {
        data = event.data;
        switch (data.charCodeAt(0)) {
            case 0:
                // Init loop
                initMatrix(data);
                break;
            case 4:
                // Game over
                socket.close();
                drawGameover();
                break;
        }
    }
}

function updateSnakeDirection(cur_snake, cur_i, cur_j) {
    // detect snake direction
    if (cur_snake["i"] < cur_i) {
        cur_snake["head"] = cur_snake["eyes"]["down"];
        cur_snake["direction"] = DIRECTION_DOWN;
    } else if (cur_snake["j"] < cur_j) {
        cur_snake["head"] = cur_snake["eyes"]["right"];
        cur_snake["direction"] = DIRECTION_RIGHT;
    } else if (cur_snake["j"] > cur_j) {
        cur_snake["head"] = cur_snake["eyes"]["left"];
        cur_snake["direction"] = DIRECTION_LEFT;
    } else { // up
        cur_snake["head"] = cur_snake["eyes"]["up"];
        cur_snake["direction"] = DIRECTION_UP;
    }

    // set snake positions
    cur_snake["i"] = cur_i;
    cur_snake["j"] = cur_j;
}

function putSnakeAtMap() {
    // current snake id
    cur_id = mobs_data[j++];

    // get current snake by id
    cur_snake = players_list.get(cur_id);

    // snake color
    color = mobs_data[j++];

    // TODO: do not receive snakes until players list is received
    if (!cur_snake) {
        cur_snake = {};
        var snake_skin = color - initial_av_index;
        cur_snake["id"] = cur_id;
        cur_snake["eyes"] = colors[snake_skin] ? colors[snake_skin][1] : colors[0][1];

        cur_snake["name"] = "";
        cur_snake["i"] = 0;
        cur_snake["j"] = 0;

        players_list.set(cur_id, cur_snake);
    }

    // push snake id in ranking array
    if (first) {
        if (leaderboard.length < rankingSize && cur_snake["name"].length > 0) {
            leaderboard.push(cur_id);
        }
    }

    // set snake color
    cur_snake["color"] = color;

    // snake size
    size_most = mobs_data[j++];
    size_less = mobs_data[j++];
    cur_snake["size"] = size_most << 8 | size_less & 0xFF;

    // snake head
    cur_i = mobs_data[j++];
    cur_j = mobs_data[j++];

    updateSnakeDirection(cur_snake, cur_i, cur_j);

    snake_size = cur_snake["size"];
    for (k = 1; k < snake_size; k++) {
        server_matrix[mobs_data[j++]][mobs_data[j++]].setMob(color);
    }

    if (cur_id == id) {
        my_snake = cur_snake;
    }

    // put snake head at mobs matrix    
    server_matrix[cur_snake["i"]][cur_snake["j"]].setSnake(cur_id);

    return cur_snake;
}

function getServerMobs() {
    snakes_count = mobs_data[1];
    j = 2;
    i = 0;

    // get snakes
    for (i = 0; i < snakes_count; i++) {
        putSnakeAtMap();
    }

    getServerMobsChanges();
}

function getServerMobsChanges() {
    // get another mobs
    var _v, _i, _j;
    for (i = j; i < mobs_data.length; i++) {
        _i = mobs_data[i];
        _j = mobs_data[++i];
        _v = mobs_data[++i];
        if (_v === 255) {
            cur_id = mobs_data[++i];
            // get current snake by id
            cur_snake = players_list.get(cur_id);
            server_matrix[_i][_j].setSnake(cur_id);

            if (!cur_snake) {
                cur_snake = {};
                var snake_skin = initial_av_index;
                cur_snake["id"] = cur_id;
                cur_snake["eyes"] = colors[0][1];

                cur_snake["name"] = "";
                cur_snake["i"] = 0;
                cur_snake["j"] = 0;
                cur_snake["color"] = initial_av_index;
                cur_snake["direction"] = DIRECTION_UP;

                players_list.set(cur_id, cur_snak);
            } else {
                // set last head position to body
                server_matrix[cur_snake["i"]][cur_snake["j"]].setMob(cur_snake["color"]);
            }

            updateSnakeDirection(cur_snake, _i, _j);

            if (cur_id == id) {
                if (!my_snake["position"]) {
                    my_snake["position"] = players_list.size;
                }
                my_snake["name"] = cur_snake["name"];
                my_snake["i"] = cur_snake["i"];
                my_snake["j"] = cur_snake["j"];
            }
        } else {
            server_matrix[_i][_j].setMob(_v);
        }
    }

    // update current view flags
    if (my_snake) {
        head_i = my_snake["i"];
        head_j = my_snake["j"];

        if (head_i - center_i < -focus_offset_i) {
            center_i--;
        } else if (head_i - center_i > focus_offset_i) {
            center_i++;
        }

        if (head_j - center_j < -focus_offset_j) {
            center_j--;
        } else if (head_j - center_j > focus_offset_j) {
            center_j++;
        }
    }
}

function drawItemAtCanvas(tile, current, previous_tile, context) {
    if (tile["image"]) {
        context.clearRect(current.position.x, current.position.y, item_size, item_size);
        context.drawImage(tile["item"], current.position.x, current.position.y, item_size, item_size);
    } else {
        previous = TILES[previous_tile];
        if (!previous || (previous["image"] || previous["off"])) {
            // clear rect
            context.fillStyle = grid_color;
            context.fillRect(current.position.x, current.position.y, item_size, item_size);
        }

        context.fillStyle = tile["item"];
        if (tile["off"]) {
            context.fillRect(current.position.x, current.position.y, item_size, item_size);
        } else {
            context.fillRect(current.position.x, current.position.y, item_size_1, item_size_1);
        }
    }
}

var stop_game = 0;

function drawMobsAtMap() {
    i_start = center_i - offset_i_left;
    i_end = center_i + offset_i_right;

    if (i_start < 0) {
        i_start = 0;
        i_end = vertical_items;
    } else if (i_end >= lines) {
        i_end = lines;
        i_start = lines - vertical_items;
    }

    j_start = center_j - offset_j_left;
    j_end = center_j + offset_j_right;

    if (j_start < 0) {
        j_start = 0;
        j_end = horizontal_items;
    } else if (j_end >= columns) {
        j_end = columns;
        j_start = columns - horizontal_items;
    }
    
    if (stop_game == 1) {
        //socket.close()
        //return;
    }

    stop_game++;
    
    for (i = i_start, _i = 0; i < i_end; i++, _i++) {
        for (j = j_start, _j = 0; j < j_end; j++, _j++) {
            // old item in screen
            current_screen = current_matrix_screen[_i][_j];
            // new map item
            current_server = server_matrix[i][j];

            // Draw static map element
            if (current_screen.map != current_server.map) {
                tile = TILES[current_server.map];
                drawItemAtCanvas(tile, current_screen, current_screen.map, ctx_below);
                current_screen.map = current_server.map;
            }

            // Draw mob element
            if (current_server.snake) {
                snake = players_list.get(current_server.snake);
                if (snake && (current_screen.mob != current_server.snake || current_screen.direction != snake["direction"])) {
                    // Snake head
                    tile = TILES[snake["color"]];

                    //drawItemAtCanvas(tile, current, ctx);
                    ctx.drawImage(tile["item"], current_screen.position.x, current_screen.position.y, item_size, item_size);

                    // snake eyes
                    ctx.drawImage(snake["head"], current_screen.position.x, current_screen.position.y, item_size, item_size);

                    // crown
                    if (room_leader && room_leader["id"] === snake["id"]) {
                        ctx.drawImage(crown[snake["direction"]], current_screen.position.x, current_screen.position.y, item_size, item_size);
                    }

                    // clear previous name
                    ctx_above.clearRect(snake["name_x"] - 2, snake["name_y"] - 2, snake["name_w"], snake["name_h"]);

                    // save last snake name position
                    snake["name_x"] = current_screen.position.x + item_size;
                    snake["name_y"] = current_screen.position.y - item_size;

                    // draw snake name
                    ctx_above.fillText(snake["name"], snake["name_x"], snake["name_y"]);
                    
                    current_screen.mob = current_server.snake;
                    current_screen.direction = snake["direction"];
                    // set 0 to invalidate draw in the next step
                    //current_server.snake = 1000;
                    // TODO: not change matrix_mobs
                }
            } else if (current_server.snake !== 0) {
                if (current_server.snake !== current_screen.mob) {
                    tile = TILES[current_server.snake];
                    drawItemAtCanvas(tile, current_screen, current_screen.mob, ctx);
                    current_screen.mob = current_server.snake;
                }
            } else if (current_server.mob !== 0) {
                if (current_server.mob !== current_screen.mob) {
                    tile = TILES[current_server.mob];
                    drawItemAtCanvas(tile, current_screen, current_screen.mob, ctx);
                    current_screen.mob = current_server.mob;
                }
            } else if (current_server.mob === 0 && current_server.snake === 0) {
                if (current_screen.mob !== 0) {
                    ctx.clearRect(current_screen.position.x, current_screen.position.y, item_size, item_size);
                    current_screen.mob = 0;
                }
            }
        }
    }
}

function drawRoomLeader() {
    if (room_leader && my_snake && room_leader["id"] != my_snake["id"]) {
        if (Math.abs(room_leader["j"] - my_snake["j"]) >= horizontal_items_half) {
            if (room_leader["j"] > my_snake["j"]) {
                arrow_right.style.display = "block";
                arrow_left.style.display = "none";
            } else {
                arrow_right.style.display = "none";
                arrow_left.style.display = "block";
            }
        } else {
            arrow_right.style.display = "none";
            arrow_left.style.display = "none";
        }

        if (Math.abs(room_leader["i"] - my_snake["i"]) >= vertical_items_half) {
            if (room_leader["i"] > my_snake["i"]) {
                arrow_bottom.style.display = "block";
                arrow_top.style.display = "none";
            } else {
                arrow_bottom.style.display = "none";
                arrow_top.style.display = "block";
            }
        } else {
            arrow_bottom.style.display = "none";
            arrow_top.style.display = "none";
        }
    } else {
        arrow_right.style.display = "none";
        arrow_left.style.display = "none";
        arrow_bottom.style.display = "none";
        arrow_top.style.display = "none";
    }
}

function initPlayer(cur_player) {
    measure = ctx_above.measureText(cur_player["name"]);
    cur_player["name_h"] = NAMES_HEIGHT + 4;
    cur_player["name_w"] = measure.width + 4;
    cur_player["name_x"] = 0;
    cur_player["name_y"] = 0;
    cur_player["size"] = 0;
}

function initPlayersList(data) {
    var player_name, cur_id, cur_player, name_size, color;

    //             0           1             2            3         4
    // Message [MSG_TYPE | PLAYER_ID | NICKNAME_SIZE | NICKNAME | COLOR | ... ]
    for (var i = 1; i < data.length;) {
        cur_id = data[i];
        i++;
        name_size = data[i];

        player_name = "";
        for (j = 0; j < name_size; j++) {
            i++;
            player_name += String.fromCharCode(data[i]);
        }

        i++;
        color = data[i];

        cur_player = {
            "id": cur_id,
            "name": player_name,
            "i": 0,
            "j": 0,
            "color": color,
            "eyes": colors[color - initial_av_index][1]
        };

        initPlayer(cur_player);

        players_list.set(cur_id, cur_player);

        i++;
    }
}

function drawLeaderboard() {
    // my score
    my_snake["score"] = my_snake["size"];
    document.getElementById("snake-size").innerHTML = my_snake["score"];

    // my snake position
    snakeRanking.innerHTML = my_snake["position"] + "/" + snakes_count;

    tBodyElem.innerHTML = "";

    var cur_snake;
    for (i = 0; i < leaderboard.length; i++) {
        cur_snake = players_list.get(leaderboard[i]);

        if (cur_snake) {
            var tableRow = document.createElement("tr");
            tableRow.innerHTML = "<td><strong> #" + (i + 1) +
                    "</strong></td><td>" +
                    cur_snake["name"] + "</td>";

            tBodyElem.appendChild(tableRow);
        }
    }
}

function drawSpeed() {
    // my speed
    document.getElementById("snake-speed").innerHTML = my_snake["speed"];
}

function drawGameover() {
    var score_dom = document.getElementById("score");
    score_dom.style.visibility = "visible";
    score_dom.innerHTML = "Score: " + my_snake["score"] + " (" + my_snake["position"] + "/" + snakes_count + ")";

    document.getElementById("connect-form-gameover").style.visibility = "visible";

    if (mustPrepare) {
        // screen size has changed
        prepareGame();
        mustPrepare = false;
    }

    drawGrid(true);
}

function keyPressed(e) {
    if (!connected) {
        if (e.keyCode == 13) {
            document.getElementById("connect").click();
        }
    } else {
        switch (e.keyCode) {
            case KEY_UP:
            case KEY_UP_1:
                socket.send('1,0');
                break;
            case KEY_DOWN:
            case KEY_DOWN_1:
                socket.send('1,1');
                break;
            case KEY_LEFT:
            case KEY_LEFT_1:
                socket.send('1,2');
                break;
            case KEY_RIGHT:
            case KEY_RIGHT_1:
                socket.send('1,3');
                break;
        }
    }
}

function virtualKeyPressed() {
    socket.send('1,' + this.getAttribute("key"));
}

function setCookie(name, value, days) {
    var expires = "";

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }

    return null;
}

function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}

function findGetParameter(parameterName) {
    var tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) {
            return decodeURIComponent(tmp[1]);
        }
    }
    return "";
}

function initTiles() {
    var image, canvas, dctx;
    var xp1_index, xp2_index;
    for (i = 0; i < TILES.length; i++) {
        if (TILES[i]["i"].charAt(0) != '#') {
            TILES[i]["image"] = true;

            // cache canvas
            canvas = createCanvas(item_size, item_size);
            dctx = canvas.getContext("2d");

            var s18 = item_size_1 / 8;
            var s28 = 2 * s18;
            var s38 = 3 * s18;
            var s48 = 4 * s18;
            var s58 = 5 * s18;
            var s68 = 6 * s18;
            var s78 = 7 * s18;
            var s88 = 8 * s18;
            var m8 = (s18/2);

            var s110 = item_size_1 / 10;
            var s210 = 2 * s110;
            var s310 = 3 * s110;
            var s410 = 4 * s110;
            var s510 = 5 * s110;
            var s610 = 6 * s110;
            var s710 = 7 * s110;
            var s810 = 8 * s110;

            var top = parseInt(s110 + (s110 / 2));

            switch (TILES[i]["i"]) {
                case 'CHICKEN':
                    var s = item_size_1 / 10;
                    var tw = 8 * s;
                    var s2 = 2 * s;

                    dctx.fillStyle = "#e8e8e8";
                    y = s;
                    dctx.fillRect(s, y, tw, s);

                    dctx.fillStyle = "#FFFFFF";
                    y += s;
                    dctx.fillRect(s, y, tw, s2);

                    // eyes
                    dctx.fillStyle = "#000000";
                    dctx.fillRect(s, y, s2, s2);
                    dctx.fillRect(3 * s2 + s, y, s2, s2);

                    dctx.fillStyle = "#c19343";
                    y += s2;
                    dctx.fillRect(s, y, tw, s2);

                    dctx.fillStyle = "#967234";
                    y += s2;
                    dctx.fillRect(s, y, tw, s2);

                    dctx.fillStyle = "#FFFFFF";
                    y += s2;
                    dctx.fillRect(s, y, tw, s);

                    dctx.fillStyle = "#FF0000";
                    dctx.fillRect(s2 + s2, y, s2 + s, s2);
                    break;
                case "PIG":
                    // bg
                    dctx.fillStyle = "#f0acab";
                    dctx.fillRect(s110, top, s810, s710);

                    // ear
                    dctx.fillStyle = "#d58181";
                    dctx.fillRect(s210, top, s110, s210);

                    // eyes
                    dctx.fillStyle = "#000000";
                    dctx.fillRect(s110, s410, s210, s210);
                    dctx.fillRect(s710, s410, s210, s210);

                    dctx.fillStyle = "#FFFFFF";
                    dctx.fillRect(s310, s410, s110, s210);
                    dctx.fillRect(s610, s410, s110, s210);

                    // nose
                    dctx.fillStyle = "#965151";
                    dctx.fillRect(s410, s710, s110, s110);
                    dctx.fillRect(s610, s710, s110, s110);
                    break;
                case "COW":
                    // bg
                    dctx.fillStyle = "#573800";
                    dctx.fillRect(s110, top, s810, s710);

                    // white
                    dctx.fillStyle = "#e7e7e7";
                    dctx.fillRect(s410, top, s210, s210);
                    dctx.fillRect(s410, top, s310, s110);
                    dctx.fillRect(s410, top, s110, s310);

                    // eyes
                    dctx.fillStyle = "#FFFFFF";
                    dctx.fillRect(s110, s410, s210, s210);
                    dctx.fillRect(s710, s410, s210, s210);

                    dctx.fillStyle = "#000000";
                    dctx.fillRect(s110, s510, s110, s110);
                    dctx.fillRect(s810, s510, s110, s110);

                    // nose
                    dctx.fillStyle = "#FFFFFF";
                    dctx.fillRect(s410, s610, s210, s110);
                    dctx.fillRect(s210, s710, s510 + (s110/2), s210);

                    dctx.fillStyle = "#000000";
                    dctx.fillRect(s310, s710, s110, s110);
                    dctx.fillRect(s610, s710, s110, s110);

                    dctx.fillStyle = "#a5a5a5";
                    dctx.fillRect(s310, s810, s410, s110);

                    break;
                case "SHEEP":
                    // bg
                    dctx.fillStyle = "#FFFFFF";
                    dctx.fillRect(s110, top, s810, s710);

                    // face
                    dctx.fillStyle = "#977864";
                    dctx.fillRect(s210, s210, s610, s410);
                    dctx.fillRect(s310, s610 - 1, s410, s210 + 2);

                    // eyes
                    dctx.fillStyle = "#000000";
                    dctx.fillRect(s210, s410, s210, s210);
                    dctx.fillRect(s710, s410, s110, s210);

                    dctx.fillStyle = "#FFFFFF";
                    dctx.fillRect(s310, s410, s110, s210);
                    dctx.fillRect(s610, s410, s110, s210);

                    // mouth
                    dctx.fillStyle = "#df9a9d";
                    dctx.fillRect(s410, s710, s210, s110);
                    break;
                case "MOVE_SPEED":
                    dctx.fillStyle = "#616161";
                    dctx.fillRect(s28, s18, s28, s78);
                    dctx.fillRect(s58, s18, s28, s78);

                    dctx.fillRect(s18, s68, s38, s28);
                    dctx.fillRect(s58, s68, s38, s28);

                    break;
                case "XP1":
                    xp1_index = i;
                    drawCircle(dctx, s18, "#9e9e00", "#bfbf00", "#fefe00", true);
                    break;
                case "XP2":
                    xp2_index = i;
                    drawCircle(dctx, s18, "#126e00", "#1fbf00", "#2afe00", true);
                    break;
                case "XP3":
                    x = item_size_1 * 0.1;
                    y = item_size_1 * 0.1;

                    w = item_size_1 * 0.8;
                    h = item_size_1 * 0.8;

                    dctx.drawImage(TILES[xp1_index]["item"], x, y, w, h);

                    // Removing big XP borders
                    dctx.fillStyle = TILES[0]["i"];
                    dctx.fillRect(0, h, item_size_1, s18);
                    dctx.fillRect(w, 0, s18, item_size_1);
                    break;
                case "XP4":
                    x = item_size_1 * 0.1;
                    y = item_size_1 * 0.1;

                    w = item_size_1 * 0.8;
                    h = item_size_1 * 0.8;

                    dctx.drawImage(TILES[xp2_index]["item"], x, y, w, h);

                    // Removing big XP borders
                    dctx.fillStyle = TILES[0]["i"];
                    dctx.fillRect(0, h, item_size_1, s18);
                    dctx.fillRect(w, 0, s18, item_size_1);

                    break;
            }

            TILES[i]["item"] = canvas;
        } else {
            TILES[i]["item"] = TILES[i]["i"];
            TILES[i]["image"] = false;
        }
    }

    var s15 = item_size_1 / 5;

    heads = {
        "#000000": createHead("#000000", s15),
        "#FFFFFF": createHead("#FFFFFF", s15),
        "#b50c0f": createHead("#b50c0f", s15)
    };
}

function createHead(eyes_color, baseSize) {
    var s25 = 2 * baseSize;
    var s35 = 3 * baseSize;
    var s45 = 4 * baseSize;

    // init head canvas
    var head_canvas = {}

    // head up
    var canvas = document.createElement("canvas");
    canvas.height = item_size;
    canvas.width = item_size;

    var dctx = canvas.getContext("2d");

    dctx.fillStyle = eyes_color;
    dctx.fillRect(baseSize, baseSize, baseSize, baseSize);
    dctx.fillRect(s35, baseSize, baseSize, baseSize);

    head_canvas["up"] = canvas;

    // head down
    canvas = document.createElement("canvas");
    canvas.height = item_size;
    canvas.width = item_size;

    dctx = canvas.getContext("2d");

    dctx.fillStyle = eyes_color;
    dctx.fillRect(baseSize, s35, baseSize, baseSize);
    dctx.fillRect(s35, s35, baseSize, baseSize);

    head_canvas["down"] = canvas;

    // head left
    canvas = document.createElement("canvas");
    canvas.height = item_size;
    canvas.width = item_size;

    dctx = canvas.getContext("2d");

    dctx.fillStyle = eyes_color;
    dctx.fillRect(baseSize, baseSize, baseSize, baseSize);
    dctx.fillRect(baseSize, s35, baseSize, baseSize);

    head_canvas["left"] = canvas;

    // head right
    canvas = document.createElement("canvas");
    canvas.height = item_size;
    canvas.width = item_size;

    dctx = canvas.getContext("2d");

    dctx.fillStyle = eyes_color;
    dctx.fillRect(s35, baseSize, baseSize, baseSize);
    dctx.fillRect(s35, s35, baseSize, baseSize);

    head_canvas["right"] = canvas;

    return head_canvas;
}

function drawCircle(dctx, s18, c1, c2, c3, radius, margin) {
    if (margin === undefined) margin = 0;

    var s28 = 2 * s18;
    var s38 = 3 * s18;
    var s48 = 4 * s18;
    var s58 = 5 * s18;
    var s68 = 6 * s18;
    var s78 = 7 * s18;
    var s88 = 8 * s18;
    var m8 = (s18/2);

    s18 += margin;

    // center 2
    dctx.fillStyle = c1;
    dctx.fillRect(s18, s18, s68, s68);

    // center 1
    dctx.fillStyle = c2;
    dctx.fillRect(s28, s28, s48, s48);

    // center
    dctx.fillStyle = c3;
    dctx.fillRect(s38, s38, s28, s28);

    if (radius) {
        // cutting
        dctx.fillStyle = TILES[0]["i"];

        // top left
        dctx.fillRect(0, 0, s28 + m8, s18 + m8);
        dctx.fillRect(0, 0, s28, s28);
        dctx.fillRect(0, 0, s18 + m8, s28 + m8);

        // top right
        dctx.fillRect(s68 + m8, 0, s18 + m8, s28 + m8);
        dctx.fillRect(s68, 0, s28, s28);
        dctx.fillRect(s58 + m8, 0, s28 + m8, s18 + m8);

        // bottom left
        dctx.fillRect(0, s58 + m8, s18 + m8, s28 + m8);
        dctx.fillRect(0, s68, s28, s28);
        dctx.fillRect(0, s68 + m8, s28 + m8, s18 + m8);

        // bottom right
        dctx.fillRect(s68 + m8, s58 + m8, s18 + m8, s28 + m8);
        dctx.fillRect(s68, s68, s28, s28);
        dctx.fillRect(s58 + m8, s68 + m8, s28 + m8, s18 + m8);
    }
}

function prepareGame(event) {
    smallScreen = window.innerWidth < SMALL_SCREEN;

    if (smallScreen) {
        // TODO: a better way to compatibilize with small screen devices
        rankingSize = 4;
    } else {
        rankingSize = RANKING_SIZE;
    }

    var c0 = document.getElementById("canvas_below");
    var c = document.getElementById("canvas");
    var c2 = document.getElementById("canvas_above");

    width = c.width = c2.width = c0.width = window.innerWidth;
    height = c.height = c2.height = c0.height = window.innerHeight;

    //horizontal_items = parseInt(width / item_size) + 1 + 2;
    //vertical_items = parseInt(height / item_size) + 1 + 2;

    horizontal_items = DESIRED_HORIZONTAL_ITEMS;

    item_size = parseInt(width / (horizontal_items - 3));
    if (item_size < 26) {
        while (item_size % 8 != 0) {
            item_size++;
        }
        horizontal_items = parseInt(width / item_size) + 1 + 2;
    }
    item_size_1 = item_size - 2;
    vertical_items = parseInt(height / item_size) + 1 + 2;
    
    vertical_items_half = parseInt(vertical_items / 2);
    horizontal_items_half = parseInt(horizontal_items / 2);

    offset_i_left = parseInt(vertical_items / 2);
    offset_j_left = parseInt(horizontal_items / 2);

    offset_i_right = vertical_items - offset_i_left;
    offset_j_right = horizontal_items - offset_j_left;

    focus_offset_i = parseInt(vertical_items * FOCUS_OFFSET_PERCENTAGE);
    focus_offset_j = parseInt(horizontal_items * FOCUS_OFFSET_PERCENTAGE);

    // Static map context
    ctx_below = c0.getContext("2d");
    ctx_below.fillStyle = grid_color;
    ctx_below.fillRect(0, 0, width, height);

    // Mobs context
    ctx = c.getContext("2d");

    ctx_above = c2.getContext("2d");
    ctx_above.textAlign = "left";
    ctx_above.textBaseline = "top";
    ctx_above.font = "bold " + NAMES_HEIGHT + "px sans-serif";
    ctx_above.fillStyle = "#FFFFFF";

    // crown
    crown[DIRECTION_DOWN] = createCrown(item_size, item_size, DIRECTION_DOWN);
    crown[DIRECTION_UP] = createCrown(item_size, item_size, DIRECTION_UP);
    crown[DIRECTION_RIGHT] = createCrown(item_size, item_size, DIRECTION_RIGHT);
    crown[DIRECTION_LEFT] = createCrown(item_size, item_size, DIRECTION_LEFT);

    initTilesArray();
    drawGrid(false);
    initTiles();

    avatar_canvas = document.getElementById("avatar");

    if (avatar_canvas) {
        initAvatarChooser();
    }

    var heading = document.getElementById("connect-form")

    // ads
    if (navigator.userAgent == "snacraft-app" || findGetParameter("n") === "1") {
        var _ads = document.getElementById("ads");
        if (_ads) {
            _ads.remove();
        }

        if (navigator.userAgent == "snacraft-app") {
            document.getElementById("social-buttons").remove();
        }
    } else {
        var heading_top = parseInt(window.getComputedStyle(heading).top.replace("px", ""));
        var ads = document.getElementById("ads");
        if (ads) {
            ads.style.top = (heading.offsetHeight + heading_top) + "px";
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    }

    var game_title = document.querySelector(".navbar-header");
    if (game_title) {
        var header_height = (smallScreen? 3 : 5) * item_size;
        var margin_top;
        if (heading.offsetTop < header_height) {
            margin_top = ((heading.offsetTop - game_title.offsetHeight) / 2) + "px";
        } else {
            margin_top = ((header_height - game_title.offsetHeight) / 2) + "px";
        }
        game_title.style.marginTop = margin_top;
    }
}

window.addEventListener('resize', function(event) {
    if (!connected) {
        prepareGame(event);
    } else {
        mustPrepare = true;
    }
});

document.addEventListener("DOMContentLoaded", function(event) {
    // room leader arrows
    arrow_top = document.getElementById('arrow-top');
    arrow_right = document.getElementById('arrow-right');
    arrow_bottom = document.getElementById('arrow-bottom');
    arrow_left = document.getElementById('arrow-left');

    var arrows_size = parseInt(window.innerWidth * 0.15);
    if (arrows_size > 70) {
        arrows_size = "70px";
    } else {
        arrows_size = arrows_size + "px";
    }

    arrow_top.style.width = arrows_size;
    arrow_right.style.height = arrows_size;
    arrow_bottom.style.width = arrows_size;
    arrow_left.style.height = arrows_size;

    // sounds
    initSounds();

    // server
    var nick = document.getElementById("nickname");
    if (nick) {
        document.getElementById("nickname").value = getCookie("nickname");
    }
    
    var server = document.getElementById("server");
    if (server) {
        if (findGetParameter("debug") === "true") {
            var debugOption = document.createElement("option");
            debugOption.value = "localhost:8080";
            debugOption.text = debugOption.value;
            server.appendChild(debugOption);

            debugOption = document.createElement("option");
            debugOption.value = "long-flower-eu.herokuapp.com";
            debugOption.text = "[DEV] Long Flower EU";
            server.appendChild(debugOption);

            debugOption = document.createElement("option");
            debugOption.value = "cool-leaf-us.herokuapp.com";
            debugOption.text = "[DEV] Cool leaf US";
            server.appendChild(debugOption);

            debugOption = document.createElement("option");
            debugOption.value = "fast-island-17183.herokuapp.com";
            debugOption.text = "Fast Island";
            server.appendChild(debugOption);
        }

        var cookieServer = getCookie("server");
        if (cookieServer) {
            var opts = server.options;
            for (var opt, j = 0; opt = opts[j]; j++) {
                if (opt.value == cookieServer) {
                    server.selectedIndex = j;
                    break;
                }
            }
        }
    }

    // user input listeners
    var connect_button = document.getElementById("connect");
    if (connect_button) {
        window.addEventListener('keydown', keyPressed, false);
        connect_button.onclick = function(e) {
            // disable button
            e.target.disabled = true;
            e.target.style.cursor = "wait";
            if (!connected) {
                resetCurrentMatrix();

                var server = document.getElementById("server").value;
                console.log(server);
                var nickname = document.getElementById("nickname").value;

                setCookie("nickname", nickname, 300);
                setCookie("server", server, 300);

                connect(server);
            }
        };

        var keys = document.querySelectorAll("#keyboard .key");
        for (var i = 0; i < keys.length; i++) {
            keys[i].addEventListener("click", virtualKeyPressed);
        }
    }

    // prepare game
    prepareGame();
});
