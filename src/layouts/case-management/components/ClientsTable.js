import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// @mui material components
import TextField from "@mui/material/TextField";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTable from "components/SoftTable";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Custom components
import StatusIndicator from "./StatusIndicator";

function ClientsTable({ clients, loading, error, onRetry, onViewDetails }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getFullName = (client) => {
    const parts = [];
    if (client.firstname) parts.push(client.firstname);
    if (client.middlename) parts.push(client.middlename);
    if (client.lastname) parts.push(client.lastname);
    return parts.join(" ");
  };

  const filteredClients = clients?.filter((client) => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = getFullName(client);
    return (
      fullName.toLowerCase().includes(searchLower) ||
      (client.email || "").toLowerCase().includes(searchLower) ||
      (client.cellphone || "").includes(searchQuery) ||
      (client.workphone || "").includes(searchQuery) ||
      (client.homephone || "").includes(searchQuery)
    );
  }) || [];

  const columns = [
    { name: "client", align: "left", width: "25%" },
    { name: "contact", align: "left", width: "20%" },
    { name: "company", align: "left", width: "20%" },
    { name: "address", align: "left", width: "25%" },
    { name: "actions", align: "right", width: "10%" }
  ];

  const rows = filteredClients.map((client) => ({
    client: (
      <SoftBox display="flex" alignItems="center" px={1}>
        <SoftBox display="flex" flexDirection="column">
          <SoftTypography
            variant="button"
            fontWeight="medium"
            sx={{ cursor: 'pointer' }}
            onClick={() => onViewDetails(client)}
          >
            {getFullName(client)}
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    ),
    contact: (
      <SoftBox display="flex" flexDirection="column">
        <SoftTypography variant="caption" color="secondary">
          {client.email}
        </SoftTypography>
        <SoftTypography variant="caption" color="secondary">
          {client.cellphone || client.workphone || client.homephone}
        </SoftTypography>
      </SoftBox>
    ),
    company: (
      <SoftBox display="flex" flexDirection="column">
        <SoftTypography variant="caption" color="secondary">
          {client.company}
        </SoftTypography>
        <SoftTypography variant="caption" color="secondary">
          {client.jobtitle}
        </SoftTypography>
      </SoftBox>
    ),
    address: (
      <SoftBox display="flex" flexDirection="column">
        <SoftTypography variant="caption" color="secondary">
          {client.address1}
          {client.address2 ? `, ${client.address2}` : ''}
        </SoftTypography>
        <SoftTypography variant="caption" color="secondary">
          {[client.city, client.province, client.country].filter(Boolean).join(", ")}
        </SoftTypography>
      </SoftBox>
    ),
    actions: (
      <SoftButton
        variant="text"
        color="info"
        onClick={() => onViewDetails(client)}
      >
        View Details
      </SoftButton>
    ),
    onClick: () => onViewDetails(client)
  }));

  return (
    <SoftBox>
      <SoftBox mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={loading || error}
        />
      </SoftBox>

      <StatusIndicator loading={loading} error={error} onRetry={onRetry}>
        <SoftTable
          title="Clients"
          columns={columns}
          rows={rows}
          pagination={{
            total: filteredClients.length,
            page,
            rowsPerPage,
            onPageChange: handleChangePage,
            onRowsPerPageChange: handleChangeRowsPerPage
          }}
        />
      </StatusIndicator>
    </SoftBox>
  );
}

ClientsTable.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      firstname: PropTypes.string,
      middlename: PropTypes.string,
      lastname: PropTypes.string,
      email: PropTypes.string,
      cellphone: PropTypes.string,
      workphone: PropTypes.string,
      homephone: PropTypes.string,
      company: PropTypes.string,
      jobtitle: PropTypes.string,
      address1: PropTypes.string,
      address2: PropTypes.string,
      city: PropTypes.string,
      province: PropTypes.string,
      country: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onRetry: PropTypes.func,
  onViewDetails: PropTypes.func.isRequired,
};

ClientsTable.defaultProps = {
  clients: [],
  loading: false,
  error: null,
  onRetry: null,
};

export default ClientsTable; 