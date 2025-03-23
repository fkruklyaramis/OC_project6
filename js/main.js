const dataManager = new DataManager();
const sizeFilmList = 6;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    displayBestMovie();
    displayTopRatedMovies();
    displayCategories();
    displayCustomCategories();
});

// show best movie
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
        // Créer la grille
        createMovieGrid('#top-rated .movies-container', sizeFilmList);

        const moviesData = await dataManager.getTopRatedMovies(sizeFilmList + 1);
        const posters = document.querySelectorAll('#top-rated .movie-poster');
        
        updateMoviePosters(moviesData.slice(1), posters);

    } catch (error) {
        console.error('Erreur displayTopRatedMovies:', error);
    }
}

// get category movies data
async function getCategoryMovies(category, div_id, limit) {
    try {
        createMovieGrid(div_id, sizeFilmList);
        
        const moviesData = await dataManager.getMoviesByCategory(category, limit);
        const posters = document.querySelectorAll('#category-' + category + ' .movie-poster');
    
        updateMoviePosters(moviesData, posters);

    } catch (error) {
        console.error('Erreur dispayCategoryMovies:', error);
    }
}

// show categories movies
async function displayCategories() {
    try {
        getCategoryMovies('comedy','#category-comedy .movies-container', sizeFilmList);
        getCategoryMovies('biography','#category-biography .movies-container', sizeFilmList);

    } catch (error) {
        console.error('Erreur displayCategories:', error);
    }
}

// show custom categories movies
async function displayCustomCategories() {
    try {
        const categories = await dataManager.getCategories();
        const sections = ['custom-category-1', 'custom-category-2'];
        
        sections.forEach(sectionId => {
            createMovieGrid('#' + sectionId + ' .movies-container', sizeFilmList);
            const select = document.querySelector(`#${sectionId} .category-select`);
            
            // Remplir la liste déroulante
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = category.name;
                select.appendChild(option);
            });

            // Gérer le changement de catégorie
            select.addEventListener('change', async (event) => {
                const selectedCategory = event.target.value;
                const moviesContainer = document.querySelector(`#${sectionId} .movies-container`);
                
                if (selectedCategory) {
                    const moviesData = await dataManager.getMoviesByCategory(selectedCategory, sizeFilmList);
                    const posters = document.querySelectorAll(`#${sectionId} .movie-poster`);
                    
                    moviesContainer.classList.remove('d-none');
                    
                    updateMoviePosters(moviesData, posters);

                } else {
                    moviesContainer.classList.add('d-none');
                }
            });
        });
    } catch (error) {
        console.error('Erreur initializeCustomCategories:', error);
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
    if (movieData.worldwide_gross_income) {
        modal.querySelector('.modal-income').textContent = 'Recettes au box-office: ' + movieData.worldwide_gross_income.toLocaleString() + ' ' + movieData.budget_currency;
        modal.querySelector('.modal-income').style.display = 'block';
    } else {
        modal.querySelector('.modal-income').style.display = 'none';
    }
    modal.querySelector('.modal-directors').textContent = movieData.directors.join(', ');
    modal.querySelector('.modal-actors').textContent = movieData.actors.join(', ');
    modal.querySelector('.modal-description').textContent = movieData.long_description
}

// create movie grid
function createMovieGrid(containerId, sizeFilmList) {
    const container = document.querySelector(containerId);
    container.innerHTML = ''; // Vider le conteneur

    // Créer les rangées nécessaires
    const rowsNeeded = Math.ceil(sizeFilmList / 3);
    
    for (let r = 0; r < rowsNeeded; r++) {
        const row = document.createElement('div');
        row.className = 'row mb-4';
        
        // Créer 3 cartes par rangée
        const cardsInThisRow = Math.min(3, sizeFilmList - (r * 3));
        for (let i = 0; i < cardsInThisRow; i++) {
            const movieCard = `
                <div class="col-md-4 movie-container">
                    <div class="position-relative">
                        <img class="img-fluid movie-poster" alt="Movie poster">
                        <div class="movie-overlay">
                            <div class="movie-title-overlay"></div>
                            <button class="btn btn-light" type="button" data-bs-toggle="modal" data-bs-target="#movie-modal">
                                Détails
                            </button>
                        </div>
                    </div>
                </div>
            `;
            row.innerHTML += movieCard;
        }
        
        container.appendChild(row);
    }
}

// Fonction utilitaire pour mettre à jour les posters
function updateMoviePosters(moviesData, posters) {
    moviesData.forEach((movie, index) => {
        if (posters[index]) {
            const poster = posters[index];
            poster.src = movie.image_url;
            poster.alt = 'Poster du film : ' + movie.title;
            poster.style.cursor = 'pointer';

            const container = poster.closest('.position-relative');
            const titleOverlay = container.querySelector('.movie-title-overlay');
            const button = container.querySelector('.btn');

            titleOverlay.textContent = movie.title;
            button.addEventListener('click', () => {
                showMovieModal(movie);
            });
        }
    });
}