import express from 'express';

import routesUtils from './utils';
import Article from '../models/article';

function routes(app, passport) {
  const articles = express.Router();

  articles.get('/', (req, res, next) => {
    res.send('Hello world!');
  });

  articles.post('/', routesUtils.isLoggedIn, (req, res, next) => {
    const article = new Article();

    article.title = req.body.title;
    article.content = req.body.content;
    article.photos = [];

    article.save((err) => {
      if (err) {
        res.status(500).end();
      } else {
        res.json(article);
      }
    });
  });

  articles.get('/:id', (req, res, next) => {
    Article.findOne({
      id: req.params.id
    }, (err, article) => {
      if (err) {
        res.json(new Article())
      } else {
        res.json(article);
      }
    });
  });

  articles.put('/:id', routesUtils.isLoggedIn, (req, res, next) => {
    res.send('Hello world!');
  });

  articles.delete('/:id', routesUtils.isLoggedIn, (req, res, next) => {
    res.send('Hello world!');
  });

  app.use('/articles', articles);
}


export default routes;
