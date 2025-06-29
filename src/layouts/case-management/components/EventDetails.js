import PropTypes from "prop-types";
import { format } from "date-fns";

// @mui material components
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import FolderIcon from "@mui/icons-material/Folder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftBadge from "components/SoftBadge";

function EventDetails({ open, onClose, item, onEdit, onDelete, itemTypes, cases, lawyers, priorities }) {
  if (!item) return null;

  const formatDate = (date) => {
    return format(new Date(date), "PPpp");
  };

  const lawyer = lawyers.find((l) => l.id === item.lawyerId);
  const case_ = cases.find((c) => c.id === item.caseId);
  const priority = priorities.find((p) => p.id === item.priority);
  const type = itemTypes[item.type];

  const handleDelete = () => {
    onDelete(item);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <SoftBox
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", md: 500 },
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Card>
          <SoftBox p={3}>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center">
              <SoftBox display="flex" alignItems="center">
                {type.icon}
                <SoftTypography variant="h5" fontWeight="medium" ml={1}>
                  {item.title}
                </SoftTypography>
              </SoftBox>
              <SoftBox display="flex" alignItems="center">
                <IconButton onClick={() => onEdit(item)} size="small" sx={{ mr: 1 }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={handleDelete} size="small" sx={{ mr: 1 }}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={onClose} size="small">
                  <CloseIcon />
                </IconButton>
              </SoftBox>
            </SoftBox>

            <Divider sx={{ my: 2 }} />

            {item.description && (
              <SoftBox mb={3}>
                <SoftTypography variant="body2" color="text">
                  {item.description}
                </SoftTypography>
              </SoftBox>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SoftBox display="flex" alignItems="center">
                  {type.icon}
                  <SoftTypography variant="button" fontWeight="medium" ml={1}>
                    {type.label}
                  </SoftTypography>
                  {item.type === "task" && (
                    <Checkbox
                      checked={item.completed}
                      icon={<RadioButtonUncheckedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                      sx={{ ml: "auto" }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </SoftBox>
              </Grid>

              <Grid item xs={12}>
                <SoftBox display="flex" alignItems="center">
                  <AccessTimeIcon />
                  <SoftBox ml={1}>
                    <SoftTypography variant="button" fontWeight="medium">
                      Start
                    </SoftTypography>
                    <SoftTypography variant="body2" color="text">
                      {formatDate(item.start)}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
              </Grid>

              <Grid item xs={12}>
                <SoftBox display="flex" alignItems="center">
                  <AccessTimeIcon />
                  <SoftBox ml={1}>
                    <SoftTypography variant="button" fontWeight="medium">
                      End
                    </SoftTypography>
                    <SoftTypography variant="body2" color="text">
                      {formatDate(item.end)}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
              </Grid>

              {lawyer && (
                <Grid item xs={12}>
                  <SoftBox display="flex" alignItems="center">
                    <PersonIcon />
                    <SoftTypography variant="button" fontWeight="medium" ml={1}>
                      Assigned to:
                    </SoftTypography>
                    <SoftTypography variant="body2" color="text" ml={1}>
                      {lawyer.name}
                    </SoftTypography>
                  </SoftBox>
                </Grid>
              )}

              {case_ && (
                <Grid item xs={12}>
                  <SoftBox display="flex" alignItems="center">
                    <FolderIcon />
                    <SoftTypography variant="button" fontWeight="medium" ml={1}>
                      Related Case:
                    </SoftTypography>
                    <SoftTypography variant="body2" color="text" ml={1}>
                      {case_.title}
                    </SoftTypography>
                  </SoftBox>
                </Grid>
              )}

              {item.location && (
                <Grid item xs={12}>
                  <SoftBox display="flex" alignItems="center">
                    <LocationOnIcon />
                    <SoftTypography variant="body2" color="text" ml={1}>
                      {item.location}
                    </SoftTypography>
                  </SoftBox>
                </Grid>
              )}

              <Grid item xs={12}>
                <SoftBox display="flex" alignItems="center">
                  <SoftBadge
                    variant="contained"
                    color={priority?.color || "default"}
                    size="sm"
                    badgeContent={priority?.label || "No Priority"}
                    container
                  />
                </SoftBox>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <SoftBox display="flex" justifyContent="flex-end">
              <SoftButton
                variant="gradient"
                color="secondary"
                onClick={onClose}
              >
                Close
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </Card>
      </SoftBox>
    </Modal>
  );
}

EventDetails.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  itemTypes: PropTypes.object.isRequired,
  cases: PropTypes.array.isRequired,
  lawyers: PropTypes.array.isRequired,
  priorities: PropTypes.array.isRequired,
};

export default EventDetails; 