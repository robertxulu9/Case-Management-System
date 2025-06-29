import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, List, ListItem, ListItemText, Typography, Box, useTheme } from "@mui/material";
import { caseOperations } from "services/databaseService";

function RecentCaseActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const cases = await caseOperations.getAllCases();
        // Sort cases by updated_at and get the most recent ones
        const recentActivities = cases
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          .slice(0, 5);
        setActivities(recentActivities);
      } catch (error) {
        console.error("Error fetching case activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <Typography>Loading activities...</Typography>;
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader 
        title="Recent Case Activities" 
        sx={{ 
          background: `linear-gradient(45deg, ${theme.palette.secondary.light} 30%, ${theme.palette.secondary.main} 90%)`,
          color: theme.palette.secondary.contrastText,
          '& .MuiTypography-root': {
            color: theme.palette.secondary.contrastText
          }
        }}
      />
      <CardContent>
        {activities.length === 0 ? (
          <Typography>No recent activities</Typography>
        ) : (
          <List>
            {activities.map((activity) => (
              <ListItem key={activity.id}>
                <ListItemText
                  primary={activity.casename}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Case Number: {activity.casenumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Updated: {new Date(activity.updated_at).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {activity.status}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stage: {activity.stage || 'Not set'}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentCaseActivities; 