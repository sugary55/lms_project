import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Chip, 
  Divider,
  Rating, // New Import
  Stack
} from '@mui/material';
import { ArrowForward, Star } from '@mui/icons-material';

const CourseCard = ({ course }) => {
  // Safe check for review count
  const reviewCount = course.reviews?.length || 0;

  return (
    <Card 
      elevation={0} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 4,
        border: '1px solid #eef2f6',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
          borderColor: 'primary.light'
        }
      }}
    >
      {/* Thumbnail Area */}
      <Box 
        sx={{ 
          height: 160, 
          bgcolor: 'aliceblue', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <Typography 
          variant="h3" 
          fontWeight="900" 
          color="primary.light" 
          sx={{ opacity: 0.4, letterSpacing: 2 }}
        >
          {course.course_ID}
        </Typography>
        
        <Chip 
          label={course.category} 
          size="small" 
          color="primary"
          sx={{ position: 'absolute', top: 12, right: 12, fontWeight: '700', fontSize: '0.65rem' }} 
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="overline" color="text.secondary" fontWeight="700">
          {course.subCategory}
        </Typography>
        
        <Typography 
          variant="h6" 
          fontWeight="800" 
          sx={{ 
            mb: 1, 
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.4em'
          }}
        >
          {course.title}
        </Typography>

        {/* RATING SECTION */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Rating 
            value={course.averageRating || 0} 
            precision={0.5} 
            readOnly 
            size="small"
            emptyIcon={<Star style={{ opacity: 0.3 }} fontSize="inherit" />}
          />
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            ({reviewCount})
          </Typography>
        </Stack>

        <Divider sx={{ my: 2, opacity: 0.5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" fontWeight="900" color="primary.main">
              {course.price} <span style={{ fontSize: '0.7rem', color: '#666' }}>EGP</span>
            </Typography>
          </Box>
          
          <Button 
            component={Link} 
            to={`/course/${course.course_ID}`}
            variant="contained" 
            disableElevation
            endIcon={<ArrowForward fontSize="small" />}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: '800' }}
          >
            Join
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CourseCard;