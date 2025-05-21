import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";

// @mui icons
import TimelineIcon from "@mui/icons-material/Timeline";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

// Custom components
import StatusIndicator from "./StatusIndicator";

// Charts
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function CaseAnalytics({ analytics, loading, error, onRetry }) {
  const chartData = {
    labels: analytics?.monthlyStats?.map((stat) => stat.month) || [],
    datasets: [
      {
        label: "New Cases",
        data: analytics?.monthlyStats?.map((stat) => stat.newCases) || [],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Closed Cases",
        data: analytics?.monthlyStats?.map((stat) => stat.closedCases) || [],
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Case Trends",
      },
    },
  };

  const statCards = [
    {
      title: "Total Cases",
      value: analytics?.totalCases || 0,
      icon: <AssessmentIcon />,
      color: "info",
    },
    {
      title: "Active Cases",
      value: analytics?.activeCases || 0,
      icon: <TimelineIcon />,
      color: "success",
    },
    {
      title: "Average Resolution Time",
      value: `${analytics?.avgResolutionTime || 0} days`,
      icon: <TrendingUpIcon />,
      color: "warning",
    },
  ];

  const renderSkeletonCard = () => (
    <Card>
      <SoftBox p={3}>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center">
          <SoftBox>
            <Skeleton variant="text" width={100} height={24} />
            <Skeleton variant="text" width={60} height={32} />
          </SoftBox>
          <Skeleton variant="circular" width={48} height={48} />
        </SoftBox>
      </SoftBox>
    </Card>
  );

  const renderSkeletonChart = () => (
    <Card>
      <SoftBox p={3}>
        <Skeleton variant="text" width={200} height={24} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={300} />
      </SoftBox>
    </Card>
  );

  return (
    <StatusIndicator loading={loading} error={error} onRetry={onRetry}>
      <Grid container spacing={3}>
        {loading
          ? Array(3).fill(0).map((_, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                {renderSkeletonCard()}
              </Grid>
            ))
          : statCards.map((stat) => (
              <Grid item xs={12} sm={6} lg={4} key={stat.title}>
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
                      <SoftBox
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        width="3rem"
                        height="3rem"
                        borderRadius="md"
                        color="white"
                        bgColor={stat.color}
                        shadow="md"
                      >
                        {stat.icon}
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                </Card>
              </Grid>
            ))}
      </Grid>

      <SoftBox mt={3}>
        {loading ? (
          renderSkeletonChart()
        ) : (
          <Card>
            <SoftBox p={3}>
              <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                Case Trends
              </SoftTypography>
              <Line data={chartData} options={chartOptions} />
            </SoftBox>
          </Card>
        )}
      </SoftBox>

      <SoftBox mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {loading ? (
              renderSkeletonChart()
            ) : (
              <Card>
                <SoftBox p={3}>
                  <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                    Case Status Distribution
                  </SoftTypography>
                  {analytics?.statusDistribution?.map((status) => (
                    <SoftBox key={status.status} mb={2}>
                      <SoftBox display="flex" justifyContent="space-between" mb={1}>
                        <SoftTypography variant="button" fontWeight="medium">
                          {status.status}
                        </SoftTypography>
                        <SoftTypography variant="button" fontWeight="medium">
                          {status.count}
                        </SoftTypography>
                      </SoftBox>
                      <SoftBox
                        width="100%"
                        height="8px"
                        bgColor="grey.200"
                        borderRadius="md"
                      >
                        <SoftBox
                          width={`${(status.count / analytics.totalCases) * 100}%`}
                          height="100%"
                          bgColor={status.color}
                          borderRadius="md"
                        />
                      </SoftBox>
                    </SoftBox>
                  ))}
                </SoftBox>
              </Card>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {loading ? (
              renderSkeletonChart()
            ) : (
              <Card>
                <SoftBox p={3}>
                  <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                    Priority Distribution
                  </SoftTypography>
                  {analytics?.priorityDistribution?.map((priority) => (
                    <SoftBox key={priority.priority} mb={2}>
                      <SoftBox display="flex" justifyContent="space-between" mb={1}>
                        <SoftTypography variant="button" fontWeight="medium">
                          {priority.priority}
                        </SoftTypography>
                        <SoftTypography variant="button" fontWeight="medium">
                          {priority.count}
                        </SoftTypography>
                      </SoftBox>
                      <SoftBox
                        width="100%"
                        height="8px"
                        bgColor="grey.200"
                        borderRadius="md"
                      >
                        <SoftBox
                          width={`${(priority.count / analytics.totalCases) * 100}%`}
                          height="100%"
                          bgColor={priority.color}
                          borderRadius="md"
                        />
                      </SoftBox>
                    </SoftBox>
                  ))}
                </SoftBox>
              </Card>
            )}
          </Grid>
        </Grid>
      </SoftBox>
    </StatusIndicator>
  );
}

CaseAnalytics.propTypes = {
  analytics: PropTypes.shape({
    totalCases: PropTypes.number,
    activeCases: PropTypes.number,
    avgResolutionTime: PropTypes.number,
    monthlyStats: PropTypes.arrayOf(
      PropTypes.shape({
        month: PropTypes.string,
        newCases: PropTypes.number,
        closedCases: PropTypes.number,
      })
    ),
    statusDistribution: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string,
        count: PropTypes.number,
        color: PropTypes.string,
      })
    ),
    priorityDistribution: PropTypes.arrayOf(
      PropTypes.shape({
        priority: PropTypes.string,
        count: PropTypes.number,
        color: PropTypes.string,
      })
    ),
  }),
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onRetry: PropTypes.func,
};

CaseAnalytics.defaultProps = {
  analytics: null,
  loading: false,
  error: null,
  onRetry: null,
};

export default CaseAnalytics; 