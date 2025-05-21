import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Custom components
import ClientModal from "./components/ClientModal";
import ClientsTable from "./components/ClientsTable";

// Database operations
import { clientOperations } from "services/databaseService";

function Clients() {
  const [clients, setClients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load clients from Supabase
  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading clients from Supabase...');
      const data = await clientOperations.getAllClients();
      console.log('Loaded clients:', data);
      setClients(data || []);
    } catch (err) {
      console.error('Error loading clients:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleAddClient = () => {
    setSelectedClient(null);
    setModalOpen(true);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  const handleSaveClient = async (clientData) => {
    try {
      setError(null);
      console.log('Saving client...', clientData);
      
      if (selectedClient) {
        // Update existing client
        const updated = await clientOperations.updateClient(selectedClient.id, clientData);
        console.log('Updated client:', updated);
      } else {
        // Add new client
        const created = await clientOperations.createClient(clientData);
        console.log('Created client:', created);
      }
      
      // Close modal and reload the clients list
      setModalOpen(false);
      await loadClients();
    } catch (err) {
      console.error('Error saving client:', err);
      // Format the error message
      let errorMessage = 'Failed to save client';
      if (err.message) {
        errorMessage = err.message;
      } else if (err.details) {
        errorMessage = err.details;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setError(errorMessage);
      // Don't close modal on error so user can try again
      throw err; // Re-throw to let modal handle the error display
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedClient(null);
    setError(null);
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await clientOperations.deleteClient(clientId);
        await loadClients();
      } catch (err) {
        console.error('Error deleting client:', err);
        setError(err.message);
      }
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
                Clients
              </SoftTypography>
            </Grid>
            <Grid item xs={12} lg={6} display="flex" justifyContent="flex-end">
              <SoftButton
                variant="gradient"
                color="info"
                onClick={handleAddClient}
                startIcon={<Icon>add</Icon>}
              >
                Add Client
              </SoftButton>
            </Grid>
          </Grid>
        </SoftBox>

        <Card>
          <SoftBox p={3}>
            {error && (
              <SoftBox mb={2}>
                <SoftTypography variant="body2" color="error">
                  {error}
                </SoftTypography>
              </SoftBox>
            )}
            
            <ClientsTable
              clients={clients}
              loading={loading}
              onEdit={handleEditClient}
              onDelete={handleDeleteClient}
            />
          </SoftBox>
        </Card>
      </SoftBox>

      <ClientModal
        open={modalOpen}
        onClose={handleCloseModal}
        client={selectedClient}
        onSave={handleSaveClient}
      />

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

export default Clients; 