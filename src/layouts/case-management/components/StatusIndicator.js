import PropTypes from "prop-types";

// @mui material components
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";

// @mui icons
import RefreshIcon from "@mui/icons-material/Refresh";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function StatusIndicator({ loading, error, onRetry, children }) {
  if (loading) {
    return (
      <SoftBox
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={3}
      >
        <CircularProgress size={40} />
        <SoftTypography variant="button" color="text" mt={2}>
          Loading...
        </SoftTypography>
      </SoftBox>
    );
  }

  if (error) {
    return (
      <SoftBox p={3}>
        <Alert
          severity="error"
          action={
            onRetry && (
              <Button
                color="inherit"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={onRetry}
              >
                Retry
              </Button>
            )
          }
        >
          <AlertTitle>Error</AlertTitle>
          {error.message || "An error occurred while loading the data."}
        </Alert>
      </SoftBox>
    );
  }

  return children;
}

StatusIndicator.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onRetry: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default StatusIndicator; 