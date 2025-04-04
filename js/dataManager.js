class DataManager {
    constructor() {
        this.baseUrl = 'http://localhost:8000/api/v1';
    }

    async getBestMovie() {
        // Récupérer les films triés par score IMDB et retourner le premier film avec ses détails
        // Utiliser la méthode getMoviesByImdbScore et getMovieDetails pour récupérer les détails du film

        try {
            const data = await this.getMoviesByImdbScore(1);
            const bestMovie = data.results[0];
            return await this.getMovieDetails(bestMovie.id);
        } catch (error) {
            console.error('Erreur getBestMovie:', error);
        }
    }

    async getTopRatedMovies(limit) {
        // Récupérer les films triés par score IMDB et retourner les meilleurs films avec leurs détails
        // Utiliser la méthode getMoviesByImdbScore et getMovieDetails pour récupérer les détails des films
        // Limiter le nombre de films à la valeur de limit passée en paramètre
        // Utiliser Promise.all pour récupérer les détails de tous les films en parallèle
        // Retourner un tableau contenant les détails de tous les films
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
        // Récupérer les films triés par score IMDB et retourner les meilleurs films
        // Utiliser la méthode getMoviesByImdbScore pour récupérer les films
        // Limiter le nombre de films à la valeur de limit passée en paramètre
        // Retourner un tableau contenant les films
        // Utiliser fetch pour récupérer les données de l'API
        const response = await fetch(`${this.baseUrl}/titles/?sort_by=-imdb_score&page_size=${limit}`);
        return await response.json();
    }

    async getMovieDetails(movieId) {
        // Récupérer les détails d'un film en utilisant son ID
        // Utiliser fetch pour récupérer les données de l'API
        // Retourner les détails du film
        const response = await fetch(`${this.baseUrl}/titles/${movieId}`);
        return await response.json();
    }

    async getMoviesByCategory(category, limit) {
        // Récupérer les films d'une catégorie spécifique en utilisant son nom
        // Utiliser fetch pour récupérer les données de l'API
        // Limiter le nombre de films à la valeur de limit passée en paramètre
        // Retourner un tableau contenant les films
        const response = await fetch(`${this.baseUrl}/titles/?genre=${category}&page_size=${limit}`);
        const data =  await response.json();
        const moviePromises = data.results.map(movie => 
            this.getMovieDetails(movie.id)
        );
        return await Promise.all(moviePromises);
    }
    
    async getCategories() {
        // Récupérer toutes les catégories de films
        // Utiliser fetch pour récupérer les données de l'API
        // Retourner un tableau contenant les catégories
        try {
            let allCategories = [];
            let nextPage = `${this.baseUrl}/genres/`;

            do {
                const response = await fetch(nextPage);
                const data = await response.json();
                
                allCategories = allCategories.concat(data.results);
                
                nextPage = data.next;
            } while (nextPage);

            return allCategories.sort();

        } catch (error) {
            console.error('Erreur getCategories:', error);
            return [];
        }
    }
}