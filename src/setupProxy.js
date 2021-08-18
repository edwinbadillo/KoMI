const path = require('path');
const fs = require('fs');

module.exports = (app) => {
  app.route('/api/v1/users/me').get((req, res) => {
    const data = fs.readFileSync(path.resolve('./dev/jsons/me.json'));
    const json = JSON.parse(data);
    res.json(json);
  });
  app.route('/api/v1/libraries').get((req, res) => {
    const data = fs.readFileSync(path.resolve('./dev/jsons/libraries.json'));
    const json = JSON.parse(data);
    res.json(json);
  });
  app.route('/actuator/info').get((req, res) => {
    const data = fs.readFileSync(path.resolve('./dev/jsons/actuatorInfo.json'));
    const json = JSON.parse(data);
    res.json(json);
  });
  app.route('/api/v1/tags').get((req, res) => {
    const data = fs.readFileSync(path.resolve('./dev/jsons/tags.json'));
    const json = JSON.parse(data);
    res.json(json);
  });
  app.route('/api/v1/genres').get((req, res) => {
    const data = fs.readFileSync(path.resolve('./dev/jsons/genres.json'));
    const json = JSON.parse(data);
    res.json(json);
  });
  app.route('/api/v1/series/:seriesId').get((req, res) => {
    const data = fs.readFileSync(path.resolve('./dev/jsons/seriesInfo.json'));
    const json = JSON.parse(data);
    res.json(json);
  });
  app.route('/api/v1/series/:seriesId/metadata').patch((req, res) => {
    res.send([]);
  });
  app.route('/api/v1/series?page=:page&size=:size&sort=metadata.titleSort%2Casc&library_id=:id').get((req, res) => {
    const data = fs.readFileSync(path.resolve('./dev/jsons/seriesList.json'));
    const json = JSON.parse(data);
    res.json(json);
  });
  app.route('/api/v1/series/:seriesId/collections').get((req, res) => {
    res.send([]);
  });
  app.route('/api/v1/series/:seriesId/books').get((req, res) => {
    const data = fs.readFileSync(path.resolve('./dev/jsons/seriesBooks.json'));
    const json = JSON.parse(data);
    res.json(json);
  });
  app.route('/api/v1/tags/book').get((req, res) => {
    res.send([]);
  });
  app.route('/api/v1/books/:bookId/thumbnail').get((req, res) => {
    const filePath = path.resolve(`./dev/images/thumbnails/${req.params.bookId}.jpg`);
    res.sendFile(filePath);
  });
  app.route('/api/v1/series/:seriesId/thumbnail').get((req, res) => {
    const filePath = path.resolve(`./dev/images/thumbnails/${req.params.seriesId}.jpg`);
    res.sendFile(filePath);
  });
};
