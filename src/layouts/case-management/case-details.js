import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// @mui icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftBadge from "components/SoftBadge";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Case Management components
import CaseInfo from "./components/CaseInfo";
import CaseTimeline from "./components/CaseTimeline";
import CaseDocuments from "./components/CaseDocuments";
import CaseNotes from "./components/CaseNotes";
import CaseContacts from "./components/CaseContacts";

// Services
import { caseOperations, noteOperations, documentOperations, timelineOperations, contactOperations } from "services/databaseService";

function CaseDetails() {
  const { caseName } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [stageMenuAnchor, setStageMenuAnchor] = useState(null);
  const stageOptions = [
    "intake",
    "pre_litigation",
    "litigation",
    "discovery",
    "trial",
    "appeal",
    "closed"
  ];

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!caseName) {
          throw new Error("Case name is required");
        }
        
        // Convert URL-friendly name back to original format
        const originalCaseName = decodeURIComponent(caseName.replace(/-/g, ' '));
        console.log('Searching for case:', originalCaseName); // Debug log
        
        const data = await caseOperations.getCaseByName(originalCaseName);
        if (!data) {
          throw new Error("Case not found");
        }
        console.log('Found case data:', data); // Debug log

        // Fetch notes
        const notes = await noteOperations.getNotesByCase(data.id);
        console.log('Fetched notes:', notes);

        // Fetch contacts
        const contacts = await contactOperations.getContactsByCase(data.id);
        console.log('Fetched contacts:', contacts);

        // Fetch documents
        const documents = await documentOperations.getDocumentsByCase(data.id);
        console.log('Fetched documents:', documents);

        // Fetch timeline events
        const timelineEvents = await timelineOperations.getTimelineEvents(data.id);
        console.log('Fetched timeline events:', timelineEvents);

        // Combine all data
        setCaseData({
          ...data,
          notes: notes || [],
          contacts: contacts || [],
          documents: documents || [],
          timelineEvents: timelineEvents || []
        });
      } catch (err) {
        console.error("Error fetching case details:", err);
        setError(err.message);
        toast.error(err.message || "Failed to load case details");
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [caseName]);

  const handleStageClick = (event) => {
    setStageMenuAnchor(event.currentTarget);
  };

  const handleStageClose = () => {
    setStageMenuAnchor(null);
  };

  const handleStageChange = async (newStage) => {
    try {
      // Update only the case stage in the database
      const updatedCase = await caseOperations.updateCase(caseData.id, {
        casestage: newStage
      });

      // Update local state
      setCaseData(prevData => ({
        ...prevData,
        casestage: newStage
      }));

      // Add timeline event
      await timelineOperations.createTimelineEvent(
        caseData.id,
        'stage_change',
        `Case stage changed to ${newStage}`
      );

      // Update timeline
      const events = await timelineOperations.getTimelineEvents(caseData.id);
      setTimelineEvents(events);

      toast.success(`Case stage updated to ${newStage}`);
    } catch (error) {
      console.error('Error updating case stage:', error);
      toast.error('Failed to update case stage');
    } finally {
      handleStageClose();
    }
  };

  const handleAddNote = async (content) => {
    if (!caseData || !caseData.id) {
      toast.error('Cannot add note: Case data not loaded');
      return;
    }

    const addNotePromise = new Promise(async (resolve, reject) => {
      try {
        // Add the note to the database
        const newNote = await noteOperations.createNote(caseData.id, content);
        
        // Update the local state to include the new note
        setCaseData(prevData => ({
          ...prevData,
          notes: [newNote, ...(prevData.notes || [])]
        }));

        // Add timeline event
        await timelineOperations.createTimelineEvent(
          caseData.id,
          'note',
          `New note added: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`
        );

        // Update timeline
        const events = await timelineOperations.getTimelineEvents(caseData.id);
        setTimelineEvents(events);
        
        resolve(newNote);
      } catch (err) {
        console.error("Error adding note:", err);
        reject(err);
      }
    });

    toast.promise(addNotePromise, {
      loading: 'Adding note...',
      success: 'Note added successfully!',
      error: (err) => `Failed to add note: ${err.message}`,
    });

    return addNotePromise;
  };

  const handleEditNote = async (noteId, content) => {
    const editNotePromise = new Promise(async (resolve, reject) => {
      try {
        // Update the note in the database
        const updatedNote = await noteOperations.updateNote(noteId, content);
        
        // Update the local state to reflect the edited note
        setCaseData(prevData => {
          const updatedNotes = prevData.notes.map(note => 
            note.id === noteId ? updatedNote : note
          );
          return {
            ...prevData,
            notes: updatedNotes
          };
        });

        // Add timeline event
        await timelineOperations.createTimelineEvent(
          caseData.id,
          'note',
          `Note updated: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`
        );

        // Update timeline
        const events = await timelineOperations.getTimelineEvents(caseData.id);
        setTimelineEvents(events);
        
        resolve(updatedNote);
      } catch (err) {
        console.error("Error updating note:", err);
        reject(err);
      }
    });

    toast.promise(editNotePromise, {
      loading: 'Updating note...',
      success: 'Note updated successfully!',
      error: 'Failed to update note',
    });

    return editNotePromise;
  };

  const handleDeleteNote = async (noteId) => {
    const deleteNotePromise = new Promise(async (resolve, reject) => {
      try {
        // Get the note content before deleting
        const noteToDelete = caseData.notes.find(note => note.id === noteId);
        
        // Delete the note from the database
        await noteOperations.deleteNote(noteId);
        
        // Update the local state to remove the deleted note
        setCaseData(prevData => ({
          ...prevData,
          notes: prevData.notes.filter(note => note.id !== noteId)
        }));

        // Add timeline event
        if (noteToDelete) {
          await timelineOperations.createTimelineEvent(
            caseData.id,
            'note',
            `Note deleted: ${noteToDelete.content.substring(0, 50)}${noteToDelete.content.length > 50 ? '...' : ''}`
          );
        }

        // Update timeline
        const events = await timelineOperations.getTimelineEvents(caseData.id);
        setTimelineEvents(events);
        
        resolve();
      } catch (err) {
        console.error("Error deleting note:", err);
        reject(err);
      }
    });

    toast.promise(deleteNotePromise, {
      loading: 'Deleting note...',
      success: 'Note deleted successfully!',
      error: 'Failed to delete note',
    });

    return deleteNotePromise;
  };

  const handleUploadDocument = async (file) => {
    const uploadPromise = new Promise(async (resolve, reject) => {
      try {
        // Upload the document
        const newDocument = await documentOperations.uploadDocument(
          caseData.id,
          file,
          file.name, // Use filename as title
          `Uploaded ${file.name}` // Use filename in description
        );

        // Update the local state to include the new document
        setCaseData(prevData => ({
          ...prevData,
          documents: [newDocument, ...(prevData.documents || [])]
        }));

        // Update timeline
        const events = await timelineOperations.getTimelineEvents(caseData.id);
        setTimelineEvents(events);

        resolve(newDocument);
      } catch (err) {
        console.error("Error uploading document:", err);
        reject(err);
      }
    });

    // Show loading toast while uploading
    toast.promise(uploadPromise, {
      loading: 'Uploading document...',
      success: 'Document uploaded successfully!',
      error: 'Failed to upload document',
    });

    return uploadPromise;
  };

  const handleDownloadDocument = async (document) => {
    try {
      const response = await documentOperations.downloadDocument(document.id);
      
      // Ensure we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Download is only available in browser environment');
      }

      // Create blob from response
      const blob = new Blob([response], { type: document.filetype });
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const downloadLink = window.document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = document.filename;
      
      // Trigger download
      window.document.body.appendChild(downloadLink);
      downloadLink.click();
      
      // Cleanup
      window.document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        await documentOperations.deleteDocument(documentId, true);
        
        // Update the local state to remove the deleted document
        setCaseData(prevData => ({
          ...prevData,
          documents: prevData.documents.filter(doc => doc.id !== documentId)
        }));

        // Update timeline
        const events = await timelineOperations.getTimelineEvents(caseData.id);
        setTimelineEvents(events);

        resolve();
      } catch (err) {
        console.error("Error deleting document:", err);
        reject(err);
      }
    });

    // Show loading toast while deleting
    toast.promise(deletePromise, {
      loading: 'Deleting document...',
      success: 'Document deleted successfully!',
      error: 'Failed to delete document',
    });

    return deletePromise;
  };

  const handleStageKeyDown = (event) => {
    if (event.key === 'Escape') {
      handleStageClose();
    }
  };

  const handleAddContact = async (contactData) => {
    const addContactPromise = new Promise(async (resolve, reject) => {
      try {
        // Validate caseData exists
        if (!caseData || !caseData.id) {
          throw new Error("Cannot add contact: Case data not loaded");
        }

        // Validate required fields
        if (!contactData.firstname || !contactData.lastname || !contactData.role) {
          throw new Error("First name, last name, and role are required");
        }

        // Add the contact to the database
        const newContact = await contactOperations.createContact({
          ...contactData,
          case_id: caseData.id
        });
        
        // Update the local state to include the new contact
        setCaseData(prevData => ({
          ...prevData,
          contacts: [newContact, ...(prevData.contacts || [])]
        }));

        // Add timeline event
        await timelineOperations.createTimelineEvent(
          caseData.id,
          'contact',
          `Added ${contactData.role}: ${contactData.firstname} ${contactData.lastname}`
        );

        // Update timeline
        const events = await timelineOperations.getTimelineEvents(caseData.id);
        setTimelineEvents(events);
        
        resolve(newContact);
      } catch (err) {
        console.error("Error adding contact:", err.message || err.error || err);
        reject(err.message || err.error || err);
      }
    });

    toast.promise(addContactPromise, {
      loading: 'Adding contact...',
      success: 'Contact added successfully!',
      error: (err) => `Failed to add contact: ${err}`,
    });

    return addContactPromise;
  };

  const handleEditContact = async (contactId, contactData) => {
    const editContactPromise = new Promise(async (resolve, reject) => {
      try {
        // Update the contact in the database
        const updatedContact = await contactOperations.updateContact(contactId, {
          ...contactData,
          case_id: caseData.id
        });
        
        // Update the local state
        setCaseData(prevData => ({
          ...prevData,
          contacts: prevData.contacts.map(contact =>
            contact.id === contactId ? updatedContact : contact
          )
        }));

        // Add timeline event
        await timelineOperations.createTimelineEvent(
          caseData.id,
          'contact',
          `Updated ${contactData.role}: ${contactData.firstname} ${contactData.lastname}`
        );

        // Update timeline
        const events = await timelineOperations.getTimelineEvents(caseData.id);
        setTimelineEvents(events);
        
        resolve(updatedContact);
      } catch (err) {
        console.error("Error updating contact:", err);
        reject(err);
      }
    });

    toast.promise(editContactPromise, {
      loading: 'Updating contact...',
      success: 'Contact updated successfully!',
      error: 'Failed to update contact',
    });

    return editContactPromise;
  };

  const handleDeleteContact = async (contactId) => {
    const contact = caseData.contacts.find(c => c.id === contactId);
    if (!contact) return;

    const deleteContactPromise = new Promise(async (resolve, reject) => {
      try {
        // Delete the contact from the database
        await contactOperations.deleteContact(contactId);
        
        // Update the local state
        setCaseData(prevData => ({
          ...prevData,
          contacts: prevData.contacts.filter(c => c.id !== contactId)
        }));

        // Add timeline event
        await timelineOperations.createTimelineEvent(
          caseData.id,
          'contact',
          `Removed ${contact.role}: ${contact.firstname} ${contact.lastname}`
        );

        // Update timeline
        const events = await timelineOperations.getTimelineEvents(caseData.id);
        setTimelineEvents(events);
        
        resolve();
      } catch (err) {
        console.error("Error deleting contact:", err);
        reject(err);
      }
    });

    toast.promise(deleteContactPromise, {
      loading: 'Deleting contact...',
      success: 'Contact deleted successfully!',
      error: 'Failed to delete contact',
    });

    return deleteContactPromise;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={3} display="flex" justifyContent="center">
          <SoftTypography>Loading case details...</SoftTypography>
        </SoftBox>
      </DashboardLayout>
    );
  }

  if (error || !caseData) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={3}>
          <SoftBox mb={3}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <SoftButton
                  variant="text"
                  color="info"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate("/cases")}
                >
                  Back to Cases
                </SoftButton>
              </Grid>
              <Grid item xs>
                <SoftTypography variant="h4" color="error">
                  {error || "Case not found"}
                </SoftTypography>
              </Grid>
            </Grid>
          </SoftBox>
        </SoftBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <SoftButton
                variant="text"
                color="dark"
                onClick={() => navigate(-1)}
                startIcon={<ArrowBackIcon />}
              >
                Back to Cases
              </SoftButton>
            </Grid>
            <Grid item>
              <SoftTypography variant="h4" fontWeight="bold">
                {caseData?.casename || "Loading..."}
              </SoftTypography>
            </Grid>
            <Grid item>
              <SoftButton
                variant="gradient"
                color="info"
                onClick={handleStageClick}
              >
                Stage: {caseData?.casestage || "Loading..."}
              </SoftButton>
              <Menu
                anchorEl={stageMenuAnchor}
                open={Boolean(stageMenuAnchor)}
                onClose={handleStageClose}
              >
                {stageOptions.map((stage) => (
                  <MenuItem
                    key={stage}
                    onClick={() => handleStageChange(stage)}
                    selected={caseData?.casestage === stage}
                  >
                    {stage}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
          </Grid>
        </SoftBox>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <SoftBox p={3}>
                <SoftTypography variant="h5" fontWeight="bold" mb={3}>
                  Case Information
                </SoftTypography>
                <CaseInfo caseData={caseData} />
              </SoftBox>
            </Card>
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <Card>
              <SoftBox p={3}>
                <SoftTypography variant="h5" fontWeight="bold" mb={3}>
                  Timeline
                </SoftTypography>
                <CaseTimeline events={caseData?.timelineEvents || []} />
              </SoftBox>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card>
              <SoftBox p={3}>
                <SoftTypography variant="h5" fontWeight="bold" mb={3}>
                  Documents
                </SoftTypography>
                <CaseDocuments
                  documents={caseData?.documents || []}
                  onUpload={handleUploadDocument}
                  onDownload={handleDownloadDocument}
                  onDelete={handleDeleteDocument}
                />
              </SoftBox>
            </Card>
        </Grid>

          <Grid item xs={12} lg={6}>
              <Card>
                <SoftBox p={3}>
                <SoftTypography variant="h5" fontWeight="bold" mb={3}>
                  Notes
                </SoftTypography>
                  <CaseNotes
                    notes={caseData?.notes || []}
                    onAddNote={handleAddNote}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                  />
                </SoftBox>
              </Card>
            </Grid>
            
          <Grid item xs={12}>
              <Card>
                <SoftBox p={3}>
                <SoftTypography variant="h5" fontWeight="bold" mb={3}>
                  Contacts
                </SoftTypography>
                <CaseContacts
                  contacts={caseData?.contacts || []}
                  onAdd={handleAddContact}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                  />
                </SoftBox>
              </Card>
            </Grid>
          </Grid>
        </SoftBox>
      <SoftBox mt="auto">
        <Footer />
      </SoftBox>
    </DashboardLayout>
  );
}

export default CaseDetails; 