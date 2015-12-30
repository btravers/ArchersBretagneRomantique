import authController from '../controllers/auth-controller';
import authUtil from '../util/auth-util';

function routes(router, passport) {
  router
    .post('/login', passport.authenticate('local'), authController.login)
    .post('/signup', authController.signup)
    .get('/logout', authController.logout);
}

export default routes;
