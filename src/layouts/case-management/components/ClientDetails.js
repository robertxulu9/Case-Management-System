import { useState } from "react";
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";

function ClientDetails({ open, client, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    firstname: client?.firstname || "",
    middlename: client?.middlename || "",
    lastname: client?.lastname || "",
    email: client?.email || "",
    cellphone: client?.cellphone || "",
    workphone: client?.workphone || "",
    homephone: client?.homephone || "",
    company: client?.company || "",
    jobtitle: client?.jobtitle || "",
    address1: client?.address1 || "",
    address2: client?.address2 || "",
    city: client?.city || "",
    province: client?.province || "",
    country: client?.country || ""
  });

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {client ? "Edit Client" : "New Client"}
        </DialogTitle>
        <DialogContent>
          <SoftBox py={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstname}
                  onChange={handleChange("firstname")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  value={formData.middlename}
                  onChange={handleChange("middlename")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastname}
                  onChange={handleChange("lastname")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cell Phone"
                  value={formData.cellphone}
                  onChange={handleChange("cellphone")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Work Phone"
                  value={formData.workphone}
                  onChange={handleChange("workphone")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Home Phone"
                  value={formData.homephone}
                  onChange={handleChange("homephone")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={formData.company}
                  onChange={handleChange("company")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={formData.jobtitle}
                  onChange={handleChange("jobtitle")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 1"
                  value={formData.address1}
                  onChange={handleChange("address1")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 2"
                  value={formData.address2}
                  onChange={handleChange("address2")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={handleChange("city")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Province/State"
                  value={formData.province}
                  onChange={handleChange("province")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Country"
                  value={formData.country}
                  onChange={handleChange("country")}
                />
              </Grid>
            </Grid>
          </SoftBox>
        </DialogContent>
        <DialogActions>
          <SoftBox p={2} display="flex" justifyContent="flex-end" gap={2}>
            <SoftButton onClick={onClose} variant="text" color="secondary">
              Cancel
            </SoftButton>
            <SoftButton type="submit" variant="gradient" color="info">
              {client ? "Save Changes" : "Create Client"}
            </SoftButton>
          </SoftBox>
        </DialogActions>
      </form>
    </Dialog>
  );
}

ClientDetails.propTypes = {
  open: PropTypes.bool.isRequired,
  client: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    firstname: PropTypes.string,
    middlename: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    cellphone: PropTypes.string,
    workphone: PropTypes.string,
    homephone: PropTypes.string,
    company: PropTypes.string,
    jobtitle: PropTypes.string,
    address1: PropTypes.string,
    address2: PropTypes.string,
    city: PropTypes.string,
    province: PropTypes.string,
    country: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ClientDetails; 