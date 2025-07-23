import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Typography, 
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  ContactMail as ContactIcon,
} from "@mui/icons-material";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { path: "/notices", label: "Notices", icon: <DashboardIcon /> },
    { path: "/search", label: "Search", icon: <SearchIcon /> },
    { path: "/contact", label: "Contact", icon: <ContactIcon /> },
  ];

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      }}
    >
      <Toolbar 
        sx={{ 
          justifyContent: isMobile ? "center" : "space-between", 
          py: { xs: 1, sm: 1.5 },
          px: { xs: 1, sm: 3 },
          minHeight: { xs: 56, sm: 64 },
        }}
      >
        {/* Logo/Title - Hidden on mobile */}
        {!isMobile && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: { sm: "1.25rem", md: "1.5rem" },
              letterSpacing: "-0.025em",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.05)",
              },
              transition: "transform 0.3s ease",
            }}
            onClick={() => navigate("/notices")}
          >
            🎓 Notice Board
          </Typography>
        )}

        {/* Navigation Items */}
        <Box 
          sx={{ 
            display: "flex", 
            gap: { xs: 0.5, sm: 1, md: 1.5 },
            justifyContent: isMobile ? "space-around" : "flex-end",
            width: isMobile ? "100%" : "auto",
            maxWidth: isMobile ? "400px" : "auto",
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            if (isMobile) {
              return (
                <Box
                  key={item.path}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <IconButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      flexDirection: "column",
                      borderRadius: 3,
                      px: 2,
                      py: 1.5,
                      gap: 0.5,
                      minWidth: "auto",
                      background: isActive 
                        ? "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                        : "transparent",
                      color: isActive ? "#fff" : "#64748b",
                      boxShadow: isActive 
                        ? "0 4px 15px rgba(79, 70, 229, 0.3)"
                        : "none",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        background: isActive
                          ? "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)"
                          : "rgba(79, 70, 229, 0.1)",
                        transform: "translateY(-2px)",
                        boxShadow: isActive
                          ? "0 6px 20px rgba(79, 70, 229, 0.4)"
                          : "0 2px 10px rgba(79, 70, 229, 0.1)",
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: isActive 
                          ? "rgba(255, 255, 255, 0.2)"
                          : "transparent",
                        borderRadius: 3,
                        transition: "all 0.3s ease",
                      },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <Box 
                      sx={{ 
                        fontSize: "1.25rem",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: isActive ? 700 : 500,
                        lineHeight: 1,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {item.label}
                    </Typography>
                  </IconButton>
                  
                  {/* Active indicator dot */}
                  {isActive && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -4,
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                        boxShadow: "0 2px 8px rgba(79, 70, 229, 0.4)",
                      }}
                    />
                  )}
                </Box>
              );
            }

            return (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                startIcon={item.icon}
                sx={{
                  px: { sm: 2.5, md: 3.5 },
                  py: { sm: 1.5, md: 1.75 },
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: { sm: "0.875rem", md: "0.95rem" },
                  minWidth: "auto",
                  position: "relative",
                  overflow: "hidden",
                  ...(isActive
                    ? {
                        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                        color: "#fff",
                        boxShadow: "0 4px 15px rgba(79, 70, 229, 0.3)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)",
                          boxShadow: "0 6px 20px rgba(79, 70, 229, 0.4)",
                          transform: "translateY(-2px)",
                        },
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "rgba(255, 255, 255, 0.2)",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                        },
                        "&:hover::before": {
                          opacity: 1,
                        },
                      }
                    : {
                        color: "#64748b",
                        background: "transparent",
                        "&:hover": {
                          background: "rgba(79, 70, 229, 0.1)",
                          color: "#4f46e5",
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 15px rgba(79, 70, 229, 0.15)",
                        },
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          width: 0,
                          height: 2,
                          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                          transition: "all 0.3s ease",
                          transform: "translateX(-50%)",
                          borderRadius: 1,
                        },
                        "&:hover::after": {
                          width: "80%",
                        },
                      }),
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "& .MuiButton-startIcon": {
                    marginRight: { sm: 1, md: 1.25 },
                    transition: "transform 0.3s ease",
                  },
                  "&:hover .MuiButton-startIcon": {
                    transform: isActive ? "rotate(360deg)" : "scale(1.1)",
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
