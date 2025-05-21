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
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Skeleton from "@mui/material/Skeleton";

// @mui icons
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import EmailIcon from "@mui/icons-material/Email";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Custom components
import StatusIndicator from "./StatusIndicator";

function ReportGenerator({ loading, error, onRetry, onGenerate, onPrint, onEmail }) {
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedFields, setSelectedFields] = useState([]);
  const [format, setFormat] = useState("pdf");

  const reportTypes = [
    { value: "cases", label: "Cases Report" },
    { value: "clients", label: "Clients Report" },
    { value: "documents", label: "Documents Report" },
  ];

  const availableFields = {
    cases: [
      { value: "caseNumber", label: "Case Number" },
      { value: "title", label: "Title" },
      { value: "status", label: "Status" },
      { value: "priority", label: "Priority" },
      { value: "createdAt", label: "Created At" },
      { value: "updatedAt", label: "Updated At" },
    ],
    clients: [
      { value: "name", label: "Name" },
      { value: "email", label: "Email" },
      { value: "phone", label: "Phone" },
      { value: "type", label: "Type" },
      { value: "status", label: "Status" },
      { value: "createdAt", label: "Created At" },
    ],
    documents: [
      { value: "name", label: "Name" },
      { value: "type", label: "Type" },
      { value: "category", label: "Category" },
      { value: "size", label: "Size" },
      { value: "uploadedAt", label: "Uploaded At" },
      { value: "uploadedBy", label: "Uploaded By" },
    ],
  };

  const handleFieldToggle = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field)
        ? prev.filter((f) => f !== field)
        : [...prev, field]
    );
  };

  const handleGenerate = () => {
    if (onGenerate) {
      onGenerate({
        type: reportType,
        dateRange,
        fields: selectedFields,
        format,
      });
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
          <Grid item xs={12}>
            <Skeleton variant="text" width={200} height={24} sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {Array(6).fill(0).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton variant="rectangular" width="100%" height={40} />
                </Grid>
              ))}
            </Grid>
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
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    label="Report Type"
                    disabled={loading}
                  >
                    {reportTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Format</InputLabel>
                  <Select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    label="Format"
                    disabled={loading}
                  >
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="excel">Excel</MenuItem>
                    <MenuItem value="csv">CSV</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                  InputLabelProps={{ shrink: true }}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                  InputLabelProps={{ shrink: true }}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                  Select Fields
                </SoftTypography>
                <Grid container spacing={2}>
                  {availableFields[reportType]?.map((field) => (
                    <Grid item xs={12} sm={6} md={4} key={field.value}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedFields.includes(field.value)}
                            onChange={() => handleFieldToggle(field.value)}
                            disabled={loading}
                          />
                        }
                        label={field.label}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <SoftBox display="flex" gap={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={handleGenerate}
                    disabled={loading || !reportType || !dateRange.start || !dateRange.end}
                  >
                    Generate Report
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<PrintIcon />}
                    onClick={onPrint}
                    disabled={loading}
                  >
                    Print
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EmailIcon />}
                    onClick={onEmail}
                    disabled={loading}
                  >
                    Email
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

ReportGenerator.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onRetry: PropTypes.func,
  onGenerate: PropTypes.func,
  onPrint: PropTypes.func,
  onEmail: PropTypes.func,
};

ReportGenerator.defaultProps = {
  loading: false,
  error: null,
  onRetry: null,
  onGenerate: null,
  onPrint: null,
  onEmail: null,
};

export default ReportGenerator; 