import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DOMPurify from "dompurify";
import {
  Card,
  TextField,
  Button,
  Icon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import Grid from "@mui/material/Grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Services
import { templateOperations } from "services/databaseService";
import { clientOperations } from "services/databaseService";
import { documentOperations } from "services/databaseService";

function TemplateUse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState(null);
  const [variables, setVariables] = useState({});
  const [generatedContent, setGeneratedContent] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [clients, setClients] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTemplate();
    fetchClients();
  }, [id]);

  const fetchTemplate = async () => {
    try {
      const data = await templateOperations.getTemplateById(id);
      setTemplate(data);
      
      // Initialize variables state
      const vars = {};
      let varArray;
      
      try {
        // Handle the backtick format
        if (typeof data.variables === 'string' && data.variables.startsWith('[') && data.variables.endsWith(']')) {
          // Remove backticks and split by comma
          const cleanStr = data.variables.replace(/[`]/g, '');
          varArray = cleanStr.split(',').map(v => v.trim());
        } else {
          // Try parsing as JSON
          varArray = JSON.parse(data.variables);
        }
      } catch (e) {
        console.error('Error parsing variables:', e);
        toast.error('Invalid template format');
        return;
      }
      
      // Ensure varArray is an array
      if (!Array.isArray(varArray)) {
        console.error('Template variables is not an array:', data.variables);
        toast.error('Invalid template format');
        return;
      }

      varArray.forEach(v => {
        vars[v] = '';
      });
      setVariables(vars);
    } catch (error) {
      console.error('Error fetching template:', error);
      toast.error('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const data = await clientOperations.getAllClients();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    }
  };

  const handleVariableChange = (name, value) => {
    setVariables(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreview = async () => {
    try {
      // Validate variables
      const emptyVars = Object.entries(variables).filter(([_, value]) => !value);
      if (emptyVars.length > 0) {
        toast.error(`Please fill in all required fields: ${emptyVars.map(([key]) => key).join(', ')}`);
        return;
      }

      console.log('Generating document with variables:', variables);
      const result = await templateOperations.generateDocument(id, variables);
      console.log('Generation result:', result);
      
      if (!result.content) {
        throw new Error('No content generated');
      }

      setGeneratedContent(result.content);
      setPreviewMode(true);
    } catch (error) {
      console.error('Error generating document:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        variables,
        templateId: id
      });
      toast.error(error.message || 'Failed to generate document');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${template.title.toLowerCase().replace(/\s+/g, '_')}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${template.title}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${generatedContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSendToClient = async () => {
    try {
      setSending(true);
      
      // Get the selected client's details
      const client = clients.find(c => c.id === selectedClient);
      if (!client) {
        throw new Error('Selected client not found');
      }

      // Create a document record
      const documentData = {
        title: template.title,
        content: generatedContent,
        clientId: parseInt(selectedClient, 10),
        templateId: parseInt(id, 10),
        status: 'sent',
        sentDate: new Date().toISOString()
      };

      console.log('Sending document with data:', {
        title: documentData.title,
        contentLength: documentData.content?.length,
        clientId: documentData.clientId,
        templateId: documentData.templateId,
        clientIdType: typeof documentData.clientId,
        templateIdType: typeof documentData.templateId
      });

      const result = await documentOperations.createDocument(documentData);
      console.log('Document sent successfully:', result);
      
      toast.success(`Document sent to ${client.firstname} ${client.lastname}`);
      setSendModalOpen(false);
    } catch (error) {
      console.error('Error sending document:', error);
      // Show the specific error message from the server if available
      toast.error(error.message || 'Failed to send document to client');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={3}>
          <SoftTypography>Loading...</SoftTypography>
        </SoftBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs>
              <SoftTypography variant="h4" fontWeight="medium">
                Use Template: {template?.title}
              </SoftTypography>
            </Grid>
            <Grid item>
              <SoftButton
                variant="gradient"
                color="secondary"
                onClick={() => navigate('/templates')}
                startIcon={<Icon>arrow_back</Icon>}
              >
                Back to Templates
              </SoftButton>
            </Grid>
          </Grid>
        </SoftBox>

        <Grid container spacing={3}>
          {!previewMode ? (
            <Grid item xs={12} lg={6}>
              <Card>
                <SoftBox p={3}>
                  <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                    Fill Template Variables
                  </SoftTypography>
                  <Grid container spacing={2}>
                    {Object.keys(variables).map((varName) => (
                      <Grid item xs={12} key={varName}>
                        <TextField
                          fullWidth
                          label={varName}
                          value={variables[varName]}
                          onChange={(e) => handleVariableChange(varName, e.target.value)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <SoftBox mt={3}>
                    <SoftButton
                      variant="gradient"
                      color="info"
                      fullWidth
                      onClick={handlePreview}
                    >
                      Preview Document
                    </SoftButton>
                  </SoftBox>
                </SoftBox>
              </Card>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Card>
                <SoftBox p={3}>
                  <Grid container spacing={2} alignItems="center" mb={3}>
                    <Grid item xs>
                      <SoftTypography variant="h6" fontWeight="medium">
                        Document Preview
                      </SoftTypography>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        startIcon={<Icon>edit</Icon>}
                        onClick={() => setPreviewMode(false)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Icon>download</Icon>}
                        onClick={handleDownload}
                        sx={{ mr: 1 }}
                      >
                        Download
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Icon>send</Icon>}
                        onClick={() => setSendModalOpen(true)}
                        sx={{ mr: 1 }}
                      >
                        Send to Client
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Icon>print</Icon>}
                        onClick={handlePrint}
                      >
                        Print
                      </Button>
                    </Grid>
                  </Grid>
                  <Card variant="outlined">
                    <SoftBox p={3}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(generatedContent)
                        }}
                      />
                    </SoftBox>
                  </Card>
                </SoftBox>
              </Card>
            </Grid>
          )}
        </Grid>
      </SoftBox>

      {/* Send to Client Modal */}
      <Dialog 
        open={sendModalOpen} 
        onClose={() => setSendModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Send Document to Client</DialogTitle>
        <DialogContent>
          <SoftBox py={2}>
            <FormControl fullWidth>
              <InputLabel>Select Client</InputLabel>
              <Select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                label="Select Client"
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.firstname} {client.lastname} - {client.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </SoftBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendModalOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSendToClient}
            variant="contained"
            disabled={!selectedClient || sending}
            startIcon={sending ? <CircularProgress size={20} /> : <Icon>send</Icon>}
          >
            {sending ? 'Sending...' : 'Send'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default TemplateUse; 