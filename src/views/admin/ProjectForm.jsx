import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Row, Col, Button, Card, Badge, Alert, Spinner } from 'react-bootstrap';
import useProjectStore from '../../stores/shared/projectStore';
import toast from 'react-hot-toast';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProject, loading, error, createProject, updateProject, fetchProject } = useProjectStore();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Software Development',
    subCategory: '',
    clientName: '',
    clientIndustry: '',
    shortDescription: '',
    fullDescription: '',
    challenge: '',
    solution: '',
    results: '',
    technologies: [],
    teamSize: '',
    projectDuration: '',
    startDate: '',
    endDate: '',
    projectUrl: '',
    githubUrl: '',
    demoUrl: '',
    clientTestimonial: '',
    testimonialAuthor: '',
    testimonialPosition: '',
    projectManager: '',
    teamMembers: [],
    stakeholders: [],
    budget: '',
    currency: 'USD',
    roi: '',
    kpis: {},
    isConfidential: false,
    confidentialityNotice: '',
    status: 'planned',
    completionPercentage: 0,
    milestones: [],
    priority: 'medium',
    isFeatured: false,
    isPublished: false,
    tags: [],
    location: '',
    country: '',
    notes: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });

  const [mediaFiles, setMediaFiles] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [milestoneInput, setMilestoneInput] = useState({ title: '', date: '', description: '' });
  const [teamMemberInput, setTeamMemberInput] = useState('');
  const [stakeholderInput, setStakeholderInput] = useState('');

  useEffect(() => {
    if (id) fetchProject(id);
  }, [id]);

  useEffect(() => {
    if (currentProject && id) {
      setFormData({
        ...formData,
        ...currentProject,
        startDate: currentProject.startDate ? currentProject.startDate.split('T')[0] : '',
        endDate: currentProject.endDate ? currentProject.endDate.split('T')[0] : '',
        budget: currentProject.budget || '',
        teamMembers: currentProject.teamMembers || [],
        stakeholders: currentProject.stakeholders || [],
        milestones: currentProject.milestones || [],
        kpis: currentProject.kpis || {},
        tags: currentProject.tags || [],
        technologies: currentProject.technologies || [],
      });
    }
  }, [currentProject, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayAdd = (field, value, setInput) => {
    if (value && !formData[field].includes(value)) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], value] }));
      setInput('');
    }
  };

  const handleArrayRemove = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  const handleFileChange = (e) => {
    setMediaFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const projectData = {
        ...formData,
        createdBy: user.userId,
        updatedBy: user.userId,
      };
      let result;
      if (id) {
        result = await updateProject(id, projectData, mediaFiles);
      } else {
        result = await createProject(projectData, mediaFiles);
      }
      if (result.success) {
        toast.success(result.message || 'Project saved');
        navigate('/admin/projects');
      } else {
        toast.error(result.error || 'Error saving project');
      }
    } catch (err) {
      toast.error('An error occurred');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container fluid className="py-4">
      <h1 className="h2 mb-4">{id ? 'Edit Project' : 'Create New Project'}</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={8}>
            {/* Basic Info */}
            <Card className="mb-4">
              <Card.Header>Basic Information</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category *</Form.Label>
                      <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                        <option value="IoT">IoT</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Mobile apps">Mobile Apps</option>
                        <option value="Web apps">Web Apps</option>
                        <option value="Installations">Installations</option>
                        <option value="Networking">Networking</option>
                        <option value="Embedded Systems">Embedded Systems</option>
                        <option value="Software Development">Software Development</option>
                        <option value="ICT Infrastructure">ICT Infrastructure</option>
                        <option value="Security Systems">Security Systems</option>
                        <option value="Cloud Computing">Cloud Computing</option>
                        <option value="AI/ML">AI/ML</option>
                        <option value="Blockchain">Blockchain</option>
                        <option value="Robotics">Robotics</option>
                        <option value="Telecommunications">Telecommunications</option>
                        <option value="Data Center">Data Center</option>
                        <option value="IT Consulting">IT Consulting</option>
                        <option value="Hardware Design">Hardware Design</option>
                        <option value="Firmware Development">Firmware Development</option>
                        <option value="System Integration">System Integration</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Sub Category</Form.Label>
                      <Form.Control
                        type="text"
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Client Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Client Industry</Form.Label>
                      <Form.Control
                        type="text"
                        name="clientIndustry"
                        value={formData.clientIndustry}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Description & Details */}
            <Card className="mb-4">
              <Card.Header>Description & Details</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Short Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Full Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="fullDescription"
                    value={formData.fullDescription}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Challenge</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="challenge"
                    value={formData.challenge}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Solution</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="solution"
                    value={formData.solution}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Results</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="results"
                    value={formData.results}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Technologies & Tags */}
            <Card className="mb-4">
              <Card.Header>Technologies & Tags</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Technologies</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="Add technology"
                      className="me-2"
                    />
                    <Button variant="outline-primary" onClick={() => handleArrayAdd('technologies', techInput, setTechInput)}>
                      Add
                    </Button>
                  </div>
                  <div className="mt-2">
                    {formData.technologies.map(tech => (
                      <Badge bg="secondary" className="me-1 mb-1" key={tech}>
                        {tech}{' '}
                        <span
                          role="button"
                          className="text-white ms-1"
                          onClick={() => handleArrayRemove('technologies', tech)}
                        >
                          ×
                        </span>
                      </Badge>
                    ))}
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tags</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag"
                      className="me-2"
                    />
                    <Button variant="outline-primary" onClick={() => handleArrayAdd('tags', tagInput, setTagInput)}>
                      Add
                    </Button>
                  </div>
                  <div className="mt-2">
                    {formData.tags.map(tag => (
                      <Badge bg="info" className="me-1 mb-1" key={tag}>
                        {tag}{' '}
                        <span
                          role="button"
                          className="text-white ms-1"
                          onClick={() => handleArrayRemove('tags', tag)}
                        >
                          ×
                        </span>
                      </Badge>
                    ))}
                  </div>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Timeline & Team */}
            <Card className="mb-4">
              <Card.Header>Timeline & Team</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Project Duration</Form.Label>
                      <Form.Control
                        type="text"
                        name="projectDuration"
                        value={formData.projectDuration}
                        onChange={handleChange}
                        placeholder="e.g. 3 months"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Team Size</Form.Label>
                      <Form.Control
                        type="number"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleChange}
                        min={1}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Team Members (User IDs)</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      value={teamMemberInput}
                      onChange={(e) => setTeamMemberInput(e.target.value)}
                      placeholder="Enter user ID"
                      className="me-2"
                    />
                    <Button variant="outline-primary" onClick={() => handleArrayAdd('teamMembers', teamMemberInput, setTeamMemberInput)}>
                      Add
                    </Button>
                  </div>
                  <div className="mt-2">
                    {formData.teamMembers.map(id => (
                      <Badge bg="dark" className="me-1 mb-1" key={id}>
                        #{id}{' '}
                        <span
                          role="button"
                          className="text-white ms-1"
                          onClick={() => handleArrayRemove('teamMembers', id)}
                        >
                          ×
                        </span>
                      </Badge>
                    ))}
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Stakeholders</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      value={stakeholderInput}
                      onChange={(e) => setStakeholderInput(e.target.value)}
                      placeholder="Add stakeholder"
                      className="me-2"
                    />
                    <Button variant="outline-primary" onClick={() => handleArrayAdd('stakeholders', stakeholderInput, setStakeholderInput)}>
                      Add
                    </Button>
                  </div>
                  <div className="mt-2">
                    {formData.stakeholders.map(s => (
                      <Badge bg="warning" className="me-1 mb-1" key={s}>
                        {s}{' '}
                        <span
                          role="button"
                          className="text-dark ms-1"
                          onClick={() => handleArrayRemove('stakeholders', s)}
                        >
                          ×
                        </span>
                      </Badge>
                    ))}
                  </div>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Links */}
            <Card className="mb-4">
              <Card.Header>Links</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Project URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="projectUrl"
                    value={formData.projectUrl}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>GitHub URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Demo URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="demoUrl"
                    value={formData.demoUrl}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Testimonial */}
            <Card className="mb-4">
              <Card.Header>Client Testimonial</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Testimonial Text</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="clientTestimonial"
                    value={formData.clientTestimonial}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Author</Form.Label>
                      <Form.Control
                        type="text"
                        name="testimonialAuthor"
                        value={formData.testimonialAuthor}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Position</Form.Label>
                      <Form.Control
                        type="text"
                        name="testimonialPosition"
                        value={formData.testimonialPosition}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Milestones */}
            <Card className="mb-4">
              <Card.Header>Milestones</Card.Header>
              <Card.Body>
                <Row className="g-2">
                  <Col md={5}>
                    <Form.Control
                      type="text"
                      placeholder="Title"
                      value={milestoneInput.title}
                      onChange={(e) => setMilestoneInput({ ...milestoneInput, title: e.target.value })}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      type="date"
                      value={milestoneInput.date}
                      onChange={(e) => setMilestoneInput({ ...milestoneInput, date: e.target.value })}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      type="text"
                      placeholder="Description"
                      value={milestoneInput.description}
                      onChange={(e) => setMilestoneInput({ ...milestoneInput, description: e.target.value })}
                    />
                  </Col>
                  <Col md={1}>
                    <Button
                      variant="outline-success"
                      onClick={() => {
                        if (milestoneInput.title && milestoneInput.date) {
                          setFormData(prev => ({
                            ...prev,
                            milestones: [...prev.milestones, { ...milestoneInput, status: 'pending' }]
                          }));
                          setMilestoneInput({ title: '', date: '', description: '' });
                        }
                      }}
                    >
                      +
                    </Button>
                  </Col>
                </Row>
                <div className="mt-3">
                  {formData.milestones.map((m, idx) => (
                    <div key={idx} className="d-flex justify-content-between align-items-center border-bottom py-1">
                      <div>
                        <strong>{m.title}</strong> - {m.date} {m.description && `(${m.description})`}
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          const newMilestones = [...formData.milestones];
                          newMilestones.splice(idx, 1);
                          setFormData(prev => ({ ...prev, milestones: newMilestones }));
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Budget & KPIs */}
            <Card className="mb-4">
              <Card.Header>Budget & KPIs</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Budget</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Currency</Form.Label>
                      <Form.Select name="currency" value={formData.currency} onChange={handleChange}>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>ROI</Form.Label>
                      <Form.Control
                        type="text"
                        name="roi"
                        value={formData.roi}
                        onChange={handleChange}
                        placeholder="e.g. 150%"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Completion Percentage</Form.Label>
                      <Form.Control
                        type="number"
                        name="completionPercentage"
                        value={formData.completionPercentage}
                        onChange={handleChange}
                        min={0}
                        max={100}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>KPIs (JSON)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="kpis"
                    value={JSON.stringify(formData.kpis, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setFormData(prev => ({ ...prev, kpis: parsed }));
                      } catch {
                        // keep as is
                      }
                    }}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Confidentiality */}
            <Card className="mb-4">
              <Card.Header>Confidentiality</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Is Confidential"
                    name="isConfidential"
                    checked={formData.isConfidential}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confidentiality Notice</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="confidentialityNotice"
                    value={formData.confidentialityNotice}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* SEO & Meta */}
            <Card className="mb-4">
              <Card.Header>SEO & Meta</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Meta Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Meta Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Meta Keywords</Form.Label>
                  <Form.Control
                    type="text"
                    name="metaKeywords"
                    value={formData.metaKeywords}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Location & Notes */}
            <Card className="mb-4">
              <Card.Header>Location & Notes</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Media Upload */}
            <Card className="mb-4">
              <Card.Header>Media Files</Card.Header>
              <Card.Body>
                <Form.Group>
                  <Form.Label>Upload Images, Videos, or Documents</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <Form.Text className="text-muted">
                    Max 20 files. Images (10MB), Videos (100MB), Documents (20MB)
                  </Form.Text>
                </Form.Group>
                {mediaFiles.length > 0 && (
                  <div className="mt-3">
                    <strong>Selected files:</strong>
                    <ul>
                      {Array.from(mediaFiles).map((file, idx) => (
                        <li key={idx}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Submit */}
            <div className="d-flex gap-2 mb-5">
              <Button variant="secondary" onClick={() => navigate('/admin/projects')}>Cancel</Button>
              <Button variant="primary" type="submit">{id ? 'Update Project' : 'Create Project'}</Button>
            </div>
          </Col>

          <Col lg={4}>
            {/* Status, Priority, Featured, Published */}
            <Card className="mb-4">
              <Card.Header>Status & Settings</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleChange}>
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="maintenance">Maintenance</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select name="priority" value={formData.priority} onChange={handleChange}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Featured Project"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Published"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Project Manager (user ID) */}
            <Card className="mb-4">
              <Card.Header>Project Manager</Card.Header>
              <Card.Body>
                <Form.Group>
                  <Form.Label>Manager User ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="projectManager"
                    value={formData.projectManager}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Quick actions: clone, export */}
            {id && (
              <Card className="mb-4">
                <Card.Header>Actions</Card.Header>
                <Card.Body>
                  <Button
                    variant="outline-info"
                    className="w-100 mb-2"
                    onClick={async () => {
                      const newTitle = prompt('Enter new title for clone:', `Copy of ${formData.title}`);
                      if (newTitle) {
                        const user = JSON.parse(localStorage.getItem('user') || '{}');
                        const result = await useProjectStore.getState().cloneProject(id, newTitle, user.userId);
                        if (result.success) toast.success('Project cloned');
                        else toast.error('Clone failed');
                      }
                    }}
                  >
                    Clone Project
                  </Button>
                  <Button
                    variant="outline-secondary"
                    className="w-100"
                    onClick={async () => {
                      const result = await useProjectStore.getState().exportProject(id, 'json');
                      if (result.success) {
                        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `project-${id}.json`;
                        a.click();
                      } else toast.error('Export failed');
                    }}
                  >
                    Export as JSON
                  </Button>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default ProjectForm;