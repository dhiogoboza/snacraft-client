var serverList = [], serverListWithData = [];

// servers select
function getServerList(serversSelect, callback) {
    if (findGetParameter("debug") === "true") {
        serverList = [{url: "localhost:8080", title: "localhost:8080"},
                        {url: "long-flower-eu.herokuapp.com", title: "[DEV] Long Flower EU"},
                        {url: "cool-leaf-us.herokuapp.com", title: "[DEV] Cool leaf US"},
                        {url: "secret-reaches-61045.herokuapp.com", title: "Secret Reaches"},
                        {url: "fast-island-17183.herokuapp.com", title: "Fast Island"}];

        initServesList(serverList);
    } else {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                serverList = JSON.parse(this.responseText);
                initServesList(serverList)
            }
        };

        xhttp.onerror = function () {
            // TODO(ruben): handle when request fails
            console.log("Error requesting server state");
        };

        xhttp.open("GET", "api/servers", true);
        xhttp.send();
    }
}

function initServesList(servers) {
    var server = null;
    // request servers latency and players count
    for (var i = 0; i < servers.length; i++) {
        getServerStatus(servers[i]);
    }
}

function callbackServerDataReached(server) {
    serverListWithData.push(server);
    if (serverListWithData.length === serverList.length) {
        // all servers data reached
        var serversSelect = document.getElementById("server");
        // add servers in select view
        for (var i = 0; i < serverListWithData.length; i++) {
            server = serverListWithData[i];

            if (server && server.title && server.url) {
                var option = document.createElement("option");
                option.innerHTML = server.title + " - c: "+ server.count + ", l: " + server.latency;//(server.count >= 0 ? " - " + server.count + "/255 " : "");
                option.setAttribute("value", server.url);
                option.setAttribute("id", server.url);

                serversSelect.appendChild(option);
            }
        }
    }
}

function getServerStatus(serverInstance) {
    var startTime = new Date();
    var ws = new WebSocket("ws://" + serverInstance.url);
    ws.binaryType = "arraybuffer";
    ws.onmessage = function (event) {
        var endTime = new Date();
        if (event.data instanceof ArrayBuffer) {
            var data = new Uint8Array(event.data);
            if (data && data.length == 2 && data[0] == 9 && data[1]) {
                var playersCount = data[1];
                serverInstance.count = playersCount;
                serverInstance.latency = (endTime - startTime) % 60;

                // FIXME: find a better way to do this
                //var serverUrl = event.srcElement.url.substring(5, event.srcElement.url.length - 1);
                //var option = document.getElementById(serverUrl);
                //option.innerHTML = option.innerHTML + " - " + playersCount + "/255 ";
            } else {
                serverInstance.count = -1;
                serverInstance.latency = -1;
            }
        } else {
            serverInstance.count = -1;
            serverInstance.latency = -1;
        }
        callbackServerDataReached(serverInstance);
        event.srcElement.close();
    };
}
