const { Router } = require('express');
const { indexPageRender } = require('../controllers/indexController');
const { frontData } = require('../controllers/translateController');

const indexRouter = Router();

indexRouter.route('/')
  .get(indexPageRender)
  .post(frontData);

module.exports = indexRouter;
