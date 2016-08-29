var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var gm = require('gm');

/* GET imageprocs listing. */
router.get('/', function(req, res, next) {
  res.send('imageprocs...');
});

router.post('/', function(req, res, next) {
  var uploadDir = '/uploads/images';
  var imageUrl = "http://localhost:3000/images/";
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '..', uploadDir);
  form.keepExtensions = true;
  form.multiples = false;
  form.parse(req, function(err, fields, files) {
    if (err) {
      return next(err);
    }
    var width = fields["width"];
    var height = fields["height"];
    var srcImagePath = files["picts"].path;
    var destThumbnailPath =
      path.join(path.dirname(srcImagePath), path.basename(srcImagePath, path.extname(srcImagePath))) +
      '-thumb' + path.extname(srcImagePath);
    gm(srcImagePath).resize(width, height).noProfile().write(destThumbnailPath, function(err) {
      if (err) {
        return next(err);
      }
      res.send({
        message: "a thumbnail image created!!!",
        original_url: imageUrl + path.basename(srcImagePath),
        thumb_url: imageUrl + path.basename(destThumbnailPath)
      })
    })
  });
});

module.exports = router;
