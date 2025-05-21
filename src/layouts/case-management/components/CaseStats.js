import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function CaseStats({ stats }) {
  const statCards = [
    {
      title: "Total Cases",
      value: stats.totalCases,
      color: "info",
    },
    {
      title: "Active Cases",
      value: stats.activeCases,
      color: "success",
    },
    {
      title: "Closed Cases",
      value: stats.closedCases,
      color: "warning",
    },
    {
      title: "Urgent Cases",
      value: stats.urgentCases,
      color: "error",
    },
  ];

  return (
    <Grid container spacing={3}>
      {statCards.map((stat) => (
        <Grid item xs={12} sm={6} lg={3} key={stat.title}>
          <Card>
            <SoftBox p={3}>
              <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                <SoftBox>
                  <SoftTypography variant="button" fontWeight="medium" color="text">
                    {stat.title}
                  </SoftTypography>
                  <SoftTypography variant="h4" fontWeight="bold">
                    {stat.value}
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
            </SoftBox>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

CaseStats.propTypes = {
  stats: PropTypes.shape({
    totalCases: PropTypes.number,
    activeCases: PropTypes.number,
    closedCases: PropTypes.number,
    urgentCases: PropTypes.number,
  }).isRequired,
};

export default CaseStats; 