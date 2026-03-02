import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Container,
  useScrollTrigger,
  Slide,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  KeyboardArrowDown,
  AdminPanelSettings,
  Logout,
  School,
  Info,
  SupportAgent,
} from '@mui/icons-material';

const Navbar = ({ User, handleLogin, handleLogout }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElCourses, setAnchorElCourses] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll effect (elevation)
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleOpenCoursesMenu = (event) => setAnchorElCourses(event.currentTarget);

  const handleCloseAll = () => {
    setAnchorElNav(null);
    setAnchorElUser(null);
    setAnchorElCourses(null);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="sticky" 
      elevation={trigger ? 4 : 0} 
      sx={{ 
        bgcolor: trigger ? 'white' : 'transparent', 
        color: 'text.primary',
        transition: 'all 0.3s ease',
        borderBottom: trigger ? 'none' : '1px solid #eee'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* LOGO - Desktop */}
          <School sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 800,
              color: 'inherit',
              textDecoration: 'none',
              letterSpacing: '-0.5px',
            }}
          >
            DR.Mina Academy
          </Typography>

          {/* MOBILE MENU ICON */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseAll}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <MenuItem onClick={() => { handleCloseAll(); navigate('/admin'); }}>Admin Panel</MenuItem>
              <MenuItem onClick={() => { handleCloseAll(); navigate('/about'); }}>About</MenuItem>
            </Menu>
          </Box>

          {/* LOGO - Mobile */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 800,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            DR.Mina
          </Typography>

          {/* DESKTOP LINKS */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1, ml: 4 }}>
            <Button
              component={Link}
              to="/admin"
              startIcon={<AdminPanelSettings />}
              sx={{ color: isActive('/admin') ? 'primary.main' : 'text.secondary', fontWeight: 600 }}
            >
              Admin
            </Button>

            {/* Courses Dropdown */}
            <Button
              endIcon={<KeyboardArrowDown />}
              onClick={handleOpenCoursesMenu}
              sx={{ color: 'text.secondary', fontWeight: 600 }}
            >
              Courses
            </Button>
            <Menu
              anchorEl={anchorElCourses}
              open={Boolean(anchorElCourses)}
              onClose={handleCloseAll}
              MenuListProps={{ onMouseLeave: handleCloseAll }}
            >
              <MenuItem onClick={handleCloseAll}>IELTS Preparation</MenuItem>
              <MenuItem onClick={handleCloseAll}>TOEFL Mastery</MenuItem>
              <MenuItem onClick={handleCloseAll}>General English</MenuItem>
            </Menu>

            <Button component={Link} to="/about" startIcon={<Info />} sx={{ color: isActive('/about') ? 'primary.main' : 'text.secondary', fontWeight: 600 }}>
              About
            </Button>
          </Box>

          {/* AUTH SECTION */}
          <Box sx={{ flexGrow: 0 }}>
            {User ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1 }}>
                    {User.user_metadata?.full_name || 'Student'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {User.email}
                  </Typography>
                </Box>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={User.email} src={User.user_metadata?.avatar_url} sx={{ bgcolor: 'primary.main' }}>
                      {User.email[0].toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseAll}
                >
                  <MenuItem onClick={handleLogout}>
                    <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                variant="contained"
                disableElevation
                onClick={handleLogin}
                startIcon={<img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" width="18" alt="G" />}
                sx={{ 
                  borderRadius: '8px', 
                  textTransform: 'none', 
                  fontWeight: 700,
                  bgcolor: 'white',
                  color: 'text.primary',
                  border: '1px solid #ddd',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;