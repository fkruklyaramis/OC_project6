class DataManager {
    constructor() {
        this.baseUrl = 'http://localhost:8000/api/v1';
    }

    async getBestMovie() {
        try {
            const data = await this.getMoviesByImdbScore(1);
            const bestMovie = data.results[0];
            return await this.getMovieDetails(bestMovie.id);
        } catch (error) {
            console.error('Erreur getBestMovie:', error);
        }
    }

    async getTopRatedMovies(limit) {
        try {
            const data = await this.getMoviesByImdbScore(limit);
            const moviePromises = data.results.map(movie => 
                this.getMovieDetails(movie.id)
            );
            return await Promise.all(moviePromises);
        } catch (error) {
            console.error('Erreur getTopRatedMovies:', error);
        }
    }

    async getMoviesByImdbScore(limit) {
        const response = await fetch(`${this.baseUrl}/titles/?sort_by=-imdb_score&page_size=${limit}`);
        return await response.json();
    }

    async getMovieDetails(movieId) {
        const response = await fetch(`${this.baseUrl}/titles/${movieId}`);
        return await response.json();
    }

    async getMoviesByCategory(category, limit) {
        const response = await fetch(`${this.baseUrl}/titles/?genre=${category}&page_size=${limit}`);
        const data =  await response.json();
        const moviePromises = data.results.map(movie => 
            this.getMovieDetails(movie.id)
        );
        return await Promise.all(moviePromises);
    }
    
    async getCategories() {
        try {
            let allCategories = [];
            let nextPage = `${this.baseUrl}/genres/`;

            do {
                const response = await fetch(nextPage);
                const data = await response.json();
                
                // Ajouter les résultats de la page courante
                allCategories = allCategories.concat(data.results);
                
                // Mettre à jour l'URL de la page suivante
                nextPage = data.next;
            } while (nextPage);

            // Trier les catégories par ordre alphabétique
            return allCategories.sort();

        } catch (error) {
            console.error('Erreur getCategories:', error);
            return [];
        }
    }
}