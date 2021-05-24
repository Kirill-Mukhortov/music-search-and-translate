require('dotenv').config();
const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const path = require('path');
const hbs = require('hbs');
const dbConnect = require('./src/config/connections');
const indexRouter = require('./src/routers/indexRouter');

const app = express();
const PORT = process.env.PORT || 3000;

dbConnect();

// ------! HBS && cookies !-----

app.set('view engine', 'hbs');
app.set('views', path.join(process.env.PWD, 'src', 'views'));
hbs.registerPartials(path.join(process.env.PWD, 'src', 'views', 'partials'));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(process.env.PWD, 'src', 'public')));
app.use(express.urlencoded({ extended: true }));

// -----! app.use ROUTERS !-----

app.use('/', indexRouter);

// --------------! Обработчик ошибок !----------------

app.use((req, res, next) => {
  const error = createError(404, 'Запрашиваемой страницы не существует на сервере.');
  next(error);
});

app.use((err, req, res, next) => {
  const appMode = req.app.get('env');
  let error;

  if (appMode === 'development') {
    error = err;
  } else {
    error = {};
  }

  res.locals.message = err.message;
  res.locals.error = error;

  res.status(err.status || 500);
  res.render('error');
});

// --------------! Запуск сервера !----------------

app.listen(PORT, () => {
  console.log('Server started on port:', PORT);
});
