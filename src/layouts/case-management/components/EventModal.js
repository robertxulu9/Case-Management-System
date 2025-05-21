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
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";

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

// Event categories with colors
export const EVENT_CATEGORIES = {
  meeting: { label: "Meeting", color: "#2196f3" },
  hearing: { label: "Court Hearing", color: "#f44336" },
  deadline: { label: "Deadline", color: "#ff9800" },
  task: { label: "Task", color: "#4caf50" },
  consultation: { label: "Consultation", color: "#9c27b0" },
  other: { label: "Other", color: "#757575" },
};

// Importance levels
export const IMPORTANCE_LEVELS = {
  high: { label: "High", color: "#f44336" },
  medium: { label: "Medium", color: "#ff9800" },
  low: { label: "Low", color: "#4caf50" },
};

// Mock attorneys list - replace with actual data from your system
const ATTORNEYS = [
  { id: "1", name: "John Smith" },
  { id: "2", name: "Jane Doe" },
  { id: "3", name: "Robert Johnson" },
  { id: "4", name: "Sarah Williams" },
];

function EventModal({ open, onClose, event, onSave, onDelete, cases, currentUser }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "meeting",
    start: new Date(),
    end: new Date(),
    location: "",
    reminder: false,
    reminderTime: 15, // minutes before event
    importance: "medium",
    caseId: "",
    userId: currentUser?.id || "",
    isNotLinkedToCase: false,
    hasAddress: false,
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    notifyAttorneys: [],
    isPrivate: false,
  });

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        start: event.start || new Date(),
        end: event.end || new Date(),
        reminder: event.reminder || false,
        reminderTime: event.reminderTime || 15,
        importance: event.importance || "medium",
        caseId: event.caseId || "",
        userId: event.userId || currentUser?.id || "",
        isNotLinkedToCase: event.isNotLinkedToCase || false,
        hasAddress: event.hasAddress || false,
        address: event.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
        },
        notifyAttorneys: event.notifyAttorneys || [],
        isPrivate: event.isPrivate || false,
      });
    }
  }, [event, currentUser]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleDateChange = (field) => (newValue) => {
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const handleAddressChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: event.target.value,
      },
    }));
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
      <Card sx={{ maxWidth: 600, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        <SoftBox p={3}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <SoftTypography variant="h5">
              {event ? "Edit Event" : "Create New Event"}
            </SoftTypography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </SoftBox>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={handleChange("title")}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={handleChange("description")}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={formData.category}
                  onChange={handleChange("category")}
                >
                  {Object.entries(EVENT_CATEGORIES).map(([key, { label, color }]) => (
                    <MenuItem key={key} value={key}>
                      <SoftBox display="flex" alignItems="center">
                        <SoftBox
                          width={16}
                          height={16}
                          borderRadius="50%"
                          bgcolor={color}
                          mr={1}
                        />
                        {label}
                      </SoftBox>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isNotLinkedToCase}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isNotLinkedToCase: e.target.checked,
                          caseId: e.target.checked ? "" : prev.caseId,
                        }))
                      }
                    />
                  }
                  label="This event is not linked to a case"
                />
              </Grid>

              {!formData.isNotLinkedToCase && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Case"
                    value={formData.caseId}
                    onChange={handleChange("caseId")}
                    required={!formData.isNotLinkedToCase}
                  >
                    <MenuItem value="">Select Case</MenuItem>
                    {cases.map((caseItem) => (
                      <MenuItem key={caseItem.id} value={caseItem.id}>
                        {caseItem.title}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Start Date & Time"
                    value={formData.start}
                    onChange={handleDateChange("start")}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="End Date & Time"
                    value={formData.end}
                    onChange={handleDateChange("end")}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.hasAddress}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hasAddress: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Add address for this event"
                />
              </Grid>

              <Collapse in={formData.hasAddress}>
                <Grid container item xs={12} spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      value={formData.address.street}
                      onChange={handleAddressChange("street")}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={formData.address.city}
                      onChange={handleAddressChange("city")}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="State"
                      value={formData.address.state}
                      onChange={handleAddressChange("state")}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      value={formData.address.zipCode}
                      onChange={handleAddressChange("zipCode")}
                    />
                  </Grid>
                </Grid>
              </Collapse>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Notify Attorneys</InputLabel>
                  <Select
                    multiple
                    value={formData.notifyAttorneys}
                    onChange={handleChange("notifyAttorneys")}
                    input={<OutlinedInput label="Notify Attorneys" />}
                    renderValue={(selected) =>
                      selected
                        .map((id) => ATTORNEYS.find((a) => a.id === id)?.name)
                        .join(", ")
                    }
                  >
                    {ATTORNEYS.map((attorney) => (
                      <MenuItem key={attorney.id} value={attorney.id}>
                        <Checkbox checked={formData.notifyAttorneys.includes(attorney.id)} />
                        <ListItemText primary={attorney.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.reminder}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, reminder: e.target.checked }))
                      }
                    />
                  }
                  label="Set Reminder"
                />
              </Grid>

              {formData.reminder && (
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Reminder Time"
                    value={formData.reminderTime}
                    onChange={handleChange("reminderTime")}
                  >
                    <MenuItem value={5}>5 minutes before</MenuItem>
                    <MenuItem value={15}>15 minutes before</MenuItem>
                    <MenuItem value={30}>30 minutes before</MenuItem>
                    <MenuItem value={60}>1 hour before</MenuItem>
                    <MenuItem value={1440}>1 day before</MenuItem>
                  </TextField>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Importance"
                  value={formData.importance}
                  onChange={handleChange("importance")}
                >
                  {Object.entries(IMPORTANCE_LEVELS).map(([key, { label, color }]) => (
                    <MenuItem key={key} value={key}>
                      <SoftBox display="flex" alignItems="center">
                        <SoftBox
                          width={16}
                          height={16}
                          borderRadius="50%"
                          bgcolor={color}
                          mr={1}
                        />
                        {label}
                      </SoftBox>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isPrivate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isPrivate: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Make this event private"
                />
              </Grid>

              <Grid item xs={12}>
                <SoftBox display="flex" justifyContent="flex-end" gap={2}>
                  {event && (
                    <SoftButton
                      variant="gradient"
                      color="error"
                      onClick={() => {
                        onDelete(event);
                        onClose();
                      }}
                    >
                      Delete
                    </SoftButton>
                  )}
                  <SoftButton variant="gradient" color="dark" onClick={onClose}>
                    Cancel
                  </SoftButton>
                  <SoftButton variant="gradient" color="info" type="submit">
                    {event ? "Update" : "Create"}
                  </SoftButton>
                </SoftBox>
              </Grid>
            </Grid>
          </form>
        </SoftBox>
      </Card>
    </Modal>
  );
}

EventModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  event: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  cases: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

export default EventModal; 