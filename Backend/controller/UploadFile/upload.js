const upload = require('../../middlewares/uploadMiddleware.js');

const uploadFile = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
         message: err.message 
        });
    }

    if (!req.file) {
      return res.status(400).json({ 
        message: 'No file uploaded' 
      });}

    res.status(200).json({
      message: 'File uploaded successfully!',
      file: req.file,
    });
  });
};

module.exports = uploadFile;
