import React, { useState, useEffect } from "react";
import { Dropdown, Card, Col, Row, Container } from "react-bootstrap";
import axios from "axios";

function FetchImage() {
  const [data, setData] = useState([]);
  const [reasons, setReasons] = useState({});

  useEffect(() => {
    async function fetchImage() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/fetchImages");
        setData(response.data.Data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    }

    fetchImage();
  }, []);

  const handleReasonChange = (itemId, fileKey, value) => {
    setReasons((prevReasons) => ({
      ...prevReasons,
      [`${itemId}-${fileKey}`]: value,
    }));
  };

  const handleApproval = async (itemId, fileKey, status) => {
    try {
      const reason = reasons[`${itemId}-${fileKey}`] || "";
      const response = await axios.put(
        `http://127.0.0.1:8000/updateImages/${itemId}`,
        { id: itemId, fileNumber: fileKey, status, reason },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        // Update the local state to reflect the status change
        setData((prevData) =>
          prevData.map((item) =>
            item._id === itemId
              ? { ...item, [`${fileKey}Status`]: status }
              : item
          )
        );
      }
    } catch (error) {
      console.error(
        "Error in approval request:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Container className="mt-4">
      <h2>Fetched Images</h2>
      {data.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {data.map((item, index) => (
            <Col key={index}>
              <Card className="h-100">
                <Card.Body className="d-flex flex-column align-items-center">
                  <Card.Title>User ID: {item.userId} </Card.Title>
                  <Card.Text>
                    {["file1", "file2", "file3"].map((fileKey) =>
                      item[fileKey] ? (
                        <div className="mb-4" key={fileKey}>
                          <img
                            src={`http://127.0.0.1:8000/image/${item._id}/${fileKey}`}
                            alt={fileKey}
                            style={{
                              width: "150px",
                              height: "150px",
                              objectFit: "cover",
                            }}
                          />
                          <p>Status: {item[`${fileKey}Status`] || "Pending"}</p>
                          <Dropdown className="mt-3">
                            <Dropdown.Toggle
                              variant="success"
                              id={`dropdown-${fileKey}`}
                            >
                              Approve/Reject {fileKey}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() =>
                                  handleApproval(item._id, fileKey, "approved")
                                }
                              >
                                Approve
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  handleApproval(item._id, fileKey, "rejected")
                                }
                              >
                                Reject
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                          <input
                            type="text"
                            placeholder="Reason for rejection"
                            value={reasons[`${item._id}-${fileKey}`] || ""}
                            onChange={(e) =>
                              handleReasonChange(
                                item._id,
                                fileKey,
                                e.target.value
                              )
                            }
                            className="mt-2 form-control"
                          />
                        </div>
                      ) : null
                    )}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No images available.</p>
      )}
    </Container>
  );
}

export default FetchImage;