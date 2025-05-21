import PropTypes from "prop-types";

// @mui material components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

function ClientsTable({ clients, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <SoftBox display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </SoftBox>
    );
  }

  return (
    <TableContainer>
      <Table sx={{ width: '100%' }}>
        <TableHead>

          <TableRow>
            <TableCell sx={{ width: '16.66%', fontWeight: 'bold' }}>Name</TableCell>
            <TableCell sx={{ width: '16.66%', fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ width: '16.66%', fontWeight: 'bold' }}>Phone</TableCell>
            <TableCell sx={{ width: '16.66%', fontWeight: 'bold' }}>Group</TableCell>
            <TableCell sx={{ width: '16.66%', fontWeight: 'bold' }}>Portal Access</TableCell>
            <TableCell sx={{ width: '16.66%', fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell sx={{ width: '16.66%', verticalAlign: 'middle' }}>
                <SoftTypography variant="button" fontWeight="medium">
                  {`${client.firstname} ${client.lastname}`}
                </SoftTypography>
              </TableCell>
              <TableCell sx={{ width: '16.66%', verticalAlign: 'middle' }}>{client.email}</TableCell>
              <TableCell sx={{ width: '16.66%', verticalAlign: 'middle' }}>{client.cellphone || client.workphone || "-"}</TableCell>
              <TableCell sx={{ width: '16.66%', verticalAlign: 'middle' }}>
                <SoftBadge
                  variant="contained"
                  color={client.peoplegroup === "vip" ? "primary" : "secondary"}
                  size="xs"
                  badgeContent={(client.peoplegroup || "client").toUpperCase()}
                  container
                />
              </TableCell>
              <TableCell sx={{ width: '16.66%', verticalAlign: 'middle' }}>
                <SoftBadge
                  variant="contained"
                  color={client.enableclientportal ? "success" : "error"}
                  size="xs"
                  badgeContent={client.enableclientportal ? "Enabled" : "Disabled"}
                  container
                />
              </TableCell>
              <TableCell sx={{ width: '16.66%', verticalAlign: 'middle' }}>
                <IconButton
                  size="small"
                  color="info"
                  onClick={() => onEdit(client)}
                >
                  <Icon>edit</Icon>
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(client.id)}
                >
                  <Icon>delete</Icon>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {clients.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ width: '100%', verticalAlign: 'middle' }}>
                <SoftTypography variant="button" color="text">
                  No clients found. Click &quot;Add Client&quot; to create one.
                </SoftTypography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ClientsTable.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
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