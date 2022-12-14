var express = require('express');
var router = express.Router();
const { UploadController } = require('../controllers');

/* GET users listing. */
router.get('/get-s3-signed-url', UploadController.getS3SignedURL);
router.post('/vaccine-items', UploadController.uploadExcel);

module.exports = router;
