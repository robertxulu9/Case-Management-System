import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Badge from "@mui/material/Badge";

// @mui icons
import EventIcon from "@mui/icons-material/Event";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import AddIcon from "@mui/icons-material/Add";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftBadge from "components/SoftBadge";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Calendar components
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

// Custom components
import EventModal from "./components/EventModal";
import EventDetails from "./components/EventDetails";
import EventFilters from "./components/EventFilters";
import { EVENT_CATEGORIES } from "./components/EventModal";

function Calendar() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filters, setFilters] = useState({
    caseId: "",
    category: "",
    importance: "",
    location: "",
    onlyMyEvents: false,
  });

  // Mock current user - replace with actual user data from your auth system
  const currentUser = {
    id: "user1",
    name: "John Doe",
  };

  // Mock cases - replace with actual cases from your backend
  const cases = [
    { id: "case1", title: "Smith vs. Johnson" },
    { id: "case2", title: "Corporate Merger A" },
    { id: "case3", title: "Estate Planning B" },
  ];

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("calendarEvents");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(parsedEvents);
    }
  }, []);

  // Save events to localStorage when they change
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  // Check for reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      events.forEach(event => {
        if (event.reminder) {
          const reminderTime = new Date(event.start);
          reminderTime.setMinutes(reminderTime.getMinutes() - event.reminderTime);
          
          if (now >= reminderTime && !event.notified) {
            // Show notification
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("Event Reminder", {
                body: `${event.title} starts in ${event.reminderTime} minutes`,
                icon: "/favicon.ico"
              });
            }
            
            // Mark event as notified
            setEvents(prev => prev.map(e => 
              e.id === event.id ? { ...e, notified: true } : e
            ));
          }
        }
      });
    };

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Check reminders every minute
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [events]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setModalOpen(true);
    setDetailsOpen(false);
  };

  const handleSaveEvent = (eventData) => {
    if (editingEvent) {
      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id ? { ...eventData, id: event.id } : event
      ));
    } else {
      setEvents(prev => [...prev, { ...eventData, id: Date.now() }]);
    }
  };

  const handleDeleteEvent = (event) => {
    setEvents(prev => prev.filter(e => e.id !== event.id));
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setDetailsOpen(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filterEvents = (events) => {
    return events.filter((event) => {
      // Filter by case
      if (filters.caseId && event.caseId !== filters.caseId) {
        return false;
      }

      // Filter by category
      if (filters.category && event.category !== filters.category) {
        return false;
      }

      // Filter by importance
      if (filters.importance && event.importance !== filters.importance) {
        return false;
      }

      // Filter by location
      if (filters.location && !event.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Filter by user's events
      if (filters.onlyMyEvents && event.userId !== currentUser.id) {
        return false;
      }

      return true;
    });
  };

  const filteredEvents = filterEvents(events).filter(event => 
    event.start.toDateString() === selectedDate.toDateString()
  );

  // Custom day renderer to show event indicators
  const renderDay = (date, selectedDates, pickersDayProps) => {
    const dayEvents = events.filter(
      event => event.start.toDateString() === date.toDateString()
    );

    if (dayEvents.length === 0) {
      return <PickersDay {...pickersDayProps} />;
    }

    return (
      <Badge
        key={date.toString()}
        overlap="circular"
        badgeContent={dayEvents.length}
        color="info"
      >
        <PickersDay {...pickersDayProps} />
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} lg={6}>
              <SoftTypography variant="h4" fontWeight="bold">
                Calendar
              </SoftTypography>
            </Grid>
            <Grid item xs={12} lg={6} display="flex" justifyContent="flex-end">
              <SoftButton
                variant="gradient"
                color="info"
                onClick={handleAddEvent}
                startIcon={<AddIcon />}
              >
                Add Event
              </SoftButton>
            </Grid>
          </Grid>
        </SoftBox>

        <Card mb={3}>
          <EventFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            cases={cases}
          />
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <SoftBox p={3}>
                <Tabs value={selectedTab} onChange={handleTabChange}>
                  <Tab 
                    icon={<CalendarViewMonthIcon />} 
                    label="Month" 
                  />
                  <Tab 
                    icon={<ViewWeekIcon />} 
                    label="Week" 
                  />
                </Tabs>
                <SoftBox mt={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    {selectedTab === 0 ? (
                      <DateCalendar
                        value={selectedDate}
                        onChange={handleDateChange}
                        renderDay={renderDay}
                        sx={{ width: '100%' }}
                      />
                    ) : (
                      <StaticDatePicker
                        displayStaticWrapperAs="desktop"
                        value={selectedDate}
                        onChange={handleDateChange}
                        renderDay={renderDay}
                        sx={{ width: '100%' }}
                      />
                    )}
                  </LocalizationProvider>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ height: '100%' }}>
              <SoftBox p={3}>
                <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                  Events for {selectedDate.toLocaleDateString()}
                </SoftTypography>
                <List>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <ListItem 
                        key={event.id}
                        button
                        onClick={() => handleEventClick(event)}
                        sx={{ mb: 1 }}
                      >
                        <ListItemIcon>
                          <SoftBox
                            component="span"
                            width={16}
                            height={16}
                            borderRadius="50%"
                            bgcolor={EVENT_CATEGORIES[event.category].color}
                            mr={1}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={event.title}
                          secondary={`${event.start.toLocaleTimeString()} - ${event.end.toLocaleTimeString()}`}
                        />
                        {event.reminder && (
                          <SoftBadge
                            variant="contained"
                            color="warning"
                            size="xs"
                            badgeContent="Reminder"
                            container
                          />
                        )}
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary="No events scheduled"
                        secondary="Click 'Add Event' to create one"
                      />
                    </ListItem>
                  )}
                </List>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        event={editingEvent}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        cases={cases}
        currentUser={currentUser}
      />

      <EventDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        event={selectedEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      <Footer 
        company={{
          href: "https://www.creative-tim.com/",
          name: "Creative Tim"
        }}
        links={[
          { href: "https://www.creative-tim.com/", name: "Creative Tim" },
          { href: "https://www.creative-tim.com/presentation", name: "About Us" },
          { href: "https://www.creative-tim.com/blog", name: "Blog" },
          { href: "https://www.creative-tim.com/license", name: "License" }
        ]}
      />
    </DashboardLayout>
  );
}

export default Calendar; 