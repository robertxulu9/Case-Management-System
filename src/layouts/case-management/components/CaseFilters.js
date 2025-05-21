import PropTypes from "prop-types";
import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";

// @mui icons
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Custom components
import StatusIndicator from "./StatusIndicator";

function CaseFilters({ loading, error, onRetry, onFilter, onClear }) {
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assignedTo: "",
    dateRange: { start: "", end: "" },
    search: "",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateRangeChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: { ...prev.dateRange, [field]: value },
    }));
  };

  const handleApply = () => {
    if (onFilter) {
      onFilter(filters);
    }
  };

  const handleClear = () => {
    setFilters({
      status: "",
      priority: "",
      assignedTo: "",
      dateRange: { start: "", end: "" },
      search: "",
    });
    if (onClear) {
      onClear();
    }
  };

  const renderSkeletonForm = () => (
    <Card>
      <SoftBox p={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Grid>
        </Grid>
      </SoftBox>
    </Card>
  );

  return (
    <StatusIndicator loading={loading} error={error} onRetry={onRetry}>
      {loading ? (
        renderSkeletonForm()
      ) : (
        <Card>
          <SoftBox p={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    label="Status"
                    disabled={loading}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={filters.priority}
                    onChange={(e) => handleFilterChange("priority", e.target.value)}
                    label="Priority"
                    disabled={loading}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Assigned To</InputLabel>
                  <Select
                    value={filters.assignedTo}
                    onChange={(e) => handleFilterChange("assignedTo", e.target.value)}
                    label="Assigned To"
                    disabled={loading}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="me">Me</MenuItem>
                    <MenuItem value="team">Team</MenuItem>
                    <MenuItem value="unassigned">Unassigned</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Search"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleDateRangeChange("start", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleDateRangeChange("end", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <SoftBox display="flex" gap={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SearchIcon />}
                    onClick={handleApply}
                    disabled={loading}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ClearIcon />}
                    onClick={handleClear}
                    disabled={loading}
                  >
                    Clear Filters
                  </Button>
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>
        </Card>
      )}
    </StatusIndicator>
  );
}

CaseFilters.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onRetry: PropTypes.func,
  onFilter: PropTypes.func,
  onClear: PropTypes.func,
};

CaseFilters.defaultProps = {
  loading: false,
  error: null,
  onRetry: null,
  onFilter: null,
  onClear: null,
};

export default CaseFilters; 