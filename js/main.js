const dataManager = new DataManager();

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    displayBestMovie();
    displayTopRatedMovies();
    displayCategories();

});

// Show best movie
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

// show top rated movies
async function displayTopRatedMovies() {
    try {
        const moviesData = await dataManager.getTopRatedMovies(7);
        const posters = document.querySelectorAll('#top-rated .movie-poster');
        
        // Pour chaque poster, assigner l'image correspondante
        moviesData.slice(1).forEach((movie, index) => {
            if (posters[index]) {
                posters[index].src = movie.image_url;
                // Ajouter un écouteur d'événements pour la modal
                posters[index].addEventListener('click', () => {
                    showMovieModal(movie);
                });
                // Ajouter un style de curseur pointer
                posters[index].style.cursor = 'pointer';
            }
        });
    } catch (error) {
        console.error('Erreur displayTopRatedMovies:', error);
    }
}

// get category movies data
async function getCategoryMovies(category) {
    try {
        const moviesData = await dataManager.getMoviesByCategory(category);
        const posters = document.querySelectorAll('#category-' + category + ' .movie-poster');
    
        // Pour chaque poster, assigner l'image correspondante
        moviesData.forEach((movie, index) => {
            if (posters[index]) {
                posters[index].src = movie.image_url;
                // Ajouter un écouteur d'événements pour la modal
                posters[index].addEventListener('click', () => {
                    showMovieModal(movie);
                });
                // Ajouter un style de curseur pointer
                posters[index].style.cursor = 'pointer';
            }
        });
    } catch (error) {
        console.error('Erreur dispayCategoryMovies:', error);
    }
}

//show categories movies
async function displayCategories() {
    try {
        getCategoryMovies('comedy');
        getCategoryMovies('biography');
    } catch (error) {
        console.error('Erreur displayCategories:', error);
    }
}

// show movie modal
function showMovieModal(movieData) {
    // Sélectionner tous les éléments de la modal
    const modal = document.getElementById('movie-modal');
    
    // Remplir les informations
    modal.querySelector('.modal-title').textContent = movieData.title;
    modal.querySelector('.modal-movie-img').src = movieData.image_url;
    modal.querySelector('.modal-date-genre').textContent = movieData.year + ' - ' + movieData.genres.join(', ');
    modal.querySelector('.modal-pg-duration-countries').textContent = 'PG ' + ' - ' + movieData.duration + ' minutes (' + movieData.countries.join(' / ')+ ')';
    modal.querySelector('.modal-imdb-score').textContent = 'IMDB score: ' + movieData.imdb_score + '/10';
    modal.querySelector('.modal-income').textContent = 'Recettes au box-office: $' + (movieData.worldwide_gross_income ?? 0);
    modal.querySelector('.modal-directors').textContent = movieData.directors.join(', ');
    modal.querySelector('.modal-actors').textContent = movieData.actors.join(', ');
    modal.querySelector('.modal-description').textContent = movieData.long_description
}

