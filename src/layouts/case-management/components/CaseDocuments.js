import PropTypes from "prop-types";
import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";

// @mui icons
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Custom components
import StatusIndicator from "./StatusIndicator";
import DocumentUpload from "./DocumentUpload";

function CaseDocuments({ documents, loading, error, onRetry, onUpload, onDownload, onDelete }) {
  const [showUpload, setShowUpload] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderSkeletonTable = () => (
    <Card>
      <SoftBox p={3}>
        <Skeleton variant="text" width={200} height={24} sx={{ mb: 2 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Skeleton variant="text" width={100} height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} height={24} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array(5).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" width={150} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={80} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={120} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="circular" width={40} height={40} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SoftBox>
    </Card>
  );

  return (
    <StatusIndicator loading={loading} error={error} onRetry={onRetry}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <SoftTypography variant="h6" fontWeight="medium">
              Documents
            </SoftTypography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<UploadIcon />}
              onClick={() => setShowUpload(true)}
              disabled={loading}
            >
              Upload Document
            </Button>
          </SoftBox>
        </Grid>

        {showUpload && (
          <Grid item xs={12}>
            <DocumentUpload
              onUpload={(file) => {
                if (onUpload) {
                  onUpload(file);
                }
                setShowUpload(false);
              }}
              onCancel={() => setShowUpload(false)}
              loading={loading}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          {loading ? (
            renderSkeletonTable()
          ) : documents?.length > 0 ? (
            <Card>
              <SoftBox p={3}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Uploaded At</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>{doc.name}</TableCell>
                          <TableCell>{doc.type}</TableCell>
                          <TableCell>{formatFileSize(doc.size)}</TableCell>
                          <TableCell>
                            {new Date(doc.uploadedAt).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => onDownload?.(doc.id)}
                              disabled={loading}
                            >
                              <DownloadIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => onDelete?.(doc.id)}
                              disabled={loading}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </SoftBox>
            </Card>
          ) : (
            <SoftTypography variant="body1" color="text">
              No documents available.
            </SoftTypography>
          )}
        </Grid>
      </Grid>
    </StatusIndicator>
  );
}

CaseDocuments.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string,
      size: PropTypes.number,
      uploadedAt: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onRetry: PropTypes.func,
  onUpload: PropTypes.func,
  onDownload: PropTypes.func,
  onDelete: PropTypes.func,
};

CaseDocuments.defaultProps = {
  documents: [],
  loading: false,
  error: null,
  onRetry: null,
  onUpload: null,
  onDownload: null,
  onDelete: null,
};

export default CaseDocuments; 