import React from "react";
import Typewriter from 'typewriter-effect';
import { 
  Container, 
  Grid, 
  Typography, 
  Button, 
  Box, 
  Stack, 
  Paper,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { PlayCircleOutline, RocketLaunch, Groups, WorkspacePremium, ShowChart } from '@mui/icons-material';

const HeroSection = ({ User }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box 
      sx={{ 
        bgcolor: '#f8faff', 
        pt: { xs: 8, md: 15 }, 
        pb: { xs: 8, md: 12 },
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          
          {/* TEXT CONTENT */}
          <Grid item xs={12} md={7}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography 
                variant="overline" 
                color="primary" 
                sx={{ fontWeight: 800, letterSpacing: 2, display: 'flex', alignItems: 'center', justifyContent: {xs: 'center', md: 'flex-start'}, gap: 1 }}
              >
                <RocketLaunch fontSize="small" /> Premium English Learning
              </Typography>
              
             <Typography 
  variant="h6" 
  color="text.secondary" 
  sx={{ 
    mb: 4, 
    fontWeight: 400, 
    maxWidth: '540px', 
    mx: { xs: 'auto', md: 0 },
    minHeight: { xs: '80px', md: 'auto' } // Prevents layout jump while typing
  }}
>
  <Typewriter
    options={{
      autoStart: true,
      loop: true,
      delay: 50,
      deleteSpeed: 30,
    }}
    onInit={(typewriter) => {
      typewriter
        .typeString('Join successful learners today who have transformed their lives.')
        .pauseFor(1000)
        // .deleteAll()
        .typeString('Master the <strong>IELTS</strong> exam with expert strategies.')
        .pauseFor(1000)
        // .deleteAll()
        .typeString('Achieve your <strong>TOEFL</strong> goals with <strong>DR.Mina</strong>')
        .pauseFor(2000)
        .deleteAll()
        .start();
    }}
  />
</Typography>

              {/* ACTION BUTTONS */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                sx={{ mb: 6 }}
              >
                {User ? (
                  <Button 
                    variant="contained" 
                    size="large" 
                    sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 'bold' }}
                  >
                    My Courses
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="contained" 
                      size="large" 
                      sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 'bold' }}
                    >
                      Start Free Trial
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="large" 
                      startIcon={<PlayCircleOutline />}
                      sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 'bold' }}
                    >
                      Watch Demo
                    </Button>
                  </>
                )}
              </Stack>

              {/* STATS SECTION */}
              <Grid container spacing={3} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                <StatItem icon={<Groups color="primary"/>} number="1000+" label="Students" />
                <StatItem icon={<WorkspacePremium color="primary"/>} number="15+" label="Years Exp." />
                <StatItem icon={<ShowChart color="primary"/>} number="98%" label="Success" />
              </Grid>
            </Box>
          </Grid>

          {/* HERO IMAGE / VISUAL */}
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box 
              sx={{ 
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  bgcolor: 'primary.light',
                  opacity: 0.1,
                  borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                  transform: 'scale(1.2) rotate(10deg)',
                  zIndex: 0
                }
              }}
            >
              <Paper 
                elevation={10} 
                sx={{ 
                  height: 450, 
                  borderRadius: 8, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'white',
                  position: 'relative',
                  zIndex: 1,
                  overflow: 'hidden',
                  border: '8px solid white'
                }}
              >
                <Typography variant="h4" fontWeight="900" color="grey.300">
                   LEARN ENGLISH
                </Typography>
                {/* When you have an actual image: 
                   <img src="/path/to/mina.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> 
                */}
              </Paper>
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

// Sub-component for Stats to keep code clean
const StatItem = ({ icon, number, label }) => (
  <Grid item>
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box sx={{ bgcolor: 'white', p: 1, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex' }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1 }}>{number}</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight="600">{label}</Typography>
      </Box>
    </Stack>
  </Grid>
);

export default HeroSection;