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
import Card from "@mui/material/Card";

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
      await onUpload(files, category, description);
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

      <Card>
        <SoftBox p={3}>
          <SoftTypography variant="h6" fontWeight="medium" mb={2}>
            Select Document Category
          </SoftTypography>
          
          <FormControl fullWidth sx={{ mb: 2 }} disabled={loading}>
            <InputLabel id="upload-category-label">Category</InputLabel>
            <Select
              labelId="upload-category-label"
              id="upload-category-select"
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
              displayEmpty
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                PaperProps: {
                  style: {
                    maxHeight: 300
                  }
                }
              }}
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                },
                '& .MuiSelect-select': {
                  cursor: 'pointer',
                  minHeight: '1.4375em',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16.5px 14px'
                }
              }}
            >
              <MenuItem value="" disabled>
                <em>Select a category</em>
              </MenuItem>
              {Array.isArray(categories) && categories.map((cat) => (
                <MenuItem 
                  key={cat.value} 
                  value={cat.value}
                  sx={{
                    minHeight: '35px',
                    padding: '6px 16px',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.08)'
                    }
                  }}
                >
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {category && (
            <>
              <SoftBox
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                sx={{
                  border: "2px dashed",
                  borderColor: uploadError ? "error.main" : "primary.main",
                  borderRadius: 1,
                  p: 3,
                  mt: 2,
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

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mt: 2, mb: 2 }}
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
              )}
            </>
          )}
        </SoftBox>
      </Card>
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
  categories: [],
  loading: false,
  error: null,
  onRetry: null,
};

export default DocumentUpload; 