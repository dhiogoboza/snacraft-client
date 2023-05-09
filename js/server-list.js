function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

// servers select
function getServerList(serversSelect) {
    let server = findGetParameter("server");

    if (server !== undefined) {
        var option = document.createElement("option");
        option.innerHTML = server;
        option.setAttribute("value", server);
        option.setAttribute("id", server);

        serversSelect.appendChild(option);
        return;
    }

    // requestDynamicServerList();
}

function requestDynamicServerList(serversSelect)  {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        var serverList = [];
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
            getPlayersCount(serverList);
        }
    };

    xhttp.onerror = function () {
        // TODO(ruben): handle when request fails
        console.log("Error requesting server state");
    };

    xhttp.open("GET", "api/servers", true);
    xhttp.send();
}

function getPlayersCount(serverList) {
    for (var i = 0; i < serverList.length; i++) {
        var server = serverList[i];
        var ws = new WebSocket("ws://" + server.url);
        ws.binaryType = "arraybuffer";
        ws.onmessage = function (event) {
            if (event.data instanceof ArrayBuffer) {
                var data = new Uint8Array(event.data);
                if (data && data.length == 2 && data[0] == 9 && data[1]) {
                    var playersCount = data[1];

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

getServerList(document.querySelector("#server"));