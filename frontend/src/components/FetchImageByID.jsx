import axios from "axios";
import React, { useState } from "react";
import { Card, Button, Container, Form } from "react-bootstrap";

function FetchImageByID() {
  const [responses, setResponses] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  async function fetchById() {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/fetchImagesByid/543210`
      );
      setResponses(response.data[0]);
    } catch (err) {
      setError("Error fetching data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = async (fileKey) => {
    if (!file) {
      setUploadError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploadError(null);
    try {
      const uploadResponse = await axios.post(
        `http://127.0.0.1:8000/uploadFile/${responses.userId}/${fileKey}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.status === 200) {
        alert("File uploaded successfully!");
        fetchById(); // Refresh the data
      }
    } catch (err) {
      setUploadError("File upload failed. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Fetch Image by ID</h2>
      <div className="mb-3">
        <Button variant="primary" onClick={() => fetchById()}>
          Fetch Images
        </Button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      {responses && (
        <Card>
          <Card.Body>
            <Card.Title>User ID: {responses.userId}</Card.Title>
            <p>Overall Status: {responses.OverAllStatus}</p>
            {["file1", "file2", "file3"].map((fileKey, index) => {
              const fileData = responses[fileKey]?.data || null;
              const fileStatus = responses[`${fileKey}Status`] || "unknown";

              return (
                <div key={index} className="mb-3">
                  {fileData && (
                    <img
                      src={`data:image/png;base64,${btoa(
                        String.fromCharCode(...fileData)
                      )}`} // Convert binary data to base64
                      alt={fileKey}
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        marginRight: "10px",
                      }}
                    />
                  )}
                  <p>Status: {fileStatus}</p>
                  {fileStatus === "rejected" && (
                    <div>
                      <Form.Group
                        controlId={`upload-${fileKey}`}
                        className="mt-2"
                      >
                        <Form.Control
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                      </Form.Group>
                      <Button
                        variant="success"
                        className="mt-2"
                        onClick={() => handleFileUpload(fileKey)}
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Upload New File"}
                      </Button>
                      {uploadError && (
                        <p className="text-danger mt-2">{uploadError}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default FetchImageByID;
