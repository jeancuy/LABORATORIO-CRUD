const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('../utils/AppError');

const UPLOAD_DIR = path.join(
  __dirname,
  '..',
  '..',
  'uploads',
  'equipos'
);

// Crear carpeta automáticamente si no existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const uniqueName =
      `equipo-${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;

    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Solo se permiten archivos JPG, JPEG, PNG o WEBP',
        400
      )
    );
  }
};

const uploadEquipoImagen = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter
}).single('imagen');

module.exports = {
  uploadEquipoImagen,
  UPLOAD_DIR
};