import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Case Management components
import CaseStats from "./components/CaseStats";
import RecentCases from "./components/RecentCases";
import CaseTimeline from "./components/CaseTimeline";

function Dashboard() {
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    closedCases: 0,
    urgentCases: 0,
  });

  // Sample timeline events
  const timelineEvents = [
    {
      id: "1",
      title: "New Case Created",
      description: "Case #123 has been created",
      timestamp: new Date().toISOString(),
      type: "update"
    },
    {
      id: "2",
      title: "Case Status Updated",
      description: "Case #456 status changed to In Progress",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      type: "status_change"
    },
    {
      id: "3",
      title: "Document Added",
      description: "New document uploaded to Case #789",
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      type: "update"
    }
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <SoftTypography variant="h4" fontWeight="bold">
                Case Management Dashboard
              </SoftTypography>
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CaseStats stats={stats} />
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card>
                <SoftBox p={3}>
                  <SoftTypography variant="h6" fontWeight="medium">
                    Recent Cases
                  </SoftTypography>
                  <RecentCases cases={cases} />
                </SoftBox>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card>
                <SoftBox p={3}>
                  <SoftTypography variant="h6" fontWeight="medium">
                    Case Timeline
                  </SoftTypography>
                  <CaseTimeline events={timelineEvents} />
                </SoftBox>
              </Card>
            </Grid>
          </Grid>
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

export default Dashboard; 