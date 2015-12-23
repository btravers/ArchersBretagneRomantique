import userController from '../controllers/user-controller';
import authUtil from '../util/auth-util';

function routes(router) {
  router.route('/users')
    .get(authUtil.isAuthentecated, userController.getUsers);
}

export default routes;
