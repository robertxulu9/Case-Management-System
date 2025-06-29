import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import PropTypes from 'prop-types';
import toast from "react-hot-toast";
import { Box, IconButton, Tooltip, Divider } from "@mui/material";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";

// Icons
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import LinkIcon from '@mui/icons-material/Link';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Services
import { templateOperations } from "services/databaseService";

const CATEGORIES = [
  { value: 'client_forms', label: 'Client Forms' },
  { value: 'agreements', label: 'Agreements' },
  { value: 'authorizations', label: 'Authorizations' },
  { value: 'court_documents', label: 'Court Documents' },
  { value: 'general', label: 'General' }
];

// Custom styles for the editor
const editorStyles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '400px',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 1,
    overflow: 'hidden'
  },
  toolbar: {
    display: 'flex',
    padding: 1,
    gap: 0.5,
    borderBottom: '1px solid',
    borderColor: 'divider',
    flexWrap: 'wrap'
  },
  editor: {
    flex: 1,
    padding: 2,
    overflow: 'auto',
    '& .ProseMirror': {
      minHeight: '300px',
      outline: 'none',
      '& > * + *': {
        marginTop: '0.75em'
      }
    }
  }
};

const MenuButton = ({ onClick, active, disabled, title, children }) => (
  <Tooltip title={title}>
    <IconButton
      onClick={onClick}
      color={active ? "primary" : "default"}
      disabled={disabled}
      size="small"
    >
      {children}
    </IconButton>
  </Tooltip>
);

MenuButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

MenuButton.defaultProps = {
  active: false,
  disabled: false,
};

function TemplateEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    content: '',
    variables: []
  });
  const [newVariable, setNewVariable] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color,
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      handleEditorChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (id) {
      fetchTemplate();
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (editor && formData.content) {
      editor.commands.setContent(formData.content);
    }
  }, [editor, formData.content]);

  const fetchTemplate = async () => {
    try {
      const template = await templateOperations.getTemplateById(id);
      setFormData({
        ...template,
        variables: Array.isArray(template.variables) ? template.variables : JSON.parse(template.variables)
      });
    } catch (error) {
      console.error('Error fetching template:', error);
      toast.error('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleAddVariable = () => {
    if (newVariable && !formData.variables.includes(newVariable)) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, newVariable]
      }));
      setNewVariable('');
    }
  };

  const handleDeleteVariable = (variable) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v !== variable)
    }));
  };

  const handleSubmit = async () => {
    try {
      if (id) {
        await templateOperations.updateTemplate(id, formData);
        toast.success('Template updated successfully');
      } else {
        await templateOperations.createTemplate(formData);
        toast.success('Template created successfully');
      }
      navigate('/templates');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={3}>
          <SoftTypography>Loading...</SoftTypography>
        </SoftBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs>
              <SoftTypography variant="h4" fontWeight="medium">
                {id ? 'Edit Template' : 'New Template'}
              </SoftTypography>
            </Grid>
            <Grid item>
              <SoftButton
                variant="gradient"
                color="secondary"
                onClick={() => navigate('/templates')}
                startIcon={<Icon>arrow_back</Icon>}
              >
                Back to Templates
              </SoftButton>
            </Grid>
          </Grid>
        </SoftBox>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <SoftBox p={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={formData.category}
                        label="Category"
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      >
                        {CATEGORIES.map((category) => (
                          <MenuItem key={category.value} value={category.value}>
                            {category.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <SoftBox mb={1}>
                      <SoftTypography variant="caption" fontWeight="medium">
                        Template Content
                      </SoftTypography>
                    </SoftBox>
                    <Box sx={editorStyles.wrapper}>
                      <Box sx={editorStyles.toolbar}>
                        <MenuButton
                          onClick={() => editor?.chain().focus().toggleBold().run()}
                          active={editor?.isActive('bold')}
                          title="Bold"
                        >
                          <FormatBoldIcon />
                        </MenuButton>
                        <MenuButton
                          onClick={() => editor?.chain().focus().toggleItalic().run()}
                          active={editor?.isActive('italic')}
                          title="Italic"
                        >
                          <FormatItalicIcon />
                        </MenuButton>
                        <MenuButton
                          onClick={() => editor?.chain().focus().toggleUnderline().run()}
                          active={editor?.isActive('underline')}
                          title="Underline"
                        >
                          <FormatUnderlinedIcon />
                        </MenuButton>
                        <Divider orientation="vertical" flexItem />
                        <MenuButton
                          onClick={() => editor?.chain().focus().toggleBulletList().run()}
                          active={editor?.isActive('bulletList')}
                          title="Bullet List"
                        >
                          <FormatListBulletedIcon />
                        </MenuButton>
                        <MenuButton
                          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                          active={editor?.isActive('orderedList')}
                          title="Numbered List"
                        >
                          <FormatListNumberedIcon />
                        </MenuButton>
                        <Divider orientation="vertical" flexItem />
                        <MenuButton
                          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                          active={editor?.isActive('blockquote')}
                          title="Quote"
                        >
                          <FormatQuoteIcon />
                        </MenuButton>
                        <MenuButton
                          onClick={() => {
                            const url = window.prompt('Enter URL');
                            if (url) {
                              editor?.chain().focus().setLink({ href: url }).run();
                            }
                          }}
                          active={editor?.isActive('link')}
                          title="Add Link"
                        >
                          <LinkIcon />
                        </MenuButton>
                        <Divider orientation="vertical" flexItem />
                        <MenuButton
                          onClick={() => editor?.chain().focus().undo().run()}
                          disabled={!editor?.can().undo()}
                          title="Undo"
                        >
                          <UndoIcon />
                        </MenuButton>
                        <MenuButton
                          onClick={() => editor?.chain().focus().redo().run()}
                          disabled={!editor?.can().redo()}
                          title="Redo"
                        >
                          <RedoIcon />
                        </MenuButton>
                      </Box>
                      <Box sx={editorStyles.editor}>
                        <EditorContent editor={editor} />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </SoftBox>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card>
              <SoftBox p={3}>
                <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                  Template Variables
                </SoftTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Add Variable"
                      value={newVariable}
                      onChange={(e) => setNewVariable(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddVariable();
                        }
                      }}
                      helperText="Press Enter to add"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <SoftBox display="flex" flexWrap="wrap" gap={1}>
                      {formData.variables.map((variable) => (
                        <Chip
                          key={variable}
                          label={variable}
                          onDelete={() => handleDeleteVariable(variable)}
                          color="primary"
                        />
                      ))}
                    </SoftBox>
                  </Grid>
                </Grid>
              </SoftBox>
            </Card>

            <SoftBox mt={3}>
              <Card>
                <SoftBox p={3}>
                  <SoftButton
                    variant="gradient"
                    color="info"
                    fullWidth
                    onClick={handleSubmit}
                  >
                    {id ? 'Save Changes' : 'Create Template'}
                  </SoftButton>
                </SoftBox>
              </Card>
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
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

export default TemplateEditor; 