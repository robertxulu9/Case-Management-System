import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, List, ListItem, ListItemText, Typography, Box, Button, useTheme } from "@mui/material";
import { templateOperations } from "services/databaseService";

function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const allTemplates = await templateOperations.getAllTemplates();
        setTemplates(allTemplates);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleUseTemplate = (templateId) => {
    // TODO: Implement template usage functionality
    console.log("Using template:", templateId);
  };

  if (loading) {
    return <Typography>Loading templates...</Typography>;
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader 
        title="Document Templates" 
        sx={{ 
          background: `linear-gradient(45deg, ${theme.palette.info.light} 30%, ${theme.palette.info.main} 90%)`,
          color: theme.palette.info.contrastText,
          '& .MuiTypography-root': {
            color: theme.palette.info.contrastText
          }
        }}
      />
      <CardContent>
        {templates.length === 0 ? (
          <Typography>No templates available</Typography>
        ) : (
          <List>
            {templates.map((template) => (
              <ListItem 
                key={template.id}
                secondaryAction={
                  <Button
                    variant="contained"
                    onClick={() => handleUseTemplate(template.id)}
                  >
                    Use Template
                  </Button>
                }
              >
                <ListItemText
                  primary={template.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Type: {template.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Description: {template.description}
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

export default Templates; 