import { Grid } from "@mui/material";
import EventsSummary from "./components/EventsSummary";
import RecentCaseActivities from "./components/RecentCaseActivities";
import RecentlyAddedClients from "./components/RecentlyAddedClients";
import Templates from "./components/Templates";
import CaseMetrics from "./components/CaseMetrics";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import Footer from "examples/Footer";

function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CaseMetrics />
          </Grid>
          <Grid item xs={12} md={6}>
            <RecentCaseActivities />
          </Grid>
          <Grid item xs={12} md={6}>
            <RecentlyAddedClients />
          </Grid>
          <Grid item xs={12} md={6}>
            <Templates />
          </Grid>
          <Grid item xs={12}>
            <EventsSummary />
          </Grid>
        </Grid>
      </SoftBox>
      <Footer 
        company={{
          href: "https://www.creative-tim.com/",
          name: "Robert Zulu"
        }}
      />
    </DashboardLayout>
  );
}

export default Dashboard;
