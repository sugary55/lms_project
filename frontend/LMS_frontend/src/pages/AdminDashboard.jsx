import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Box, Grid, Card, CardContent, Button, TextField,
  MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, InputAdornment, Alert, Snackbar, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider, Stack
} from '@mui/material';
import {
  Delete, Search, Add, Close, Book, ErrorOutline, TrendingUp, People, Dashboard,Edit,Star,StarBorder
} from '@mui/icons-material';
import { supabase } from './../library/supabaseClient';


const API_URL = import.meta.env.VITE_API_URL;
const ADMIN_SUPABASE_ID = 'df355608-8ea4-4fce-ae27-77b6304cd6c4';

const AdminDashboard = () => {
  /* --- STATE --- */
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
const [courseToDelete, setCourseToDelete] = useState(null);
  const navigate = useNavigate();
  // Notification State
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  // Form State
  const [formData, setFormData] = useState({
    title: '', course_ID: '', category: 'IELTS', subCategory: 'GRAMMAR', price: 0, description: ''
  });

  /* --- HELPERS --- */
  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/course`);
      setCourses(res.data);
    } catch {
      showToast("Server synchronization failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (courseId)=>{
    try{
      ;
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/course/${courseId}/featured`,{},{headers:{'x-user-id':"df355608-8ea4-4fce-ae27-77b6304cd6c4"},withCredentials:true});
        const currentCourse = courses.find(c => c.course_ID === courseId);
        const isNowFeatured = !currentCourse?.isFeatured;
      setCourses(prev =>prev.map(c => c.course_ID === courseId ?{...c,isFeatured:!c.isFeatured}:c));
      
      if (isNowFeatured) {
      showToast("Course featured to home successfully", "success");
    } else {
      showToast("Course removed from featured list", "info");
    }
    }catch(error){
      console.error("failed to toggle fetured status ",error);
      showToast("Failed to update featured status", "error");
    }
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (formData.course_ID.length !== 4) return showToast("ID must be 4 chars", "error");
    
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/course/add`, { ...formData, instructor: "Admin" }, {
        headers: { 'x-user-id': ADMIN_SUPABASE_ID },
        withCredentials: true
      });
      showToast("Course published successfully");
      fetchCourses();
      setIsFormOpen(false);
      setFormData({ title: '', course_ID: '', category: 'IELTS', subCategory: 'GRAMMAR', price: 0, description: '' });
    } catch (err) {
      showToast(err.response?.data?.message || "Operation failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
const handleDeleteClick = (courseID)=>{
  setCourseToDelete(courseID);
  setIsConfirmOpen(true);
};
const confirmDelete = async () => {
  try {
    await axios.delete(`${API_URL}/api/course/${courseToDelete}`, {
      headers: { 'x-user-id': "df355608-8ea4-4fce-ae27-77b6304cd6c4" }, 
      withCredentials: true
    });

    showToast("Course record successfully purged", "success");
    fetchCourses();
  } catch (error) {
    showToast(error.response?.data?.message || "Deletion failed", "error");
  } finally {
    setIsConfirmOpen(false);
    setCourseToDelete(null);
  }
};
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.course_ID.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = filterCategory === 'All' || c.category === filterCategory;
      return matchesSearch && matchesCat;
    });
  }, [courses, searchTerm, filterCategory]);

  useEffect(() => { fetchCourses(); });

  if (loading) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <CircularProgress />
      <Typography variant="overline">Initializing Console...</Typography>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="800" color="text.primary">Management Console</Typography>
          <Typography variant="body2" color="text.secondary">Audit and modify curriculum parameters</Typography>
        </Box>
        <Button 
          variant={isFormOpen ? "outlined" : "contained"} 
          startIcon={isFormOpen ? <Close /> : <Add />}
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? "Cancel" : "New Course"}
        </Button>
      </Box>

      {/* METRICS */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <MetricCard icon={<Dashboard color="primary"/>} label="Course Catalog" value={courses.length} />
        <MetricCard icon={<People color="success"/>} label="Enrollments" value={courses.reduce((a, b) => a + (b.enrollmentCount || 0), 0)} />
        <MetricCard icon={<TrendingUp color="secondary"/>} label="Primary Focus" value={filterCategory} />
      </Grid>

      {/* CREATE FORM (Collapsible) */}
      {isFormOpen && (
        <Card sx={{ mb: 6, p: 2, border: '1px solid #e0e0e0' }} elevation={0}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Publish New Course</Typography>
            <Box component="form" onSubmit={handleCreateCourse} sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Course Title" value={formData.title} onChange={(e)=>setFormData({...formData, title: e.target.value})} required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="ID (4 Chars)" value={formData.course_ID} onChange={(e)=>setFormData({...formData, course_ID: e.target.value.toUpperCase()})} inputProps={{ maxLength: 4 }} required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth type="number" label="Price (EGP)" value={formData.price} onChange={(e)=>setFormData({...formData, price: e.target.value})} required />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField select fullWidth label="Category" value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})}>
                    {['IELTS', 'TOEFL', 'GENERAL'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField select fullWidth label="Sub-Category" value={formData.subCategory} onChange={(e)=>setFormData({...formData, subCategory: e.target.value})}>
                    {['GRAMMAR', 'Speaking', 'Exams', 'Revision'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={3} label="Description" value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                    {isSubmitting ? "Syncing..." : "Publish Course"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* FILTER BAR */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField 
          fullWidth placeholder="Filter by Title or ID..." 
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
        />
        <TextField select sx={{ minWidth: 200 }} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <MenuItem value="All">All Classifications</MenuItem>
          <MenuItem value="IELTS">IELTS</MenuItem>
          <MenuItem value="TOEFL">TOEFL</MenuItem>
          <MenuItem value="GENERAL">GENERAL</MenuItem>
        </TextField>
      </Stack>

      {/* TABLE */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f9fafb' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>IDENTIFIER</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>COURSE DETAILS</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>PRICE</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course._id} hover>
                <TableCell><Chip label={course.course_ID} size="small" sx={{ fontWeight: 'bold', fontFamily: 'monospace', cursor: 'pointer' }} onClick={() => navigate(`/course/${course.course_ID}`)} /></TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">{course.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{course.category} • {course.subCategory}</Typography>
                </TableCell>
                <TableCell><Typography variant="body2" fontWeight="bold">{course.price.toLocaleString()} EGP</Typography></TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary" title="Curriculum"><Book fontSize="small" /></IconButton>
                  <IconButton 
                  onClick={() => handleToggleFeatured(course.course_ID)} sx={{color:course.isFeatured ? '#ffc107': 'inherit'}}>
                  {course.isFeatured ? <Star /> : <StarBorder />}
                  </IconButton>
                  <IconButton size="small" color="error" title="Delete" onClick={()=>handleDeleteClick(course.course_ID)}><Delete fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* SNACKBAR NOTIFICATION */}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} variant="filled" sx={{ width: '100%' }}>{toast.message}</Alert>
      </Snackbar>
      {/* DELETE CONFIRMATION DIALOG */}
<Dialog
  open={isConfirmOpen}
  onClose={() => setIsConfirmOpen(false)}
  PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
>
  <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
    <ErrorOutline color="error" /> Confirm Deletion
  </DialogTitle>
  <DialogContent>
    <Typography variant="body2" color="text.secondary">
      Are you sure you want to delete course <strong>{courseToDelete}</strong>? 
      This action is permanent and will remove all associated lessons and enrollment data.
    </Typography>
  </DialogContent>
  <DialogActions sx={{ pb: 2, px: 3 }}>
    <Button onClick={() => setIsConfirmOpen(false)} color="inherit" sx={{ fontWeight: 'bold' }}>
      Cancel
    </Button>
    <Button 
      onClick={confirmDelete} 
      variant="contained" 
      color="error" 
      autoFocus
      sx={{ fontWeight: 'bold', borderRadius: '8px', px: 3 }}
    >
      Delete Permanently
    </Button>
  </DialogActions>
</Dialog>
    </Container>
  );
};

const MetricCard = ({ icon, label, value }) => (
  <Grid item xs={12} md={4}>
    <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 2 }}>{icon}</Box>
        <Box>
          <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase' }}>{label}</Typography>
          <Typography variant="h5" fontWeight="800">{value}</Typography>
        </Box>
      </CardContent>
    </Card>
  </Grid>
);

export default AdminDashboard;