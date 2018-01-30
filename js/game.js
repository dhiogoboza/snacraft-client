var KEY_UP = 87;
var KEY_DOWN = 83;
var KEY_LEFT = 65;
var KEY_RIGHT = 68;
var KEY_UP_1 = 38;
var KEY_DOWN_1 = 40;
var KEY_LEFT_1 = 37;
var KEY_RIGHT_1 = 39;

var FOCUS_OFFSET_PERCENTAGE = 0.2;

var matrix = [];
var current_matrix = [];
var matrix_mobs = [];

var connected = false;
var socket;
var nickname;
var lines = 0, columns = 0;

var center_i = 0, center_j = 0;
var head_i = 0, head_j = 0;

var offset_i_left = 0, offset_j_left = 0, offset_i_right = 0, offset_j_right = 0;

var horizontal_items, vertical_items;
var focus_offset_i, focus_offset_j;

var MAP_COLORS = ["#EEEEEE","#212121","#00DD00","#000080"];

// canvas context
var ctx;

// canvas size
var width;
var height;
var item_size = 15, item_size_1 = item_size - 1;

// ui items
var leaderBoardTable;
var tBodyElem;
var snakeRanking;

function initMatrix(matrix_data) {
    var line;
    var y = 0, x;
    for (var i = 0; i < vertical_items; i++) {
        line = [];
        x = 0;
        for (var j = 0; j < horizontal_items; j++) {
            line.push({"i": -1, "x": x, "y": y});

            x += item_size;
        }

        y += item_size;

        current_matrix.push(line);
    }

    var matrix_split = matrix_data.split(",");
    var line_snakes;

    lines = parseInt(matrix_split[1]);
    columns = parseInt(matrix_split[2]);

    var c = 3;
    for (var i = 0; i < lines; i++) {
        line = [];
        line_snakes = [];

        for (var j = 0; j < columns; j++) {
            line.push(parseInt(matrix_split[c]));
            line_snakes.push(0);

            c++;
        }

        matrix_mobs[i] = line_snakes;
        matrix[i] = line;
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

        document.getElementById('game-container').style.display = "block";
        document.getElementById('game-stats').style.display = "block";
        document.getElementById('connect-form').style.display = "none";
        document.getElementById('navbar').style.display = "none";
        document.getElementById('footer').style.display = "none";
        
        // init ui items
        leaderBoardTable = document.getElementById("leader-board-table");
        tBodyElem = document.createElement("tbody");
        leaderBoardTable.appendChild(tBodyElem);
        snakeRanking = document.getElementById("snake-ranking")
        
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
            window.addEventListener('keydown', keyPressed, false);
            break;
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

    if (center_i == 0) {
        // TODO: get snake head at map initialization
        center_i = head_i;
        center_j = head_j;
    } else {
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

    for (var i = i_start, _i = 0; i < i_end; i++, _i++) {
        for (var j = j_start, _j = 0; j < j_end; j++, _j++) {
            current = current_matrix[_i][_j];

            if (matrix_mobs[i][j] == 0) {
                if (matrix[i][j] != current["i"]) {
                    ctx.fillStyle = MAP_COLORS[matrix[i][j]];
                    ctx.fillRect(current["x"], current["y"], item_size_1, item_size_1);

                    current["i"] = matrix[i][j];
                }
            } else {
                if (matrix_mobs[i][j] != current["i"]) {
                    ctx.fillStyle = MAP_COLORS[matrix_mobs[i][j]];
                    ctx.fillRect(current["x"], current["y"], item_size_1, item_size_1);

                    current["i"] = matrix_mobs[i][j];
                }

                matrix_mobs[i][j] = 0;
            }
        }
    }
}

function drawStats(data) {
    document.getElementById("snake-size").innerHTML = data.charCodeAt(1);
}

function drawGameover() {
    document.getElementById("connect-form-gameover").classList.remove("hidden");
}

function drawRanking(data) {
    snakeRanking.innerHTML = data.charCodeAt(1) + "/" + data.charCodeAt(2);
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
        return;
    }
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

document.addEventListener("DOMContentLoaded", function(event) {
    var c = document.getElementById("canvas");

    width = c.width = $(document).width();
    height = c.height = $(document).height();

    horizontal_items = parseInt(width / item_size);
    vertical_items = parseInt(height / item_size);

    offset_i_left = parseInt(vertical_items / 2);
    offset_j_left = parseInt(horizontal_items / 2);

    offset_i_right = vertical_items - offset_i_left;
    offset_j_right = horizontal_items - offset_j_left;

    focus_offset_i = parseInt(vertical_items * FOCUS_OFFSET_PERCENTAGE);
    focus_offset_j = parseInt(horizontal_items * FOCUS_OFFSET_PERCENTAGE);

    ctx = c.getContext("2d");
    ctx.fillStyle = MAP_COLORS[0];
    ctx.fillRect(0, 0, width, height);

    document.getElementById("nickname").value = getCookie("nickname");

    if (findGetParameter("debug") === "true") {
        var debugOption = document.createElement("option"); 
        debugOption.value = "localhost:8080";
        debugOption.text = debugOption.value;

        document.getElementById("server").appendChild(debugOption); 
    }

    document.getElementById("connect").onclick = function(e) {
        // disable button
        e.target.disabled = true;
        e.target.style.cursor = "wait";
        if (!connected) {
            var server = document.getElementById("server").value;
            var nickname = document.getElementById("nickname").value;
            
            setCookie("nickname", nickname, 5);
            setCookie("server", server, 5);

            connect(server);
        }
    };

    window.addEventListener('keydown', function(e) {
        if (!connected) {
            if (e.keyCode == 13) {
                document.getElementById("connect").click();
            }
        }
    }, false);
});
