import { useState } from "react";
import PropTypes from "prop-types";

// @mui material components
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

// @mui icons
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

function ClientSearch({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleQueryChange = (event) => {
    const newQuery = event.target.value;
    setSearchQuery(newQuery);
    onSearch(newQuery.toLowerCase());
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <SoftBox p={2}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search by name, email, phone, NRC, or any other information..."
        value={searchQuery}
        onChange={handleQueryChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </SoftBox>
  );
}

ClientSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default ClientSearch; 