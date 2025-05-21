import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// @mui material components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";

function RecentCases({ cases }) {
  return (
    <TableContainer>
      <Table>
        <TableBody>
          {cases.map((caseItem) => (
            <TableRow key={caseItem.id}>
              <TableCell>
                <SoftBox display="flex" alignItems="center" px={1}>
                  <SoftBox mr={2}>
                    <SoftAvatar
                      src={caseItem.client?.avatar}
                      alt={caseItem.client?.name}
                      size="sm"
                      variant="rounded"
                    />
                  </SoftBox>
                  <SoftBox display="flex" flexDirection="column">
                    <SoftTypography
                      component={Link}
                      to={`/cases/${caseItem.id}`}
                      variant="button"
                      fontWeight="medium"
                      sx={{ textDecoration: "none" }}
                    >
                      {caseItem.title}
                    </SoftTypography>
                    <SoftTypography variant="caption" color="secondary">
                      {caseItem.client?.name}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
              </TableCell>
              <TableCell>
                <SoftTypography variant="caption" color="secondary">
                  {caseItem.status}
                </SoftTypography>
              </TableCell>
              <TableCell>
                <SoftTypography variant="caption" color="secondary">
                  {new Date(caseItem.createdAt).toLocaleDateString()}
                </SoftTypography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

RecentCases.propTypes = {
  cases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      client: PropTypes.shape({
        name: PropTypes.string,
        avatar: PropTypes.string,
      }),
    })
  ).isRequired,
};

export default RecentCases; 