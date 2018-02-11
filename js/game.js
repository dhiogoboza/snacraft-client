var KEY_UP = 87;
var KEY_DOWN = 83;
var KEY_LEFT = 65;
var KEY_RIGHT = 68;
var KEY_UP_1 = 38;
var KEY_DOWN_1 = 40;
var KEY_LEFT_1 = 37;
var KEY_RIGHT_1 = 39;

var FOCUS_OFFSET_PERCENTAGE = 0.2;

var TILE_MOVE_SPEED = 5;

var matrix = [];
var current_matrix = [];
var matrix_mobs = [];

// images
var image_MoveSpeed;

var connected = false;
var socket;
var nickname;
var lines = 0, columns = 0;

var center_i = 0, center_j = 0;
var head_i = 0, head_j = 0;

var position, score;

var offset_i_left = 0, offset_j_left = 0, offset_i_right = 0, offset_j_right = 0;

var horizontal_items, vertical_items;
var focus_offset_i, focus_offset_j;

var grid_color = "#D5D5D5";
var TILES_FOLDER = "img/tiles/"

var TILES = [
    // empty
    {item: "#DDDDDD", off: false},
    
    // stones
    {item: "#686868", off: true}, {item: "#6e6e6e", off: true},
    {item: "#747474", off: true}, {item: "#7e7e7e", off: true}, {item: "#8e8e8e", off: true},
    
    // clay
    {item: "#2b1608", off: true}, {item: "#3b2711", off: true}, {item: "#593d2a", off: true},
    {item: "#715036", off: true}, {item: "#76553a", off: true},
        
    // grass
    {item: "#346a2c", off: true}, {item: "#4b8435", off: true}, {item: "#508935", off: true},
    {item: "#548c35", off: true}, {item: "#7da658", off: true},
    
    // eat
    {item: "CHICKEN", off: false},
    {item: "PIG", off: false},
    {item: "COW", off: false},
    
    // corpse
    {item: "#000080", off: false},
    
    // move spedd
    {item: "MOVE_SPEED", off: false},
    
    {item: "#00DD00", off: false}]

// canvas context
var ctx;

// canvas size
var width;
var height;
var item_size = 21, item_size_1 = item_size - 1;
var i, j;

// ui items
var leaderBoardTable;
var tBodyElem;
var snakeRanking;

