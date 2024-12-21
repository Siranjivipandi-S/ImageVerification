import multer from "multer";

// Multer storage configuration to handle file buffers
const storage = multer.memoryStorage(); // Using memoryStorage to store files as buffers

const upload = multer({ storage });

export { upload };
