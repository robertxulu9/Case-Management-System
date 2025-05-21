import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";

// @mui icons
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

// Custom components
import StatusIndicator from "./StatusIndicator";

// Charts
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ClientAnalytics({ analytics, loading, error, onRetry }) {
  const chartData = {
    labels: analytics?.monthlyStats?.map((stat) => stat.month) || [],
    datasets: [
      {
        label: "New Clients",
        data: analytics?.monthlyStats?.map((stat) => stat.newClients) || [],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Active Clients",
        data: analytics?.monthlyStats?.map((stat) => stat.activeClients) || [],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
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
        text: "Client Growth",
      },
    },
  };

  const statCards = [
    {
      title: "Total Clients",
      value: analytics?.totalClients || 0,
      icon: <PeopleIcon />,
      color: "info",
    },
    {
      title: "Active Clients",
      value: analytics?.activeClients || 0,
      icon: <BusinessIcon />,
      color: "success",
    },
    {
      title: "Average Cases per Client",
      value: analytics?.avgCasesPerClient || 0,
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
                Client Growth
              </SoftTypography>
              <Bar data={chartData} options={chartOptions} />
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
                    Client Type Distribution
                  </SoftTypography>
                  {analytics?.clientTypeDistribution?.map((type) => (
                    <SoftBox key={type.type} mb={2}>
                      <SoftBox display="flex" justifyContent="space-between" mb={1}>
                        <SoftTypography variant="button" fontWeight="medium">
                          {type.type}
                        </SoftTypography>
                        <SoftTypography variant="button" fontWeight="medium">
                          {type.count}
                        </SoftTypography>
                      </SoftBox>
                      <SoftBox
                        width="100%"
                        height="8px"
                        bgColor="grey.200"
                        borderRadius="md"
                      >
                        <SoftBox
                          width={`${(type.count / analytics.totalClients) * 100}%`}
                          height="100%"
                          bgColor={type.color}
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
                    Client Status Distribution
                  </SoftTypography>
                  {analytics?.clientStatusDistribution?.map((status) => (
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
                          width={`${(status.count / analytics.totalClients) * 100}%`}
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
        </Grid>
      </SoftBox>
    </StatusIndicator>
  );
}

ClientAnalytics.propTypes = {
  analytics: PropTypes.shape({
    totalClients: PropTypes.number,
    activeClients: PropTypes.number,
    avgCasesPerClient: PropTypes.number,
    monthlyStats: PropTypes.arrayOf(
      PropTypes.shape({
        month: PropTypes.string,
        newClients: PropTypes.number,
        activeClients: PropTypes.number,
      })
    ),
    clientTypeDistribution: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        count: PropTypes.number,
        color: PropTypes.string,
      })
    ),
    clientStatusDistribution: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string,
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

ClientAnalytics.defaultProps = {
  analytics: null,
  loading: false,
  error: null,
  onRetry: null,
};

export default ClientAnalytics; 