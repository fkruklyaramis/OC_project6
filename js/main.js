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
    modal.querySelector('.modal-genre').textContent = movieData.genres.join(', ');
    modal.querySelector('.modal-date').textContent = movieData.date_published;
    modal.querySelector('.modal-rated').textContent = movieData.rated;
    modal.querySelector('.modal-score').textContent = movieData.imdb_score;
    modal.querySelector('.modal-directors').textContent = movieData.directors.join(', ');
    modal.querySelector('.modal-actors').textContent = movieData.actors.join(', ');
    modal.querySelector('.modal-duration').textContent = movieData.duration;
    modal.querySelector('.modal-countries').textContent = movieData.countries.join(', ');
    modal.querySelector('.modal-income').textContent = 
        movieData.worldwide_gross_income ? 
        `${movieData.worldwide_gross_income.toLocaleString()} ${movieData.budget_currency}` : 
        'Non disponible';
    modal.querySelector('.modal-description').textContent = movieData.long_description || movieData.description;
}
