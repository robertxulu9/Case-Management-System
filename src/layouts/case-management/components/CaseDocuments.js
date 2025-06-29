import PropTypes from "prop-types";
import { useState } from "react";

// @mui material components
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

// @mui icons
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function CaseDocuments({ documents, onUpload, onDownload, onDelete }) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      try {
        await onUpload(file);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <SoftBox>
      <SoftBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <SoftTypography variant="h6" fontWeight="medium">
          Documents
        </SoftTypography>
        <Button
          variant="contained"
          component="label"
          startIcon={<AddIcon />}
          disabled={uploading}
        >
          Upload
          <input
            type="file"
            hidden
            onChange={handleFileUpload}
          />
        </Button>
      </SoftBox>

      <List>
        {documents?.map((doc) => (
          <ListItem key={doc.id}>
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText
              primary={doc.filename}
              secondary={`${doc.filetype} • ${formatFileSize(doc.filesize)}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => onDownload(doc)}>
                <DownloadIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => onDelete(doc.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {(!documents || documents.length === 0) && (
        <SoftBox textAlign="center" py={3}>
          <SoftTypography variant="button" color="text">
            No documents uploaded yet
          </SoftTypography>
        </SoftBox>
      )}
    </SoftBox>
  );
}

CaseDocuments.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      filename: PropTypes.string.isRequired,
      filetype: PropTypes.string.isRequired,
      filesize: PropTypes.number.isRequired,
      uploaded_at: PropTypes.string.isRequired,
    })
  ),
  onUpload: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

CaseDocuments.defaultProps = {
  documents: [],
};

export default CaseDocuments; 