import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Case Management components
import DocumentList from "./components/DocumentList";
import DocumentUpload from "./components/DocumentUpload";
import DocumentCategories from "./components/DocumentCategories";

// Services
import { documentOperations } from "services/databaseService";

// Document categories
const DOCUMENT_CATEGORIES = [
  { value: "contracts", label: "Contracts" },
  { value: "reports", label: "Reports" },
  { value: "correspondence", label: "Correspondence" },
  { value: "evidence", label: "Evidence" },
  { value: "legal_filings", label: "Legal Filings" },
  { value: "client_documents", label: "Client Documents" },
  { value: "other", label: "Other" }
];

console.log('DOCUMENT_CATEGORIES in parent:', DOCUMENT_CATEGORIES);

function DocumentManagement() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [uploadLoading, setUploadLoading] = useState(false);

  // Fetch all documents when component mounts
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentOperations.getAllDocuments();
      setDocuments(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err.message);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleUploadDocument = async (files, category, description) => {
    setUploadLoading(true);
    const uploadPromises = files.map(async (file) => {
      try {
        const document = await documentOperations.uploadDocument(
          null, // No case ID for general document management
          file,
          category,
          description
        );
        return document;
      } catch (err) {
        console.error("Error uploading document:", err);
        throw err;
      }
    });

    try {
      await Promise.all(uploadPromises);
      toast.success("Documents uploaded successfully!");
      fetchDocuments(); // Refresh the documents list
      setSelectedTab(0); // Switch back to document list
    } catch (err) {
      toast.error("Failed to upload one or more documents");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDownloadDocument = async (document) => {
    try {
      const { downloadUrl } = await documentOperations.downloadDocument(document.id, false);
      
      // Create a temporary link and click it to start the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = document.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading document:", err);
      toast.error("Failed to download document");
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      await documentOperations.deleteDocument(documentId, false);
      toast.success("Document deleted successfully");
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId));
    } catch (err) {
      console.error("Error deleting document:", err);
      toast.error("Failed to delete document");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} lg={6}>
              <SoftTypography variant="h4" fontWeight="bold">
                Document Management
              </SoftTypography>
            </Grid>
            <Grid item xs={12} lg={6} display="flex" justifyContent="flex-end">
              <SoftButton
                variant="gradient"
                color="info"
                onClick={() => setSelectedTab(1)}
              >
                Upload Document
              </SoftButton>
            </Grid>
          </Grid>
        </SoftBox>

        <SoftBox mb={3}>
          <Card>
            <SoftBox p={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <SoftInput
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <FormControl fullWidth>
                    <InputLabel id="category-filter-label">Category</InputLabel>
                    <Select
                      labelId="category-filter-label"
                      value={selectedCategory}
                      label="Category"
                      onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      {DOCUMENT_CATEGORIES.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </SoftBox>
          </Card>
        </SoftBox>

        <SoftBox mb={3}>
          <Card>
            <SoftBox p={3}>
              <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab label="Document List" />
                <Tab label="Upload Document" />
              </Tabs>
            </SoftBox>
            <SoftBox p={3}>
              {selectedTab === 0 ? (
                <DocumentList
                  documents={documents}
                  loading={loading}
                  error={error}
                  searchQuery={searchQuery}
                  category={selectedCategory}
                  onDownload={handleDownloadDocument}
                  onDelete={handleDeleteDocument}
                  onRetry={fetchDocuments}
                />
              ) : (
                <DocumentUpload
                  categories={[...DOCUMENT_CATEGORIES]}
                  loading={uploadLoading}
                  error={error}
                  onUpload={handleUploadDocument}
                  onRetry={fetchDocuments}
                />
              )}
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>
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

export default DocumentManagement; 