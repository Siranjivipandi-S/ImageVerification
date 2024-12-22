import { fileScheme } from "../model/FileModelSchema.js";
import multer from "multer";
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
      const { userId } = req.body;
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
    };
    if (
      updatedFile.file1Status === "approved" &&
      updatedFile.file2Status === "approved" &&
      updatedFile.file3Status === "approved"
    ) {
      updatedFile[`OverAllStatus`] = "approved";
    }
    // Only update the reason if it is provided
    if (reason) {
      updatedFile[`${fileNumber}Reason`] = reason;
    }

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
    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting file by ID:", error);
  }
};

export const updatedFile = async (req, res) => {
  // Use multer or another middleware-less approach if needed
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ error: "File upload failed." });
    }

    try {
      const { fileNumber, id } = req.body; // Extract fields from the request body
      const fileData = req.file?.buffer; // Extract the uploaded file buffer

      // Validate required fields
      if (!fileNumber || !id) {
        return res.status(400).send({ error: "Missing fileNumber or id." });
      }

      if (!["file1", "file2", "file3"].includes(fileNumber)) {
        return res.status(400).send({ error: "Invalid file number." });
      }

      if (!fileData) {
        return res.status(400).send({ error: "No file uploaded." });
      }

      // Find the user's record in the database
      const existData = await fileScheme.findOne({ userId: id });

      if (!existData) {
        return res.status(404).send({ error: "Data not found." });
      }

      // Dynamically update the correct file field with the uploaded data
      existData[fileNumber] = fileData;
      await existData.save(); // Save changes to the database

      res.status(200).send({ message: "File updated successfully." });
    } catch (error) {
      console.error("Error updating file:", error);
      res.status(500).send({ error: "Internal Server Error." });
    }
  });
};
