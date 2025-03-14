const dataManager = new DataManager();

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    displayBestMovie();
});

// Afficher le meilleur film
async function displayBestMovie() {
    try {
        const movieData = await dataManager.getBestMovie();
        document.querySelector('.movie-title').textContent = movieData.title;
        document.querySelector('.movie-description').textContent = movieData.description;
        document.querySelector('.movie-poster').src = movieData.image_url;

        // Ajouter l'écouteur d'événement pour la modal
        document.querySelector('#best-movie .btn-primary').addEventListener('click', () => {
            showMovieModal(movieData);
        });
    } catch (error) {
        console.error('Erreur displayBestMovie:', error);
    }
}

// Afficher les films les mieux notés
function showMovieModal(movieData) {
    // Sélectionner tous les éléments de la modal
    const modal = document.getElementById('movie-modal');
    
    // Remplir les informations
    modal.querySelector('.modal-title').textContent = movieData.title;
    modal.querySelector('.modal-movie-img').src = movieData.image_url;
    modal.querySelector('.modal-date-genre').textContent = movieData.year + ' - ' + movieData.genres.join(', ');
    modal.querySelector('.modal-pg-duration-countries').textContent = 'PG ' + ' - ' + movieData.duration + ' minutes (' + movieData.countries.join(' / ')+ ')';
    modal.querySelector('.modal-imdb-score').textContent = 'IMDB score: ' + movieData.imdb_score + '/10';
    modal.querySelector('.modal-income').textContent = 'Recettes au box-office: $' + movieData.worldwide_gross_income;
    modal.querySelector('.modal-directors').textContent = movieData.directors.join(', ');
    modal.querySelector('.modal-actors').textContent = movieData.actors.join(', ');
    modal.querySelector('.modal-description').textContent = movieData.long_description
}
