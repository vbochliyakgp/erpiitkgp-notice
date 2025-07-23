import React, { useEffect, useState } from "react";
import { useNotices } from "../context/NoticeContext";
import {
  CircularProgress,
  Button,
  Typography,
  Grid,
  Box,
  Container,
  Paper,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  IconButton,
  Divider,
} from "@mui/material";
import {
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Inbox as InboxIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import NoticeCard from "../components/NoticeCard";
import client from "../api/client";

const NoticesPage: React.FC = () => {
  const { notices, loading, error, fetchNotices } = useNotices();
  const [page, setPage] = useState(1);

  // Filter states
  const [type, setType] = useState("");
  const [subject, setSubject] = useState("");
  const [company, setCompany] = useState("");
  const [filteredNotices, setFilteredNotices] = useState<any[]>([]);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [FilterOptions, setFilterOptions] = useState({
    types: [],
    subjects: [],
    companies: [],
  });

  const fetchFilterOptions = async () => {
    const response = await client.get("/api/distinct-notice-types");
    setFilterOptions({
      types: response.data.types || [],
      subjects: response.data.subjects || [],
      companies: response.data.companies || [],
    });
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const prev = () => {
    const p = Math.max(1, page - 1);
    setPage(p);
    fetchNotices({ page: p });
  };

  const next = () => {
    const p = page + 1;
    setPage(p);
    fetchNotices({ page: p });
  };

  const applyFilters = async () => {
    const filters: any = { page: 1, limit: 50 };
    if (type) filters.type = type;
    if (subject) filters.subject = subject;
    if (company) filters.company = company;

    setFilterLoading(true);
    setFilterError(null);
    setHasAppliedFilters(true);

    try {
      const res = await client.get("/api/notices", { params: filters });
      setFilteredNotices(res.data.data);
    } catch (e: any) {
      setFilterError(
        e.response?.data?.error || "Failed to fetch filtered notices"
      );
      setFilteredNotices([]);
    } finally {
      setFilterLoading(false);
    }
  };

  const clearFilters = () => {
    setType("");
    setSubject("");
    setCompany("");
    setFilteredNotices([]);
    setHasAppliedFilters(false);
    setFilterError(null);
    setShowFilters(false);
    // Reset to page 1 of regular notices
    setPage(1);
    fetchNotices({ page: 1 });
  };

  const hasActiveFilters = type || subject || company;

  // Decide which notices to show
  const displayNotices = hasAppliedFilters ? filteredNotices : notices;
  const displayLoading = hasAppliedFilters ? filterLoading : loading;
  const displayError = hasAppliedFilters ? filterError : error;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: {
          xs: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          md: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: {
            xs: "rgba(255, 255, 255, 0.1)",
            md: "rgba(255, 255, 255, 0.05)",
          },
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 1,
          py: { xs: 3, sm: 6, md: 8 },
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 4, sm: 6, md: 6 },
          }}
        >
          {/* Stats Chip */}
          {!displayLoading && !displayError && displayNotices.length > 0 && (
            <Chip
              label={
                hasAppliedFilters
                  ? `${displayNotices.length} filtered results`
                  : `${displayNotices.length} notices on page ${page}`
              }
              sx={{
                mt: 2,
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            />
          )}
        </Box>

        {/* Filter Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: { xs: 4, md: 6 },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: 900, md: 1000 },
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: { xs: 2, md: 3 },
              border: "1px solid rgba(255, 255, 255, 0.2)",
              overflow: "hidden",
            }}
          >
            {/* Filter Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: { xs: 2, sm: 3 },
                cursor: "pointer",
              }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <FilterIcon sx={{ color: "#667eea" }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#667eea",
                  }}
                >
                  Filter Notices
                </Typography>
                {hasActiveFilters && (
                  <Chip
                    label={`${
                      Object.values({ type, subject, company }).filter(Boolean)
                        .length
                    } active`}
                    size="small"
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
              <IconButton
                sx={{
                  color: "#667eea",
                  transform: showFilters ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Box>

            <Collapse in={showFilters}>
              <Divider />
              <Box sx={{ p: { xs: 3, sm: 4 } }}>
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  {/* Type Filter */}
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <FormControl fullWidth>
                      <InputLabel>Notice Type</InputLabel>
                      <Select
                        value={type}
                        label="Notice Type"
                        onChange={(e) => setType(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": {
                              borderColor: "#667eea",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#667eea",
                            },
                          },
                        }}
                      >
                        <MenuItem value="">All Types</MenuItem>
                        {FilterOptions.types.map((type) => (
                          <MenuItem key={type[0]} value={type[0]}>
                            {type[0]} - {type[1]}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Subject Filter */}
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <FormControl fullWidth>
                      <InputLabel>Subject</InputLabel>
                      <Select
                        value={subject}
                        label="Subject"
                        onChange={(e) => setSubject(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": {
                              borderColor: "#667eea",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#667eea",
                            },
                          },
                        }}
                      >
                        <MenuItem value="">All Subjects</MenuItem>
                        {FilterOptions.subjects.map((sub) => (
                          <MenuItem key={sub[0]} value={sub[0]}>
                            {sub[0]} - {sub[1]}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Company Filter */}
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <FormControl fullWidth>
                      <InputLabel>Company</InputLabel>
                      <Select
                        value={company}
                        label="Company"
                        onChange={(e) => setCompany(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": {
                              borderColor: "#667eea",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#667eea",
                            },
                          },
                        }}
                      >
                        <MenuItem value="">All Companies</MenuItem>
                        {FilterOptions.companies.map((comp) => (
                          <MenuItem key={comp[0]} value={comp[0]}>
                            {comp[0]} - {comp[1]}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 2, sm: 3 },
                    mt: { xs: 3, sm: 4 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={applyFilters}
                    disabled={!hasActiveFilters}
                    startIcon={<SearchIcon />}
                    sx={{
                      px: { xs: 4, sm: 6 },
                      py: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      background: hasActiveFilters
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)",
                      boxShadow: hasActiveFilters
                        ? "0 8px 25px rgba(102, 126, 234, 0.4)"
                        : "none",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        background: hasActiveFilters
                          ? "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)"
                          : "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)",
                        boxShadow: hasActiveFilters
                          ? "0 12px 35px rgba(102, 126, 234, 0.6)"
                          : "none",
                        transform: hasActiveFilters
                          ? "translateY(-2px)"
                          : "none",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Apply Filters
                  </Button>

                  {hasActiveFilters && (
                    <Button
                      variant="outlined"
                      onClick={clearFilters}
                      startIcon={<ClearIcon />}
                      sx={{
                        px: { xs: 4, sm: 6 },
                        py: { xs: 1.5, sm: 2 },
                        borderRadius: 2,
                        borderColor: "#667eea",
                        color: "#667eea",
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": {
                          borderColor: "#5a67d8",
                          color: "#5a67d8",
                          background: "rgba(102, 126, 234, 0.05)",
                        },
                      }}
                    >
                      Clear All
                    </Button>
                  )}
                </Box>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <Box sx={{ mt: 3 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: "#667eea",
                      }}
                    >
                      Active Filters:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {type && (
                        <Chip
                          label={`Type: ${type}`}
                          color="primary"
                          variant="outlined"
                          onDelete={() => setType("")}
                          sx={{ borderRadius: 2 }}
                        />
                      )}
                      {subject && (
                        <Chip
                          label={`Subject: ${subject}`}
                          color="secondary"
                          variant="outlined"
                          onDelete={() => setSubject("")}
                          sx={{ borderRadius: 2 }}
                        />
                      )}
                      {company && (
                        <Chip
                          label={`Company: ${company}`}
                          color="success"
                          variant="outlined"
                          onDelete={() => setCompany("")}
                          sx={{ borderRadius: 2 }}
                        />
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            </Collapse>
          </Paper>
        </Box>

        {/* Loading State */}
        {displayLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress
                size={60}
                sx={{
                  color: "white",
                  mb: 2,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                }}
              >
                {hasAppliedFilters
                  ? "Filtering notices..."
                  : "Loading notices..."}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Error State */}
        {displayError && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <Alert
              severity="error"
              sx={{
                borderRadius: 2,
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                maxWidth: 600,
                width: "100%",
              }}
            >
              <Typography>⚠️ {displayError}</Typography>
            </Alert>
          </Box>
        )}

        {/* Notice Cards */}
        {!displayLoading && !displayError && (
          <Box>
            {displayNotices.length > 0 ? (
              <Grid 
                container 
                spacing={{ xs: 2, sm: 3, md: 4 }}
                sx={{
                  // Ensure consistent card heights and proper alignment
                  '& .MuiGrid-item': {
                    display: 'flex',
                    flexDirection: 'column',
                  }
                }}
              >
                {displayNotices.map((notice) => (
                  <Grid
                    size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}
                    key={notice.notification_number}
                    sx={{
                      // Ensure full height for consistent card layout
                      minHeight: { xs: 'auto', sm: '350px', md: '400px' },
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        display: 'flex',
                        flexDirection: 'column',
                        "& > *": { 
                          height: "100%",
                          display: 'flex',
                          flexDirection: 'column',
                        },
                      }}
                    >
                      <NoticeCard notice={notice} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              /* Empty State */
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    maxWidth: 500,
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    borderRadius: { xs: 2, md: 3 },
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    textAlign: "center",
                    py: { xs: 6, md: 8 },
                    px: { xs: 3, md: 4 },
                  }}
                >
                  <InboxIcon
                    sx={{
                      fontSize: { xs: "3rem", md: "4rem" },
                      color: "text.secondary",
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "text.secondary",
                      mb: 1,
                      fontWeight: 600,
                    }}
                  >
                    {hasAppliedFilters
                      ? "No notices match your filters"
                      : "No notices found"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.disabled",
                      lineHeight: 1.6,
                      mb: hasAppliedFilters ? 2 : 0,
                    }}
                  >
                    {hasAppliedFilters
                      ? "Try adjusting your filters or clear them to see all notices"
                      : "Check back later for new updates"}
                  </Typography>
                  {hasAppliedFilters && (
                    <Button
                      variant="outlined"
                      onClick={clearFilters}
                      startIcon={<ClearIcon />}
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        textTransform: "none",
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </Paper>
              </Box>
            )}

            {/* Pagination - Only show for regular notices, not filtered */}
            {displayNotices.length > 0 && !hasAppliedFilters && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: { xs: 4, md: 6 },
                  gap: { xs: 2, sm: 3 },
                }}
              >
                <Button
                  variant="contained"
                  onClick={prev}
                  disabled={page === 1}
                  startIcon={<NavigateBeforeIcon />}
                  sx={{
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    background:
                      page === 1
                        ? "rgba(255, 255, 255, 0.3)"
                        : "rgba(255, 255, 255, 0.9)",
                    color: page === 1 ? "rgba(255, 255, 255, 0.7)" : "#667eea",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow:
                      page === 1 ? "none" : "0 4px 15px rgba(0,0,0,0.1)",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      background:
                        page === 1
                          ? "rgba(255, 255, 255, 0.3)"
                          : "rgba(255, 255, 255, 1)",
                      transform: page === 1 ? "none" : "translateY(-2px)",
                    },
                  }}
                >
                  Previous
                </Button>

                <Paper
                  elevation={0}
                  sx={{
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1, sm: 1.5 },
                    borderRadius: 2,
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: "#667eea",
                    }}
                  >
                    Page {page}
                  </Typography>
                </Paper>

                <Button
                  variant="contained"
                  onClick={next}
                  endIcon={<NavigateNextIcon />}
                  sx={{
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    background: "rgba(255, 255, 255, 0.9)",
                    color: "#667eea",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      background: "rgba(255, 255, 255, 1)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Next
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default NoticesPage;
