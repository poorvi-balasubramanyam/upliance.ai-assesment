import React from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Container,
  Tabs,
  Tab,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Build, Preview, List, AutoAwesome } from '@mui/icons-material';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  const getCurrentTab = () => {
    if (location.pathname === '/create') return '/create';
    if (location.pathname === '/preview') return '/preview';
    if (location.pathname === '/myforms') return '/myforms';
    return '/create';
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ 
          minHeight: isMobile ? '60px !important' : '80px !important',
          px: { xs: 1, sm: 2, md: 4 },
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            pointerEvents: 'none',
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <AutoAwesome sx={{ 
              mr: { xs: 1, sm: 2 }, 
              fontSize: { xs: 24, sm: 28, md: 32 },
              color: 'rgba(255, 255, 255, 0.9)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }} />
            <Typography 
              variant={isMobile ? "h5" : "h4"}
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                letterSpacing: '-0.025em',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Form Builder Pro
            </Typography>
            <Typography 
              variant="h6"
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'block', sm: 'none' }
              }}
            >
              Form Builder
            </Typography>
          </Box>
        </Toolbar>
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            mx: { xs: 0.5, sm: 1, md: 2 },
            mb: 1
          }}
        >
          <Tabs
            value={getCurrentTab()}
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{ 
              '& .MuiTab-root': { 
                color: '#64748b',
                fontWeight: 500,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                minHeight: { xs: '48px', sm: '56px' },
                textTransform: 'none',
                '&.Mui-selected': { 
                  color: '#6366f1',
                  fontWeight: 600,
                },
                '&:hover': {
                  color: '#6366f1',
                  background: 'rgba(99, 102, 241, 0.04)',
                }
              },
              '& .MuiTabs-indicator': {
                height: '3px',
                borderRadius: '3px 3px 0 0',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              }
            }}
          >
            <Tab
              icon={<Build sx={{ fontSize: { xs: 18, sm: 20 }, mb: { xs: 0, sm: 0.5 } }} />}
              label={isMobile ? "Create" : "Create Form"}
              value="/create"
              iconPosition={isMobile ? "top" : "top"}
            />
            <Tab
              icon={<Preview sx={{ fontSize: { xs: 18, sm: 20 }, mb: { xs: 0, sm: 0.5 } }} />}
              label={isMobile ? "Preview" : "Preview"}
              value="/preview"
              iconPosition={isMobile ? "top" : "top"}
            />
            <Tab
              icon={<List sx={{ fontSize: { xs: 18, sm: 20 }, mb: { xs: 0, sm: 0.5 } }} />}
              label={isMobile ? "Forms" : "My Forms"}
              value="/myforms"
              iconPosition={isMobile ? "top" : "top"}
            />
          </Tabs>
        </Paper>
      </AppBar>
      <Container 
        maxWidth="xl" 
        sx={{ 
          mt: { xs: 2, sm: 3, md: 4 }, 
          mb: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1, sm: 2, md: 3, lg: 4 },
          minHeight: 'calc(100vh - 200px)'
        }}
      >
        <Box sx={{ 
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -20,
            left: -20,
            right: -20,
            bottom: -20,
            background: 'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            zIndex: -1,
            borderRadius: 8,
          }
        }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default AppLayout;