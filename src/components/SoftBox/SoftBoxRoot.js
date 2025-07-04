/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export default styled(Box)(({ theme = {}, ownerState }) => {
  const { palette = {}, functions = {}, borders = {}, boxShadows = {} } = theme;
  const { variant, bgColor, color, opacity, borderRadius, shadow } = ownerState;

  const { gradients = {}, grey = {}, white = {} } = palette;
  const { linearGradient = () => "" } = functions;
  const { borderRadius: radius = {} } = borders;

  const greyColors = {
    "grey-100": grey[100],
    "grey-200": grey[200],
    "grey-300": grey[300],
    "grey-400": grey[400],
    "grey-500": grey[500],
    "grey-600": grey[600],
    "grey-700": grey[700],
    "grey-800": grey[800],
    "grey-900": grey[900],
  };

  const validGradients = [
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ];

  const validColors = [
    "transparent",
    "white",
    "black",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
    "text",
    "grey-100",
    "grey-200",
    "grey-300",
    "grey-400",
    "grey-500",
    "grey-600",
    "grey-700",
    "grey-800",
    "grey-900",
  ];

  const validBorderRadius = ["xs", "sm", "md", "lg", "xl", "xxl", "section"];
  const validBoxShadows = ["xs", "sm", "md", "lg", "xl", "xxl", "inset"];

  // background value
  let backgroundValue = bgColor;

  if (variant === "gradient") {
    if (validGradients.find((el) => el === bgColor) && gradients[bgColor]?.main && gradients[bgColor]?.state) {
      backgroundValue = linearGradient(gradients[bgColor].main, gradients[bgColor].state);
    } else {
      backgroundValue = white?.main || "#ffffff";
    }
  } else if (validColors.find((el) => el === bgColor)) {
    backgroundValue = palette[bgColor]?.main || greyColors[bgColor] || bgColor;
  }

  // color value
  let colorValue = color;

  if (validColors.find((el) => el === color)) {
    colorValue = palette[color]?.main || greyColors[color] || color;
  }

  // borderRadius value
  let borderRadiusValue = borderRadius;

  if (validBorderRadius.find((el) => el === borderRadius)) {
    borderRadiusValue = radius[borderRadius] || borderRadius;
  }

  // boxShadow value
  let boxShadowValue = boxShadows;

  if (validBoxShadows.find((el) => el === shadow)) {
    boxShadowValue = boxShadows[shadow] || "none";
  }

  return {
    opacity,
    background: backgroundValue || "transparent",
    color: colorValue || "inherit",
    borderRadius: borderRadiusValue || "0",
    boxShadow: boxShadowValue || "none",
  };
});
