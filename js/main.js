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
    const modal = document.getElementById('movie-modal');
    
    // Mettre à jour les éléments communs aux deux versions
    modal.querySelectorAll('.modal-title').forEach(el => el.textContent = movieData.title);
    modal.querySelectorAll('.modal-movie-img').forEach(el => {
        el.src = movieData.image_url;
        el.alt = "Poster du film : " + movieData.title;
    });
    modal.querySelectorAll('.modal-date-genre').forEach(el => 
        el.textContent = movieData.year + ' - ' + movieData.genres.join(', '));
    modal.querySelectorAll('.modal-pg-duration-countries').forEach(el => 
        el.textContent = 'Rating : ' + movieData.rated + ' - ' + movieData.duration + ' minutes (' + movieData.countries.join(' / ')+ ')');
    modal.querySelectorAll('.modal-imdb-score').forEach(el => 
        el.textContent = 'IMDB score: ' + movieData.imdb_score + '/10');

    // Gestion box office
    if (movieData.worldwide_gross_income) {
        modal.querySelectorAll('.modal-income').forEach(el => {
            el.textContent = 'Recettes au box-office: ' + movieData.worldwide_gross_income.toLocaleString() + ' ' + movieData.budget_currency;
            el.style.display = 'block';
        });
    } else {
        modal.querySelectorAll('.modal-income').forEach(el => {
            el.style.display = 'none';
        });
    }

    // Mettre à jour les autres informations
    modal.querySelectorAll('.modal-directors').forEach(el => 
        el.textContent = movieData.directors.join(', '));
    modal.querySelectorAll('.modal-actors').forEach(el => 
        el.textContent = movieData.actors.join(', '));
    modal.querySelectorAll('.modal-description').forEach(el => 
        el.textContent = movieData.long_description);
}

// create movie grid
function createMovieGrid(containerId, numberOfMovies) {
    const container = document.querySelector(containerId);
    container.innerHTML = '';
    const row = document.createElement('div');
    row.className = 'row g-4';

    for (let i = 0; i < numberOfMovies; i++) {
        const isTopRated = containerId === '#top-rated .movies-container';
        
        // Classes de visibilité selon le device et la position
        let visibilityClasses = '';
        
        if (isTopRated) {
            // Pour top-rated:
            // Mobile (<576px): cacher après le 2ème
            // Tablet (576px-991px): cacher après le 4ème
            // Desktop (≥992px): tout montrer
            if (i >= 4) {
                visibilityClasses = 'd-none d-lg-block mobile-hidden tablet-hidden';
            } else if (i >= 2) {
                visibilityClasses = 'd-none d-sm-block d-lg-block mobile-hidden';
            }
        } else {
            // Pour les autres sections:
            // Mobile: cacher après le 2ème
            // Tablet: cacher après le 4ème
            if (i >= 4) {
                visibilityClasses = 'd-none d-lg-block mobile-hidden tablet-hidden';
            } else if (i >= 2) {
                visibilityClasses = 'd-none d-sm-block mobile-hidden';
            }
        }
        // Créer la carte du film
        const movieCard = `
            <div class="col-12 col-sm-6 col-lg-4 movie-container ${visibilityClasses}">
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

    // Ajouter le bouton voir plus/moins
    const toggleButton = `
        <div class="text-center mt-4 d-block d-lg-none">
            <button class="btn btn-primary toggle-view">
                Voir plus
            </button>
        </div>
    `;
    row.insertAdjacentHTML('beforeend', toggleButton);
    
    container.appendChild(row);

    // Ajouter l'écouteur d'événements pour le bouton
    const button = container.querySelector('.toggle-view');
    button.addEventListener('click', () => {
        const screenWidth = window.innerWidth;
        const hiddenCards = screenWidth >= 576 
            ? container.querySelectorAll('.tablet-hidden')
            : container.querySelectorAll('.mobile-hidden');

        hiddenCards.forEach(card => {
            if (card.classList.contains('d-none')) {
                card.classList.remove('d-none');
                button.textContent = 'Voir moins';
            } else {
                card.classList.add('d-none');
                button.textContent = 'Voir plus';
            }
        });
    });
}

// update movie posters
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