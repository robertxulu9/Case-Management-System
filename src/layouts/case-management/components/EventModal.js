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
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Date picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function EventModal({ open, onClose, item, onSave, onDelete, itemTypes, cases, lawyers, priorities }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "task",
    start: new Date(),
    end: new Date(),
    lawyerId: "",
    caseId: "",
    priority: "medium",
    location: "",
    completed: false,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        start: new Date(item.start),
        end: new Date(item.end),
      });
    } else {
      setFormData({
        title: "",
        description: "",
        type: "task",
        start: new Date(),
        end: new Date(),
        lawyerId: "",
        caseId: "",
        priority: "medium",
        location: "",
        completed: false,
      });
    }
  }, [item]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleDateChange = (field) => (newDate) => {
    setFormData((prev) => ({
      ...prev,
      [field]: newDate,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    onDelete(item);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <SoftBox
        component="form"
        role="form"
        onSubmit={handleSubmit}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", md: 600 },
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Card>
          <SoftBox p={3}>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <SoftTypography variant="h5" fontWeight="medium">
                {item ? "Edit Item" : "Add New Item"}
              </SoftTypography>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </SoftBox>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  value={formData.title}
                  onChange={handleChange("title")}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={handleChange("description")}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={handleChange("type")}
                    label="Type"
                    required
                  >
                    {Object.entries(itemTypes).map(([type, config]) => (
                      <MenuItem key={type} value={type}>
                        {config.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={handleChange("priority")}
                    label="Priority"
                    required
                  >
                    {priorities.map((priority) => (
                      <MenuItem key={priority.id} value={priority.id}>
                        {priority.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Assigned Lawyer</InputLabel>
                  <Select
                    value={formData.lawyerId}
                    onChange={handleChange("lawyerId")}
                    label="Assigned Lawyer"
                  >
                    <MenuItem value="">None</MenuItem>
                    {lawyers.map((lawyer) => (
                      <MenuItem key={lawyer.id} value={lawyer.id}>
                        {lawyer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Related Case</InputLabel>
                  <Select
                    value={formData.caseId}
                    onChange={handleChange("caseId")}
                    label="Related Case"
                  >
                    <MenuItem value="">None</MenuItem>
                    {cases.map((case_) => (
                      <MenuItem key={case_.id} value={case_.id}>
                        {case_.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Start Date & Time"
                    value={formData.start}
                    onChange={handleDateChange("start")}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="End Date & Time"
                    value={formData.end}
                    onChange={handleDateChange("end")}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                    minDateTime={formData.start}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Location"
                  value={formData.location}
                  onChange={handleChange("location")}
                  fullWidth
                />
              </Grid>

              {formData.type === "task" && (
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.completed}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, completed: e.target.checked }))
                        }
                      />
                    }
                    label="Mark as completed"
                  />
                </Grid>
              )}
            </Grid>

            <SoftBox mt={4} mb={1} display="flex" justifyContent="space-between">
              {item && (
                <SoftButton
                  variant="gradient"
                  color="error"
                  onClick={handleDelete}
                >
                  Delete
                </SoftButton>
              )}
              <SoftBox ml="auto">
                <SoftButton
                  variant="text"
                  color="secondary"
                  onClick={onClose}
                  sx={{ marginRight: 1 }}
                >
                  Cancel
                </SoftButton>
                <SoftButton
                  variant="gradient"
                  color="info"
                  type="submit"
                >
                  {item ? "Save Changes" : "Create Item"}
                </SoftButton>
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </Card>
      </SoftBox>
    </Modal>
  );
}

EventModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  itemTypes: PropTypes.object.isRequired,
  cases: PropTypes.array.isRequired,
  lawyers: PropTypes.array.isRequired,
  priorities: PropTypes.array.isRequired,
};

export default EventModal; 