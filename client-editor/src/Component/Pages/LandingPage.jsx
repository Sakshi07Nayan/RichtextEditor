import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { getAllContent, updateContent, deleteContent } from '../../store/actions/contentAction';
import EditContentModel from './EditContentModel';
import '../../App.css';

function LandingPage() {
  const dispatch = useDispatch();
  const { contents, loading, error } = useSelector(state => state.content);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    dispatch(getAllContent());
  }, [dispatch]);

  const handleEdit = (content) => {
    setSelectedContent(content);
    setShowEditModal(true);
  };

  const handleUpdate = async (id, formData) => {
    try {
      await dispatch(updateContent(id, formData));
      setShowEditModal(false);
      setSelectedContent(null);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await dispatch(deleteContent(id));
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <Spinner animation="border" role="status" variant="primary" size="lg">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="text-center shadow-sm">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-5 text-center text-primary display-6">Content List</h2>
      <Row>
        {contents.map(content => (
          <Col key={content._id} lg={4} md={6} className="mb-4">
            <Card className="h-100 shadow rounded-lg overflow-hidden" style={{ background: 'linear-gradient(90deg, rgba(244,239,241,1) 0%, rgba(211,227,246,1) 100%)' }}>
              <Card.Body className="d-flex flex-column p-4">
                <Card.Title className="text-truncate text-primary">{content.title}</Card.Title>
                <Card.Text className="text-muted mb-3" style={{ minHeight: '60px' }}>
                  {content.description || 'No description available'}
                </Card.Text>
                <Badge
                  bg={content.status === 'published' ? 'success' : 'warning'}
                  className="mb-2 px-3 py-1 text-uppercase"
                  pill
                >
                  {content.status}
                </Badge>
                {content.tags?.length > 0 && (
                  <div className="mb-3 d-flex flex-wrap">
                    {content.tags.map((tag, index) => (
                      <Badge key={index} bg="secondary" className="me-1 mb-1 px-2 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="mt-auto d-flex justify-content-between">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2 transition"
                    onClick={() => handleEdit(content)}
                    disabled={content.status === 'published'} // Disable if status is 'published'
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="transition"
                    onClick={() => handleDelete(content._id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
              <Card.Footer className="text-muted text-center">
                <small>Created: {new Date(content.createdAt).toLocaleDateString()}</small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <EditContentModel
        show={showEditModal}
        handleClose={() => {
          setShowEditModal(false);
          setSelectedContent(null);
        }}
        content={selectedContent}
        handleUpdate={handleUpdate}
      />
    </Container>
  );
}

export default LandingPage;
