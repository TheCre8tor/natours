const multer = require('multer');
const AppError = require('./appErrors');

// --------- # ----------##########

// Upload Files Storage -->
/* If we are going to manipulate the image after storage
 * it's best we should not save the image in diskStorage
 * but rather on memory */
// const multerStorage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'public/img/users');
//     },
//     filename: (req, file, callback) => {
//         // user-name | id | timestamp --> user-76633gdhdh3-82828733.jpg
//         const extension = file.mimetype.split('/')[1];
//         callback(null, `user-${req.user.id}-${Date.now()}.${extension}`);
//     }
// });

// Memory Buffer Storage -->
const multerStorage = multer.memoryStorage();

// Upload Files Filter -->
const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true);
    } else {
        callback(new AppError('Not an image! Please upload only images', 400), false);
    }
};

exports.upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});