function randomInt(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function drawGrid(only_header) {
    var y = 0, x;
    var last_y = 0;
    
    var $navbar = $("#navbar");
    var $footer = $("#footer");
    
    var footer_first = true;
    var header_height = 5 * item_size;
    var footer_start = (vertical_items - 6) * item_size;
    
    for (i = 0; i < vertical_items + 1; i++) {
        x = 0;
        for (j = 0; j < horizontal_items + 1; j++) {
            if (y >= footer_start) {
                if (footer_first) {
                    ctx.fillStyle = TILES[randomInt(11, 15)]["item"];
                    ctx.fillRect(x, y, item_size, item_size);
                } else {
                    ctx.fillStyle = TILES[randomInt(6, 10)]["item"];
                    ctx.fillRect(x, y, item_size, item_size);
                }
            } else if (y <= header_height) {
                ctx.fillStyle = TILES[randomInt(1, 5)]["item"];
                ctx.fillRect(x, y, item_size, item_size);
            } else if (only_header) {
                break;
            } else {
                ctx.fillStyle = TILES[0]["item"];
                ctx.fillRect(x, y, item_size_1, item_size_1);
            }
            
            x += item_size;
        }
        
        if (y >= footer_start) {
            footer_first = false;
        }
        
        if (y <= header_height) {
            last_y = y + item_size;
        }
        
        y += item_size;
        
    }

    $footer.height((height - footer_start) + "px");
    $navbar.height(last_y + "px");
}

function resetCurrentMatrix() {
    var line;
    var y = 0, x;
    current_matrix = [];
    for (i = 0; i < vertical_items; i++) {
        line = [];
        x = 0;
        for (j = 0; j < horizontal_items; j++) {
            line.push({"i": -1, "x": x, "y": y, "off": true});

            x += item_size;
        }

        y += item_size;

        current_matrix.push(line);
    }
}

function initMatrix(matrix_data) {
    var matrix_split = matrix_data.split(",");
    var line_snakes;

    lines = parseInt(matrix_split[1]);
    columns = parseInt(matrix_split[2]);
    
    matrix_mobs = [];
    matrix = [];
    
    var c = 3;
    var line;
    var y = 0, x;
    for (i = 0; i < lines; i++) {
        line = [];
        line_snakes = [];

        for (j = 0; j < columns; j++) {
            line.push(parseInt(matrix_split[c]));
            line_snakes.push(0);

            c++;
        }

        matrix_mobs[i] = line_snakes;
        matrix[i] = line;
    }
    
    // clear last line and column
    /*var last = current_matrix[vertical_items - 1][0];
    console.log(last)
    var x = last["x"] + item_size;
    var y = 0;
    
    for (i = 0; i < vertical_items + 1; i++) {
        ctx.fillStyle = grid_color;
        ctx.fillRect(x, y, item_size, item_size);
        
        ctx.fillStyle = TILES[0]["item"];
        ctx.fillRect(x, y, item_size_1, item_size_1);
        
        y += item_size;
    }*/
    
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

        document.getElementById('game-container').style.display = "block";
        document.getElementById('game-stats').style.display = "block";
        document.getElementById('connect-form').style.display = "none";
        document.getElementById('navbar').style.display = "none";
        document.getElementById('footer').style.display = "none";
        document.getElementById('beta').style.display = "none";
        document.getElementById('ads').style.display = "none";
        document.getElementById('social-buttons').style.display = "none";

        // init ui items
        leaderBoardTable = document.getElementById("leader-board-table");
        tBodyElem = document.createElement("tbody");
        leaderBoardTable.innerHTML = "";
        leaderBoardTable.appendChild(tBodyElem);
        snakeRanking = document.getElementById("snake-ranking");

        // setup nickname
        var nickname = document.getElementById("nickname").value;
        if (!nickname) {
            nickname = 'snake-' + parseInt(Math.random() * 1e5).toString();
        }
        socket.send(nickname);
        document.getElementById("snake-nickname").innerHTML = nickname;
    });

    // Connection closed
    socket.addEventListener('close', function (event) {
        socket = null;

        connected = false;

        document.getElementById("connect").disabled = false;

        document.getElementById('game-stats').style.display = "none";
        document.getElementById('connect-form').style.display = "block";
        document.getElementById('navbar').style.display = "block";
        document.getElementById('footer').style.display = "block";
        document.getElementById('beta').style.display = "block";
        document.getElementById('ads').style.display = "block";
        document.getElementById('social-buttons').style.display = "block";
    });

    // Connection failed
    socket.addEventListener('error', function (event) {
        socket = null;

        connected = false;

        document.getElementById("connect").disabled = false;
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        onMessage(event);
    });
}

function onMessage(event, onSuccess) {
    var data = null;
    if (event.data instanceof ArrayBuffer) {
        data = new TextDecoder().decode(new Uint8Array(event.data));
    } else if (typeof event.data === "string") {
        data = event.data;
    }
    // FIXME: handle blob event.data type
    switch (data.charCodeAt(0)) {
        case 0:
            // Init loop
            initMatrix(data);
            break;
        case 1:
            // Head
            head_i = data.charCodeAt(1);
            head_j = data.charCodeAt(2);

            center_i = head_i;
            center_j = head_j;
        case 2:
            // Game data updated
            drawMobs(data);
            drawMobsAtMap();
            break;
        case 3:
            // Game stats updated
            drawStats(data);
            break;
        case 4:
            // Game over
            socket.close();
            drawGameover();
            break;
        case 5:
            // Ranking
            drawRanking(data);
            break;
        case 6:
            // Leader board
            drawLeaderBoard(data);
            break;
    }
}

function drawMobs(mobs_data) {
    head_i = mobs_data.charCodeAt(1);
    head_j = mobs_data.charCodeAt(2);

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

    for (var i = 3; i < mobs_data.length; i++) {
        matrix_mobs[mobs_data.charCodeAt(i)][mobs_data.charCodeAt(++i)] = mobs_data.charCodeAt(++i);
    }
}

