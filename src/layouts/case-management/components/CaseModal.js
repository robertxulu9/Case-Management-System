import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// @mui material components
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Practice areas - replace with your actual practice areas
const PRACTICE_AREAS = [
  { id: "civil", label: "Civil Litigation" },
  { id: "corporate", label: "Corporate Law" },
  { id: "criminal", label: "Criminal Law" },
  { id: "family", label: "Family Law" },
  { id: "real_estate", label: "Real Estate" },
  { id: "tax", label: "Tax Law" },
];

// Case stages
const CASE_STAGES = [
  { id: "intake", label: "Intake" },
  { id: "pre_litigation", label: "Pre-Litigation" },
  { id: "litigation", label: "Litigation" },
  { id: "discovery", label: "Discovery" },
  { id: "trial", label: "Trial" },
  { id: "appeal", label: "Appeal" },
  { id: "closed", label: "Closed" },
];

// Office locations - replace with your actual offices
const OFFICES = [
  { id: "main", label: "Main Office" },
  { id: "north", label: "North Branch" },
  { id: "south", label: "South Branch" },
];

import { clientOperations, caseOperations, practiceAreaOperations } from "services/databaseService";

function generateCaseNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${year}-${random}`;
}

function CaseModal({ open, onClose, caseData, onSave }) {
  const [clients, setClients] = useState([]);
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    casename: "",
    casenumber: generateCaseNumber(),
    practicearea: "",
    newPracticeArea: "",
    casestage: "intake",
    dateopened: new Date().toISOString().split('T')[0],
    office: "",
    description: "",
    statuteoflimitations: "",
    conflictcheck: false,
    conflictchecknotes: "",
    clientid: "",
    ...caseData,
  });

  const [showNewPracticeArea, setShowNewPracticeArea] = useState(false);

  // Load clients and practice areas
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [clientsData, practiceAreasData] = await Promise.all([
          clientOperations.getAllClients(),
          practiceAreaOperations.getAllPracticeAreas()
        ]);
        setClients(clientsData);
        setPracticeAreas(practiceAreasData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadData();
    }
  }, [open]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleCheckboxChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.checked,
    }));
  };

  const handleAddPracticeArea = async () => {
    if (formData.newPracticeArea.trim()) {
      try {
        setLoading(true);
        // Add new practice area to database
        const newArea = await practiceAreaOperations.createPracticeArea(formData.newPracticeArea.trim());
        
        // Update practice areas list
        setPracticeAreas(prev => [...prev, newArea]);
        
        // Update form data
        setFormData(prev => ({
          ...prev,
          practicearea: newArea.id,
          newPracticeArea: "",
        }));
        
        setShowNewPracticeArea(false);
      } catch (err) {
        console.error('Error adding practice area:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Create a new object without UI-only fields
      const dataToSubmit = { ...formData };
      delete dataToSubmit.newPracticeArea; // Remove UI-only field
      
      // Handle empty date fields
      if (!dataToSubmit.statuteoflimitations) {
        delete dataToSubmit.statuteoflimitations;
      }
      
      await onSave(dataToSubmit);
      onClose();
    } catch (err) {
      console.error('Error saving case:', err);
      setError(err.message || 'Failed to save case. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ maxWidth: 800, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        <form onSubmit={handleSubmit}>
          <SoftBox p={3}>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <SoftTypography variant="h5">
                {caseData ? "Edit Case" : "Add New Case"}
              </SoftTypography>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </SoftBox>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Client"
                  value={formData.clientid}
                  onChange={handleChange('clientid')}
                  required
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {`${client.firstname} ${client.lastname}${client.company ? ` - ${client.company}` : ''}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Case Name"
                  value={formData.casename}
                  onChange={handleChange('casename')}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Case Number"
                  value={formData.casenumber}
                  onChange={handleChange('casenumber')}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Practice Area"
                  value={formData.practicearea}
                  onChange={handleChange('practicearea')}
                >
                  {practiceAreas.map((area) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.name}
                    </MenuItem>
                  ))}
                  <MenuItem value="new">
                    <SoftBox display="flex" alignItems="center">
                      <AddIcon fontSize="small" sx={{ mr: 1 }} />
                      Add New Practice Area
                    </SoftBox>
                  </MenuItem>
                </TextField>
              </Grid>

              {formData.practicearea === 'new' && (
                <Grid item xs={12}>
                  <SoftBox display="flex" gap={1}>
                    <TextField
                      fullWidth
                      label="New Practice Area"
                      value={formData.newPracticeArea}
                      onChange={handleChange('newPracticeArea')}
                    />
                    <SoftButton
                      variant="contained"
                      color="primary"
                      onClick={handleAddPracticeArea}
                      disabled={!formData.newPracticeArea.trim()}
                    >
                      Add
                    </SoftButton>
                  </SoftBox>
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Case Stage"
                  value={formData.casestage}
                  onChange={handleChange('casestage')}
                  required
                >
                  {CASE_STAGES.map((stage) => (
                    <MenuItem key={stage.id} value={stage.id}>
                      {stage.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date Opened"
                  value={formData.dateopened}
                  onChange={handleChange('dateopened')}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Office"
                  value={formData.office}
                  onChange={handleChange('office')}
                >
                  {OFFICES.map((office) => (
                    <MenuItem key={office.id} value={office.id}>
                      {office.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Statute of Limitations"
                  value={formData.statuteoflimitations}
                  onChange={handleChange('statuteoflimitations')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={formData.description}
                  onChange={handleChange('description')}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.conflictcheck}
                      onChange={handleCheckboxChange('conflictcheck')}
                    />
                  }
                  label="Conflict Check Required"
                />
              </Grid>

              {formData.conflictcheck && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Conflict Check Notes"
                    value={formData.conflictchecknotes}
                    onChange={handleChange('conflictchecknotes')}
                  />
                </Grid>
              )}
            </Grid>

            {error && (
              <SoftBox mt={2}>
                <SoftTypography color="error">{error}</SoftTypography>
              </SoftBox>
            )}

            <SoftBox mt={3} display="flex" justifyContent="flex-end" gap={1}>
              <SoftButton variant="outlined" onClick={onClose}>
                Cancel
              </SoftButton>
              <SoftButton
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Case"}
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </form>
      </Card>
    </Modal>
  );
}

CaseModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  caseData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    casename: PropTypes.string,
    casenumber: PropTypes.string,
    clientid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    practicearea: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    casestage: PropTypes.string,
    dateopened: PropTypes.string,
    office: PropTypes.string,
    description: PropTypes.string,
    statuteoflimitations: PropTypes.string,
    conflictcheck: PropTypes.bool,
    conflictchecknotes: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
};

export default CaseModal; 