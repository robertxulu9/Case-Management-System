import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// @mui material components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";
import SoftBadge from "components/SoftBadge";

// Custom components
import StatusIndicator from "./StatusIndicator";

function ClientsTable({ clients, loading, error, onRetry }) {
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

  const filteredClients = clients?.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  ) || [];

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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Cases</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.length === 0 && !loading && !error ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <SoftTypography variant="body2" color="text">
                      No clients found
                    </SoftTypography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <SoftBox display="flex" alignItems="center" px={1}>
                          <SoftBox mr={2}>
                            <SoftAvatar
                              src={client.avatar}
                              alt={client.name}
                              size="sm"
                              variant="rounded"
                            />
                          </SoftBox>
                          <SoftBox display="flex" flexDirection="column">
                            <SoftTypography
                              component={Link}
                              to={`/clients/${client.id}`}
                              variant="button"
                              fontWeight="medium"
                              sx={{ textDecoration: "none" }}
                            >
                              {client.name}
                            </SoftTypography>
                            <SoftTypography variant="caption" color="secondary">
                              {client.company}
                            </SoftTypography>
                          </SoftBox>
                        </SoftBox>
                      </TableCell>
                      <TableCell>
                        <SoftBox display="flex" flexDirection="column">
                          <SoftTypography variant="caption" color="secondary">
                            {client.email}
                          </SoftTypography>
                          <SoftTypography variant="caption" color="secondary">
                            {client.phone}
                          </SoftTypography>
                        </SoftBox>
                      </TableCell>
                      <TableCell>
                        <SoftBadge
                          variant="gradient"
                          color="info"
                          badgeContent={client.activeCases}
                          container
                        />
                      </TableCell>
                      <TableCell>
                        <SoftBadge
                          variant="gradient"
                          color={client.status === "Active" ? "success" : "error"}
                          badgeContent={client.status}
                          container
                        />
                      </TableCell>
                      <TableCell>
                        <SoftTypography variant="caption" color="secondary">
                          {new Date(client.lastActive).toLocaleDateString()}
                        </SoftTypography>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredClients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          disabled={loading || error}
        />
      </StatusIndicator>
    </SoftBox>
  );
}

ClientsTable.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      company: PropTypes.string,
      avatar: PropTypes.string,
      activeCases: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      lastActive: PropTypes.string.isRequired,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onRetry: PropTypes.func,
};

ClientsTable.defaultProps = {
  clients: [],
  loading: false,
  error: null,
  onRetry: null,
};

export default ClientsTable; 