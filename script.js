// let api = '4ddc7b65'
// let searchInput = document.getElementById('input');


// let timer;

// document.getElementById("search").addEventListener('click',() =>{
//     if(timer) clearTimeout(timer);
//     timer = setTimeout(async () =>{
//         let url = `http://www.omdbapi.com/?s=${searchInput.value}&apikey=${api}` 
//         let response = await fetch(url);
//         let data = await response.json();
//         console.log(data);
        
//     let container = document.getElementById('container');
//     container.innerHTML ="";

//     if(data.Search){
//         data.Search.forEach(ele => {
           
//             let div = document.createElement('div');
//             let img = document.createElement('img');
//             let h1 = document.createElement('h1');
//             let p =document.createElement('p');

//             div.appendChild(img);
//             div.appendChild(h1);
//             container.appendChild(div);
//             img.src = ele.Poster;
//             h1.innerText= ele.Title;
//             p.innerText = ele.imdbID;

//         });
//     }
    

//     },2000);

// });

let api = '4ddc7b65';
let searchInput = document.getElementById('input');
let container = document.getElementById('container');
let detailsContainer = document.getElementById("movie-details");
let detailsContent = document.getElementById("details-content");
let loader = document.getElementById("loader"); // Loading spinner
let timer;

// Debounced search function
searchInput.addEventListener("input", () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(fetchMovies, 1000); // Triggers after 1 sec of no typing
});

// Fetch movies from API
async function fetchMovies() {
    let query = searchInput.value.trim();

    if (query === "") {
        container.innerHTML = `<p class="text-red-500 text-xl mt-5">Please enter a movie name.</p>`;
        return;
    }

    loader.classList.remove("hidden"); // Show loader
    container.innerHTML = ""; // Clear previous results

    try {
        let url = `https://www.omdbapi.com/?s=${query}&apikey=${api}`;
        let response = await fetch(url);
        let data = await response.json();

        loader.classList.add("hidden"); // Hide loader

        if (data.Response === "False") {
            container.innerHTML = `<p class="text-red-500 text-xl mt-5">No results found for "${query}".</p>`;
            return;
        }

        // Display search results
        container.innerHTML = "";
        data.Search.forEach(ele => {
            let div = document.createElement('div');
            div.classList.add("movie-card", "bg-white", "shadow-lg", "rounded-lg", "p-4", "m-2", "cursor-pointer", "w-60");
            div.setAttribute("data-id", ele.imdbID);

            let img = document.createElement('img');
            img.src = ele.Poster !== "N/A" ? ele.Poster : "placeholder.jpg"; // Fallback image
            img.classList.add("w-full", "h-80", "object-cover", "rounded-md");

            let h1 = document.createElement('h1');
            h1.innerText = ele.Title;
            h1.classList.add("text-lg", "font-semibold", "mt-2");

            div.appendChild(img);
            div.appendChild(h1);
            container.appendChild(div);

            // Add event listener to fetch movie details
            div.addEventListener("click", () => {
                showMovieDetails(ele.imdbID);
            });
        });
    } catch (error) {
        loader.classList.add("hidden");
        container.innerHTML = `<p class="text-red-500 text-xl mt-5">Error fetching movies. Please try again.</p>`;
    }
}

// Fetch and display movie details
async function showMovieDetails(movieId) {
    detailsContainer.classList.remove("hidden"); // Show details section

    try {
        let detailsUrl = `https://www.omdbapi.com/?i=${movieId}&apikey=${api}`;
        let response = await fetch(detailsUrl);
        let movie = await response.json();

        detailsContent.innerHTML = `
            <h2 class="text-2xl font-bold">${movie.Title} (${movie.Year})</h2>
            <img src="${movie.Poster}" alt="${movie.Title}" class="w-full max-h-96 object-contain mt-4">
            <p class="mt-2"><strong>Plot:</strong> ${movie.Plot}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
        `;
    } catch (error) {
        detailsContent.innerHTML = `<p class="text-red-500 text-xl mt-5">Error loading details. Please try again.</p>`;
    }
}

// Close details section
document.getElementById("close-details").addEventListener("click", () => {
    detailsContainer.classList.add("hidden");
});



