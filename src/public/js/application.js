/* eslint-disable no-use-before-define */
const button = document.getElementById('searchbutton');
const search = document.getElementById('inputDefault');
const preResult = document.getElementById('preresult');
const resultOriginal = document.getElementById('resultOriginal');
const resultTranslate = document.getElementById('resultTranslate');
const artistTitleDivFirst = document.getElementById('artisttitlefirst');
const artistTitleDivSecond = document.getElementById('artisttitlesecond');
const audio = document.getElementById('foraudio');

const URLlist = 'https://api.lyrics.ovh/suggest/';
const URLtarget = 'https://api.lyrics.ovh/v1/';

// -------! Получаем значение из инпута !-------
button.addEventListener('click', (event) => {
  event.preventDefault();
  const searchValue = search.value;
  const errorDiv = document.getElementById('errormessage');

  if (!searchValue) {
    errorDiv.innerText = 'Запрос не может быть пустым!';
  } else {
    errorDiv.innerText = null;
    const encodedSearch = encodeURI(searchValue);
    searchSong(encodedSearch);
  }
});

// -------! Получаем результаты поиска по инпуту !-------
async function searchSong(encodedSearch) {
  const searchResult = await fetch(`${URLlist}${encodedSearch}`, {
    method: 'GET',
  });
  const result = await searchResult.json();
  showOriginalResult(result);
}

// -------! Рисуем выпадающее меню !-------
function showOriginalResult(result) {
  preResult.innerHTML = result.data.map((el) => `
  <div class="list-group-item list-group-item-action" data-artist="${el.artist.name}" data-title="${el.title}">
      ${el.artist.name} - ${el.title}
    </div>
  </div>`).join('');
}

// -------! Получаем исполнителя и песню из клика по выпадающему списку !-------
preResult.addEventListener('click', (event) => {
  const { artist, title } = event.target.dataset;
  preResult.remove();
  artistTitleDivFirst.innerText = `${artist} - ${title}`;
  artistTitleDivSecond.innerText = `${artist} - ${title}`;
  showLyrics(artist, title);
});

// -------! Получаем результаты по конкретной песне/исполнителю !-------
async function showLyrics(artist, title) {
  const lyricsResult = await fetch(`${URLtarget}${artist}/${title}`, {
    method: 'GET',
  });

  const resultFetch = await lyricsResult.json();
  const regExpForSite = /(\r\n|\r|\n)/g;

  const lyricsForSite = resultFetch.lyrics.replace(regExpForSite, '<br>');
  const lyricsForBack = resultFetch.lyrics.replace(regExpForSite, ' ').split();

  resultOriginal.innerHTML = lyricsForSite;

  sendDataForTranslate(lyricsForBack);
}

// -------! Отправляем на бэк данные для перевода !-------
async function sendDataForTranslate(lyrics) {
  const searchResult = await fetch('/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lyrics,
    }),
  });

  const result = await searchResult.json();
  await showTranslateResult(result);
}

// -------! Рисуем перевод песни !-------
function showTranslateResult(result) {
  resultTranslate.innerText = result;
  // audio.style.visibility = 'visible';
}
