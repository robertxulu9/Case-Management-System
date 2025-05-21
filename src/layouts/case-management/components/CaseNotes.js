import PropTypes from "prop-types";
import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";

// @mui icons
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Custom components
import StatusIndicator from "./StatusIndicator";

function CaseNotes({ notes, loading, error, onRetry, onAdd, onEdit, onDelete }) {
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [editText, setEditText] = useState("");

  const handleAddNote = () => {
    if (newNote.trim() && onAdd) {
      onAdd(newNote.trim());
      setNewNote("");
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note.id);
    setEditText(note.text);
  };

  const handleSaveEdit = (noteId) => {
    if (editText.trim() && onEdit) {
      onEdit(noteId, editText.trim());
      setEditingNote(null);
      setEditText("");
    }
  };

  const handleDeleteNote = (noteId) => {
    if (onDelete) {
      onDelete(noteId);
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
    <StatusIndicator loading={loading} error={error} onRetry={onRetry}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <SoftBox p={3}>
              <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                Add Note
              </SoftTypography>
              <SoftBox display="flex" gap={2}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter your note here..."
                  disabled={loading}
                />
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SendIcon />}
                  onClick={handleAddNote}
                  disabled={loading || !newNote.trim()}
                >
                  Add
                </Button>
              </SoftBox>
            </SoftBox>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <SoftTypography variant="h6" fontWeight="medium" mb={2}>
            Notes History
          </SoftTypography>
          {loading ? (
            Array(3).fill(0).map((_, index) => (
              <SoftBox key={index} mb={3}>
                {renderSkeletonNote()}
              </SoftBox>
            ))
          ) : notes?.length > 0 ? (
            notes.map((note) => (
              <SoftBox key={note.id} mb={3}>
                <Card>
                  <SoftBox p={3}>
                    <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <SoftTypography variant="h6" fontWeight="medium">
                        {note.author}
                      </SoftTypography>
                      <SoftBox>
                        <IconButton
                          size="small"
                          onClick={() => handleEditNote(note)}
                          disabled={loading}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteNote(note.id)}
                          disabled={loading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </SoftBox>
                    </SoftBox>

                    {editingNote === note.id ? (
                      <SoftBox display="flex" gap={2}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          disabled={loading}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSaveEdit(note.id)}
                          disabled={loading || !editText.trim()}
                        >
                          Save
                        </Button>
                      </SoftBox>
                    ) : (
                      <SoftTypography variant="body1" color="text">
                        {note.text}
                      </SoftTypography>
                    )}

                    <SoftTypography variant="caption" color="secondary" mt={2}>
                      {new Date(note.createdAt).toLocaleString()}
                    </SoftTypography>
                  </SoftBox>
                </Card>
              </SoftBox>
            ))
          ) : (
            <SoftTypography variant="body1" color="text">
              No notes available.
            </SoftTypography>
          )}
        </Grid>
      </Grid>
    </StatusIndicator>
  );
}

CaseNotes.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
      author: PropTypes.string,
      createdAt: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onRetry: PropTypes.func,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

CaseNotes.defaultProps = {
  notes: [],
  loading: false,
  error: null,
  onRetry: null,
  onAdd: null,
  onEdit: null,
  onDelete: null,
};

export default CaseNotes; 