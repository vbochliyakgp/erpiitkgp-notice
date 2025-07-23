import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
  Launch as LaunchIcon,
  Article as ArticleIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";

interface Notice {
  notification_number: number;
  type: string;
  subject: string;
  company: string;
  title: string;
  description: string;
  date_generated: string;
}

interface NoticeCardProps {
  notice: Notice;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getTypeColor = (type: string) => {
    switch (type) {
      case "INTERNSHIP":
        return {
          bg: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          color: "#fff",
          shadow: "rgba(79, 70, 229, 0.3)",
        };
      case "PLACEMENT":
        return {
          bg: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
          color: "#fff",
          shadow: "rgba(236, 72, 153, 0.3)",
        };
      default:
        return {
          bg: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
          color: "#fff",
          shadow: "rgba(107, 114, 128, 0.3)",
        };
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "Shortlist":
        return {
          bg: "linear-gradient(135deg, #059669 0%, #047857 100%)",
          color: "#fff",
          shadow: "rgba(5, 150, 105, 0.3)",
        };
      case "CV Submission":
        return {
          bg: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
          color: "#fff",
          shadow: "rgba(234, 88, 12, 0.3)",
        };
      case "PPT/Workshop/Seminars etc":
        return {
          bg: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          color: "#fff",
          shadow: "rgba(37, 99, 235, 0.3)",
        };
      case "Urgent":
        return {
          bg: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
          color: "#fff",
          shadow: "rgba(220, 38, 38, 0.3)",
        };
      default:
        return {
          bg: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
          color: "#fff",
          shadow: "rgba(100, 116, 139, 0.3)",
        };
    }
  };

  const truncateTitle = (title: string) => {
    return title.length > 90 ? title.substring(0, 90) + "..." : title;
  };

  // Format date and time with better handling
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date
      .toLocaleDateString("en-GB")
      .replace(/\//g, "/")
      .slice(0, 8); // dd/mm/yy format
    
    // Better time formatting to prevent wrapping
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).replace(/\s/g, ''); // Remove spaces to prevent wrapping
    
