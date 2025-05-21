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
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Skeleton from "@mui/material/Skeleton";

// @mui icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Custom components
import StatusIndicator from "./StatusIndicator";

function DocumentCategories({ categories, loading, error, onRetry, onAdd, onEdit, onDelete }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
      setCategoryDescription(category.description);
    } else {
      setEditingCategory(null);
      setCategoryName("");
      setCategoryDescription("");
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setCategoryName("");
    setCategoryDescription("");
  };

  const handleSave = () => {
    if (categoryName.trim()) {
      if (editingCategory) {
        onEdit?.(editingCategory.id, {
          name: categoryName.trim(),
          description: categoryDescription.trim(),
        });
      } else {
        onAdd?.({
          name: categoryName.trim(),
          description: categoryDescription.trim(),
        });
      }
      handleCloseDialog();
    }
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
              </TableRow>
            </TableHead>
            <TableBody>
              {Array(5).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" width={150} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={200} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={80} height={24} />
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
              Document Categories
            </SoftTypography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              disabled={loading}
            >
              Add Category
            </Button>
          </SoftBox>
        </Grid>

        <Grid item xs={12}>
          {loading ? (
            renderSkeletonTable()
          ) : categories?.length > 0 ? (
            <Card>
              <SoftBox p={3}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Document Count</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>{category.name}</TableCell>
                          <TableCell>{category.description}</TableCell>
                          <TableCell>{category.documentCount}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(category)}
                              disabled={loading}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => onDelete?.(category.id)}
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
              No categories available.
            </SoftTypography>
          )}
        </Grid>

        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>
            {editingCategory ? "Edit Category" : "Add Category"}
          </DialogTitle>
          <DialogContent>
            <SoftBox mt={2}>
              <TextField
                fullWidth
                label="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                disabled={loading}
              />
            </SoftBox>
            <SoftBox mt={2}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                disabled={loading}
              />
            </SoftBox>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              color="primary"
              disabled={loading || !categoryName.trim()}
            >
              {editingCategory ? "Save" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </StatusIndicator>
  );
}

DocumentCategories.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string,
      documentCount: PropTypes.number,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onRetry: PropTypes.func,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

DocumentCategories.defaultProps = {
  categories: [],
  loading: false,
  error: null,
  onRetry: null,
  onAdd: null,
  onEdit: null,
  onDelete: null,
};

export default DocumentCategories; 