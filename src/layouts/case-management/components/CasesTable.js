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

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";
import SoftBadge from "components/SoftBadge";

function CasesTable({ cases, filters }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch = (caseItem.casename?.toLowerCase() || "").includes(filters.search.toLowerCase()) ||
                         (`${caseItem.client?.firstname || ''} ${caseItem.client?.lastname || ''}`.toLowerCase().includes(filters.search.toLowerCase()));
    const matchesStatus = filters.status === "all" || (caseItem.casestage || "").toLowerCase() === filters.status.toLowerCase();
    // You can add more filter logic for priority if needed
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Case Name</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Date Opened</TableCell>
              <TableCell>Practice Area</TableCell>
              <TableCell>Case Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCases
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell>
                    <SoftTypography
                      component={Link}
                      to={`/cases/${caseItem.id}`}
                      variant="button"
                      fontWeight="medium"
                      sx={{ textDecoration: "none" }}
                    >
                      {caseItem.casename}
                    </SoftTypography>
                  </TableCell>
                  <TableCell>
                    <SoftTypography variant="button" fontWeight="medium">
                      {caseItem.client ? `${caseItem.client.firstname} ${caseItem.client.lastname}` : ''}
                    </SoftTypography>
                  </TableCell>
                  <TableCell>
                    <SoftBadge
                      variant="gradient"
                      color={
                        caseItem.casestage === "closed"
                          ? "error"
                          : caseItem.casestage === "trial"
                          ? "warning"
                          : "success"
                      }
                      badgeContent={caseItem.casestage}
                      container
                    />
                  </TableCell>
                  <TableCell>
                    <SoftTypography variant="caption" color="secondary">
                      {caseItem.dateopened}
                    </SoftTypography>
                  </TableCell>
                  <TableCell>
                    <SoftTypography variant="caption" color="secondary">
                      {caseItem.practicearea}
                    </SoftTypography>
                  </TableCell>
                  <TableCell>
                    <SoftTypography variant="caption" color="secondary">
                      {caseItem.casenumber}
                    </SoftTypography>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCases.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

CasesTable.propTypes = {
  cases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      casenumber: PropTypes.string.isRequired,
      casename: PropTypes.string.isRequired,
      casestage: PropTypes.string.isRequired,
      dateopened: PropTypes.string.isRequired,
      practicearea: PropTypes.string,
      client: PropTypes.shape({
        firstname: PropTypes.string,
        lastname: PropTypes.string,
      }),
    })
  ).isRequired,
  filters: PropTypes.shape({
    search: PropTypes.string,
    status: PropTypes.string,
    priority: PropTypes.string,
  }).isRequired,
};

export default CasesTable; 