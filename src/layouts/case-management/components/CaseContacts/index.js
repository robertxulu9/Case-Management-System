import { useState } from "react";
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftBadge from "components/SoftBadge";

const CONTACT_ROLES = [
  { value: 'opposing_counsel', label: 'Opposing Counsel' },
  { value: 'judge', label: 'Judge' },
  { value: 'witness', label: 'Witness' },
  { value: 'expert_witness', label: 'Expert Witness' },
  { value: 'mediator', label: 'Mediator' },
  { value: 'court_reporter', label: 'Court Reporter' },
  { value: 'investigator', label: 'Investigator' },
  { value: 'other', label: 'Other' }
];

function CaseContacts({ contacts = [], onAdd, onEdit, onDelete }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    role: 'opposing_counsel',
    organization: '',
    email: '',
    phone: '',
    notes: ''
  });

  const handleOpenMenu = (event, contact) => {
    setMenuAnchor(event.currentTarget);
    setSelectedContact(contact);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedContact(null);
  };

  const handleOpenDialog = (contact = null) => {
    if (contact) {
      setEditingContact(contact);
      setFormData(contact);
    } else {
      setEditingContact(null);
      setFormData({
        firstname: '',
        lastname: '',
        role: 'opposing_counsel',
        organization: '',
        email: '',
        phone: '',
        notes: ''
      });
    }
    setOpenDialog(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingContact(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingContact) {
        await onEdit(editingContact.id, formData);
      } else {
        await onAdd(formData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(selectedContact.id);
      handleCloseMenu();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'opposing_counsel':
        return 'error';
      case 'judge':
        return 'warning';
      case 'witness':
      case 'expert_witness':
        return 'info';
      case 'mediator':
        return 'success';
      case 'court_reporter':
        return 'secondary';
      case 'investigator':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role) => {
    return CONTACT_ROLES.find(r => r.value === role)?.label || role;
  };

  return (
    <SoftBox>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <SoftTypography variant="h6" fontWeight="medium">
          Case Contacts
        </SoftTypography>
        <SoftButton
          variant="gradient"
          color="info"
          size="small"
          onClick={() => handleOpenDialog()}
        >
          Add Contact
        </SoftButton>
      </SoftBox>

      <Grid container spacing={2}>
        {contacts.map((contact) => (
          <Grid item xs={12} key={contact.id}>
            <Card>
              <SoftBox p={2}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs>
                    <SoftTypography variant="h6">
                      {contact.firstname} {contact.lastname}
                    </SoftTypography>
                    <SoftTypography variant="body2" color="text">
                      {contact.organization}
                    </SoftTypography>
                  </Grid>
                  <Grid item>
                    <SoftBadge
                      variant="contained"
                      color={getRoleBadgeColor(contact.role)}
                      badgeContent={getRoleLabel(contact.role)}
                      container
                    />
                  </Grid>
                  <Grid item>
                    <IconButton
                      size="small"
                      onClick={(event) => handleOpenMenu(event, contact)}
                    >
                      <Icon>more_vert</Icon>
                    </IconButton>
                  </Grid>
                </Grid>
                {(contact.email || contact.phone) && (
                  <SoftBox mt={2}>
                    {contact.email && (
                      <SoftTypography variant="body2" color="text">
                        <Icon fontSize="small">email</Icon> {contact.email}
                      </SoftTypography>
                    )}
                    {contact.phone && (
                      <SoftTypography variant="body2" color="text">
                        <Icon fontSize="small">phone</Icon> {contact.phone}
                      </SoftTypography>
                    )}
                  </SoftBox>
                )}
                {contact.notes && (
                  <SoftBox mt={1}>
                    <SoftTypography variant="body2" color="text">
                      {contact.notes}
                    </SoftTypography>
                  </SoftBox>
                )}
              </SoftBox>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => handleOpenDialog(selectedContact)}>
          <Icon>edit</Icon>&nbsp;Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Icon>delete</Icon>&nbsp;Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingContact ? 'Edit Contact' : 'Add New Contact'}
        </DialogTitle>
        <DialogContent>
          <SoftBox component="form" role="form" mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstname}
                  onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastname}
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    label="Role"
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    {CONTACT_ROLES.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Organization"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </SoftBox>
        </DialogContent>
        <DialogActions>
          <SoftButton onClick={handleCloseDialog} color="secondary">
            Cancel
          </SoftButton>
          <SoftButton onClick={handleSubmit} color="info">
            {editingContact ? 'Save Changes' : 'Add Contact'}
          </SoftButton>
        </DialogActions>
      </Dialog>
    </SoftBox>
  );
}

CaseContacts.propTypes = {
  contacts: PropTypes.array,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CaseContacts; 