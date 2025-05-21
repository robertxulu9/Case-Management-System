import PropTypes from "prop-types";

// @mui material components
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotificationsIcon from "@mui/icons-material/Notifications";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Event categories
import { EVENT_CATEGORIES, IMPORTANCE_LEVELS } from "./EventModal";

function EventDetails({ event, open, onClose, onEdit, onDelete, cases }) {
  if (!event) return null;

  const category = EVENT_CATEGORIES[event.category];
  const importance = IMPORTANCE_LEVELS[event.importance];
  const caseItem = cases.find(c => c.id === event.caseId);
  const formatDate = (date) => new Date(date).toLocaleString();

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        <SoftBox p={3}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <SoftBox display="flex" alignItems="center">
              <SoftBox
                width={16}
                height={16}
                borderRadius="50%"
                bgcolor={category.color}
                mr={1}
              />
              <SoftTypography variant="button" fontWeight="medium" textTransform="uppercase">
                {category.label}
              </SoftTypography>
            </SoftBox>
            <SoftBox display="flex" gap={1}>
              <IconButton size="small" onClick={() => onEdit(event)}>
                <EditIcon />
              </IconButton>
              <IconButton size="small" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </SoftBox>
          </SoftBox>

          <SoftTypography variant="h4" fontWeight="bold" mb={1}>
            {event.title}
          </SoftTypography>

          {event.description && (
            <SoftBox mb={3}>
              <SoftTypography variant="body2" color="text">
                {event.description}
              </SoftTypography>
            </SoftBox>
          )}

          <Divider />

          <Grid container spacing={2} mt={2}>
            {caseItem && (
              <Grid item xs={12}>
                <SoftBox display="flex" alignItems="center" gap={1}>
                  <SoftBox
                    component="span"
                    width={16}
                    height={16}
                    borderRadius="50%"
                    bgcolor="info.main"
                    mr={1}
                  />
                  <SoftTypography variant="button" fontWeight="medium">
                    Case:
                  </SoftTypography>
                  <SoftTypography variant="body2" color="text">
                    {caseItem.title}
                  </SoftTypography>
                </SoftBox>
              </Grid>
            )}

            <Grid item xs={12}>
              <SoftBox display="flex" alignItems="center" gap={1}>
                <SoftBox
                  component="span"
                  width={16}
                  height={16}
                  borderRadius="50%"
                  bgcolor={importance.color}
                  mr={1}
                />
                <SoftTypography variant="button" fontWeight="medium">
                  Importance:
                </SoftTypography>
                <SoftTypography variant="body2" color="text">
                  {importance.label}
                </SoftTypography>
              </SoftBox>
            </Grid>

            <Grid item xs={12}>
              <SoftBox display="flex" alignItems="center" gap={1}>
                <AccessTimeIcon />
                <SoftBox>
                  <SoftTypography variant="button" fontWeight="medium">
                    Start
                  </SoftTypography>
                  <SoftTypography variant="body2" color="text">
                    {formatDate(event.start)}
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
            </Grid>

            <Grid item xs={12}>
              <SoftBox display="flex" alignItems="center" gap={1}>
                <AccessTimeIcon />
                <SoftBox>
                  <SoftTypography variant="button" fontWeight="medium">
                    End
                  </SoftTypography>
                  <SoftTypography variant="body2" color="text">
                    {formatDate(event.end)}
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
            </Grid>

            {event.location && (
              <Grid item xs={12}>
                <SoftBox display="flex" alignItems="center" gap={1}>
                  <LocationOnIcon />
                  <SoftTypography variant="body2" color="text">
                    {event.location}
                  </SoftTypography>
                </SoftBox>
              </Grid>
            )}

            {event.reminder && (
              <Grid item xs={12}>
                <SoftBox display="flex" alignItems="center" gap={1}>
                  <NotificationsIcon />
                  <SoftTypography variant="body2" color="text">
                    Reminder {event.reminderTime} minutes before
                  </SoftTypography>
                </SoftBox>
              </Grid>
            )}
          </Grid>

          <SoftBox display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <SoftButton
              variant="gradient"
              color="error"
              onClick={() => {
                onDelete(event);
                onClose();
              }}
              startIcon={<DeleteIcon />}
            >
              Delete
            </SoftButton>
            <SoftButton
              variant="gradient"
              color="info"
              onClick={() => {
                onEdit(event);
                onClose();
              }}
              startIcon={<EditIcon />}
            >
              Edit
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </Card>
    </Modal>
  );
}

EventDetails.propTypes = {
  event: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  cases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default EventDetails; 