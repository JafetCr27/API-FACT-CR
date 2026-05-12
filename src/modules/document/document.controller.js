const service = require("./document.service");

async function create(req, res) {
  try {

    const document = await service.createDocument(
      req.body,
      req.user
    );

    res.status(201).json(document);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
}

async function getAll(req, res) {

  try {

    const documents = await service.getDocuments(req.user);

    res.json(documents);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
}

module.exports = {
  create,
  getAll
};