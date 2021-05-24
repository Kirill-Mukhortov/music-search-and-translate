const axios = require('axios');
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const fs = require('fs');

// -------! Получаем с фронта данные для перевода !-------
const frontData = async (req, res) => {
  const {
    lyrics,
  } = req.body;
  const yandexTranslate = await yandex(lyrics);
  const speach = await yandexSpeach(yandexTranslate);
  return res.json(yandexTranslate);
};

// -------! Обращаемся к Яндексу за переводом !-------
async function yandex(lyrics) {
  const result = await axios.post(`${process.env.yandexUrltext}`, {
    folder_id: `${process.env.folderID}`,
    texts: lyrics,
    sourceLanguageCode: 'en',
    targetLanguageCode: 'ru',
  }, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.yandexAPIkey}`,
    },
  });
  return result.data.translations[0].text;
}

// -------! Обращаемся к Яндексу за озвучкой !-------
const params = new URLSearchParams();

async function yandexSpeach(speach) {
  params.append('text', speach);
  params.append('folderId', `${process.env.folderID}`);
  params.append('voice', 'zahar');
  params.append('emotion', 'good');
  params.append('lang', 'ru-RU');
  params.append('speed', '1.0');
  params.append('format', 'oggopus');

  await fetch(`${process.env.yandexUrlspeach}`, {
    method: 'post',
    body: params,
    headers: {
      Authorization: `Bearer ${process.env.yandexAPIkey}`,
    },
  })
    .then((res) => {
      const dest = fs.createWriteStream('./src/public/audio/octocat.ogg');
      res.body.pipe(dest);
    })
    .catch((err) => console.error(err));
}

module.exports = { frontData };
