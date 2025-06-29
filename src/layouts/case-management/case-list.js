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
import CasesTable from "./components/CasesTable";
import CaseFilters from "./components/CaseFilters";
import CaseModal from "./components/CaseModal";

// Soft UI Dashboard React context
import { useSoftUIController, setDirection } from "context";
import { caseOperations } from "services/databaseService";

function CaseList() {
  const [controller, dispatch] = useSoftUIController();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all"
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await caseOperations.getAllCases();
      setCases(data);
    } catch (err) {
      console.error('Error loading cases:', err);
      setError(err.message);
      toast.error('Failed to load cases: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateCase = async (caseData) => {
    try {
      await caseOperations.createCase(caseData);
      toast.success('Case created successfully');
      loadCases();
      handleCloseModal();
    } catch (error) {
      console.error('Error creating case:', error);
      toast.error('Failed to create case: ' + error.message);
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
                Cases
              </SoftTypography>
            </Grid>
            <Grid item xs={12} lg={6} display="flex" justifyContent="flex-end">
              <SoftButton
                variant="gradient"
                color="info"
                onClick={() => handleOpenModal()}
              >
                New Case
              </SoftButton>
            </Grid>
          </Grid>
        </SoftBox>

        <Card>
          <SoftBox p={3}>
            <CaseFilters filters={filters} onFilterChange={setFilters} />
            <CasesTable 
              cases={cases} 
              filters={filters}
              loading={loading}
              error={error}
              onRetry={loadCases}
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
      <CaseModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleCreateCase}
      />
    </DashboardLayout>
  );
}

export default CaseList; 