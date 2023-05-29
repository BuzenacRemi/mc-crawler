function darkTheme() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}

function pingServer(ip) {
    var button = event.target;
    var loader = document.createElement("span");
    var result = document.createElement("p");

    loader.style.display = "inline-block";
    button.style.display = "hidden";
    loader.id = "loader";
    loader.className = "loader";
    button.parentNode.insertBefore(loader, button.nextSibling);

    var port = 25565;

    fetch(`https://api.minetools.eu/ping/${ip}/${port}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                button.textContent = "Offline";
                button.className = "offline-button";
            } else {
                button.textContent = data.players.online + "/" + data.players.max;
                button.className = "online-button";

            }
            loader.remove();
        })
        .catch(error => {
            console.log(error);
            loader.remove();
            button.textContent = "Error";
            button.className = "offline-button";

        });
    button.style.display = "visible";
}