function drawMobsAtMap() {
    var i_start = center_i - offset_i_left;
    var i_end = center_i + offset_i_right;

    if (i_start < 0) {
        i_start = 0;
        i_end = vertical_items;
    } else if (i_end >= lines) {
        i_end = lines;
        i_start = lines - vertical_items;
    }

    var j_start = center_j - offset_j_left;
    var j_end = center_j + offset_j_right;

    if (j_start < 0) {
        j_start = 0;
        j_end = horizontal_items;
    } else if (j_end >= columns) {
        j_end = columns;
        j_start = columns - horizontal_items;
    }
    
    var tile, previous;
    for (i = i_start, _i = 0; i < i_end; i++, _i++) {
        for (j = j_start, _j = 0; j < j_end; j++, _j++) {
            current = current_matrix[_i][_j];
            
            if (matrix_mobs[i][j] == 0) {
                if (matrix[i][j] != current["i"]) {
                    tile = TILES[matrix[i][j]];
                    if (tile["image"] == true) {
                        ctx.drawImage(tile["item"], current["x"], current["y"], item_size, item_size);
                    } else {
                        previous = TILES[current["i"]];
                        if (!previous || (previous["image"] || previous["off"])) {
                            // clear rect
                            ctx.fillStyle = grid_color;
                            ctx.fillRect(current["x"], current["y"], item_size, item_size);
                        }
                        
                        ctx.fillStyle = tile["item"];
                        if (tile["off"]) {
                            ctx.fillRect(current["x"], current["y"], item_size, item_size);
                        } else {
                            ctx.fillRect(current["x"], current["y"], item_size_1, item_size_1);
                        }
                    }
                    
                    current["i"] = matrix[i][j];
                }
            } else {
                if (matrix_mobs[i][j] != current["i"]) {
                    tile = TILES[matrix_mobs[i][j]];
                    
                    if (tile["image"] == true) {
                        ctx.drawImage(tile["item"], current["x"], current["y"], item_size, item_size);
                    } else {
                        previous = TILES[current["i"]];
                        if (!previous || (previous["image"] || previous["off"])) {
                            // clear rect
                            ctx.fillStyle = grid_color;
                            ctx.fillRect(current["x"], current["y"], item_size, item_size);
                        }
                        
                        ctx.fillStyle = tile["item"];
                        if (tile["off"]) {
                            ctx.fillRect(current["x"], current["y"], item_size, item_size);
                        } else {
                            ctx.fillRect(current["x"], current["y"], item_size_1, item_size_1);
                        }
                    }

                    current["i"] = matrix_mobs[i][j];
                }

                matrix_mobs[i][j] = 0;
            }
        }
    }
}

function drawStats(data) {
    score = data.charCodeAt(1);
    document.getElementById("snake-size").innerHTML = score;
}

function drawGameover() {
    var score_dom = document.getElementById("score");
    score_dom.style.visibility = "visible";
    score_dom.innerHTML = "Score: " + score + " (" + position + ")";
    
    document.getElementById("connect-form-gameover").style.visibility = "visible";
    
    drawGrid(true);
}

function drawRanking(data) {
    position = data.charCodeAt(1) + "/" + data.charCodeAt(2)
    snakeRanking.innerHTML = position;
}

