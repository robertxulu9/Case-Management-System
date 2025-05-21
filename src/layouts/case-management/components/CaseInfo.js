import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";

// @mui icons
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

// Custom components
import StatusIndicator from "./StatusIndicator";

function CaseInfo({ caseData, loading, error, onRetry }) {
  const infoSections = [
    {
      title: "Case Details",
      items: [
        {
          label: "Case Number",
          value: caseData?.caseNumber,
          icon: <AssignmentIcon />,
        },
        {
          label: "Created Date",
          value: caseData?.createdAt,
          icon: <CalendarTodayIcon />,
        },
        {
          label: "Status",
          value: caseData?.status,
          icon: <PriorityHighIcon />,
          badge: true,
        },
      ],
    },
    {
      title: "Client Information",
      items: [
        {
          label: "Client Name",
          value: caseData?.client?.name,
          icon: <PersonIcon />,
        },
        {
          label: "Client Email",
          value: caseData?.client?.email,
          icon: <PersonIcon />,
        },
        {
          label: "Client Phone",
          value: caseData?.client?.phone,
          icon: <PersonIcon />,
        },
      ],
    },
  ];

  const renderSkeletonCard = () => (
    <Card>
      <SoftBox p={3}>
        <Skeleton variant="text" width={200} height={24} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {Array(3).fill(0).map((_, index) => (
            <Grid item xs={12} key={index}>
              <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={200} height={32} />
            </Grid>
          ))}
        </Grid>
      </SoftBox>
    </Card>
  );

  return (
    <StatusIndicator loading={loading} error={error} onRetry={onRetry}>
      <Grid container spacing={3}>
        {loading
          ? Array(2).fill(0).map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                {renderSkeletonCard()}
              </Grid>
            ))
          : infoSections.map((section, sectionIndex) => (
              <Grid item xs={12} md={6} key={sectionIndex}>
                <Card>
                  <SoftBox p={3}>
                    <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                      {section.title}
                    </SoftTypography>
                    <Grid container spacing={3}>
                      {section.items.map((item, itemIndex) => (
                        <Grid item xs={12} key={itemIndex}>
                          <SoftBox display="flex" alignItems="center" mb={2}>
                            <SoftBox
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              width="2rem"
                              height="2rem"
                              borderRadius="md"
                              color="white"
                              bgColor="info"
                              shadow="md"
                              mr={2}
                            >
                              {item.icon}
                            </SoftBox>
                            <SoftBox>
                              <SoftTypography variant="button" fontWeight="medium" color="text">
                                {item.label}
                              </SoftTypography>
                              {item.badge ? (
                                <SoftBadge
                                  variant="gradient"
                                  color={item.value === "open" ? "success" : "error"}
                                  size="xs"
                                  badgeContent={item.value}
                                  container
                                />
                              ) : (
                                <SoftTypography variant="h6" fontWeight="bold">
                                  {item.value}
                                </SoftTypography>
                              )}
                            </SoftBox>
                          </SoftBox>
                        </Grid>
                      ))}
                    </Grid>
                  </SoftBox>
                </Card>
              </Grid>
            ))}
      </Grid>
    </StatusIndicator>
  );
}

CaseInfo.propTypes = {
  caseData: PropTypes.shape({
    caseNumber: PropTypes.string,
    createdAt: PropTypes.string,
    status: PropTypes.string,
    client: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
    }),
  }),
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onRetry: PropTypes.func,
};

CaseInfo.defaultProps = {
  caseData: null,
  loading: false,
  error: null,
  onRetry: null,
};

export default CaseInfo; 