import { useState, useEffect } from "react";

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
  const { direction = 'ltr' } = controller || {};
  const [cases, setCases] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    search: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    setDirection(dispatch, "ltr");
    // Fetch cases from Supabase
    const fetchCases = async () => {
      try {
        const data = await caseOperations.getAllCases();
        setCases(data || []);
      } catch (err) {
        console.error('Error fetching cases:', err);
      }
    };
    fetchCases();
  }, [dispatch]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleOpenModal = (caseData = null) => {
    setSelectedCase(caseData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCase(null);
    setIsModalOpen(false);
  };

  const handleSaveCase = async (caseData) => {
    // Save to Supabase
    try {
      if (selectedCase) {
        await caseOperations.updateCase(selectedCase.id, caseData);
      } else {
        await caseOperations.createCase(caseData);
      }
      // Refresh cases from Supabase
      const data = await caseOperations.getAllCases();
      setCases(data || []);
    } catch (err) {
      console.error('Error saving case:', err);
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

        <SoftBox mb={3}>
          <Card>
            <SoftBox p={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <SoftInput
                    placeholder="Search cases..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <CaseFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                  />
                </Grid>
              </Grid>
            </SoftBox>
          </Card>
        </SoftBox>

        <SoftBox mb={3}>
          <Card>
            <SoftBox p={3}>
              <CasesTable
                cases={cases}
                filters={filters}
                onEditCase={handleOpenModal}
              />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>

      <CaseModal
        open={isModalOpen}
        onClose={handleCloseModal}
        caseData={selectedCase}
        onSave={handleSaveCase}
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

export default CaseList; 