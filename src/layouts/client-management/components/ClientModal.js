import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// @mui material components
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// People groups - replace with your actual groups
const PEOPLE_GROUPS = [
  { id: "client", label: "Client" },
  { id: "vip", label: "VIP Client" },
  { id: "prospect", label: "Prospect" },
  { id: "lead", label: "Lead" },
];

// Countries list - you can expand this
const COUNTRIES = [
  { code: "ZM", name: "Zambia" },
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  // Add more countries as needed
];

// Gender options
const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

// Marital status options
const MARITAL_STATUS_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
];

import { clientOperations } from "services/databaseService";

function ClientModal({ open, onClose, client, onSave }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    // Basic Information
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    peoplegroup: "client",
    enableclientportal: false,
    cellphone: "",
    workphone: "",
    homephone: "",
    
    // Personal Information
    nrc: "",
    passport: "",
    gender: "male",
    dateofbirth: "",
    placeofbirth: "",
    nationality: "",
    maritalstatus: "single",
    occupation: "",
    
    // Address Information
    address1: "",
    address2: "",
    city: "",
    province: "",
    country: "ZM",
    
    // Additional Information
    company: "",
    jobtitle: "",
    website: "",
    faxnumber: "",
    notes: "",
  });

  // Effect to update form data when client changes
  useEffect(() => {
    if (client) {
      const { id, created_at, updated_at, ...clientData } = client;
      setFormData(prevData => ({
        ...prevData,
        ...clientData
      }));
    } else {
      // Reset form when creating new client
      setFormData({
        firstname: "",
        middlename: "",
        lastname: "",
        email: "",
        peoplegroup: "client",
        enableclientportal: false,
        cellphone: "",
        workphone: "",
        homephone: "",
        nrc: "",
        passport: "",
        gender: "male",
        dateofbirth: "",
        placeofbirth: "",
        nationality: "",
        maritalstatus: "single",
        occupation: "",
        address1: "",
        address2: "",
        city: "",
        province: "",
        country: "ZM",
        company: "",
        jobtitle: "",
        website: "",
        faxnumber: "",
        notes: "",
      });
    }
  }, [client]);

  const validateField = (field, value) => {
    const errors = {};
    
    switch (field) {
      case 'email':
        if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          errors[field] = 'Invalid email address';
        }
        break;
      case 'nrc':
        if (value && value.length < 6) {
          errors[field] = 'NRC must be at least 6 characters';
        }
        break;
      // Add more field validations as needed
    }
    
    return errors;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    const fieldErrors = validateField(field, value);
    
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    setValidationErrors(prev => ({
      ...prev,
      [field]: fieldErrors[field],
    }));
  };

  const handleSwitchChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.checked,
    }));
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach(field => {
      const fieldErrors = validateField(field, formData[field]);
      if (fieldErrors[field]) {
        errors[field] = fieldErrors[field];
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validate form before submission
    if (!validateForm()) {
      setError('Please correct the validation errors before saving.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create a copy of formData and handle empty date
      const { id, created_at, updated_at, ...dataToSubmit } = {
        ...formData,
        dateofbirth: formData.dateofbirth || null // Convert empty string to null for date field
      };

      console.log('Starting client save...', dataToSubmit);
      const success = await onSave(dataToSubmit);
      
      if (success) {
        console.log('Client saved successfully');
        onClose();
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError('An unexpected error occurred while saving the client.');
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
                {client ? "Edit Client" : "Add New Client"}
              </SoftTypography>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </SoftBox>

            {error && (
              <SoftBox mb={2}>
                <SoftTypography variant="body2" color="error">
                  {error}
                </SoftTypography>
              </SoftBox>
            )}

            <Grid container spacing={2}>
              {/* Basic Information Section */}
              <Grid item xs={12}>
                <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                  Basic Information
                </SoftTypography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstname}
                  onChange={handleChange("firstname")}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  value={formData.middlename}
                  onChange={handleChange("middlename")}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastname}
                  onChange={handleChange("lastname")}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  required
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="People Group"
                  value={formData.peoplegroup}
                  onChange={handleChange("peoplegroup")}
                  required
                >
                  {PEOPLE_GROUPS.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.enableclientportal}
                      onChange={handleSwitchChange("enableclientportal")}
                    />
                  }
                  label="Enable Client Portal Access"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Cell Phone"
                  value={formData.cellphone}
                  onChange={handleChange("cellphone")}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Work Phone"
                  value={formData.workphone}
                  onChange={handleChange("workphone")}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Home Phone"
                  value={formData.homephone}
                  onChange={handleChange("homephone")}
                />
              </Grid>

              {/* Personal Information Section */}
              <Grid item xs={12}>
                <Divider />
                <SoftBox mt={2} mb={1}>
                  <SoftTypography variant="h6" fontWeight="medium">
                    Personal Information
                  </SoftTypography>
                </SoftBox>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="NRC Number"
                  value={formData.nrc}
                  onChange={handleChange("nrc")}
                  required
                  helperText="National Registration Card number is required"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Passport Number"
                  value={formData.passport}
                  onChange={handleChange("passport")}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={formData.dateofbirth}
                  onChange={handleChange("dateofbirth")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Place of Birth"
                  value={formData.placeofbirth}
                  onChange={handleChange("placeofbirth")}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nationality"
                  value={formData.nationality}
                  onChange={handleChange("nationality")}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  value={formData.gender}
                  onChange={handleChange("gender")}
                >
                  {GENDER_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Marital Status"
                  value={formData.maritalstatus}
                  onChange={handleChange("maritalstatus")}
                >
                  {MARITAL_STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Occupation"
                  value={formData.occupation}
                  onChange={handleChange("occupation")}
                />
              </Grid>

              {/* Address Information Section */}
              <Grid item xs={12}>
                <Divider />
                <SoftBox mt={2} mb={1}>
                  <SoftTypography variant="h6" fontWeight="medium">
                    Address Information
                  </SoftTypography>
                </SoftBox>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address1}
                  onChange={handleChange("address1")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address 2"
                  value={formData.address2}
                  onChange={handleChange("address2")}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={handleChange("city")}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Province/State"
                  value={formData.province}
                  onChange={handleChange("province")}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Country"
                  value={formData.country}
                  onChange={handleChange("country")}
                >
                  {COUNTRIES.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Additional Information Section */}
              <Grid item xs={12}>
                <Divider />
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <SoftTypography variant="h6" fontWeight="medium">
                      Additional Information
                    </SoftTypography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Company"
                          value={formData.company}
                          onChange={handleChange("company")}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Job Title"
                          value={formData.jobtitle}
                          onChange={handleChange("jobtitle")}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Website"
                          value={formData.website}
                          onChange={handleChange("website")}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Fax Number"
                          value={formData.faxnumber}
                          onChange={handleChange("faxnumber")}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Notes"
                          value={formData.notes}
                          onChange={handleChange("notes")}
                          multiline
                          rows={4}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <SoftBox display="flex" justifyContent="flex-end" gap={2}>
                  <SoftButton 
                    variant="gradient" 
                    color="dark" 
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </SoftButton>
                  <SoftButton 
                    variant="gradient" 
                    color="info" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : (client ? "Update" : "Create")}
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

ClientModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  client: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default ClientModal; 