function drawLeaderBoard(data) {
    tBodyElem.innerHTML = "";
    var leaders = data.substring(1).split(",");
    for (var i = 0; i < leaders.length; i++) {
        var leader = leaders[i];

        if (leader) {
            var tableRow = document.createElement("tr");
            tableRow.innerHTML = "<td><strong> " + "#" + (i + 1) + " </strong></td><td>" + leader + "</td>";
            tBodyElem.appendChild(tableRow);
        }
    }
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

    for(var i = 0; i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
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
    for (i = 0; i < TILES.length; i++) {
        if (TILES[i]["item"].charAt(0) != '#') {
            TILES[i]["image"] = true;
            
            // cache canvas
            canvas = document.createElement("canvas");
            canvas.height = item_size;
            canvas.width = item_size;
            
            dctx = canvas.getContext("2d");
            
            switch (TILES[i]["item"]) {
                case 'CHICKEN':
                    var s = Math.floor(item_size_1 / 10);
                    var tw = 8 * s;
                    var s2 = 2 * s;
                    
                    dctx.fillStyle = TILES[0]["item"];
                    dctx.fillRect(0, 0, item_size_1, item_size_1);
                    
                    dctx.fillStyle = "#e8e8e8";
                    y = s;
                    dctx.fillRect(s, y, tw, s);
                    
                    dctx.fillStyle = "#FFFFFF";
                    y += s;
                    dctx.fillRect(s, y, tw, s2);
                    dctx.fillStyle = "#000000";
                    dctx.fillRect(s, y, s2, s2);
                    dctx.fillRect(item_size - s2 - s, y, s2, s2);
                    
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
                    var s110 = Math.floor(item_size_1 / 10);
                    var s810 = 8 * s110;
                    var s710 = 7 * s110;
                    
                    dctx.fillStyle = TILES[0]["item"];
                    dctx.fillRect(0, 0, item_size_1, item_size_1);
                    
                    dctx.fillStyle = "#f0acab";
                    dctx.fillRect(s110, parseInt(s110 + (s110 / 2)), s810, s710);
                    
                    break;
                case "MOVE_SPEED":
                    var s18 = Math.floor(item_size_1 / 8);
                    var s28 = 2 * s18;
                    var s38 = 3 * s18;
                    var s58 = 5 * s18;
                    var s68 = 6 * s18;
                    var s78 = 7 * s18;
                    
                    dctx.fillStyle = TILES[0]["item"];
                    dctx.fillRect(0, 0, item_size_1, item_size_1);
                    
                    dctx.fillStyle = "#616161";
                    dctx.fillRect(s28, s18, s28, s78);
                    dctx.fillRect(s58, s18, s28, s78);
                    
                    dctx.fillRect(s18, s68, s38, s28);
                    dctx.fillRect(s58, s68, s38, s28);
                    
                    break;
            }
            
            TILES[i]["item"] = canvas; // recycle field with canvas
        } else {
            TILES[i]["image"] = false;
        }
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    var c = document.getElementById("canvas");

    width = c.width = $(document).width();
    height = c.height = $(document).height();

    horizontal_items = parseInt(width / item_size) + 1;
    vertical_items = parseInt(height / item_size) + 1;

    offset_i_left = parseInt(vertical_items / 2);
    offset_j_left = parseInt(horizontal_items / 2);

    offset_i_right = vertical_items - offset_i_left;
    offset_j_right = horizontal_items - offset_j_left;

    focus_offset_i = parseInt(vertical_items * FOCUS_OFFSET_PERCENTAGE);
    focus_offset_j = parseInt(horizontal_items * FOCUS_OFFSET_PERCENTAGE);

    ctx = c.getContext("2d");
    ctx.fillStyle = grid_color;
    ctx.fillRect(0, 0, width, height);
    
    drawGrid(false);
    initTiles();
    
    document.getElementById("nickname").value = getCookie("nickname");
    var server = document.getElementById("server");

    if (findGetParameter("debug") === "true") {
        var debugOption = document.createElement("option");
        debugOption.value = "localhost:8080";
        debugOption.text = debugOption.value;

        server.appendChild(debugOption);
    }

    var cookie_server = getCookie("server");

    if (cookie_server) {
        var opts = server.options;
        for (var opt, j = 0; opt = opts[j]; j++) {
            if (opt.value == cookie_server) {
                server.selectedIndex = j;
                break;
            }
        }
    }

    document.getElementById("connect").onclick = function(e) {
        // disable button
        e.target.disabled = true;
        e.target.style.cursor = "wait";
        if (!connected) {
            resetCurrentMatrix();
            
            var server = document.getElementById("server").value;
            var nickname = document.getElementById("nickname").value;

            setCookie("nickname", nickname, 5);
            setCookie("server", server, 5);

            connect(server);
        }
    };
    
    window.addEventListener('keydown', keyPressed, false);
});
