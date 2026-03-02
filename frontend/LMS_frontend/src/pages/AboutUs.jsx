import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Divider 
} from '@mui/material';
import { School, Groups, Verified } from '@mui/icons-material';

const AboutUs = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h1" color="primary" fontWeight="bold" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="h3" component="h1" fontWeight="800" gutterBottom>
          Empowering Language Learners Globally
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', fontWeight: 400 }}>
          We provide world-class preparation for IELTS, TOEFL, and General English to help students unlock international opportunities.
        </Typography>
      </Box>

      {/* Stats/Features Section */}
      <Grid container spacing={4} justifyContent="center" sx={{ mb: 10, width: '100%', mx: 0 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <School color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>Expert Tutors</Typography>
            <Typography variant="body2" color="text.secondary">
              Learn from certified instructors with years of experience in exam preparation.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Verified color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>Proven Results</Typography>
            <Typography variant="body2" color="text.secondary">
              Over 90% of our students achieve their target scores within the first attempt.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Groups color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>Community</Typography>
            <Typography variant="body2" color="text.secondary">
              Join a global network of learners supporting each other through the journey.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 10 }} />

      {/* Core Values Section */}
      <Box sx={{ bgcolor: 'grey.50', p: 6, borderRadius: 4 }}>
        <Typography variant="h4"  textAlign="center" fontWeight="bold" sx={{ mb: 6 }}>
          Why Choose Our LMS?
        </Typography>
        <Grid container spacing={3} justifyContent="center" sx={{ width: '100%', mx: 0 }}>
          {['Adaptive Learning', 'Real-time Analytics', 'Comprehensive Materials'].map((value) => (
            <Grid item xs={12} sm={4} key={value}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>{value}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our platform is designed to meet individual student needs through high-tech pedagogical tools.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default AboutUs;