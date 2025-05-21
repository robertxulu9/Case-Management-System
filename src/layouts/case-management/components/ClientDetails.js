import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

// @mui icons
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";
import SoftBadge from "components/SoftBadge";

function ClientDetails({ client }) {
  if (!client) return null;

  const infoSections = [
    {
      title: "Client Information",
      items: [
        { label: "Name", value: client.name },
        { label: "Company", value: client.company },
        { label: "Email", value: client.email },
        { label: "Phone", value: client.phone },
        { label: "Address", value: client.address },
      ],
    },
    {
      title: "Client Status",
      items: [
        { label: "Status", value: client.status },
        { label: "Active Cases", value: client.activeCases },
        { label: "Total Cases", value: client.totalCases },
        { label: "Member Since", value: client.memberSince },
        { label: "Last Active", value: client.lastActive },
      ],
    },
  ];

  return (
    <SoftBox>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <SoftBox display="flex" alignItems="center">
          <SoftAvatar
            src={client.avatar}
            alt={client.name}
            size="xl"
            variant="rounded"
            sx={{ mr: 2 }}
          />
          <SoftBox>
            <SoftTypography variant="h5" fontWeight="bold">
              {client.name}
            </SoftTypography>
            <SoftTypography variant="button" color="secondary">
              {client.company}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        <SoftBox>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            sx={{ mr: 1 }}
          >
            Edit Client
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            component={Link}
            to={`/cases/new?clientId=${client.id}`}
          >
            New Case
          </Button>
        </SoftBox>
      </SoftBox>

      {infoSections.map((section, index) => (
        <SoftBox key={section.title} mb={3}>
          <SoftTypography variant="h6" fontWeight="medium" mb={2}>
            {section.title}
          </SoftTypography>
          <Grid container spacing={2}>
            {section.items.map((item) => (
              <Grid item xs={12} sm={6} key={item.label}>
                <SoftBox mb={1}>
                  <SoftTypography variant="caption" color="secondary">
                    {item.label}
                  </SoftTypography>
                  {item.label === "Status" ? (
                    <SoftBadge
                      variant="gradient"
                      color={item.value === "Active" ? "success" : "error"}
                      badgeContent={item.value}
                      container
                    />
                  ) : item.label === "Active Cases" ? (
                    <SoftBadge
                      variant="gradient"
                      color="info"
                      badgeContent={item.value}
                      container
                    />
                  ) : (
                    <SoftTypography variant="button" fontWeight="medium">
                      {item.value}
                    </SoftTypography>
                  )}
                </SoftBox>
              </Grid>
            ))}
          </Grid>
          {index < infoSections.length - 1 && (
            <SoftBox mt={3}>
              <Divider />
            </SoftBox>
          )}
        </SoftBox>
      ))}

      <SoftBox mt={3}>
        <SoftTypography variant="h6" fontWeight="medium" mb={2}>
          Recent Cases
        </SoftTypography>
        {/* Here you would include the RecentCases component with filtered cases for this client */}
      </SoftBox>
    </SoftBox>
  );
}

ClientDetails.propTypes = {
  client: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    company: PropTypes.string,
    address: PropTypes.string,
    avatar: PropTypes.string,
    status: PropTypes.string.isRequired,
    activeCases: PropTypes.number.isRequired,
    totalCases: PropTypes.number.isRequired,
    memberSince: PropTypes.string.isRequired,
    lastActive: PropTypes.string.isRequired,
  }),
};

export default ClientDetails; 