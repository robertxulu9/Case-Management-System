import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { Modal, Form, Button } from "react-bootstrap";

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
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";

// @mui icons
import EventIcon from "@mui/icons-material/Event";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import AddIcon from "@mui/icons-material/Add";
import TaskIcon from "@mui/icons-material/Task";
import GavelIcon from "@mui/icons-material/Gavel";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

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

// Event and task types with colors
export const ITEM_TYPES = {
  task: { label: "Task", color: "#2196f3", icon: <TaskIcon /> },
  court: { label: "Court Date", color: "#f44336", icon: <GavelIcon /> },
  meeting: { label: "Meeting", color: "#ffc107", icon: <GroupsIcon /> },
};

import { calendarOperations } from '../../services/databaseService';

const Calendar = () => {
  const calendarRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filters, setFilters] = useState({
    types: Object.keys(ITEM_TYPES),
    lawyer: "all",
    case: "all",
    priority: "all",
  });
  const [lawyers, setLawyers] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [selectedLawyer, setSelectedLawyer] = useState('');
  const [selectedCase, setSelectedCase] = useState('');
  const [eventType, setEventType] = useState('meeting');
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const casesData = [
    { id: "1", title: "Smith vs. Johnson" },
    { id: "2", title: "Corporate Merger A" },
    { id: "3", title: "Estate Planning B" },
  ];

  const priorities = [
    { id: "high", label: "High", color: "error" },
    { id: "medium", label: "Medium", color: "warning" },
    { id: "low", label: "Low", color: "info" },
  ];

  // Load items from API on mount
  useEffect(() => {
    const loadItems = async () => {
      try {
        const items = await calendarOperations.getCalendarItems();
        setItems(items.map(item => ({
        ...item,
        start: new Date(item.start),
        end: new Date(item.end),
          lawyerId: item.lawyer_id,
          caseId: item.case_id
        })));
      } catch (error) {
        console.error('Error loading calendar items:', error);
        toast.error('Failed to load calendar items');
      }
    };
    loadItems();
  }, []);

  // Load lawyers and cases when modal opens
  useEffect(() => {
    if (showEventModal) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const [lawyersResponse, casesResponse] = await Promise.all([
            fetch('http://localhost:5000/api/lawyers', {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }),
            fetch('http://localhost:5000/api/cases', {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            })
          ]);

          if (!lawyersResponse.ok || !casesResponse.ok) {
            throw new Error('Failed to fetch data');
          }

          const [lawyersData, casesData] = await Promise.all([
            lawyersResponse.json(),
            casesResponse.json()
          ]);

          setLawyers(lawyersData);
          setCases(casesData);
        } catch (error) {
          console.error('Error loading data:', error);
          toast.error('Failed to load data');
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [showEventModal]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setModalOpen(true);
    setDetailsOpen(false);
  };

  const handleSaveItem = async (itemData) => {
    try {
      const formattedData = {
        ...itemData,
        lawyer_id: itemData.lawyerId,
        case_id: itemData.caseId
      };

    if (editingItem) {
        const updatedItem = await calendarOperations.updateCalendarItem(editingItem.id, formattedData);
      setItems(prev => prev.map(item => 
          item.id === editingItem.id ? {
            ...updatedItem,
            start: new Date(updatedItem.start),
            end: new Date(updatedItem.end),
            lawyerId: updatedItem.lawyer_id,
            caseId: updatedItem.case_id
          } : item
      ));
    } else {
        const newItem = await calendarOperations.createCalendarItem(formattedData);
        setItems(prev => [...prev, {
          ...newItem,
          start: new Date(newItem.start),
          end: new Date(newItem.end),
          lawyerId: newItem.lawyer_id,
          caseId: newItem.case_id
        }]);
      }
    } catch (error) {
      console.error('Error saving calendar item:', error);
      toast.error('Failed to save calendar item');
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      await calendarOperations.deleteCalendarItem(item.id);
    setItems(prev => prev.filter(i => i.id !== item.id));
    } catch (error) {
      console.error('Error deleting calendar item:', error);
      toast.error('Failed to delete calendar item');
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };

  const handleToggleComplete = async (itemId) => {
    try {
      const item = items.find(i => i.id === itemId);
      const updatedItem = await calendarOperations.updateCalendarItem(itemId, {
        ...item,
        completed: !item.completed,
        lawyer_id: item.lawyerId,
        case_id: item.caseId
      });
      setItems(prev => prev.map(i => 
        i.id === itemId ? {
          ...updatedItem,
          start: new Date(updatedItem.start),
          end: new Date(updatedItem.end),
          lawyerId: updatedItem.lawyer_id,
          caseId: updatedItem.case_id
        } : i
      ));
    } catch (error) {
      console.error('Error updating calendar item:', error);
      toast.error('Failed to update calendar item');
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleTypeFilterChange = (type) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  const filterItems = (items) => {
    return items.filter((item) => {
      // Filter by type
      if (!filters.types.includes(item.type)) {
        return false;
      }

      // Filter by lawyer
      if (filters.lawyer !== "all" && item.lawyerId !== filters.lawyer) {
        return false;
      }

      // Filter by case
      if (filters.case !== "all" && item.caseId !== filters.case) {
        return false;
      }

      // Filter by priority
      if (filters.priority !== "all" && item.priority !== filters.priority) {
        return false;
      }

      return true;
    });
  };

  const filteredItems = filterItems(items).filter(item => 
    item.start.toDateString() === selectedDate.toDateString()
  );

  // Custom day renderer to show item indicators
  const renderDay = (date, selectedDates, pickersDayProps) => {
    const dayItems = items.filter(
      item => item.start.toDateString() === date.toDateString()
    );

    if (dayItems.length === 0) {
      return <PickersDay {...pickersDayProps} />;
    }

    return (
      <Badge
        key={date.toString()}
        overlap="circular"
        badgeContent={dayItems.length}
        color="info"
      >
        <PickersDay {...pickersDayProps} />
      </Badge>
    );
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        title: eventTitle,
        start: eventStart,
        end: eventEnd,
        description: eventDescription,
        lawyer_id: selectedLawyer || null,
        case_id: selectedCase || null,
        type: eventType
      };

      let savedEvent;
      if (selectedEvent) {
        savedEvent = await calendarOperations.updateCalendarItem(selectedEvent.id, eventData);
      } else {
        savedEvent = await calendarOperations.createCalendarItem(eventData);
      }
      
      if (selectedEvent) {
        calendarRef.current.getApi().getEventById(selectedEvent.id).remove();
      }

      calendarRef.current.getApi().addEvent({
        id: savedEvent.id,
        title: savedEvent.title,
        start: savedEvent.start,
        end: savedEvent.end,
        extendedProps: {
          description: savedEvent.description,
          lawyerId: savedEvent.lawyer_id,
          caseId: savedEvent.case_id,
          type: savedEvent.type
        },
        backgroundColor: getEventColor(savedEvent.type),
        borderColor: getEventColor(savedEvent.type)
      });

      toast.success(`Event ${selectedEvent ? 'updated' : 'created'} successfully`);
      setShowEventModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    }
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const lawyer = lawyers.find(l => l.id === event.extendedProps.lawyerId);
    const case_ = cases.find(c => c.id === event.extendedProps.caseId);
    
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      description: event.extendedProps.description,
      lawyerId: event.extendedProps.lawyerId,
      caseId: event.extendedProps.caseId,
      lawyerName: lawyer ? `${lawyer.firstname} ${lawyer.lastname}` : 'Unassigned',
      caseName: case_ ? `${case_.case_number} - ${case_.title}` : 'None',
      type: event.extendedProps.type
    });
    setEventTitle(event.title);
    setEventStart(event.start.toISOString().slice(0, 16));
    setEventEnd(event.end.toISOString().slice(0, 16));
    setEventDescription(event.extendedProps.description || '');
    setSelectedLawyer(event.extendedProps.lawyerId || '');
    setSelectedCase(event.extendedProps.caseId || '');
    setEventType(event.extendedProps.type || 'meeting');
    setShowEventModal(true);
  };

  const handleDateSelect = (selectInfo) => {
    setSelectedEvent(null);
    setEventTitle('');
    setEventStart(selectInfo.startStr.slice(0, 16));
    setEventEnd(selectInfo.endStr.slice(0, 16));
    setEventDescription('');
    setSelectedLawyer('');
    setSelectedCase('');
    setEventType('meeting');
    setShowEventModal(true);
  };

  const handleEventDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/calendar/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete event');
        }

        calendarRef.current.getApi().getEventById(eventId).remove();
        toast.success('Event deleted successfully');
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
      }
    }
  };

  const resetForm = () => {
    setEventTitle('');
    setEventStart('');
    setEventEnd('');
    setEventDescription('');
    setSelectedLawyer('');
    setSelectedCase('');
    setEventType('meeting');
    setSelectedEvent(null);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Card>
              <SoftBox p={3}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <SoftTypography variant="h4" fontWeight="medium">
                      Unified Calendar
                    </SoftTypography>
                  </Grid>
                  <Grid item xs={12} md={6} display="flex" justifyContent="flex-end">
                    <SoftButton
                      variant="gradient"
                      color="info"
                      onClick={handleAddItem}
                      startIcon={<AddIcon />}
                    >
                      Add Item
                    </SoftButton>
                  </Grid>
                </Grid>

                {/* Filters */}
                <SoftBox mt={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <SoftTypography variant="h6" fontWeight="medium">
                        Filters
                      </SoftTypography>
                    </Grid>
                    <Grid item xs={12}>
                      <FormGroup row>
                        {Object.entries(ITEM_TYPES).map(([type, config]) => (
                          <FormControlLabel
                            key={type}
                            control={
                              <Checkbox
                                checked={filters.types.includes(type)}
                                onChange={() => handleTypeFilterChange(type)}
                                icon={<RadioButtonUncheckedIcon sx={{ color: config.color }} />}
                                checkedIcon={<CheckCircleIcon sx={{ color: config.color }} />}
                              />
                            }
                            label={config.label}
                          />
                        ))}
                      </FormGroup>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Lawyer</InputLabel>
                        <Select
                          value={filters.lawyer}
                          onChange={(e) => handleFilterChange("lawyer", e.target.value)}
                          label="Lawyer"
                        >
                          <MenuItem value="all">All Lawyers</MenuItem>
                          {lawyers.map((lawyer) => (
                            <MenuItem key={lawyer.id} value={lawyer.id}>
                              {lawyer.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Case</InputLabel>
                        <Select
                          value={filters.case}
                          onChange={(e) => handleFilterChange("case", e.target.value)}
                          label="Case"
                        >
                          <MenuItem value="all">All Cases</MenuItem>
                          {cases.map((case_) => (
                            <MenuItem key={case_.id} value={case_.id}>
                              {case_.title}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Priority</InputLabel>
                        <Select
                          value={filters.priority}
                          onChange={(e) => handleFilterChange("priority", e.target.value)}
                          label="Priority"
                        >
                          <MenuItem value="all">All Priorities</MenuItem>
                          {priorities.map((priority) => (
                            <MenuItem key={priority.id} value={priority.id}>
                              {priority.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </SoftBox>

                {/* Calendar */}
                <SoftBox mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} lg={8}>
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
                    </Grid>

                    {/* Items List */}
                    <Grid item xs={12} lg={4}>
                      <Card sx={{ height: '100%' }}>
                        <SoftBox p={3}>
                          <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                            Items for {selectedDate.toLocaleDateString()}
                          </SoftTypography>
                          <List>
                            {filteredItems.length > 0 ? (
                              filteredItems.map((item) => (
                                <ListItem 
                                  key={item.id}
                                  button
                                  onClick={() => handleItemClick(item)}
                                  sx={{ mb: 1 }}
                                >
                                  <ListItemIcon>
                                    {ITEM_TYPES[item.type].icon}
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={
                                      <SoftBox display="flex" alignItems="center">
                                        <SoftTypography
                                          variant="button"
                                          fontWeight="medium"
                                          sx={{
                                            textDecoration: item.completed ? 'line-through' : 'none',
                                          }}
                                        >
                                          {item.title}
                                        </SoftTypography>
                                        {item.type === 'task' && (
                                          <Checkbox
                                            checked={item.completed}
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              handleToggleComplete(item.id);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        )}
                                      </SoftBox>
                                    }
                                    secondary={`${item.start.toLocaleTimeString()} - ${item.end.toLocaleTimeString()}`}
                                  />
                                  <SoftBadge
                                    variant="contained"
                                    color={priorities.find(p => p.id === item.priority)?.color || 'default'}
                                    size="xs"
                                    badgeContent={priorities.find(p => p.id === item.priority)?.label}
                                    container
                                  />
                                </ListItem>
                              ))
                            ) : (
                              <ListItem>
                                <ListItemText
                                  primary="No items scheduled"
                                  secondary="Click 'Add Item' to create one"
                                />
                              </ListItem>
                            )}
                          </List>
                        </SoftBox>
                      </Card>
                    </Grid>
                  </Grid>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={editingItem}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
        itemTypes={ITEM_TYPES}
        cases={casesData}
        lawyers={lawyers}
        priorities={priorities}
      />

      <EventDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        item={selectedItem}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        itemTypes={ITEM_TYPES}
        cases={casesData}
        lawyers={lawyers}
        priorities={priorities}
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

      {/* Event Modal */}
      <Modal
        show={showEventModal}
        onHide={() => {
          setShowEventModal(false);
          resetForm();
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? 'Edit Event' : 'Add New Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEventSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start</Form.Label>
              <Form.Control
                type="datetime-local"
                value={eventStart}
                onChange={(e) => setEventStart(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End</Form.Label>
              <Form.Control
                type="datetime-local"
                value={eventEnd}
                onChange={(e) => setEventEnd(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              >
                <option value="meeting">Meeting</option>
                <option value="hearing">Hearing</option>
                <option value="deadline">Deadline</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assigned Lawyer</Form.Label>
              <Form.Select
                value={selectedLawyer}
                onChange={(e) => setSelectedLawyer(e.target.value)}
              >
                <option value="">Select a lawyer</option>
                {isLoading ? (
                  <option disabled>Loading lawyers...</option>
                ) : (
                  lawyers.map((lawyer) => (
                    <option key={lawyer.id} value={lawyer.id}>
                      {lawyer.firstname} {lawyer.lastname}
                    </option>
                  ))
                )}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Related Case</Form.Label>
              <Form.Select
                value={selectedCase}
                onChange={(e) => setSelectedCase(e.target.value)}
              >
                <option value="">None</option>
                {isLoading ? (
                  <option disabled>Loading cases...</option>
                ) : (
                  cases.map((case_) => (
                    <option key={case_.id} value={case_.id}>
                      {case_.case_number} - {case_.title}
                    </option>
                  ))
                )}
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => {
                setShowEventModal(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedEvent ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </DashboardLayout>
  );
};

export default Calendar; 