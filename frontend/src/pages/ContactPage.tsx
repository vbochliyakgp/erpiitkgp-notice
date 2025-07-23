import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Alert,
  CardContent,
  Grid,
  Snackbar,
  Box,
  Container,
  Paper,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Send as SendIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  ContactMail as ContactMailIcon,
} from "@mui/icons-material";
import client from "../api/client";

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (error) setError(null);
    };

  const validateForm = () => {
    if (!form.name.trim()) return "Please enter your name";
    if (!form.email.trim()) return "Please enter your email";
    if (!form.phone.trim()) return "Please enter your phone number";
    if (!form.message.trim()) return "Please enter your message";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email))
      return "Please enter a valid email address";

    if (form.phone.length < 7) return "Please enter a valid phone number";
    if (form.message.length < 10)
      return "Message should be at least 10 characters";

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await client.post("/api/contacts", form);
      setForm({ name: "", email: "", phone: "", message: "" });
      setSnackOpen(true);
    } catch (e: any) {
      setError(
        e.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Enhanced input field styles for better design, borders, and sizing
  const inputFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px", // Softer, more modern border radius
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      border: "none", // Remove default border
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
      minHeight: "56px", // Consistent height for all fields
      "& fieldset": {
        border: "2px solid rgba(102, 126, 234, 0.3)", // Custom border color and width
        borderRadius: "12px",
      },
      "&:hover fieldset": {
        borderColor: "#667eea",
        boxShadow: "0 6px 16px rgba(102, 126, 234, 0.2)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#667eea",
        borderWidth: "2px",
        boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
      },
      "&.Mui-error fieldset": {
        borderColor: "#f44336",
      },
    },
    "& .MuiInputLabel-root": {
      fontWeight: 500,
      color: "rgba(0, 0, 0, 0.7)",
      "&.Mui-focused": {
        color: "#667eea",
      },
    },
    "& .MuiInputAdornment-root": {
      mr: 1,
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: {
          xs: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          md: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        },
        position: "relative",
        display: "flex",
        alignItems: "center",
        py: { xs: 4, sm: 6, md: 8 },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 4, sm: 5, md: 6 },
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: { xs: 2, md: 3 },
              p: { xs: 2, md: 2.5 },
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <ContactMailIcon
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                color: "white",
              }}
            />
          </Box>

          <Typography
            variant={isSmall ? "h4" : isMobile ? "h3" : "h2"}
            sx={{
              fontWeight: 700,
              color: "white",
              mb: { xs: 1, md: 2 },
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            Get In Touch
          </Typography>

          <Typography
            variant={isSmall ? "body1" : "h6"}
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              maxWidth: 500,
              mx: "auto",
              lineHeight: 1.6,
              px: { xs: 2, sm: 0 },
            }}
          >
            Love to hear from you. Send a message and we'll respond as
            soon as possible.
          </Typography>
        </Box>

        {/* Form Section */}
        <Paper
          elevation={0}
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: { xs: 3, md: 4 },
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            mx: { xs: 2, sm: 0 },
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, sm: 4, md: 6 },
            }}
          >
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 4,
                  borderRadius: 2,
                  fontWeight: 500,
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" noValidate>
              <Grid container spacing={3}>
                {/* Name Field */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={form.name}
                    onChange={handleChange("name")}
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "#667eea" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputFieldStyles}
                  />
                </Grid>

                {/* Email Field */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "#667eea" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputFieldStyles}
                  />
                </Grid>

                {/* Phone Field */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: "#667eea" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputFieldStyles}
                  />
                </Grid>

                {/* Message Field */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={5}
                    value={form.message}
                    onChange={handleChange("message")}
                    variant="outlined"
                    required
                    placeholder="Tell us what's on your mind..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ 
                            alignSelf: "flex-start", 
                            mt: 1.5,
                          }}
                        >
                          <MessageIcon sx={{ color: "#667eea" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      ...inputFieldStyles,
                      "& .MuiOutlinedInput-root": {
                        ...inputFieldStyles["& .MuiOutlinedInput-root"],
                        alignItems: "flex-start",
                        minHeight: "auto", // Allow natural height for multiline
                      },
                    }}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleSubmit}
                      disabled={loading}
                      startIcon={<SendIcon />}
                      sx={{
                        px: { xs: 4, sm: 6 },
                        py: 1.5,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        borderRadius: 3,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
                        textTransform: "none",
                        minWidth: { xs: 200, sm: 250 },
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                          boxShadow: "0 15px 40px rgba(102, 126, 234, 0.6)",
                          transform: "translateY(-2px)",
                        },
                        "&:active": {
                          transform: "translateY(0px)",
                        },
                        "&:disabled": {
                          background: "#e5e7eb",
                          color: "#9ca3af",
                          boxShadow: "none",
                          transform: "none",
                        },
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Paper>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity="success"
          onClose={() => setSnackOpen(false)}
          sx={{
            borderRadius: 2,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            minWidth: { xs: 300, sm: 400 },
          }}
        >
          Message sent successfully! We'll get back to you soon.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;
