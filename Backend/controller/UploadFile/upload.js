const upload = require('../../middlewares/uploadMiddleware.js');

const uploadFile = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: err.message,
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No files uploaded',
      });
    }

    const fileUrls = req.files.map((file) => `/upload/${file.filename}`);

    res.status(200).json({
      message: 'Files uploaded successfully!',
      fileUrls,
    });
  });
};

module.exports = uploadFile;
