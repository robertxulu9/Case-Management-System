import PropTypes from "prop-types";
import { format, isValid, parseISO } from "date-fns";
import { useState } from "react";

// @mui material components
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";

// @mui icons
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DescriptionIcon from "@mui/icons-material/Description";
import CreateIcon from "@mui/icons-material/Create";
import UpdateIcon from "@mui/icons-material/Update";
import CloseIcon from "@mui/icons-material/Close";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

function CaseTimeline({ events = [] }) {
  const [openModal, setOpenModal] = useState(false);
  
  // Sort events by date in descending order (most recent first)
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = parseISO(a.created_at);
    const dateB = parseISO(b.created_at);
    return dateB - dateA;
  });
  
  const recentEvents = sortedEvents.slice(0, 4);
  const allEvents = sortedEvents;

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid date";
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy HH:mm") : "Invalid date";
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'note':
        return <NoteAddIcon />;
      case 'document':
        return <DescriptionIcon />;
      case 'create':
        return <CreateIcon />;
      case 'stage':
        return <UpdateIcon />;
      default:
        return <CreateIcon />;
    }
  };

  const getEventColor = (eventType) => {
    switch (eventType) {
      case 'note':
        return 'info';
      case 'document':
        return 'success';
      case 'create':
        return 'primary';
      case 'stage':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const renderTimeline = (eventsToRender) => (
    <Timeline position="alternate">
      {eventsToRender.map((event) => (
        <TimelineItem key={event.id}>
          <TimelineSeparator>
            <TimelineDot color={getEventColor(event.event_type)}>
              {getEventIcon(event.event_type)}
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <SoftBox>
              <SoftTypography variant="body2" color="text">
                {event.description}
              </SoftTypography>
              <SoftTypography variant="caption" color="text" fontWeight="regular">
                {formatDate(event.created_at)}
              </SoftTypography>
            </SoftBox>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );

  return (
    <SoftBox>
      {renderTimeline(recentEvents)}
      {events.length > 4 && (
        <SoftBox mt={2} display="flex" justifyContent="center">
          <SoftButton
            variant="text"
            color="info"
            onClick={handleOpenModal}
          >
            View All Events
          </SoftButton>
        </SoftBox>
      )}

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center">
            <SoftTypography variant="h5">Case Timeline</SoftTypography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </SoftBox>
        </DialogTitle>
        <DialogContent>
          {renderTimeline(allEvents)}
        </DialogContent>
      </Dialog>
    </SoftBox>
  );
}

CaseTimeline.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      event_type: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
    })
  ),
};

export default CaseTimeline; 