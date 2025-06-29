import { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Typography, 
  Box, 
  useTheme,
  Chip,
  Divider
} from "@mui/material";
import { 
  Event as EventIcon,
  Task as TaskIcon,
  Gavel as CourtIcon,
  Groups as MeetingIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Folder as CaseIcon
} from "@mui/icons-material";
import { calendarOperations } from "services/databaseService";

function EventsSummary() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const items = await calendarOperations.getCalendarItems();
        // Get today's events and upcoming events
        const today = new Date();
        const upcomingEvents = items
          .filter(item => new Date(item.start) >= today)
          .sort((a, b) => new Date(a.start) - new Date(b.start))
          .slice(0, 8); // Show more events
        setEvents(upcomingEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getEventIcon = (type) => {
    switch (type) {
      case 'task':
        return <TaskIcon />;
      case 'court':
        return <CourtIcon />;
      case 'meeting':
        return <MeetingIcon />;
      default:
        return <EventIcon />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'task':
        return 'primary';
      case 'court':
        return 'error';
      case 'meeting':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if it's today
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    // Check if it's tomorrow
    else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    // Otherwise show date and time
    else {
      return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const isOverdue = (dateString) => {
    return new Date(dateString) < new Date();
  };

  if (loading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardHeader 
          title="Upcoming Events & Tasks" 
          sx={{ 
            background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.main} 90%)`,
            color: theme.palette.primary.contrastText,
            '& .MuiTypography-root': {
              color: theme.palette.primary.contrastText
            }
          }}
        />
        <CardContent>
          <Typography>Loading events...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader 
        title="Upcoming Events & Tasks" 
        sx={{ 
          background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.main} 90%)`,
          color: theme.palette.primary.contrastText,
          '& .MuiTypography-root': {
            color: theme.palette.primary.contrastText
          }
        }}
      />
      <CardContent sx={{ p: 0 }}>
        {events.length === 0 ? (
          <Box p={2}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No upcoming events or tasks
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {events.map((event, index) => (
              <Box key={event.id}>
                <ListItem sx={{ 
                  py: 1.5, 
                  px: 2,
                  backgroundColor: isOverdue(event.start) ? theme.palette.error.light + '20' : 'transparent'
                }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        color: theme.palette[getTypeColor(event.type)]?.main || theme.palette.grey[500],
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {getEventIcon(event.type)}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        <Typography 
                          variant="body2" 
                          fontWeight="medium"
                          sx={{ 
                            textDecoration: event.completed ? 'line-through' : 'none',
                            color: event.completed ? 'text.secondary' : 'text.primary'
                          }}
                        >
                          {event.title}
                        </Typography>
                        {event.priority && (
                          <Chip 
                            label={event.priority.toUpperCase()} 
                            size="small" 
                            color={getPriorityColor(event.priority)}
                            variant="outlined"
                          />
                        )}
                        {event.completed && (
                          <Chip 
                            label="COMPLETED" 
                            size="small" 
                            color="success"
                            variant="outlined"
                          />
                        )}
                        {isOverdue(event.start) && !event.completed && (
                          <Chip 
                            label="OVERDUE" 
                            size="small" 
                            color="error"
                            variant="filled"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box mt={0.5}>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <TimeIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {formatDateTime(event.start)}
                          </Typography>
                        </Box>
                        
                        {event.location && (
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <LocationIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {event.location}
                            </Typography>
                          </Box>
                        )}
                        
                        {event.lawyer_firstname && (
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <PersonIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {event.lawyer_firstname} {event.lawyer_lastname}
                            </Typography>
                          </Box>
                        )}
                        
                        {event.case_title && (
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <CaseIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {event.case_title}
                            </Typography>
                          </Box>
                        )}
                        
                        {event.description && (
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {event.description}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < events.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

export default EventsSummary; 