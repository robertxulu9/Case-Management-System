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

import { clientOperations, caseOperations } from "services/databaseService";

function generateCaseNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${year}-${random}`;
}

function CaseModal({ open, onClose, caseData, onSave }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    caseName: "",
    caseNumber: generateCaseNumber(),
    practiceArea: "",
    newPracticeArea: "",
    caseStage: "intake",
    dateopened: new Date().toISOString().split('T')[0],
    office: "",
    description: "",
    statuteOfLimitations: "",
    conflictCheck: false,
    conflictCheckNotes: "",
    clientid: "",
    ...caseData,
  });

  const [showNewPracticeArea, setShowNewPracticeArea] = useState(false);

  // Load clients from Supabase
  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        const data = await clientOperations.getAllClients();
        setClients(data);
      } catch (err) {
        console.error('Error loading clients:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadClients();
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

  const handleAddPracticeArea = () => {
    if (formData.newPracticeArea.trim()) {
      // In a real application, you would typically make an API call to add the new practice area
      // For now, we'll just update the form data
      setFormData((prev) => ({
        ...prev,
        practiceArea: prev.newPracticeArea.trim(),
        newPracticeArea: "",
      }));
      setShowNewPracticeArea(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
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
                  onChange={handleChange("clientid")}
                  required
                  disabled={loading}
                  error={!!error}
                  helperText={error}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: { maxHeight: 200 }
                      }
                    }
                  }}
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {`${client.firstname} ${client.lastname}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Case Name"
                  value={formData.caseName}
                  onChange={handleChange("caseName")}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Case Number"
                  value={formData.caseNumber}
                  disabled
                  helperText="Auto-generated case number"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                {showNewPracticeArea ? (
                  <SoftBox display="flex" gap={1}>
                    <TextField
                      fullWidth
                      label="New Practice Area"
                      value={formData.newPracticeArea}
                      onChange={handleChange("newPracticeArea")}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddPracticeArea}
                      sx={{ minWidth: 'auto' }}
                    >
                      <AddIcon />
                    </Button>
                  </SoftBox>
                ) : (
                  <TextField
                    fullWidth
                    select
                    label="Practice Area"
                    value={formData.practiceArea}
                    onChange={handleChange("practiceArea")}
                    required
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          sx: { maxHeight: 200 }
                        }
                      }
                    }}
                  >
                    {PRACTICE_AREAS.map((area) => (
                      <MenuItem key={area.id} value={area.id}>
                        {area.label}
                      </MenuItem>
                    ))}
                    <MenuItem value="add_new" onClick={() => setShowNewPracticeArea(true)}>
                      <AddIcon sx={{ mr: 1 }} /> Add New Practice Area
                    </MenuItem>
                  </TextField>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Case Stage"
                  value={formData.caseStage}
                  onChange={handleChange("caseStage")}
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
                  onChange={handleChange("dateopened")}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Office"
                  value={formData.office}
                  onChange={handleChange("office")}
                  required
                >
                  {OFFICES.map((office) => (
                    <MenuItem key={office.id} value={office.id}>
                      {office.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={handleChange("description")}
                  multiline
                  rows={4}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Statute of Limitations"
                  value={formData.statuteOfLimitations}
                  onChange={handleChange("statuteOfLimitations")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.conflictCheck}
                      onChange={handleCheckboxChange("conflictCheck")}
                    />
                  }
                  label="Conflict Check Completed"
                />
              </Grid>

              {formData.conflictCheck && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Conflict Check Notes"
                    value={formData.conflictCheckNotes}
                    onChange={handleChange("conflictCheckNotes")}
                    multiline
                    rows={3}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <SoftBox display="flex" justifyContent="flex-end" gap={2}>
                  <SoftButton variant="gradient" color="dark" onClick={onClose}>
                    Cancel
                  </SoftButton>
                  <SoftButton variant="gradient" color="info" type="submit">
                    {caseData ? "Update" : "Create"}
                  </SoftButton>
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>
        </form>
      </Card>
    </Modal>
  );
}

CaseModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  caseData: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default CaseModal; 