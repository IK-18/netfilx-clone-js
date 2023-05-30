window.onload = () => {
	getOriginals();
	getTrendingNow();
	getTopRated();
	fetchFeaturedProperties();
};

window.onscroll = () => {
	if (document.documentElement.scrollTop >= 80) {
		document.getElementsByTagName("header")[0].style.backgroundColor =
			"black";
	} else {
		document.getElementsByTagName("header")[0].style.backgroundColor =
			"transparent";
	}
};

function fetchMovies(url, dom_element, path_type) {
	fetch(url)
		.then((res) => {
			return res.json();
		})
		.then((json) => {
			showMovies(json, dom_element, path_type);
		});
}

let handleMovieSelection = (e) => {
	let mid = e.target.dataset.id;
	let modal = document.getElementById("trailerModal");
	modal.style.display = "block";
	modal.style.opacity = 1;
	getMovieTrailer(mid);
};

showMovies = (movies, dom_element, path_type) => {
	let ele = document.querySelector(dom_element);

	for (let movie of movies.results) {
		let image = document.createElement("img");
		image.setAttribute("data-id", movie.id);
		image.src = `https://image.tmdb.org/t/p/original${movie[path_type]}`;
		image.addEventListener("click", handleMovieSelection);
		ele.appendChild(image);
	}
};

function getOriginals() {
	let url =
		"https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213";
	fetchMovies(url, ".original__movies", "poster_path");
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

let backg = document.querySelector(".featured");
let title = document.querySelector(".featured_title");
let desc = document.querySelector(".featured__description");
let backTrailer = document.getElementById("featuredTrailer");
let play = document.querySelector(".play");

let fetchFeaturedProperties = () => {
	let url =
		"https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045";
	fetch(url)
		.then((res) => {
			return res.json();
		})
		.then((json) => {
			setFeaturedProperties(json);
			setTimeout(() => {
				setFeaturedProperties(json);
			}, 60000);
		});
};

let setFeaturedProperties = (movies) => {
	let len = movies.results.length - 1;
	let backid = Math.floor(Math.random() * len);
	let id = movies.results[backid].id;
	backg.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movies.results[backid].backdrop_path})`;
	title.innerText = `${movies.results[backid].title}`;
	desc.innerText = `${movies.results[backid].overview}`;
	if (!backTrailer.classList.contains("d-none")) {
		backTrailer.classList.add("d-none");
		backTrailer.src = "";
	}
	fetchFeaturedTrailer(id);
};

let fetchFeaturedTrailer = (id) => {
	let url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`;
	fetch(url)
		.then((res) => {
			return res.json();
		})
		.then((json) => {
			setTimeout(() => {
				setFeaturedTrailer(json);
			}, 5000);
		});
};

let setFeaturedTrailer = (trailers) => {
	let source;
	for (let trailer of trailers.results) {
		if (trailer.type == "Trailer") {
			source = trailer.key;
		}
	}
	play.setAttribute("href", `https://www.youtube.com/watch?v=${source}`);
	backTrailer.classList.remove("d-none");
	backTrailer.src = `https://www.youtube.com/embed/${source}?autoplay=1`;
};

async function getMovieTrailer(id) {
	let url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`;
	fetch(url)
		.then((res) => {
			return res.json();
		})
		.then((json) => {
			setTrailer(json);
		});
}

const setTrailer = (trailers) => {
	const iframe = document.getElementById("movieTrailer");
	const movieNotFound = document.querySelector(".movieNotFound");

	if (trailers.results.length > 0) {
		document.getElementById("trailerModal").classList.remove("d-none");
		movieNotFound.classList.add("d-none");
		iframe.classList.remove("d-none");
		for (let trailer of trailers.results) {
			if (trailer.type == "Trailer") {
				let source = trailer.key;
			}
		}
		iframe.src = `https://www.youtube.com/embed/${source}?autoplay=1`;
	} else {
		document.getElementById("trailerModal").classList.remove("d-none");
		movieNotFound.classList.remove("d-none");
		iframe.classList.add("d-none");
		iframe.src = "";
	}
};

let closeModal = (e) => {
	if (
		document.getElementById("trailerModal").style.display == "block" &&
		(e.target.matches(".close") || !e.target.closest(".modal-content"))
	) {
		document.getElementById("trailerModal").classList.add("d-none");
		document.getElementById("movieTrailer").src = "";
	}
};

document.addEventListener("click", closeModal);
