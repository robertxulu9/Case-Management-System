import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Case Management components
import CaseAnalytics from "./components/CaseAnalytics";
import ClientAnalytics from "./components/ClientAnalytics";
import DocumentAnalytics from "./components/DocumentAnalytics";
import ReportGenerator from "./components/ReportGenerator";

function Reports() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} lg={6}>
              <SoftTypography variant="h4" fontWeight="bold">
                Reports & Analytics
              </SoftTypography>
            </Grid>
            <Grid item xs={12} lg={6} display="flex" justifyContent="flex-end">
              <SoftButton
                variant="gradient"
                color="info"
                onClick={() => {/* Handle report generation */}}
              >
                Generate Report
              </SoftButton>
            </Grid>
          </Grid>
        </SoftBox>

        <SoftBox mb={3}>
          <Card>
            <SoftBox p={3}>
              <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab label="Case Analytics" />
                <Tab label="Client Analytics" />
                <Tab label="Document Analytics" />
                <Tab label="Custom Reports" />
              </Tabs>
            </SoftBox>
            <SoftBox p={3}>
              {selectedTab === 0 && (
                <CaseAnalytics
                  dateRange={dateRange}
                  onDateRangeChange={handleDateRangeChange}
                />
              )}
              {selectedTab === 1 && (
                <ClientAnalytics
                  dateRange={dateRange}
                  onDateRangeChange={handleDateRangeChange}
                />
              )}
              {selectedTab === 2 && (
                <DocumentAnalytics
                  dateRange={dateRange}
                  onDateRangeChange={handleDateRangeChange}
                  analytics={{
                    totalDocuments: 0,
                    totalSize: 0,
                    categoryCount: 0,
                    categoryDistribution: [],
                    typeDistribution: [],
                    recentUploads: []
                  }}
                  loading={false}
                  error={null}
                  onRetry={() => {}}
                />
              )}
              {selectedTab === 3 && (
                <ReportGenerator
                  dateRange={dateRange}
                  onDateRangeChange={handleDateRangeChange}
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

export default Reports; 