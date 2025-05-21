import { useState, useCallback } from "react";
import PropTypes from "prop-types";

// @mui material components
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

// @mui icons
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ErrorIcon from "@mui/icons-material/Error";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function DocumentUpload({ onUpload, categories, loading, error, onRetry }) {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [uploadError, setUploadError] = useState(null);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);
    setUploadError(null);
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadError({ message: "Please select at least one file to upload" });
      return;
    }

    if (!category) {
      setUploadError({ message: "Please select a category" });
      return;
    }

    try {
      const uploadPromises = files.map((file) => {
        return new Promise((resolve) => {
          // Simulate upload delay
          setTimeout(() => {
            resolve({
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              name: file.name,
              type: "file",
              category,
              description,
              size: file.size,
              uploadedAt: new Date().toISOString(),
            });
          }, 1000);
        });
      });

      const uploadedDocuments = await Promise.all(uploadPromises);
      onUpload(uploadedDocuments);
      setFiles([]);
      setCategory("");
      setDescription("");
      setUploadError(null);
    } catch (error) {
      setUploadError({ message: "Failed to upload files. Please try again." });
    }
  };

  return (
    <SoftBox>
      {error && (
        <SoftBox mb={3}>
          <Alert
            severity="error"
            action={
              onRetry && (
                <Button
                  color="inherit"
                  size="small"
                  onClick={onRetry}
                  disabled={loading}
                >
                  Retry
                </Button>
              )
            }
          >
            <AlertTitle>Error</AlertTitle>
            {error.message}
          </Alert>
        </SoftBox>
      )}

      <SoftBox
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        sx={{
          border: "2px dashed",
          borderColor: uploadError ? "error.main" : "primary.main",
          borderRadius: 1,
          p: 3,
          textAlign: "center",
          cursor: "pointer",
          "&:hover": {
            borderColor: uploadError ? "error.dark" : "primary.dark",
          },
          opacity: loading ? 0.7 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
          id="file-upload"
          disabled={loading}
        />
        <label htmlFor="file-upload">
          <SoftBox display="flex" flexDirection="column" alignItems="center">
            {loading ? (
              <CircularProgress size={48} sx={{ mb: 2 }} />
            ) : (
              <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            )}
            <SoftTypography variant="h6" fontWeight="medium">
              {loading ? "Uploading..." : "Drag and drop files here or click to select"}
            </SoftTypography>
            <SoftTypography variant="caption" color="secondary">
              Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
            </SoftTypography>
          </SoftBox>
        </label>
      </SoftBox>

      {uploadError && (
        <SoftBox mt={2}>
          <Alert severity="error" icon={<ErrorIcon />}>
            {uploadError.message}
          </Alert>
        </SoftBox>
      )}

      {files.length > 0 && (
        <SoftBox mt={3}>
          <SoftTypography variant="h6" fontWeight="medium" mb={2}>
            Selected Files ({files.length})
          </SoftTypography>
          <Box sx={{ maxHeight: 200, overflow: "auto" }}>
            {files.map((file, index) => (
              <SoftBox
                key={index}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={1}
                sx={{
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <SoftTypography variant="caption">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </SoftTypography>
              </SoftBox>
            ))}
          </Box>

          <SoftBox mt={3}>
            <FormControl fullWidth sx={{ mb: 2 }} disabled={loading}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
              disabled={loading}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={loading || !category}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Uploading..." : "Upload Files"}
            </Button>
          </SoftBox>
        </SoftBox>
      )}
    </SoftBox>
  );
}

DocumentUpload.propTypes = {
  onUpload: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onRetry: PropTypes.func,
};

DocumentUpload.defaultProps = {
  loading: false,
  error: null,
  onRetry: null,
};

export default DocumentUpload; 