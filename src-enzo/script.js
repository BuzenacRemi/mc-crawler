// Données de test
let data = [
    {
        titre: 'Serveur 1',
        description: 'Description du serveur 1',
        creationDate: '2023-05-20',
        playerCount: 100,
        vote: 'oui',
        gameMode: 'PvP',
        image: 'public/img/server.png'
    },
    {
        titre: 'Serveur 2',
        description: 'Description du serveur 2',
        creationDate: '2023-05-15',
        playerCount: 50,
        vote: 'non',
        gameMode: 'survie',
        image: 'public/img/server.png'
    },
    {
        titre: 'Serveur 3',
        description: 'Description du serveur 3',
        creationDate: '2023-05-25',
        playerCount: 200,
        vote: 'oui',
        gameMode: 'mini-jeux',
        image: 'public/img/server.png'
    }
];

let resultsContainer = document.getElementById('results');
let detailsModal = document.getElementById('details-modal');
let detailsContent = document.getElementById('details-content');
let filterModal = document.getElementById('filter-modal');
let closeButton = document.getElementsByClassName('close');
let searchInput = document.getElementById('search-input');
let filterButton = document.getElementById('filter-button');

// Fonction pour afficher les données
function afficherDonnees() {
    resultsContainer.innerHTML = ''; // Effacer les résultats précédents

    let searchTerm = searchInput.value.toLowerCase();

    data.forEach(function(donnee, index) {
        let titre = donnee.titre.toLowerCase();
        let description = donnee.description.toLowerCase();

        if (titre.includes(searchTerm) || description.includes(searchTerm)) {
            let item = document.createElement('div');
            item.classList.add('result-item');

            let imageLeft = document.createElement('img');
            imageLeft.src = donnee.image;
            item.appendChild(imageLeft);

            let content = document.createElement('div');
            content.classList.add('result-item-content');
            content.innerHTML = '<h2>' + donnee.titre + '</h2><p>' + donnee.description + '</p>';
            item.appendChild(content);

            // Ajouter un gestionnaire d'événement clic pour afficher le modal avec les détails
            item.addEventListener('click', function() {
                afficherDetails(index);
            });

            resultsContainer.appendChild(item);
        }
    });
}

// Fonction pour afficher les détails dans le modal
function afficherDetails(index) {
    let donnee = data[index];

    let detailsHTML = '<h2>' + donnee.titre + '</h2>';
    detailsHTML += '<p>Description : ' + donnee.description + '</p>';
    detailsHTML += '<p>Date de création : ' + donnee.creationDate + '</p>';
    detailsHTML += '<p>Nombre de joueurs : ' + donnee.playerCount + '</p>';
    detailsHTML += '<p>Vote : ' + donnee.vote + '</p>';
    detailsHTML += '<p>Mode de jeu : ' + donnee.gameMode + '</p>';

    detailsContent.innerHTML = detailsHTML;
    detailsModal.style.display = 'block';
}

// Fonction pour ouvrir le modal de filtrage
function ouvrirModalFiltre() {
    filterModal.style.display = 'block';
}

// Fonction pour fermer le modal
function fermerModal() {
    detailsModal.style.display = 'none';
    filterModal.style.display = 'none';
}

// Ajouter un gestionnaire d'événement clic pour fermer le modal lorsque l'utilisateur clique sur la croix
for (let i = 0; i < closeButton.length; i++) {
    closeButton[i].addEventListener('click', fermerModal);
}

// Écouter l'événement de saisie dans la barre de recherche
searchInput.addEventListener('input', function() {
    afficherDonnees();
});

// Écouter l'événement de clic sur le bouton de filtrage
filterButton.addEventListener('click', ouvrirModalFiltre);

// Afficher les données au chargement de la page
afficherDonnees();
