var KEY_UP = 87;
var KEY_DOWN = 83;
var KEY_LEFT = 65;
var KEY_RIGHT = 68;

var FOCUS_OFFSET_PERCENTAGE = 0.2;

var matrix = [];
var current_matrix = [];

var matrix_mobs = [];
var current_matrix_mobs = [];

var connected = false;
var socket;
var lines = 0, columns = 0;

var center_i = 0, center_j = 0;
var head_i = 0, head_j = 0;

var offset_i_left = 0, offset_j_left = 0, offset_i_right = 0, offset_j_right;
var x = 0, y = 0;

var horizontal_items, vertical_items;
var focus_offset_i, focus_offset_j;

var MAP_COLORS = ["#FFFFFF","#000000","#00DD00","#0000DD"];

// canvas context
var ctx, ctx_snakes;

// canvas size
var width;
var height;
var item_size = 10;

function initMatrix(matrix_data) {
    var line;
    for (var i = 0; i < vertical_items; i++) {
        line = [];
        for (var j = 0; j < horizontal_items; j++) {
            line.push(-1);
        }
        
        current_matrix_mobs.push(line);
        current_matrix.push(line.slice());
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
    
    // Connection opened
    socket.addEventListener('open', function (event) {
        console.log("socket opened");
        connected = true;
        
        document.getElementById('game-container').style.display = "block";
        document.getElementById('connect-form').style.display = "none";
    });
    
    // Connection failed
    socket.addEventListener('error', function (event) {
        console.log("error");
        connected = false;
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        //console.log('Message from server ', event.data);
        onMessage(event);
    });
}

function onMessage(event, onSuccess) {
    switch (event.data.charCodeAt(0)) {
        case 0:
            // Init loop
            initMatrix(event.data);
            window.addEventListener('keydown', keyPressed, false);
            break;
        case 2:
            // Game data updated            
            drawMobs(event.data);
            drawMobsAtMap();
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
    
    y = 0;
    for (var i = i_start, _i = 0; i < i_end; i++, _i++) {
        x = 0;
        for (var j = j_start, _j = 0; j < j_end; j++, _j++) {
            if (matrix_mobs[i][j] != current_matrix_mobs[_i][_j]) {
                if (matrix_mobs[i][j] == 0) {
                    ctx_snakes.clearRect(x, y, item_size, item_size);
                } else {
                    ctx_snakes.fillStyle = MAP_COLORS[matrix_mobs[i][j]];
                    ctx_snakes.fillRect(x, y, item_size, item_size);
                }
                
                current_matrix_mobs[_i][_j] = matrix_mobs[i][j];
                matrix_mobs[i][j] = 0;
            } else {
                matrix_mobs[i][j] = 0;
            }
            
            if (matrix[i][j] != current_matrix[_i][_j]) {
                ctx.fillStyle = MAP_COLORS[matrix[i][j]];
                ctx.fillRect(x, y, item_size, item_size);
                   
                current_matrix[_i][_j] = matrix[i][j];
            }

            x += item_size;
        }
        
        y += item_size;
    }
}

function keyPressed(e) {
    switch (e.keyCode) {
        case KEY_UP:
            socket.send('1,0');
            break;
        case KEY_DOWN:
            socket.send('1,1');
            break;
        case KEY_LEFT:
            socket.send('1,2');
            break;
        case KEY_RIGHT:
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

document.addEventListener("DOMContentLoaded", function(event) {
    var c = document.getElementById("canvas");
    var c2 = document.getElementById("canvas-snakes");
    
    width = c.width = c2.width = document.documentElement.clientWidth;
    height = c.height = c2.height =  document.documentElement.clientHeight;
    
    horizontal_items = parseInt(width / item_size);
    vertical_items = parseInt(height / item_size);
    
    offset_i_left = parseInt(vertical_items / 2);
    offset_j_left = parseInt(horizontal_items / 2);
   
    offset_i_right = vertical_items - offset_i_left;
    offset_j_right = horizontal_items - offset_j_left;
    
    focus_offset_i = parseInt(vertical_items * FOCUS_OFFSET_PERCENTAGE);
    focus_offset_j = parseInt(horizontal_items * FOCUS_OFFSET_PERCENTAGE);
    
    ctx = c.getContext("2d");
    ctx_snakes = c2.getContext("2d");
    
    document.getElementById("server").value = getCookie("server");
    
    document.getElementById("connect").onclick = function() {
        if (!connected) {
            var server = document.getElementById("server").value;
            
            setCookie("server", server, 5);
            
            connect(server);
        }
    };
});



