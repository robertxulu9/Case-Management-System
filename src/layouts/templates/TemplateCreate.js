import React, { useState } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { templateOperations } from '../../services/databaseService';
import toast from 'react-hot-toast';

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Custom components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const categories = [
  'Agreement',
  'Letter',
  'Notice',
  'Contract',
  'Other'
];

const TemplateCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState({
    title: '',
    description: '',
    category: '',
    content: '',
    variables: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!template.title || !template.content || !template.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await templateOperations.createTemplate(template);
      toast.success('Template created successfully');
      navigate('/templates');
    } catch (error) {
      toast.error(error.message || 'Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs>
              <SoftTypography variant="h4" fontWeight="medium">
                Create New Template
              </SoftTypography>
            </Grid>
            <Grid item>
              <SoftButton
                variant="gradient"
                color="secondary"
                onClick={() => navigate('/templates')}
              >
                Back to Templates
              </SoftButton>
            </Grid>
          </Grid>
        </SoftBox>

        <SoftBox>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Title"
                  name="title"
                  value={template.title}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={template.description}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Category"
                  name="category"
                  value={template.category}
                  onChange={handleChange}
                  variant="outlined"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Content"
                  name="content"
                  value={template.content}
                  onChange={handleChange}
                  multiline
                  rows={10}
                  variant="outlined"
                  helperText="Use {{variable}} syntax for variables"
                />
              </Grid>
              <Grid item xs={12}>
                <SoftButton
                  type="submit"
                  variant="gradient"
                  color="info"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Create Template"
                  )}
                </SoftButton>
              </Grid>
            </Grid>
          </form>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
};

export default TemplateCreate; 