import { fileScheme } from "../model/FileModelSchema.js";

import { upload } from "../config/multer.js"; // Assuming multer setup is correct

// POST route to upload three images
export const uploadImages = (req, res) => {
  // Multer middleware to handle file uploads
  upload.fields([
    { name: "file1", maxCount: 1 },
    { name: "file2", maxCount: 1 },
    { name: "file3", maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error uploading files", error: err.message });
    }

    try {
      const { userId } = req.body; // Extract userId from the request body
      console.log(userId);
      console.log(req.files);

      if (
        !userId ||
        !req.files ||
        !req.files["file1"] ||
        !req.files["file2"] ||
        !req.files["file3"]
      ) {
        return res
          .status(400)
          .json({ message: "UserId and all three files are required" });
      }

      // Create a new document in the database with the uploaded file buffers
      const newFile = new fileScheme({
        userId,
        file1: req.files["file1"][0].buffer, // Store file as Buffer
        file2: req.files["file2"][0].buffer, // Store file as Buffer
        file3: req.files["file3"][0].buffer, // Store file as Buffer
        file1Status: "pending",
        file2Status: "pending",
        file3Status: "pending",
        file1Reason: "",
        file2Reason: "",
        file3Reason: "",

        OverAllStatus: "pending",
      });

      await newFile.save();
      res
        .status(200)
        .json({ message: "Files uploaded successfully", data: newFile });
    } catch (error) {
      res.status(500).json({
        message: "Error saving files to database",
        error: error.message,
      });
    }
  });
};

// GET route to fetch images
export const fetchImages = async (req, res) => {
  try {
    const responseImage = await fileScheme.find({});
    res
      .status(200)
      .json({ message: "File Fetched successfully", Data: responseImage });
  } catch (error) {
    res.status(500).json({ message: "Fetching issue", error: error.message });
  }
};

export const UpdateStatusImage = async (req, res) => {
  try {
    const { id, fileNumber, status, reason } = req.body;

    // Validate request body
    if (!id || !fileNumber || !status) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Fetch the document by ID
    const response = await fileScheme.findById(id);
    if (!response) {
      return res.status(404).json({ message: "File not found." });
    }

    // Update the status of the specific file
    const updatedFile = {
      ...response.toObject(),
      [`${fileNumber}Status`]: status,
      [`${fileNumber}Reason`]: reason,
    };

    // Save the updated document
    const result = await fileScheme.findByIdAndUpdate(id, updatedFile, {
      new: true,
    });

    console.log("Updated file status:", result);

    res.status(200).json({
      message: `Status of ${fileNumber} updated successfully.`,
      updatedFile: result,
    });
  } catch (error) {
    console.error("Error updating file status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const GetimageByID = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fileScheme.find({ userId: id });
    if (!response) {
      return res.status(404).json({ message: "File not found." });
    }
    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting file by ID:", error);
  }
};
