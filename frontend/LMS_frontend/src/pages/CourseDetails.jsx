import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { 
  Container, Grid, Typography, Button, Box, Chip, 
  Accordion, AccordionSummary, AccordionDetails, 
  List, ListItem, ListItemIcon, ListItemText, 
  CircularProgress, Divider, Paper, Stack 
} from '@mui/material';
import { 
  ExpandMore, Lock, PlayCircle, ArrowBack, 
  CheckCircle, Description, Videocam, LiveTv, Assignment 
} from '@mui/icons-material';

const CourseDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);

  // Map content types to icons
  const getIcon = (type) => {
    switch (type) {
      case 'video': return <Videocam fontSize="small" />;
      case 'pdf': return <Description fontSize="small" />;
      case 'live': return <LiveTv fontSize="small" />;
      case 'exam': return <Assignment fontSize="small" />;
      default: return <PlayCircle fontSize="small" />;
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/course/${id}`);
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user || !course) { setCheckingEnrollment(false); return; }
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/${user.id}/enrolled-courses`);
        if (response.data && Array.isArray(response.data)) {
          const enrolledIds = response.data.map(c => c._id);
          setIsEnrolled(enrolledIds.includes(course._id));
        }
      } catch (error) {
        console.error('Enrollment check failed', error);
      } finally {
        setCheckingEnrollment(false);
      }
    };
    checkEnrollment();
  }, [user, course]);

  const handleEnroll = async () => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/user/enroll`, {
        userId: user.id,
        courseId: course.course_ID
      });
      setIsEnrolled(true);
    } catch (error) {
      alert(error.response?.data?.message || "Enrollment failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
  );

  if (!course) return (
    <Container sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h5">Course not found</Typography>
      <Button onClick={() => navigate('/')}>Return Home</Button>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Back Button */}
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/')} 
        sx={{ mb: 4, fontWeight: 'bold' }}
      >
        Back to Gallery
      </Button>

      <Grid container spacing={5}>
        {/* LEFT COLUMN: Course Info & Curriculum */}
        <Grid  size={{ xs: 12 , md:8 }} >
          <Stack spacing={3}>
            <Box>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip label={course.course_ID} color="primary" sx={{ fontWeight: 'bold' }} />
                <Chip label={course.category} variant="outlined" />
              </Stack>
              <Typography variant="h3" fontWeight="900" gutterBottom>
                {course.title}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                {course.description || "Learn the fundamentals and advanced techniques in this comprehensive curriculum."}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h5" fontWeight="800" sx={{ mb: 3 }}>
                Course Content
              </Typography>
              
              {course.sections?.map((section, idx) => (
                <Accordion key={idx} elevation={0} sx={{ border: '1px solid #eee', mb: 1, '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography fontWeight="700">{section.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <List disablePadding>
                      {section.lessons?.map((lesson, lIdx) => (
                        <ListItem key={lIdx} divider sx={{ py: 1.5 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {lesson.isLocked ? <Lock color="disabled" fontSize="small" /> : <CheckCircle color="success" fontSize="small" />}
                          </ListItemIcon>
                          <ListItemText 
                            primary={lesson.lessonTitle} 
                            secondary={lesson.contentType.toUpperCase()} 
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                          />
                          <Box sx={{ color: 'text.secondary' }}>
                            {getIcon(lesson.contentType)}
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Stack>
        </Grid>

        {/* RIGHT COLUMN: Enrollment Card (Sticky) */}
        <Grid  size={{ xs: 12 , md:4}}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 4, 
              border: '1px solid #eef2f6', 
              position: 'sticky', 
              top: 100,
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" fontWeight="900" color="primary" gutterBottom>
              {course.price} EGP
            </Typography>
            
            <Box sx={{ my: 3 }}>
              {checkingEnrollment ? (
                <CircularProgress size={24} />
              ) : isEnrolled ? (
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="success" 
                  size="large" 
                  startIcon={<CheckCircle />}
                  sx={{ borderRadius: 3, py: 1.5, fontWeight: 'bold' }}
                >
                  Access Content
                </Button>
              ) : (
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="large" 
                  onClick={handleEnroll}
                  disabled={loading}
                  sx={{ borderRadius: 3, py: 1.5, fontWeight: 'bold' }}
                >
                  {loading ? "Processing..." : "Enroll Now"}
                </Button>
              )}
            </Box>

            <Typography variant="caption" color="text.secondary">
              Lifetime access • Certificate of completion • Practical exercises
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetails;