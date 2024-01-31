const express = require('express');
const router = express.Router();

module.exports = function (tourHistory) {
  router.get('/', (req, res) => {
    console.log('Fetching tour history from server');
    const history = tourHistory();
    console.log('History:', history);
    res.json(history);
  });

  return router;
};
