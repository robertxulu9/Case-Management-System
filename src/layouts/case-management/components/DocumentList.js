import { useState } from "react";
import PropTypes from "prop-types";

// @mui material components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

// @mui icons
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Custom components
import StatusIndicator from "./StatusIndicator";

function DocumentList({ documents, loading, error, onRetry, onDownload, onDelete }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(0);
  };

  const filteredDocuments = documents?.filter((doc) => {
    const matchesSearch = (doc.filename?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                         (doc.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesCategory = category === "all" || doc.category === category;
    return matchesSearch && matchesCategory;
  }) || [];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "contracts", label: "Contracts" },
    { value: "reports", label: "Reports" },
    { value: "correspondence", label: "Correspondence" },
    { value: "evidence", label: "Evidence" },
    { value: "legal_filings", label: "Legal Filings" },
    { value: "client_documents", label: "Client Documents" },
    { value: "other", label: "Other" }
  ];

  return (
    <SoftBox>
      <SoftBox mb={3} display="flex" gap={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={loading || error}
        />
        <FormControl sx={{ minWidth: 200 }} disabled={loading || error}>
          <InputLabel id="category-filter-label">Category</InputLabel>
          <Select
            labelId="category-filter-label"
            value={category}
            label="Category"
            onChange={handleCategoryChange}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </SoftBox>

      <StatusIndicator loading={loading} error={error} onRetry={onRetry}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Document</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Uploaded</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDocuments.length === 0 && !loading && !error ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <SoftTypography variant="body2" color="text">
                      No documents found
                    </SoftTypography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <SoftBox display="flex" alignItems="center" px={1}>
                          <SoftBox mr={2}>
                            <DescriptionIcon color="action" />
                          </SoftBox>
                          <SoftBox display="flex" flexDirection="column">
                            <SoftTypography variant="button" fontWeight="medium">
                              {doc.filename}
                            </SoftTypography>
                            <SoftTypography variant="caption" color="secondary">
                              {doc.description || "No description"}
                            </SoftTypography>
                          </SoftBox>
                        </SoftBox>
                      </TableCell>
                      <TableCell>
                        <SoftTypography variant="caption" color="secondary">
                          {doc.category}
                        </SoftTypography>
                      </TableCell>
                      <TableCell>
                        <SoftTypography variant="caption" color="secondary">
                          {formatFileSize(doc.filesize)}
                        </SoftTypography>
                      </TableCell>
                      <TableCell>
                        <SoftTypography variant="caption" color="secondary">
                          {new Date(doc.created_at).toLocaleString()}
                        </SoftTypography>
                      </TableCell>
                      <TableCell>
                        <SoftBox display="flex" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() => onDownload?.(doc)}
                            disabled={loading}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => onDelete?.(doc.id)}
                            disabled={loading}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </SoftBox>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredDocuments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          disabled={loading || error}
        />
      </StatusIndicator>
    </SoftBox>
  );
}

DocumentList.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      type: PropTypes.oneOf(["file", "folder"]).isRequired,
      category: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      uploadedAt: PropTypes.string.isRequired,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onRetry: PropTypes.func,
  onDownload: PropTypes.func,
  onDelete: PropTypes.func,
};

DocumentList.defaultProps = {
  documents: [],
  loading: false,
  error: null,
  onRetry: null,
  onDownload: null,
  onDelete: null,
};

export default DocumentList; 