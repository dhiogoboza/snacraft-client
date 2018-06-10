// servers select
var serverList = [];
var serversSelect = document.getElementById("server");

function getServerList() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        // TODO(ruben): handle when request fails

        if (this.readyState == 4 && this.status == 200) {
            var servers = JSON.parse(this.responseText);
            var server = null;
            for (var i = 0; i < servers.length; i++) {
                server = servers[i];

                if (server && server.title && server.url) {
                    serverList.push(server);

                    var option = document.createElement("option");
                    option.innerHTML = server.title;
                    option.setAttribute("value", server.url);
                    option.setAttribute("id", server.url);

                    serversSelect.appendChild(option);
                }
            }

            server = null;
            servers = null;

            // Update players count
            getPlayersCount();
        }
    };
    xhttp.open("GET", "api/servers", true);
    xhttp.send();
}

function getPlayersCount() {
    for (var i = 0; i < serverList.length; i++) {
        var server = serverList[i];

        var ws = new WebSocket("ws://" + server.url);
        ws.binaryType = "arraybuffer";
        ws.onmessage = function (event) {
            if (event.data instanceof ArrayBuffer) {
                var data = new Uint8Array(event.data);
                if (data[0] == 9) {
                    var playersCount = data[2];

                    // FIXME: find a better way to do this
                    var serverUrl = event.srcElement.url.substring(5, event.srcElement.url.length - 1);

                    var option = document.getElementById(serverUrl);
                    option.innerHTML = option.innerHTML + " - " + playersCount + "/255 ";
                }
            }
            event.srcElement.close();
        };
    }
}

getServerList();
