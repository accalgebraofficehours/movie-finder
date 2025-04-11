// TMDb Movie ID Checker
const API_KEY = 'YOUR_TMDB_API_KEY'; // Replace with your actual API key
const BASE_URL = 'https://api.themoviedb.org/3';

async function getMovieId(movieTitle, year = null) {
    try {
        // First, search for the movie
        let searchUrl = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieTitle)}`;
        if (year) searchUrl += `&year=${year}`;
        
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();
        
        if (!searchData.results || searchData.results.length === 0) {
            return { error: 'No movies found with that title' };
        }
        
        // Return the first result (most relevant)
        const movie = searchData.results[0];
        return {
            id: movie.id,
            title: movie.title,
            release_date: movie.release_date,
            overview: movie.overview,
            poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : null
        };
    } catch (error) {
        return { error: error.message };
    }
}

// Example usage with UI (for browser)
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('movie-search-form');
    const resultsDiv = document.getElementById('results');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const movieTitle = document.getElementById('movie-title').value;
            const year = document.getElementById('movie-year').value;
            
            resultsDiv.innerHTML = '<p>Searching...</p>';
            
            const movieData = await getMovieId(movieTitle, year || null);
            
            if (movieData.error) {
                resultsDiv.innerHTML = `<p class="error">Error: ${movieData.error}</p>`;
            } else {
                resultsDiv.innerHTML = `
                    <h2>${movieData.title} (${movieData.release_date.substring(0, 4)})</h2>
                    ${movieData.poster_path ? `<img src="${movieData.poster_path}" alt="${movieData.title} poster" style="float: left; margin-right: 20px;">` : ''}
                    <p><strong>TMDb ID:</strong> ${movieData.id}</p>
                    <p><strong>Overview:</strong> ${movieData.overview || 'N/A'}</p>
                `;
            }
        });
    }
});