    return { date: formattedDate, time: formattedTime };
  };

  const dateTime = formatDateTime(notice.date_generated);

  return (
    <>
      <Card
        onClick={() => setDialogOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          width: "100%",
          height: { xs: "auto", sm: 350 },
          minHeight: { xs: 300, sm: 350 },
          background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(148, 163, 184, 0.1)",
          borderRadius: 4,
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
          transform: isHovered
            ? "translateY(-8px) scale(1.02)"
            : "translateY(0) scale(1)",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: getTypeColor(notice.type).bg,
            transform: isHovered ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 0.4s ease",
          },
          "&:hover": {
            boxShadow: `0 25px 50px ${getTypeColor(notice.type).shadow}`,
          },
        }}
      >
        {/* Floating Animation Background */}
        <Box
          sx={{
            position: "absolute",
            top: -2,
            right: -2,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: `conic-gradient(from 0deg, ${
              getTypeColor(notice.type).bg
            }, transparent)`,
            opacity: isHovered ? 0.4 : 0,
            transform: isHovered
              ? "rotate(180deg) scale(1.5)"
              : "rotate(0deg) scale(1)",
            transition: "all 0.6s ease",
            zIndex: 0,
          }}
        />

        <CardContent
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: { xs: 2.5, sm: 3 },
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Top Section */}
          <Box>
            {/* Header with Type and Date/Time - Fixed Layout */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 3,
                gap: 1.5,
                flexWrap: { xs: "wrap", sm: "nowrap" },
              }}
            >
              <Chip
                label={notice.type}
                size="small"
                sx={{
                  background: getTypeColor(notice.type).bg,
                  color: getTypeColor(notice.type).color,
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  height: 32,
                  borderRadius: 2.5,
                  boxShadow: `0 4px 12px ${getTypeColor(notice.type).shadow}`,
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                  transition: "transform 0.3s ease",
                  flexShrink: 0,
                  "& .MuiChip-label": {
                    px: 2.5,
                  },
                }}
              />

              {/* Fixed Date and Time Layout */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-end", sm: "center" },
                  gap: { xs: 0.5, sm: 1 },
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.5, sm: 0.75 },
                  borderRadius: 2.5,
                  background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  boxShadow: "0 2px 8px rgba(71, 85, 105, 0.1)",
                  flexShrink: 0,
                  minWidth: "fit-content",
                }}
              >
                {/* Date */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    whiteSpace: "nowrap",
                  }}
                >
                  <CalendarIcon
                    sx={{
                      fontSize: "0.75rem",
                      color: "#475569",
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      fontWeight: 600,
                      color: "#475569",
                      lineHeight: 1,
                    }}
                  >
                    {dateTime.date}
                  </Typography>
                </Box>

                {/* Time - Ensuring no wrapping */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    whiteSpace: "nowrap",
                  }}
                >
                  <TimeIcon
                    sx={{
                      fontSize: "0.75rem",
                      color: "#475569",
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      fontWeight: 600,
                      color: "#475569",
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                      minWidth: "fit-content",
                    }}
                  >
                    {dateTime.time}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Company Name - Enhanced */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2.5,
                p: 2,
                borderRadius: 3,
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                border: "1px solid rgba(79, 70, 229, 0.1)",
                transform: isHovered ? "translateX(4px)" : "translateX(0)",
                transition: "transform 0.3s ease",
              }}
            >
              <BusinessIcon
                sx={{
                  fontSize: "1.5rem",
                  mr: 1.5,
                  color: "#4f46e5",
                  transform: isHovered ? "rotate(5deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#1e293b",
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}
              >
                {notice.company}
              </Typography>
            </Box>

            {/* Subject - Better positioning */}
            <Box
              sx={{ mb: 2.5, display: "flex", justifyContent: "flex-start" }}
            >
              <Chip
                label={notice.subject}
                variant="filled"
                size="small"
                sx={{
                  background: getSubjectColor(notice.subject).bg,
                  color: getSubjectColor(notice.subject).color,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  height: 30,
                  borderRadius: 2.5,
                  boxShadow: `0 3px 10px ${
                    getSubjectColor(notice.subject).shadow
                  }`,
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                  transition: "transform 0.3s ease",
                  "& .MuiChip-label": {
                    px: 2,
                  },
                }}
              />
            </Box>

            {/* Title - Enhanced */}
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: "#334155",
                lineHeight: 1.6,
                fontSize: { xs: "0.875rem", sm: "1rem" },
                mb: 2,
                p: 1.5,
                borderRadius: 2,
                background: "rgba(241, 245, 249, 0.5)",
                border: "1px solid rgba(148, 163, 184, 0.1)",
              }}
            >
              {truncateTitle(notice.title)}
            </Typography>
          </Box>

          {/* Bottom Section - Enhanced */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              pt: 2,
              borderTop: "1px solid rgba(148, 163, 184, 0.15)",
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 0.75,
                borderRadius: 2,
                background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                border: "1px solid rgba(148, 163, 184, 0.2)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                }}
              >
                Notice #{notice.notification_number}
              </Typography>
            </Box>

            <LaunchIcon
              sx={{
                fontSize: "1.125rem",
                color: "#4f46e5",
                transform: isHovered
                  ? "translate(2px, -2px)"
                  : "translate(0, 0)",
                transition: "transform 0.3s ease",
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Enhanced Responsive Modal Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: isMobile ? 0 : 4,
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
            margin: isMobile ? 0 : 'auto',
            maxHeight: isMobile ? '100vh' : '90vh',
            height: isMobile ? '100vh' : 'auto',
          },
        }}
        sx={{
          '& .MuiDialog-container': {
            alignItems: isMobile ? 'stretch' : 'center',
          }
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: "1px solid rgba(148, 163, 184, 0.15)",
            pb: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3 },
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  mb: { xs: 1.5, sm: 2 },
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  gap: 1
                }}
              >
                <ArticleIcon
                  sx={{
                    mr: { xs: 1, sm: 1.5 },
                    color: "#4f46e5",
                    fontSize: { xs: "1.5rem", sm: "1.75rem" },
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#1e293b",
                    fontSize: { xs: "1.125rem", sm: "1.5rem" },
                    wordBreak: 'break-word',
                    lineHeight: 1.2,
                  }}
                >
                  {notice.company}
                </Typography>
              </Box>

              <Box sx={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: { xs: 1, sm: 1.5 }, 
                mt: { xs: 1, sm: 2 }
              }}>
                <Chip
                  label={notice.type}
                  size="small"
                  sx={{
                    background: getTypeColor(notice.type).bg,
                    color: getTypeColor(notice.type).color,
                    fontWeight: 700,
                    height: { xs: 28, sm: 32 },
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    boxShadow: `0 4px 12px ${getTypeColor(notice.type).shadow}`,
                  }}
                />
                <Chip
                  label={notice.subject}
                  size="small"
                  sx={{
                    background: getSubjectColor(notice.subject).bg,
                    color: getSubjectColor(notice.subject).color,
                    fontWeight: 600,
                    height: { xs: 28, sm: 32 },
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    boxShadow: `0 4px 12px ${
                      getSubjectColor(notice.subject).shadow
                    }`,
                    '& .MuiChip-label': {
                      px: { xs: 1.5, sm: 2 },
                    }
                  }}
                />
              </Box>
            </Box>

            <IconButton
              onClick={() => setDialogOpen(false)}
              sx={{
                background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                flexShrink: 0,
                "&:hover": {
                  background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
                  transform: "rotate(90deg)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <CloseIcon 
                sx={{ 
                  color: "#64748b",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" }
                }} 
              />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent 
          sx={{ 
            pt: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3 },
            pb: { xs: 2, sm: 3 },
            flex: 1,
            overflow: 'auto',
          }}
        >
          <Box sx={{ mb: 3 }}>
            {/* Enhanced responsive date/time display in modal */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, sm: 3 },
                mb: { xs: 3, sm: 4 },
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                border: "1px solid rgba(148, 163, 184, 0.2)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  boxShadow: "0 4px 15px rgba(79, 70, 229, 0.3)",
                  minWidth: "fit-content",
                }}
              >
                <CalendarIcon sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    whiteSpace: "nowrap",
                  }}
                >
                  {dateTime.date}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  boxShadow: "0 4px 15px rgba(5, 150, 105, 0.3)",
                  minWidth: "fit-content",
                }}
              >
                <TimeIcon sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    whiteSpace: "nowrap",
                  }}
                >
                  {dateTime.time}
                </Typography>
              </Box>

              {!isMobile && (
                <>
                  <Box
                    sx={{
                      mx: 1,
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#cbd5e1",
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      background: "rgba(148, 163, 184, 0.1)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Notice #{notice.notification_number}
                  </Typography>
                </>
              )}
            </Box>

            {/* Mobile Notice Number */}
            {isMobile && (
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontWeight: 600,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    background: "rgba(148, 163, 184, 0.1)",
                    display: "inline-block",
                  }}
                >
                  Notice #{notice.notification_number}
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: { xs: 3, sm: 4 } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: { xs: 1.5, sm: 2 },
                  color: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: { xs: 16, sm: 20 },
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    flexShrink: 0,
                  }}
                />
                Title
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.7,
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  color: "#334155",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  wordBreak: "break-word",
                }}
              >
                {notice.title.length > 100 ? notice.title.slice(0, 100) + "..." : notice.title}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: { xs: 1.5, sm: 2 },
                  color: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: { xs: 16, sm: 20 },
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    flexShrink: 0,
                  }}
                />
                Description
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.7,
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  whiteSpace: "pre-wrap",
                  color: "#334155",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  wordBreak: "break-word",
                  maxHeight: { xs: "300px", sm: "none" },
                  overflowY: { xs: "auto", sm: "visible" },
                }}
              >
                {notice.description}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: { xs: 2, sm: 3 },
            borderTop: "1px solid rgba(148, 163, 184, 0.15)",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            position: isMobile ? 'sticky' : 'static',
            bottom: 0,
            zIndex: 1,
          }}
        >
          <Button
            onClick={() => setDialogOpen(false)}
            variant="contained"
            fullWidth={isMobile}
            sx={{
              px: { xs: 4, sm: 6 },
              py: { xs: 1.5, sm: 2 },
              borderRadius: 3,
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              boxShadow: "0 8px 25px rgba(79, 70, 229, 0.3)",
              textTransform: "none",
              fontWeight: 700,
              fontSize: { xs: "0.875rem", sm: "1rem" },
              "&:hover": {
                background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)",
                boxShadow: "0 12px 35px rgba(79, 70, 229, 0.4)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NoticeCard;
