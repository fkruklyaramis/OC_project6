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
async function getCategoryMovies(category, div_id, limit) {
    try {
        const moviesData = await dataManager.getMoviesByCategory(category, limit);
        const posters = document.querySelectorAll(div_id);
    
        // Pour chaque poster, assigner l'image correspondante
        moviesData.forEach((movie, index) => {
            if (posters[index]) {
                posters[index].src = movie.image_url;
                posters[index].alt = 'Poster du film : ' + movie.title;
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
        getCategoryMovies('comedy','#category-comedy .movie-poster', 6);
        getCategoryMovies('biography','#category-biography .movie-poster', 6);

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
    modal.querySelector('.modal-pg-duration-countries').textContent = 'Rating : ' + movieData.rated + ' - ' + movieData.duration + ' minutes (' + movieData.countries.join(' / ')+ ')';
    modal.querySelector('.modal-imdb-score').textContent = 'IMDB score: ' + movieData.imdb_score + '/10';
    modal.querySelector('.modal-income').textContent = 'Recettes au box-office: ' + (movieData.worldwide_gross_income ?? 0 ) + ' ' + movieData.budget_currency; // masquer la ligne si null + tester la currency
    modal.querySelector('.modal-directors').textContent = movieData.directors.join(', ');
    modal.querySelector('.modal-actors').textContent = movieData.actors.join(', ');
    modal.querySelector('.modal-description').textContent = movieData.long_description
}



// G – General Audiences - All ages admitted. Nothing that would offend parents for viewing by children.
// PG – Parental Guidance Suggested - Some material may not be suitable for children. Parents urged to give "parental guidance".
// PG-13 – Parents Strongly Cautioned - Some material may be inappropriate for children under 13. Parents are urged to be cautious.
// R – Restricted - Under 17 requires accompanying parent or adult guardian. Contains
// NC-17 – Adults Only