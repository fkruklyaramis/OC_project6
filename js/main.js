const dataManager = new DataManager();

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    displayBestMovie();
    displayTopRatedMovies();
    displayCategories();
    initializeCustomCategories();
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

async function initializeCustomCategories() {
    try {
        const categories = await dataManager.getCategories();
        const sections = ['custom-category-1', 'custom-category-2'];
        
        sections.forEach(sectionId => {
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
                    const moviesData = await dataManager.getMoviesByCategory(selectedCategory, 6);
                    const posters = document.querySelectorAll(`#${sectionId} .movie-poster`);
                    
                    moviesContainer.classList.remove('d-none');
                    
                    posters.forEach((poster, index) => {
                        if (moviesData[index]) {
                            poster.src = moviesData[index].image_url;
                            poster.alt = `Affiche de ${moviesData[index].title}`;
                            poster.style.cursor = 'pointer';
                            poster.addEventListener('click', () => {
                                showMovieModal(moviesData[index]);
                            });
                        }
                    });
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
