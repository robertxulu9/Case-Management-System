import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { format, isValid, parseISO } from "date-fns";

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import GavelIcon from "@mui/icons-material/Gavel";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import HomeIcon from "@mui/icons-material/Home";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

// Services
import { practiceAreaOperations } from "services/databaseService";

function CaseInfo({ caseData }) {
  const [practiceAreaName, setPracticeAreaName] = useState("Loading...");

  useEffect(() => {
    const loadPracticeArea = async () => {
      if (caseData?.practicearea) {
        try {
          const areas = await practiceAreaOperations.getAllPracticeAreas();
          const area = areas.find(a => a.id === caseData.practicearea);
          setPracticeAreaName(area ? area.name : "Unknown");
        } catch (err) {
          console.error('Error loading practice area:', err);
          setPracticeAreaName("Error loading");
        }
      } else {
        setPracticeAreaName("N/A");
      }
    };

    loadPracticeArea();
  }, [caseData?.practicearea]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : "N/A";
  };

  const formatName = (client) => {
    if (!client) return "N/A";
    const parts = [
      client.firstname,
      client.middlename,
      client.lastname
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : "N/A";
  };

  const formatAddress = (client) => {
    if (!client) return "N/A";
    const parts = [
      client.address1,
      client.address2,
      client.city,
      client.province,
      client.country
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }
    return value;
  };

  const sections = [
    {
      title: "Case Information",
      items: [
        {
          icon: <AssignmentIcon />,
          label: "Case Number",
          value: formatValue(caseData?.casenumber),
        },
        {
          icon: <GavelIcon />,
          label: "Practice Area",
          value: formatValue(caseData?.practicearea),
        },
        {
          icon: <CalendarTodayIcon />,
          label: "Date Opened",
          value: formatDate(caseData?.dateopened),
        },
        {
          icon: <AccessTimeIcon />,
          label: "Status",
          value: formatValue(caseData?.casestage),
          badge: true,
          badgeColor: 
            caseData?.casestage === "closed"
              ? "error"
              : caseData?.casestage === "trial"
              ? "warning"
              : "success",
        },
      ],
    },
    {
      title: "Client Information",
      items: [
        {
          icon: <PersonIcon />,
          label: "Client Name",
          value: formatName(caseData?.client),
        },
        {
          icon: <EmailIcon />,
          label: "Email",
          value: formatValue(caseData?.client?.email),
        },
        {
          icon: <SmartphoneIcon />,
          label: "Cell Phone",
          value: formatValue(caseData?.client?.cellphone),
        },
        {
          icon: <PhoneIcon />,
          label: "Work Phone",
          value: formatValue(caseData?.client?.workphone),
        },
        {
          icon: <HomeIcon />,
          label: "Home Phone",
          value: formatValue(caseData?.client?.homephone),
        },
        {
          icon: <BusinessIcon />,
          label: "Company",
          value: formatValue(caseData?.client?.company),
        },
        {
          icon: <WorkIcon />,
          label: "Job Title",
          value: formatValue(caseData?.client?.jobtitle),
        },
        {
          icon: <LocationOnIcon />,
          label: "Address",
          value: formatAddress(caseData?.client),
        },
      ],
    },
    {
      title: "Financial Information",
      items: [
        {
          icon: <AttachMoneyIcon />,
          label: "Billing Type",
          value: formatValue(caseData?.billingtype),
        },
        {
          icon: <AttachMoneyIcon />,
          label: "Retainer Amount",
          value: caseData?.retaineramount 
            ? `$${caseData.retaineramount.toLocaleString()}`
            : "N/A",
        },
        {
          icon: <BusinessIcon />,
          label: "Billing Status",
          value: formatValue(caseData?.billingstatus),
          badge: true,
          badgeColor: 
            caseData?.billingstatus === "paid"
              ? "success"
              : caseData?.billingstatus === "overdue"
              ? "error"
              : "warning",
        },
      ],
    },
  ];

  return (
    <SoftBox>
      {sections.map((section, index) => (
        <SoftBox key={section.title} mb={3}>
          <SoftTypography variant="h6" fontWeight="bold" mb={2}>
            {section.title}
          </SoftTypography>
          <Grid container spacing={2}>
            {section.items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.label}>
                <SoftBox display="flex" alignItems="center" mb={1}>
                  <SoftBox mr={1} color="text">
                    {item.icon}
                  </SoftBox>
                  <SoftBox>
                    <SoftTypography variant="caption" color="text" fontWeight="regular">
                      {item.label}
                    </SoftTypography>
                    {item.badge ? (
                      <SoftBadge
                        variant="gradient"
                        color={item.badgeColor}
                        size="sm"
                        badgeContent={item.value}
                        container
                      />
                    ) : (
                      <SoftTypography variant="body2" fontWeight="regular">
                        {item.value}
                      </SoftTypography>
                    )}
                  </SoftBox>
                </SoftBox>
              </Grid>
            ))}
          </Grid>
          {index < sections.length - 1 && <Divider sx={{ my: 2 }} />}
        </SoftBox>
      ))}
    </SoftBox>
  );
}

CaseInfo.propTypes = {
  caseData: PropTypes.shape({
    casenumber: PropTypes.string,
    practicearea: PropTypes.string,
    dateopened: PropTypes.string,
    casestage: PropTypes.string,
    client: PropTypes.shape({
      firstname: PropTypes.string,
      middlename: PropTypes.string,
      lastname: PropTypes.string,
      email: PropTypes.string,
      cellphone: PropTypes.string,
      workphone: PropTypes.string,
      homephone: PropTypes.string,
      company: PropTypes.string,
      jobtitle: PropTypes.string,
      address1: PropTypes.string,
      address2: PropTypes.string,
      city: PropTypes.string,
      province: PropTypes.string,
      country: PropTypes.string,
    }),
    billingtype: PropTypes.string,
    retaineramount: PropTypes.number,
    billingstatus: PropTypes.string,
  }),
};

CaseInfo.defaultProps = {
  caseData: null,
};

export default CaseInfo; 