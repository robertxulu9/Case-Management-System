import PropTypes from "prop-types";

// @mui material components
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function CaseTimeline({ events }) {
  return (
    <Timeline>
      {events.map((event, index) => (
        <TimelineItem key={event.id}>
          <TimelineSeparator>
            <TimelineDot color={event.type === "update" ? "info" : "success"} />
            {index !== events.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <SoftBox mb={1}>
              <SoftTypography variant="button" fontWeight="medium" color="text">
                {event.title}
              </SoftTypography>
            </SoftBox>
            <SoftBox mb={1}>
              <SoftTypography variant="caption" color="secondary">
                {event.description}
              </SoftTypography>
            </SoftBox>
            <SoftTypography variant="caption" color="secondary">
              {new Date(event.timestamp).toLocaleString()}
            </SoftTypography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

CaseTimeline.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["update", "status_change"]).isRequired,
    })
  ).isRequired,
};

export default CaseTimeline; 