import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// @mui material components
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTable from "components/SoftTable";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

// Services
import { practiceAreaOperations } from "services/databaseService";

function CasesTable({ cases, filters }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (caseItem) => {
    navigate(`/cases/${caseItem.casename.split(' ').join('-')}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getCaseStageColor = (stage) => {
    switch (stage) {
      case "closed":
        return "error";
      case "trial":
      case "judgment":
      case "appeal":
        return "warning";
      case "consultation":
      case "investigation":
        return "info";
      case "pre-litigation":
      case "settlement":
        return "primary";
      case "filed":
      case "discovery":
        return "secondary";
      default:
        return "success";
    }
  };

  const columns = [
    { name: "case", align: "left" },
    { name: "client", align: "left" },
    { name: "stage", align: "center" },
    { name: "opened", align: "center" }
  ];

  const rows = cases.map((caseItem) => ({
    case: (
      <SoftBox>
        <SoftTypography variant="button" fontWeight="medium">
          {caseItem.casename}
        </SoftTypography>
        <SoftTypography variant="caption" color="secondary">
          {caseItem.casenumber}
        </SoftTypography>
      </SoftBox>
    ),
    client: (
      <SoftBox>
        {caseItem.client && (
          <>
            <SoftTypography variant="button" fontWeight="medium">
              {`${caseItem.client.firstname} ${caseItem.client.lastname}`}
            </SoftTypography>
            {caseItem.client.company && (
              <SoftTypography variant="caption" color="secondary">
                {caseItem.client.company}
              </SoftTypography>
            )}
          </>
        )}
      </SoftBox>
    ),
    stage: (
      <SoftBadge
        variant="gradient"
        color={getCaseStageColor(caseItem.casestage)}
        size="sm"
        badgeContent={caseItem.casestage || "NEW"}
        container
      />
    ),
    opened: (
      <SoftTypography variant="caption" color="secondary" fontWeight="medium">
        {formatDate(caseItem.dateopened)}
      </SoftTypography>
    ),
    onClick: () => handleRowClick(caseItem)
  }));

  // Filter cases based on search and other filters
  const filteredCases = cases.filter(caseItem => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        caseItem.casename.toLowerCase().includes(searchLower) ||
        caseItem.casenumber.toLowerCase().includes(searchLower) ||
        (caseItem.client && 
          `${caseItem.client.firstname} ${caseItem.client.lastname}`.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }

    if (filters.status && filters.status !== 'all' && caseItem.casestage !== filters.status) {
      return false;
    }

    return true;
  });

  return (
    <SoftBox>
      <SoftTable
        columns={columns}
        rows={rows}
        onRowClick={(row) => row.onClick && row.onClick()}
        pagination={{
          count: filteredCases.length,
          page,
          rowsPerPage,
          onPageChange: handleChangePage,
          onRowsPerPageChange: handleChangeRowsPerPage
        }}
      />
    </SoftBox>
  );
}

CasesTable.propTypes = {
  cases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      casename: PropTypes.string.isRequired,
      casenumber: PropTypes.string,
      casestage: PropTypes.string,
      dateopened: PropTypes.string.isRequired,
      client: PropTypes.shape({
        firstname: PropTypes.string.isRequired,
        lastname: PropTypes.string.isRequired,
        company: PropTypes.string
      })
    })
  ).isRequired,
  filters: PropTypes.object.isRequired
};

export default CasesTable; 