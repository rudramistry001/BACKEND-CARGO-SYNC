// import multer from "multer";

// // Define storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Path where files will be stored
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`); // Customize file name
//   },
// });

// // Define upload middleware
// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//     if (!allowedTypes.includes(file.mimetype)) {
//       return cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'));
//     }
//     cb(null, true);
//   },
// });

// export default upload;
