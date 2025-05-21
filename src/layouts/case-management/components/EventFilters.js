import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

// Event categories
import { EVENT_CATEGORIES } from "./EventModal";

// Importance levels
const IMPORTANCE_LEVELS = {
  high: { label: "High", color: "#f44336" },
  medium: { label: "Medium", color: "#ff9800" },
  low: { label: "Low", color: "#4caf50" },
};

function EventFilters({ filters, onFilterChange, cases }) {
  const handleChange = (field) => (event) => {
    onFilterChange({
      ...filters,
      [field]: event.target.value,
    });
  };

  const handleSwitchChange = (field) => (event) => {
    onFilterChange({
      ...filters,
      [field]: event.target.checked,
    });
  };

  return (
    <SoftBox p={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={3}>
          <TextField
            fullWidth
            select
            label="Case"
            value={filters.caseId || ""}
            onChange={handleChange("caseId")}
          >
            <MenuItem value="">All Cases</MenuItem>
            {cases.map((caseItem) => (
              <MenuItem key={caseItem.id} value={caseItem.id}>
                {caseItem.title}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <TextField
            fullWidth
            select
            label="Event Type"
            value={filters.category || ""}
            onChange={handleChange("category")}
          >
            <MenuItem value="">All Events</MenuItem>
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

        <Grid item xs={12} md={6} lg={3}>
          <TextField
            fullWidth
            select
            label="Importance"
            value={filters.importance || ""}
            onChange={handleChange("importance")}
          >
            <MenuItem value="">All Importance Levels</MenuItem>
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

        <Grid item xs={12} md={6} lg={3}>
          <TextField
            fullWidth
            label="Location"
            value={filters.location || ""}
            onChange={handleChange("location")}
            placeholder="Filter by location"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={filters.onlyMyEvents || false}
                onChange={handleSwitchChange("onlyMyEvents")}
                color="primary"
              />
            }
            label="Show only my events"
          />
        </Grid>
      </Grid>
    </SoftBox>
  );
}

EventFilters.propTypes = {
  filters: PropTypes.shape({
    caseId: PropTypes.string,
    category: PropTypes.string,
    importance: PropTypes.string,
    location: PropTypes.string,
    onlyMyEvents: PropTypes.bool,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  cases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default EventFilters; 