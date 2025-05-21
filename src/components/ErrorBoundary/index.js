import React from 'react';
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // You can also log the error to an error reporting service here
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <SoftBox
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          p={3}
        >
          <SoftTypography variant="h2" fontWeight="bold" color="error" mb={2}>
            Something went wrong
          </SoftTypography>
          <SoftTypography variant="body1" color="text" mb={4}>
            We apologize for the inconvenience. Please try refreshing the page.
          </SoftTypography>
          <SoftButton
            variant="gradient"
            color="info"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </SoftButton>
          {process.env.NODE_ENV === 'development' && (
            <SoftBox mt={4} p={3} bgcolor="grey.100" borderRadius="lg" maxWidth="800px">
              <SoftTypography variant="h6" color="error" mb={2}>
                Error Details:
              </SoftTypography>
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </SoftBox>
          )}
        </SoftBox>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary; 