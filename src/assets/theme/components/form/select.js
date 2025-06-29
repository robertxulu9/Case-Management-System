/**
=========================================================
* Soft UI Dashboard React - v3.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Soft UI Dashboard React base styles
import colors from "assets/theme/base/colors";

// Soft UI Dashboard React helper functions
import pxToRem from "assets/theme/functions/pxToRem";

const { transparent } = colors;

const select = {
  styleOverrides: {
    select: {
      display: "flex",
      alignItems: "center",
      padding: `0 ${pxToRem(12)} !important`,
      cursor: "pointer",

      "& .Mui-selected": {
        backgroundColor: transparent.main,
      },
    },

    selectMenu: {
      background: "none",
      minHeight: "auto",
      overflow: "hidden",
    },

    icon: {
      display: "block",
      right: pxToRem(12),
      position: "absolute",
      pointerEvents: "none",
      color: "inherit",
      transition: "transform 0.2s",
    },
  },
};

export default select;
