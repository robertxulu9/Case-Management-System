import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Case Management components
import CaseInfo from "./components/CaseInfo";
import CaseTimeline from "./components/CaseTimeline";
import CaseDocuments from "./components/CaseDocuments";
import CaseNotes from "./components/CaseNotes";

function CaseDetails() {
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch case details based on caseId
    // This will be implemented when we set up the API
    setLoading(false);
  }, [caseId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} lg={6}>
              <SoftTypography variant="h4" fontWeight="bold">
                Case Details
              </SoftTypography>
            </Grid>
            <Grid item xs={12} lg={6} display="flex" justifyContent="flex-end">
              <SoftButton
                variant="gradient"
                color="info"
                onClick={() => {/* Handle case update */}}
              >
                Update Case
              </SoftButton>
            </Grid>
          </Grid>
        </SoftBox>

        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card>
                <SoftBox p={3}>
                  <CaseInfo caseData={caseData} />
                </SoftBox>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card>
                <SoftBox p={3}>
                  <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                    Case Status
                  </SoftTypography>
                  {/* Status component will be added here */}
                </SoftBox>
              </Card>
            </Grid>
          </Grid>
        </SoftBox>

        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card>
                <SoftBox p={3}>
                  <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                    Case Timeline
                  </SoftTypography>
                  <CaseTimeline caseId={caseId} />
                </SoftBox>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card>
                <SoftBox p={3}>
                  <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                    Related Documents
                  </SoftTypography>
                  <CaseDocuments caseId={caseId} />
                </SoftBox>
              </Card>
            </Grid>
          </Grid>
        </SoftBox>

        <SoftBox mb={3}>
          <Card>
            <SoftBox p={3}>
              <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                Case Notes
              </SoftTypography>
              <CaseNotes caseId={caseId} />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default CaseDetails; 