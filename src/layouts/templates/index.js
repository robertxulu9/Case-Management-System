import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftBadge from "components/SoftBadge";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Services
import { templateOperations } from "services/databaseService";

const CATEGORIES = [
  { value: 'all', label: 'All Templates' },
  { value: 'client_forms', label: 'Client Forms' },
  { value: 'agreements', label: 'Agreements' },
  { value: 'authorizations', label: 'Authorizations' },
  { value: 'court_documents', label: 'Court Documents' },
  { value: 'general', label: 'General' }
];

function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, [currentCategory]);

  const fetchTemplates = async () => {
    try {
      let data;
      if (currentCategory === 'all') {
        data = await templateOperations.getAllTemplates();
      } else {
        data = await templateOperations.getTemplatesByCategory(currentCategory);
      }
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMenu = (event, template) => {
    setMenuAnchor(event.currentTarget);
    setSelectedTemplate(template);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedTemplate(null);
  };

  const handleCategoryChange = (event, newValue) => {
    setCurrentCategory(newValue);
  };

  const handleDelete = async () => {
    try {
      await templateOperations.deleteTemplate(selectedTemplate.id);
      fetchTemplates();
      handleCloseMenu();
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'client_forms':
        return 'info';
      case 'agreements':
        return 'success';
      case 'authorizations':
        return 'warning';
      case 'court_documents':
        return 'error';
      case 'general':
        return 'secondary';
      default:
        return 'default';
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
                Document Templates
              </SoftTypography>
            </Grid>
            <Grid item>
              <SoftButton
                component={Link}
                to="/templates/new"
                variant="gradient"
                color="info"
                startIcon={<Icon>add</Icon>}
              >
                New Template
              </SoftButton>
            </Grid>
          </Grid>
        </SoftBox>

        <Card>
          <SoftBox p={3}>
            <SoftBox 
              sx={{ 
                width: '100%',
                '.MuiTabs-root': {
                  overflow: 'auto',
                  scrollbarWidth: 'none', // Firefox
                  '&::-webkit-scrollbar': { // Webkit
                    display: 'none'
                  },
                  '-ms-overflow-style': 'none' // IE/Edge
                }
              }}
            >
              <Tabs
                value={currentCategory}
                onChange={handleCategoryChange}
                variant="standard"
                textColor="primary"
                indicatorColor="primary"
                sx={{ 
                  minHeight: 48,
                  borderBottom: 1,
                  borderColor: 'divider'
                }}
              >
                {CATEGORIES.map((category) => (
                  <Tab
                    key={category.value}
                    value={category.value}
                    label={category.label}
                    sx={{ 
                      minHeight: 48,
                      minWidth: 'auto',
                      px: 2,
                      '&:not(:last-of-type)': {
                        mr: 2
                      }
                    }}
                  />
                ))}
              </Tabs>
            </SoftBox>
          </SoftBox>
        </Card>

        <SoftBox mt={3}>
          <Grid container spacing={3}>
            {templates.map((template) => (
              <Grid item xs={12} md={6} xl={4} key={template.id}>
                <Card>
                  <SoftBox p={3}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs>
                        <SoftTypography variant="h6" fontWeight="medium">
                          {template.title}
                        </SoftTypography>
                        <SoftTypography variant="body2" color="text">
                          {template.description}
                        </SoftTypography>
                      </Grid>
                      <Grid item>
                        <SoftBadge
                          variant="contained"
                          color={getCategoryColor(template.category)}
                          badgeContent={template.category.replace('_', ' ')}
                          container
                        />
                      </Grid>
                      <Grid item>
                        <IconButton
                          size="small"
                          onClick={(event) => handleOpenMenu(event, template)}
                        >
                          <Icon>more_vert</Icon>
                        </IconButton>
                      </Grid>
                    </Grid>
                    <SoftBox mt={2}>
                      <SoftButton
                        component={Link}
                        to={`/templates/${template.id}/use`}
                        variant="outlined"
                        color="info"
                        size="small"
                        fullWidth
                      >
                        Use Template
                      </SoftButton>
                    </SoftBox>
                  </SoftBox>
                </Card>
              </Grid>
            ))}
          </Grid>
        </SoftBox>
      </SoftBox>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          component={Link}
          to={`/templates/${selectedTemplate?.id}/edit`}
          onClick={handleCloseMenu}
        >
          <Icon>edit</Icon>&nbsp;Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Icon>delete</Icon>&nbsp;Delete
        </MenuItem>
      </Menu>

      <Footer 
        company={{
          href: "https://www.creative-tim.com/",
          name: "Creative Tim"
        }}
        links={[
          { href: "https://www.creative-tim.com/", name: "Creative Tim" },
          { href: "https://www.creative-tim.com/presentation", name: "About Us" },
          { href: "https://www.creative-tim.com/blog", name: "Blog" },
          { href: "https://www.creative-tim.com/license", name: "License" }
        ]}
      />
    </DashboardLayout>
  );
}

export default Templates; 