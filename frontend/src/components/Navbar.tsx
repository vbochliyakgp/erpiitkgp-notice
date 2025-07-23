import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  ContactMail as ContactIcon,
} from "@mui/icons-material";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/notices", label: "Notices", icon: <DashboardIcon /> },
    { path: "/search", label: "Search", icon: <SearchIcon /> },
    { path: "/contact", label: "Contact", icon: <ContactIcon /> },
  ];

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#1f2937",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          🎓 Notice
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              startIcon={item.icon}
              variant={location.pathname === item.path ? "contained" : "text"}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: location.pathname === item.path ? 600 : 400,
                ...(location.pathname === item.path
                  ? {
                      backgroundColor: "#dbeafe",
                      color: "#2563eb",
                      "&:hover": {
                        backgroundColor: "#bfdbfe",
                      },
                    }
                  : {
                      color: "#6b7280",
                      "&:hover": {
                        backgroundColor: "#f3f4f6",
                      },
                    }),
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
