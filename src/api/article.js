import { Router } from 'express';
import Article from '../models/article';
import authUtil from '../util/auth';

const router = new Router();

router.route('/')
  .get(authUtil.isAuthentecated, (req, res) => {
    console.log('Retrieving all articles');

    Article.find((err, articles) => {
      if (err) {
        res.send(err);
      }

      res.json(articles);
    })
  })
  .post(authUtil.isAuthentecated, (req, res) => {
    const article = new Article(req.body);

    console.log('Adding article: %s', req.body);

    // save the article and check for errors
    article.save((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(article);
      }
    });
  });

router.route('/:id')
  .get(authUtil.isAuthentecated, (req, res) => {
    console.log('Retrieving article: %s', req.params.id);

    Article.findById(req.params.id, (err, article) => {
      if (err) {
        res.send(err);
      }

      res.json(article);
    });
  })
  .put(authUtil.isAuthentecated, (req, res) => {
    console.log('Updating article: %s', req.params.id);

    Article.findById(req.params.id, (err, article) => {
      if (err) {
        res.send(err);
      }

      article.title = req.body.title;
      article.content = req.body.content;
      article.photos = req.body.photos;

      article.save((err) => {
        if (err) {
          res.send(err);
        }

        res.json(article);
      })
    })
  })
  .delete(authUtil.isAuthentecated, (req, res) => {
    console.log('Deleting article: %s', req.params.id);

    Article.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        res.send(err);
      }

      res.json({
        message: 'Article successfully removed'
      });
    })
  });

export default router;
