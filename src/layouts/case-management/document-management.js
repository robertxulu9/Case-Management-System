import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

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

function DocumentManagement() {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
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
                  <DocumentCategories
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                  />
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
                  searchQuery={searchQuery}
                  category={selectedCategory}
                />
              ) : (
                <DocumentUpload onUploadComplete={() => setSelectedTab(0)} />
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