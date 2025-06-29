import PropTypes from "prop-types";
import { useState } from "react";

// @mui material components
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTable from "components/SoftTable";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

// Custom components
import ClientDetailsModal from "./ClientDetailsModal";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

function ClientsTable({ clients, loading, onEdit, onDelete }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE_OPTIONS[0]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (clientId) => {
    setSelectedClientId(clientId);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedClientId(null);
  };

  if (loading) {
    return (
      <SoftBox display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </SoftBox>
    );
  }

  const columns = [
    { name: "name", align: "left", width: "auto" },
    { name: "email", align: "left", width: "auto" },
    { name: "contact", align: "left", width: "auto" },
    { name: "group", align: "left", width: "auto" },
    { name: "portal", align: "left", width: "auto" },
    { name: "actions", align: "right", width: "auto" }
  ];

  // Calculate the slice of data to display based on pagination
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedClients = clients.slice(startIndex, endIndex);

  const rows = displayedClients.map((client) => ({
    name: (
      <SoftBox display="flex" flexDirection="column">
        <SoftTypography variant="button" fontWeight="medium" textTransform="capitalize">
          {`${client.firstname} ${client.lastname}`}
        </SoftTypography>
        {client.company && (
          <SoftTypography variant="caption" color="secondary">
            {client.company}
          </SoftTypography>
        )}
      </SoftBox>
    ),
    email: (
      <SoftTypography variant="button" fontWeight="regular">
        {client.email}
      </SoftTypography>
    ),
    contact: (
      <SoftBox display="flex" flexDirection="column">
        {client.cellphone && (
          <SoftTypography variant="button" fontWeight="regular">
            {client.cellphone}
          </SoftTypography>
        )}
        {client.workphone && (
          <SoftTypography variant="caption" color="secondary">
            {client.workphone}
          </SoftTypography>
        )}
      </SoftBox>
    ),
    group: (
      <SoftBadge
        variant="gradient"
        color={client.peoplegroup === "vip" ? "info" : "secondary"}
        badgeContent={(client.peoplegroup || "client").toUpperCase()}
        container
      />
    ),
    portal: (
      <SoftBadge
        variant="gradient"
        color={client.enableclientportal ? "success" : "error"}
        badgeContent={client.enableclientportal ? "ENABLED" : "DISABLED"}
        container
      />
    ),
    actions: (
      <SoftBox display="flex" gap={1}>
        <IconButton
          size="small"
          color="info"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(client);
          }}
        >
          <Icon>edit</Icon>
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(client.id);
          }}
        >
          <Icon>delete</Icon>
        </IconButton>
      </SoftBox>
    ),
    onClick: () => handleRowClick(client.id)
  }));

  return (
    <>
      <SoftBox
        sx={{
          "& .MuiTableRow-root:not(.MuiTableRow-head):hover": {
            cursor: "pointer",
            backgroundColor: ({ palette: { grey } }) => grey[200]
          },
        }}
      >
        <SoftTable
          title="Clients"
          columns={columns}
          rows={rows}
          onRowClick={(row) => row.onClick && row.onClick()}
          pagination={{
            total: clients.length,
            page,
            rowsPerPage,
            onPageChange: handleChangePage,
            onRowsPerPageChange: handleChangeRowsPerPage
          }}
        />
      </SoftBox>

      <ClientDetailsModal
        open={showDetailsModal}
        onClose={handleCloseModal}
        clientId={selectedClientId}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
}

ClientsTable.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      firstname: PropTypes.string.isRequired,
      lastname: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      cellphone: PropTypes.string,
      workphone: PropTypes.string,
      peoplegroup: PropTypes.string,
      enableclientportal: PropTypes.bool,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ClientsTable; 