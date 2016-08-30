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
  var formFields = {};
  var form = new formidable.IncomingForm();
  form.on('field', function(name, value) {
    function makeFormFields(prop, val) {
      if (!formFields[prop]) {
        formFields[prop] = val;
      } else {
        if (formFields[prop] instanceof Array) { // 배열일 경우
          formFields[prop].push(val);
        } else { // 배열이 아닐 경우
          var tmp = formFields[prop];
          formFields[prop] = [];
          formFields[prop].push(tmp);
          formFields[prop].push(val);
        }
      }//
    }
    var re1 = /\[\]/;
    var re2 = /\[\d+\]/;
    if (name.match(re1)) {
      name = name.replace(re1, '');
    } else if (name.match(/\[\d+\]/)) {
      name = name.replace(re2, '');
    }
    makeFormFields(name, value);
  });

  form.uploadDir = path.join(__dirname, '..', uploadDir);
  form.keepExtensions = true;
  form.multiples = false;
  form.parse(req, function(err, fields, files) {
    if (err) {
      return next(err);
    }
    var width = formFields["width"];
    var height = formFields["height"];
    var msg = formFields["msg"];
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
        thumb_url: imageUrl + path.basename(destThumbnailPath),
        msg: msg
      })
    })
  });
});

module.exports = router;
