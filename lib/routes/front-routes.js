function routes(router) {
  router.get('/', (req, res) => {
    req.render('index');
  });
}

export default routes;
