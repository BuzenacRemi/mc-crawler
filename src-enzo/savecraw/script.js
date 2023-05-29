function createServerCard(server) {
    const serverCard = document.createElement('div');
    serverCard.classList.add('server-card');

    const serverImage = new Image();
    serverImage.classList.add('server-image');
    serverImage.src = server.imageSrc;

    const serverDetails = document.createElement('div');
    serverDetails.classList.add('server-details');

    const serverTitle = document.createElement('div');
    serverTitle.classList.add('server-title');
    serverTitle.textContent = server.title;

    const serverDescription = document.createElement('div');
    serverDescription.classList.add('server-description');
    serverDescription.textContent = server.description;

    const serverTags = document.createElement('div');
    serverTags.classList.add('server-tags');
    server.tags.forEach(tag => {
        const tagLink = document.createElement('a');
        tagLink.textContent = tag;
        serverTags.appendChild(tagLink);
    });

    serverCard.appendChild(serverImage);
    serverCard.appendChild(serverDetails);
    serverDetails.appendChild(serverTitle);
    serverDetails.appendChild(serverDescription);
    serverDetails.appendChild(serverTags);

    return serverCard;
}
