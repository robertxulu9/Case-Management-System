import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, List, ListItem, ListItemText, Typography, Box, useTheme } from "@mui/material";
import { clientOperations } from "services/databaseService";

function RecentlyAddedClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const allClients = await clientOperations.getAllClients();
        // Sort clients by created_at and get the most recent ones
        const recentClients = allClients
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        setClients(recentClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) {
    return <Typography>Loading clients...</Typography>;
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader 
        title="Recently Added Clients" 
        sx={{ 
          background: `linear-gradient(45deg, ${theme.palette.success.light} 30%, ${theme.palette.success.main} 90%)`,
          color: theme.palette.success.contrastText,
          '& .MuiTypography-root': {
            color: theme.palette.success.contrastText
          }
        }}
      />
      <CardContent>
        {clients.length === 0 ? (
          <Typography>No clients added yet</Typography>
        ) : (
          <List>
            {clients.map((client) => (
              <ListItem key={client.id}>
                <ListItemText
                  primary={`${client.firstname} ${client.lastname}`}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email: {client.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Phone: {client.phone}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Added: {new Date(client.created_at).toLocaleDateString()}
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

export default RecentlyAddedClients; 