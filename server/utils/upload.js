const multer = require("multer");

let upload;

if (process.env.NODE_ENV === "production") {
  // Production: use AWS S3 storage
  const aws = require("aws-sdk");
  const multerS3 = require("multer-s3");

  aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
  });

  const s3 = new aws.S3();

  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME,
      acl: "public-read",
      key: (req, file, cb) => {
        cb(null, Date.now().toString() + "-" + file.originalname);
      },
    }),
  });
} else {
  // Local storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  upload = multer({ storage: storage });
}

module.exports = upload;
