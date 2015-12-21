import routesUtils from './utils';
import Article from '../models/article';

const express = require('express');

function routes(app, passport) {
  const articles = express.Router();

  articles.get('/', (req, res, next) => {
    Article.find({}, (err, list) => {
      var artList = {};

      for (elem of list) {
        artList[elem._id] = elem;
      }

      res.send(artList);
    });
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
    const article = new Article();

    article.title = req.body.title;
    article.content = req.body.content;
    article.photos = [];

    Article.findOneAndUpdate({
      id: req.params.id
    }, {
      title: req.body.title,
      content: req.body.content
    });
  });

  articles.delete('/:id', routesUtils.isLoggedIn, (req, res, next) => {
    Article.remove({
      id: req.params.id
    });
  });

  app.use('/articles', articles);
}

export default routes;
