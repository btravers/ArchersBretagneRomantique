import articleController from '../controllers/article-controller';
import authUtil from '../util/auth-util';

function routes(router) {
  router.route('/articles')
    .get(authUtil.isAuthentecated, articleController.getArticles)
    .post(authUtil.isAuthentecated, articleController.postArticle);

  router.route('/articles/:id')
    .get(authUtil.isAuthentecated, articleController.getArticle)
    .put(authUtil.isAuthentecated, articleController.putArticle)
    .delete(authUtil.isAuthentecated, articleController.deleteArticle);
}

export default routes;
