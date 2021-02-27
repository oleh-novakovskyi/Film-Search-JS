const searchForm = document.querySelector("#search-form");
const movie = document.querySelector("#movies")
const  urlPoster = 'https://image.tmdb.org/t/p/w500';


function apiSearch(e) {
    e.preventDefault();
    const searchText = document.querySelector(".form-control").value;
    if(searchText.trim().length == 0){
        movie.innerHTML = "<h2 class='col-12 text-center text-danger'>Поле поиска не должно быть пустым</h2>"
        return
    }
    movie.innerHTML = "<div class='spinner'></div>";

    fetch("https://api.themoviedb.org/3/search/multi?api_key=e15dde120dd17708e45327ca3f5076cd&language=ru&query=" + searchText)
    .then((value) => {
        if(value.status !== 200){
            return Promise.reject(new Error(value.status))
        }
        return value.json()
    })
    .then((output) => {
        let inner = '';
        if (output.results.length == 0){
            inner = "<h2 class='col-12 text-center text-info'>По вашему запросу ничего не найдено</h2>"
        }
            output.results.forEach((item) => {
                let nameItem = item.name || item.title;


                const poster = item.poster_path ? urlPoster + item.poster_path : 'http://img.filmy-2017.net/t/240x360/2/25/25d/25d5At.png'       
                let dataInfo = '';
                if(item.media_type !== 'person') dataInfo = `data-id="${item.id}"
                data-type="${item.media_type}"`
                inner += `
                <div class='col-12 col-md-6 col-xl-3 item'>
                    <img src="${poster}" class='imgposter' alt="${nameItem}" ${dataInfo} >
                    <h5>${nameItem}</h5> 
                 </div>
                `
            })
            movie.innerHTML = inner;

            addEventMedia()

    })
    .catch((reason) => {
        movie.innerHTML = "Упс, что-то пошло не так";
        console.log(reason || reason.status);       
    }) 
}

searchForm.addEventListener('submit', apiSearch);

function addEventMedia(){
    const media = movie.querySelectorAll('img[data-id]')
    media.forEach( elem => {
        elem.style.cursor = 'pointer';
        elem.addEventListener('click', showFullInfo);
    })
}


//--------------------------------------------------------------------------------------

function showFullInfo(){
  let url = '';
 if (this.dataset.type === 'movie'){
     url = `https://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=e15dde120dd17708e45327ca3f5076cd&language=ru`;
 } else if(this.dataset.type === 'tv'){
    url = `https://api.themoviedb.org/3/tv/${this.dataset.id}?api_key=e15dde120dd17708e45327ca3f5076cd&language=ru`;
 } else {
    movie.innerHTML = "<h2 class='col-12 text-center text-danger'>Произошла ошибка, повторите позже</h2>"
 } 
 fetch(url)
 .then((value) => {
     if(value.status !== 200){
         return Promise.reject(new Error(value.status))
     }
     return value.json()
 })
 .then((output) => {
     console.log(output)
     movie.innerHTML = `
     <h4 class='col-12 text-center text-info'>${output.name || output.title}</h4>
     <div class="col-4">
        <img src='${urlPoster + output.poster_path}' alt='${output.name || output.title}'>
        ${(output.homepage) ? `<p class='text-center'><a href="${output.homepage}" target="_blanc">Официальная страница</a></p>` : ''}
        ${(output.imdb_id) ? `<p class='text-center'><a href="https://imdb.com/title/${output.imdb_id}" target="_blanc">Страница на Imdb</a></p>` : ''}
     </div>
     <div class="col-8">
        <p>Рейтинг: ${output.vote_average}</p>
        <p>Статус: ${output.status}</p>
        <p>Премьера: ${output.first_air_date || output.release_date}</p>       
        ${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} сезонов ${output.last_episode_to_air.episode_number} серий вышло</p>` : ''}
        <p>Описание: ${output.overview}</p>
     </div>
     `;
 })
 .catch((reason) => {
     movie.innerHTML = "Упс, что-то пошло не так";
     console.log(reason || reason.status);       
 }) 
}

//--------------------------------------------------------------------------------------



document.addEventListener('DOMContentLoaded', () => {
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=e15dde120dd17708e45327ca3f5076cd&language=ru')
    .then((value) => {
        if(value.status !== 200){
            return Promise.reject(new Error(value.status))
        }
        return value.json()
    })
    .then((output) => {
        let inner = "<h4 class='col-12 text-center text-info'>Популярные за неделю</h4>";
        if (output.results.length == 0){
            inner = "<h2 class='col-12 text-center text-info'>По вашему запросу ничего не найдено</h2>"
        }
            output.results.forEach((item) => {
                let nameItem = item.name || item.title;
                let mediaType = item.title ?  'movie' : 'tv'

                const poster = item.poster_path ? urlPoster + item.poster_path : 'http://img.filmy-2017.net/t/240x360/2/25/25d/25d5At.png'       
                let dataInfo = `data-id="${item.id}"
                data-type="${mediaType}"`;
                inner += `
                <div class='col-12 col-md-6 col-xl-3 item'>
                    <img src="${poster}" class='imgposter' alt="${nameItem}" ${dataInfo} >
                    <h5>${nameItem}</h5> 
                 </div>
                `
            })
            movie.innerHTML = inner;

            addEventMedia()

    })
    .catch((reason) => {
        movie.innerHTML = "Упс, что-то пошло не так";
        console.log('error: ' + reason.status)        
    }) 
})

