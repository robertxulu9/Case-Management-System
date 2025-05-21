import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";

// @mui icons
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import StorageIcon from "@mui/icons-material/Storage";
import CategoryIcon from "@mui/icons-material/Category";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

// Custom components
import StatusIndicator from "./StatusIndicator";

// Charts
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function DocumentAnalytics({ analytics, loading, error, onRetry }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const categoryChartData = {
    labels: analytics?.categoryDistribution?.map((cat) => cat.category) || [],
    datasets: [
      {
        data: analytics?.categoryDistribution?.map((cat) => cat.count) || [],
        backgroundColor: analytics?.categoryDistribution?.map((cat) => cat.color) || [],
      },
    ],
  };

  const typeChartData = {
    labels: analytics?.typeDistribution?.map((type) => type.type) || [],
    datasets: [
      {
        data: analytics?.typeDistribution?.map((type) => type.count) || [],
        backgroundColor: analytics?.typeDistribution?.map((type) => type.color) || [],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const statCards = [
    {
      title: "Total Documents",
      value: analytics?.totalDocuments || 0,
      icon: <DescriptionIcon />,
      color: "info",
    },
    {
      title: "Total Size",
      value: formatFileSize(analytics?.totalSize || 0),
      icon: <StorageIcon />,
      color: "success",
    },
    {
      title: "Categories",
      value: analytics?.categoryCount || 0,
      icon: <CategoryIcon />,
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
        <Skeleton variant="circular" width={300} height={300} sx={{ mx: "auto" }} />
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {loading ? (
              renderSkeletonChart()
            ) : (
              <Card>
                <SoftBox p={3}>
                  <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                    Document Categories
                  </SoftTypography>
                  <SoftBox height={300} position="relative">
                    <Pie data={categoryChartData} options={chartOptions} />
                  </SoftBox>
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
                    Document Types
                  </SoftTypography>
                  <SoftBox height={300} position="relative">
                    <Pie data={typeChartData} options={chartOptions} />
                  </SoftBox>
                </SoftBox>
              </Card>
            )}
          </Grid>
        </Grid>
      </SoftBox>

      <SoftBox mt={3}>
        <Card>
          <SoftBox p={3}>
            <SoftTypography variant="h6" fontWeight="medium" mb={2}>
              Recent Uploads
            </SoftTypography>
            {analytics.recentUploads.map((upload) => (
              <SoftBox key={upload.id} mb={2}>
                <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                  <SoftBox display="flex" alignItems="center">
                    <DescriptionIcon sx={{ mr: 2 }} />
                    <SoftBox>
                      <SoftTypography variant="button" fontWeight="medium">
                        {upload.name}
                      </SoftTypography>
                      <SoftTypography variant="caption" color="secondary">
                        {formatFileSize(upload.size)} • {upload.category}
                      </SoftTypography>
                    </SoftBox>
                  </SoftBox>
                  <SoftTypography variant="caption" color="secondary">
                    {new Date(upload.uploadedAt).toLocaleString()}
                  </SoftTypography>
                </SoftBox>
                <Divider sx={{ mt: 2 }} />
              </SoftBox>
            ))}
          </SoftBox>
        </Card>
      </SoftBox>
    </StatusIndicator>
  );
}

DocumentAnalytics.propTypes = {
  analytics: PropTypes.shape({
    totalDocuments: PropTypes.number,
    totalSize: PropTypes.number,
    categoryCount: PropTypes.number,
    categoryDistribution: PropTypes.arrayOf(
      PropTypes.shape({
        category: PropTypes.string,
        count: PropTypes.number,
        color: PropTypes.string,
      })
    ),
    typeDistribution: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        count: PropTypes.number,
        color: PropTypes.string,
      })
    ),
    recentUploads: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
        category: PropTypes.string.isRequired,
        uploadedAt: PropTypes.string.isRequired,
      })
    ).isRequired,
  }),
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onRetry: PropTypes.func,
};

DocumentAnalytics.defaultProps = {
  analytics: null,
  loading: false,
  error: null,
  onRetry: null,
};

export default DocumentAnalytics; 