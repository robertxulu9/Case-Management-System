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

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Soft UI Dashboard React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import VirtualReality from "layouts/virtual-reality";
import RTL from "layouts/rtl";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// Case Management layouts
import CaseDashboard from "layouts/case-management/dashboard";
import CaseList from "layouts/case-management/case-list";
import CaseDetails from "layouts/case-management/case-details";
import Clients from "layouts/client-management";
import DocumentManagement from "layouts/case-management/document-management";
import Reports from "layouts/case-management/reports";
import Calendar from "layouts/case-management/calendar";

// Soft UI Dashboard React icons
import Shop from "@mui/icons-material/Shop";
import BusinessCenter from "@mui/icons-material/BusinessCenter";
import Settings from "@mui/icons-material/Settings";
import Document from "@mui/icons-material/Description";
import SpaceShip from "@mui/icons-material/Rocket";
import CustomerSupport from "@mui/icons-material/SupportAgent";
import CreditCard from "@mui/icons-material/CreditCard";
import ViewInAr from "@mui/icons-material/ViewInAr";
import CaseIcon from "@mui/icons-material/Folder";
import ClientIcon from "@mui/icons-material/People";
import ReportIcon from "@mui/icons-material/Assessment";
import CalendarIcon from "@mui/icons-material/CalendarToday";

const routes = [
  {
    type: "collapse",
    name: "Case Dashboard",
    key: "case-dashboard",
    route: "/",
    icon: <CaseIcon size="12px" />,
    component: <CaseDashboard />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Cases",
    key: "cases",
    route: "/cases",
    icon: <CaseIcon size="12px" />,
    component: <CaseList />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Clients",
    key: "clients",
    route: "/clients",
    icon: <ClientIcon size="12px" />,
    component: <Clients />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Documents",
    key: "documents",
    route: "/documents",
    icon: <Document size="12px" />,
    component: <DocumentManagement />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reports",
    route: "/reports",
    icon: <ReportIcon size="12px" />,
    component: <Reports />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Calendar",
    key: "calendar",
    route: "/calendar",
    icon: <CalendarIcon size="12px" />,
    component: <Calendar />,
    noCollapse: true,
  },
  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    route: "/sign-in",
    icon: <Document size="12px" />,
    component: <SignIn />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    route: "/sign-up",
    icon: <SpaceShip size="12px" />,
    component: <SignUp />,
    noCollapse: true,
  },
];

export default routes;
