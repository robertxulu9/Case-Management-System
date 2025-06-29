import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

// @mui material components
import { Table as MuiTable } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import borders from "assets/theme/base/borders";

function SoftTable({ 
  columns, 
  rows, 
  pagination, 
  title,
  entriesPerPage,
  canSearch,
  showTotalEntries,
  table,
  isSorted,
  noEndBorder
}) {
  const { light } = colors;
  const { size, fontWeightBold } = typography;
  const { borderWidth } = borders;

  const renderColumns = columns.map(({ name, align, width }, key) => {
    let pl;
    let pr;

    if (key === 0) {
      pl = 3;
      pr = 3;
    } else if (key === columns.length - 1) {
      pl = 3;
      pr = 3;
    } else {
      pl = 1;
      pr = 1;
    }

    return (
      <SoftBox
        key={name}
        component="th"
        width={width || "auto"}
        pt={1.5}
        pb={1.25}
        pl={align === "left" ? pl : 3}
        pr={align === "right" ? pr : 3}
        textAlign={align}
        fontSize={size.xxs}
        fontWeight={fontWeightBold}
        color="secondary"
        opacity={0.7}
        borderBottom={`${borderWidth[1]} solid ${light.main}`}
      >
        {name.toUpperCase()}
      </SoftBox>
    );
  });

  const renderRows = rows.map((row, key) => {
    const rowKey = `row-${key}`;
    const isLast = key === rows.length - 1;

    const tableRow = columns.map(({ name, align }) => {
      let template;
      const cellContent = row[name];

      if (React.isValidElement(cellContent)) {
        // If the content is already a React element, use it directly
        template = (
          <SoftBox
            key={uuidv4()}
            component="td"
            p={1}
            textAlign={align}
            borderBottom={!isLast && !noEndBorder ? `${borderWidth[1]} solid ${light.main}` : null}
          >
            {cellContent}
          </SoftBox>
        );
      } else if (Array.isArray(cellContent)) {
        // Handle arrays (usually for avatar + text combinations)
        template = (
          <SoftBox
            key={uuidv4()}
            component="td"
            p={1}
            borderBottom={!isLast && !noEndBorder ? `${borderWidth[1]} solid ${light.main}` : null}
          >
            <SoftBox display="flex" alignItems="center" py={0.5} px={1}>
              {cellContent.map((item, index) => (
                React.isValidElement(item) ? item : (
                  <SoftTypography
                    key={index}
                    variant="button"
                    fontWeight="medium"
                    sx={{ width: "max-content", marginLeft: index > 0 ? 1 : 0 }}
                  >
                    {item}
                  </SoftTypography>
                )
              ))}
            </SoftBox>
          </SoftBox>
        );
      } else {
        // Default text content
        template = (
          <SoftBox
            key={uuidv4()}
            component="td"
            p={1}
            textAlign={align}
            borderBottom={!isLast && !noEndBorder ? `${borderWidth[1]} solid ${light.main}` : null}
          >
            <SoftTypography
              variant="button"
              fontWeight="regular"
              color="secondary"
              sx={{ display: "inline-block", width: "max-content" }}
            >
              {cellContent}
            </SoftTypography>
          </SoftBox>
        );
      }

      return template;
    });

    return (
      <TableRow 
        key={rowKey}
        sx={row.onClick ? {
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        } : {}}
        onClick={row.onClick}
      >
        {tableRow}
      </TableRow>
    );
  });

  const tableContent = useMemo(
    () => (
      <TableContainer>
        <MuiTable>
          <SoftBox component="thead">
            <TableRow>{renderColumns}</TableRow>
          </SoftBox>
          <TableBody>{renderRows}</TableBody>
        </MuiTable>
      </TableContainer>
    ),
    [columns, rows]
  );

  return (
    <Card>
      {title && (
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
          <SoftTypography variant="h6">{title}</SoftTypography>
        </SoftBox>
      )}
      <SoftBox
        sx={{
          "& .MuiTableRow-root:not(:last-child)": {
            "& td": {
              borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                `${borderWidth[1]} solid ${borderColor}`,
            },
          },
        }}
      >
        {tableContent}
      </SoftBox>
      {pagination && (
        <SoftBox
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          p={3}
        >
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={pagination.total}
            rowsPerPage={pagination.rowsPerPage}
            page={pagination.page}
            onPageChange={pagination.onPageChange}
            onRowsPerPageChange={pagination.onRowsPerPageChange}
          />
        </SoftBox>
      )}
    </Card>
  );
}

// Setting default values for the props of SoftTable
SoftTable.defaultProps = {
  columns: [],
  rows: [{}],
  pagination: null,
  title: null,
  entriesPerPage: { defaultValue: 10, entries: [5, 10, 15, 20, 25] },
  canSearch: false,
  showTotalEntries: true,
  table: {},
  isSorted: false,
  noEndBorder: false,
};

// Typechecking props for the SoftTable
SoftTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  rows: PropTypes.arrayOf(PropTypes.object),
  pagination: PropTypes.shape({
    total: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onRowsPerPageChange: PropTypes.func.isRequired,
  }),
  title: PropTypes.string,
  entriesPerPage: PropTypes.shape({
    defaultValue: PropTypes.number,
    entries: PropTypes.arrayOf(PropTypes.number),
  }),
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.object,
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
};

export default SoftTable; 