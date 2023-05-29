/* 

These are the 3 main functions and their URL'S you must create  👇
========================================

- getOriginals()
  * URL : 'https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213'

- getTrendingNow()
  * URL : 'https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045'

- getTopRated()
  * URL : 'https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1'


** These functions will provide the URL you need to fetch() movies of that genere **

*/

window.onload = () => {
  getOriginals();
  getTrendingNow();
  getTopRated();
};

// ** Helper function that makes dynamic API calls **
function fetchMovies(url, dom_element, path_type) {
  // Use Fetch with the url passed down
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      showMovies(json, dom_element, path_type);
    });
}

//  ** Function that displays the movies to the DOM **
showMovies = (movies, dom_element, path_type) => {
  // Create a variable that grabs id or class
  let ele = document.querySelector(dom_element);

  let handleMovieSelection = (e) => {
    let t = e.target;
    let mid = t.dataset.id;
    let modal = document.getElementById("trailerModal");
    modal.style.opacity = 1;
    getMovieTrailer(mid);
  };

  for (let movie of movies.results) {
    let image = document.createElement("img");
    image.setAttribute("data-id", movie.id);
    image.src = `https://image.tmdb.org/t/p/original${movie[path_type]}`;
    image.addEventListener("click", handleMovieSelection);
    ele.appendChild(image);
    console.log(image.dataset.id);
  }
};

function getOriginals() {
  let url =
    "https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213";
  fetchMovies(url, ".original__movies", "backdrop_path");
}
function getTrendingNow() {
  let url =
    "https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045";
  fetchMovies(url, "#trending", "poster_path");
}
function getTopRated() {
  let url =
    "https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1";
  fetchMovies(url, "#top_rated", "poster_path");
}

// ** BONUS **

// ** Fetches URL provided and returns response.json()
async function getMovieTrailer(id) {
  let url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`;
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      console.log(json);
      setTrailer(json);
    });
}

// ** Function that adds movie data to the DOM
const setTrailer = (trailers) => {
  // Set up iframe variable to hold id of the movieTrailer Element
  const iframe = document.getElementById("movieTrailer");
  // Set up variable to select .movieNotFound element
  const movieNotFound = document.querySelector(".movieNotFound");

  // If there is a trailer add the src for it
  if (trailers.length > 0) {
    // add d-none class to movieNotFound and remove it from iframe
    movieNotFound.classList.add("d-none");
    iframe.classList.remove("d-none");
    // add youtube link with trailers key to iframe.src
    iframe.src = `${trailers.key}`;
  } else {
    // Else remove d-none class to movieNotfound and ADD it to iframe
    movieNotFound.classList.remove("d-none");
    iframe.classList.add("d-none");
  }
};
