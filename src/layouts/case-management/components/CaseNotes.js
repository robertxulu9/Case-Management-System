import PropTypes from "prop-types";
import { useState } from "react";
import { format, isValid, parseISO } from "date-fns";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

// @mui icons
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Custom components
import StatusIndicator from "./StatusIndicator";

function CaseNotes({ notes = [], onAddNote, onEdit, onDelete }) {
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [editText, setEditText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid date";
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy HH:mm") : "Invalid date";
  };

  const handleAddNote = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!newNote.trim() || submitting) return;

    setSubmitting(true);
    setError(null);
    
    try {
      if (typeof onAddNote === 'function') {
        await onAddNote(newNote.trim());
        setNewNote("");
      } else {
        throw new Error('onAddNote is not a function');
      }
    } catch (error) {
      console.error("Error adding note:", error);
      setError(error.message || "Failed to add note");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note.id);
    setEditText(note.content);
  };

  const handleSaveEdit = async (noteId) => {
    if (!editText.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await onEdit(noteId, editText.trim());
      setEditingNote(null);
      setEditText("");
    } catch (error) {
      console.error("Error editing note:", error);
      setError(error.message || "Failed to edit note");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (onDelete) {
      try {
        await onDelete(noteId);
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const renderSkeletonNote = () => (
    <Card>
      <SoftBox p={3}>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Skeleton variant="text" width={100} height={24} />
          <Skeleton variant="circular" width={40} height={40} />
        </SoftBox>
        <Skeleton variant="text" width="100%" height={60} />
        <Skeleton variant="text" width={150} height={24} sx={{ mt: 2 }} />
      </SoftBox>
    </Card>
  );

  return (
    <StatusIndicator loading={submitting} error={error} onRetry={() => setError(null)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <SoftBox p={3}>
              <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                Add Note
              </SoftTypography>
              <form onSubmit={handleAddNote}>
                <SoftBox display="flex" gap={2}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter your note here..."
                    disabled={submitting}
                    error={!!error}
                    helperText={error}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SendIcon />}
                    disabled={!newNote.trim() || submitting}
                  >
                    Add
                  </Button>
                </SoftBox>
              </form>
            </SoftBox>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <SoftTypography variant="h6" fontWeight="medium" mb={2}>
            Notes History
          </SoftTypography>
          <Card>
            <SoftBox p={3}>
              {notes?.length > 0 ? (
                <List>
                  {notes.map((note) => (
                    <ListItem key={note.id} divider>
                      {editingNote === note.id ? (
                        <SoftBox width="100%">
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            disabled={submitting}
                          />
                          <SoftBox mt={2} display="flex" justifyContent="flex-end" gap={1}>
                            <Button
                              variant="contained"
                              onClick={() => handleSaveEdit(note.id)}
                              disabled={submitting || !editText.trim()}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => setEditingNote(null)}
                            >
                              Cancel
                            </Button>
                          </SoftBox>
                        </SoftBox>
                      ) : (
                        <>
                          <ListItemText
                            primary={note.content}
                            secondary={
                              <SoftTypography 
                                component="span" 
                                variant="caption" 
                                color="text"
                              >
                                {formatDate(note.created_at)}
                              </SoftTypography>
                            }
                          />
                          <SoftBox ml={2}>
                            <IconButton
                              size="small"
                              onClick={() => handleEditNote(note)}
                              disabled={submitting}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteNote(note.id)}
                              disabled={submitting}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </SoftBox>
                        </>
                      )}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <SoftTypography variant="body2" color="text" textAlign="center">
                  No notes available. Add your first note above.
                </SoftTypography>
              )}
            </SoftBox>
          </Card>
        </Grid>
      </Grid>
    </StatusIndicator>
  );
}

CaseNotes.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
    })
  ),
  onAddNote: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default CaseNotes; 