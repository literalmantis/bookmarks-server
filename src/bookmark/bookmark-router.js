const express = require("express");
const { v4: uuid } = require("uuid");
const logger = require("../logger");
const { bookmarks } = require("../store");

const bookMarkRouter = express.Router();
const bodyParser = express.json();

bookMarkRouter
  .route("/bookmarks")
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, url, description, rating } = req.body;

    if (!title) {
      logger.error(`Title is required`);
      return res.status(400).send("Invalid data");
    }

    if (!url) {
      logger.error(`URL is required`);
      return res.status(400).send("Invalid data");
    }

    if (!description) {
      logger.error(`Description is required`);
      return res.status(400).send("Invalid data");
    }

    if (!rating) {
      logger.error(`Rating is required`);
      return res.status(400).send("Invalid data");
    }

    if (rating <= 0 || rating > 5) {
      logger.error(`Rating must be between 1 and 5`);
      return res.status(400).send("Rating must be between 1 and 5");
    }

    const id = uuid();

    const bookmark = {
      id,
      title,
      url,
      description,
      rating,
    };

    bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(bookmark);
  });

bookMarkRouter
  .route("/bookmarks/:id")
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find((b) => b.id == id);

    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(404).send("Bookmark not found");
    }
    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;
    const markIndex = bookmarks.findIndex((b) => b.id == id);

    if (markIndex === -1) {
      logger.error(`Bookmark with id ${id} not found`);
      return res.status(404).send("Not found");
    }

    bookmarks.splice(markIndex, 1);

    logger.info(`Bookmark with id ${id} was deleted`);

    res.status(204).end();
  });

module.exports = bookMarkRouter;