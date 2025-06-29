import { useEffect, useState } from "react";
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";
import SoftButton from "components/SoftButton";

// Components
import CasesTable from "../../case-management/components/CasesTable";

// Services
import { clientOperations, caseOperations } from "services/databaseService";

function ClientDetailsModal({ open, onClose, clientId, onEdit, onDelete }) {
  const [clientData, setClientData] = useState(null);
  const [clientCases, setClientCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && clientId) {
      loadClientData();
    }
  }, [open, clientId]);

  const loadClientData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load client data
      const client = await clientOperations.getClientById(clientId);
      setClientData(client);

      // Load client's cases
      const cases = await caseOperations.getCasesByClient(clientId);
      setClientCases(cases);
    } catch (err) {
      console.error('Error loading client data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(clientData);
    onClose();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(clientId);
    onClose();
  };

  if (!open) return null;

  if (loading) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <SoftBox
          p={3}
          sx={{
            width: '90%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2
          }}
        >
          <SoftBox display="flex" justifyContent="center" alignItems="center" p={3}>
            Loading...
          </SoftBox>
        </SoftBox>
      </Modal>
    );
  }

  if (error || !clientData) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <SoftBox
          p={3}
          sx={{
            width: '90%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2
          }}
        >
          <SoftBox p={3} textAlign="center">
            <SoftTypography variant="h6" fontWeight="medium" color="error">
              {error || 'Client not found'}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <SoftBox
        p={3}
        sx={{
          width: '90%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2
        }}
      >
        <Card>
          <SoftBox p={3}>
            {/* Header */}
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <IconButton onClick={onClose} sx={{ mb: 0 }}>
                  <Icon>close</Icon>
                </IconButton>
              </Grid>
              <Grid item xs>
                <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                  <SoftBox display="flex" flexDirection="column">
                    <SoftTypography variant="h6" fontWeight="medium">
                      {`${clientData.firstname} ${clientData.lastname}`}
                    </SoftTypography>
                    {clientData.company && (
                      <SoftTypography variant="caption" color="secondary">
                        {clientData.company}
                      </SoftTypography>
                    )}
                  </SoftBox>
                  <SoftBox display="flex" gap={1}>
                    <SoftBadge
                      variant="gradient"
                      color={clientData.peoplegroup === "vip" ? "info" : "secondary"}
                      badgeContent={(clientData.peoplegroup || "client").toUpperCase()}
                      container
                    />
                    <SoftBadge
                      variant="gradient"
                      color={clientData.enableclientportal ? "success" : "error"}
                      badgeContent={clientData.enableclientportal ? "ENABLED" : "DISABLED"}
                      container
                    />
                  </SoftBox>
                </SoftBox>
              </Grid>
              <Grid item>
                <SoftBox display="flex" gap={1}>
                  <IconButton size="small" color="info" onClick={handleEdit}>
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton size="small" color="error" onClick={handleDelete}>
                    <Icon>delete</Icon>
                  </IconButton>
                </SoftBox>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Client Information */}
            <Grid container spacing={3}>
              {/* Contact Information */}
              <Grid item xs={12} md={6}>
                <SoftBox>
                  <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                    Contact Information
                  </SoftTypography>
                  <Card>
                    <SoftBox p={2}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <SoftBox display="flex" flexDirection="column">
                            <SoftTypography variant="caption" color="text">
                              Full Name
                            </SoftTypography>
                            <SoftTypography variant="button" fontWeight="medium">
                              {`${clientData.firstname} ${clientData.middlename ? clientData.middlename + ' ' : ''}${clientData.lastname}`}
                            </SoftTypography>
                          </SoftBox>
                        </Grid>
                        <Grid item xs={12}>
                          <SoftBox display="flex" flexDirection="column">
                            <SoftTypography variant="caption" color="text">
                              Email
                            </SoftTypography>
                            <SoftTypography variant="button" fontWeight="regular">
                              {clientData.email}
                            </SoftTypography>
                          </SoftBox>
                        </Grid>
                        {clientData.cellphone && (
                          <Grid item xs={12}>
                            <SoftBox display="flex" flexDirection="column">
                              <SoftTypography variant="caption" color="text">
                                Cell Phone
                              </SoftTypography>
                              <SoftTypography variant="button" fontWeight="regular">
                                {clientData.cellphone}
                              </SoftTypography>
                            </SoftBox>
                          </Grid>
                        )}
                        {clientData.workphone && (
                          <Grid item xs={12}>
                            <SoftBox display="flex" flexDirection="column">
                              <SoftTypography variant="caption" color="text">
                                Work Phone
                              </SoftTypography>
                              <SoftTypography variant="button" fontWeight="regular">
                                {clientData.workphone}
                              </SoftTypography>
                            </SoftBox>
                          </Grid>
                        )}
                        {clientData.homephone && (
                          <Grid item xs={12}>
                            <SoftBox display="flex" flexDirection="column">
                              <SoftTypography variant="caption" color="text">
                                Home Phone
                              </SoftTypography>
                              <SoftTypography variant="button" fontWeight="regular">
                                {clientData.homephone}
                              </SoftTypography>
                            </SoftBox>
                          </Grid>
                        )}
                      </Grid>
                    </SoftBox>
                  </Card>
                </SoftBox>
              </Grid>

              {/* Professional Information */}
              <Grid item xs={12} md={6}>
                <SoftBox>
                  <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                    Professional Information
                  </SoftTypography>
                  <Card>
                    <SoftBox p={2}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <SoftBox display="flex" flexDirection="column">
                            <SoftTypography variant="caption" color="text">
                              Company
                            </SoftTypography>
                            <SoftTypography variant="button" fontWeight="regular">
                              {clientData.company || 'N/A'}
                            </SoftTypography>
                          </SoftBox>
                        </Grid>
                        <Grid item xs={12}>
                          <SoftBox display="flex" flexDirection="column">
                            <SoftTypography variant="caption" color="text">
                              Job Title
                            </SoftTypography>
                            <SoftTypography variant="button" fontWeight="regular">
                              {clientData.jobtitle || 'N/A'}
                            </SoftTypography>
                          </SoftBox>
                        </Grid>
                        <Grid item xs={12}>
                          <SoftBox display="flex" flexDirection="column">
                            <SoftTypography variant="caption" color="text">
                              Client Type
                            </SoftTypography>
                            <SoftBox mt={1}>
                              <SoftBadge
                                variant="gradient"
                                color={clientData.peoplegroup === "vip" ? "info" : "secondary"}
                                badgeContent={(clientData.peoplegroup || "client").toUpperCase()}
                                container
                              />
                            </SoftBox>
                          </SoftBox>
                        </Grid>
                        <Grid item xs={12}>
                          <SoftBox display="flex" flexDirection="column">
                            <SoftTypography variant="caption" color="text">
                              Portal Access
                            </SoftTypography>
                            <SoftBox mt={1}>
                              <SoftBadge
                                variant="gradient"
                                color={clientData.enableclientportal ? "success" : "error"}
                                badgeContent={clientData.enableclientportal ? "ENABLED" : "DISABLED"}
                                container
                              />
                            </SoftBox>
                          </SoftBox>
                        </Grid>
                      </Grid>
                    </SoftBox>
                  </Card>
                </SoftBox>
              </Grid>

              {/* Address Information */}
              <Grid item xs={12}>
                <SoftBox>
                  <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                    Address Information
                  </SoftTypography>
                  <Card>
                    <SoftBox p={2}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <SoftBox display="flex" flexDirection="column">
                            <SoftTypography variant="caption" color="text">
                              Address Line 1
                            </SoftTypography>
                            <SoftTypography variant="button" fontWeight="regular">
                              {clientData.address1 || 'N/A'}
                            </SoftTypography>
                          </SoftBox>
                        </Grid>
                        {clientData.address2 && (
                          <Grid item xs={12}>
                            <SoftBox display="flex" flexDirection="column">
                              <SoftTypography variant="caption" color="text">
                                Address Line 2
                              </SoftTypography>
                              <SoftTypography variant="button" fontWeight="regular">
                                {clientData.address2}
                              </SoftTypography>
                            </SoftBox>
                          </Grid>
                        )}
                        <Grid item xs={12} sm={4}>
                          <SoftBox display="flex" flexDirection="column">
                            <SoftTypography variant="caption" color="text">
                              City
                            </SoftTypography>
                            <SoftTypography variant="button" fontWeight="regular">
                              {clientData.city || 'N/A'}
                            </SoftTypography>
                          </SoftBox>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <SoftBox display="flex" flexDirection="column">
                            <SoftTypography variant="caption" color="text">
                              Province/State
                            </SoftTypography>
                            <SoftTypography variant="button" fontWeight="regular">
                              {clientData.province || 'N/A'}
                            </SoftTypography>
                          </SoftBox>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <SoftBox display="flex" flexDirection="column">
                            <SoftTypography variant="caption" color="text">
                              Country
                            </SoftTypography>
                            <SoftTypography variant="button" fontWeight="regular">
                              {clientData.country || 'N/A'}
                            </SoftTypography>
                          </SoftBox>
                        </Grid>
                      </Grid>
                    </SoftBox>
                  </Card>
                </SoftBox>
              </Grid>

              {/* Client Cases */}
              <Grid item xs={12}>
                <SoftBox>
                  <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                    Related Cases
                  </SoftTypography>
                  <Card>
                    <SoftBox p={2}>
                      <CasesTable cases={clientCases} filters={{}} />
                    </SoftBox>
                  </Card>
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>
        </Card>
      </SoftBox>
    </Modal>
  );
}

ClientDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  clientId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ClientDetailsModal; 