import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

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
import ClientsTable from "./components/ClientsTable";
import ClientDetails from "./components/ClientDetails";

// Services
import { clientOperations } from "services/databaseService";

function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientOperations.getAllClients();
      setClients(data);
    } catch (err) {
      console.error('Error loading clients:', err);
      setError(err.message);
      toast.error('Failed to load clients: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (client) => {
    setSelectedClient(client);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedClient(null);
    setShowDetails(false);
  };

  const handleCreateClient = async (clientData) => {
    try {
      await clientOperations.createClient(clientData);
      toast.success('Client created successfully');
      loadClients();
      handleCloseDetails();
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Failed to create client: ' + error.message);
    }
  };

  const handleNewClient = () => {
    setSelectedClient(null);
    setShowDetails(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} lg={6}>
              <SoftTypography variant="h4" fontWeight="bold">
                Clients
              </SoftTypography>
            </Grid>
            <Grid item xs={12} lg={6} display="flex" justifyContent="flex-end">
              <SoftButton
                variant="gradient"
                color="info"
                onClick={handleNewClient}
              >
                New Client
              </SoftButton>
            </Grid>
          </Grid>
        </SoftBox>

        <Card>
          <SoftBox p={3}>
            <ClientsTable 
              clients={clients}
              loading={loading}
              error={error}
              onRetry={loadClients}
              onViewDetails={handleViewDetails}
            />
          </SoftBox>
        </Card>
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
      <ClientDetails
        open={showDetails}
        client={selectedClient}
        onClose={handleCloseDetails}
        onSubmit={handleCreateClient}
      />
    </DashboardLayout>
  );
}

export default ClientList; 