import React, { useState } from 'react'
import { 
  TextField, 
  Button, 
  CardContent, 
  CircularProgress, 
  Typography, 
  Grid,
  InputAdornment,
  Box,
  Container,
  Paper,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { 
  Search as SearchIcon, 
  SearchOff as SearchOffIcon,
  FindInPage as FindInPageIcon 
} from '@mui/icons-material'
import NoticeCard from '../components/NoticeCard'
import client from '../api/client'

const SearchPage: React.FC = () => {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = async () => {
    if (!q.trim()) return
    
    setLoading(true)
    setError(null)
    setHasSearched(true)
    
    try {
      const res = await client.get('/api/notices/search', { 
        params: { q: q.trim(), page: 1, limit: 20 } 
      })
      setResults(res.data.data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

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
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: { xs: 2, md: 3 },
              p: { xs: 1.5, md: 2 },
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <FindInPageIcon
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
            Search Notices
          </Typography>
          
          <Typography
            variant={isSmall ? "body1" : "h6"}
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              maxWidth: { xs: "100%", md: 600 },
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Find specific notices using keywords and stay updated with the latest announcements
          </Typography>
        </Box>

        {/* Search Section */}
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
              maxWidth: { xs: "100%", sm: 700, md: 800 },
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: { xs: 2, md: 3 },
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 2, sm: 2 },
                  alignItems: { xs: "stretch", sm: "center" },
                }}
              >
                <TextField
                  fullWidth
                  label="Search notices..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
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
                />
                <Button 
                  variant="contained" 
                  onClick={handleSearch}
                  disabled={!q.trim() || loading}
                  sx={{
                    px: { xs: 4, sm: 6 },
                    py: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "1rem", md: "1.125rem" },
                    fontWeight: 600,
                    borderRadius: 2,
                    minWidth: { xs: "100%", sm: 120 },
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                    textTransform: "none",
                    "&:hover": {
                      background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                      boxShadow: "0 12px 35px rgba(102, 126, 234, 0.6)",
                      transform: "translateY(-2px)",
                    },
                    "&:disabled": {
                      background: "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)",
                      boxShadow: "none",
                      transform: "none",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                </Button>
              </Box>
            </CardContent>
          </Paper>
        </Box>

        {/* Loading State */}
        {loading && (
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
                  mb: 2
                }} 
              />
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                }}
              >
                Searching...
              </Typography>
            </Box>
          </Box>
        )}

        {/* Error State */}
        {error && (
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
              <Typography>⚠️ {error}</Typography>
            </Alert>
          </Box>
        )}

        {/* Results */}
        {!loading && hasSearched && (
          <Box>
            {/* Results Header */}
            <Box
              sx={{
                textAlign: "center",
                mb: { xs: 3, md: 4 },
              }}
            >
              <Typography
                variant={isSmall ? "h5" : "h4"}
                sx={{
                  fontWeight: 600,
                  color: "white",
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                }}
              >
                {results.length > 0 ? `Found ${results.length} Results` : 'No Results Found'}
              </Typography>
            </Box>

            {/* Results Grid */}
            {results.length > 0 ? (
              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                {results.map((notice) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={notice.notification_number}>
                    <Box
                      sx={{
                        height: "100%",
                        "& > *": { height: "100%" },
                      }}
                    >
                      <NoticeCard notice={notice} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              /* Empty Results */
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
                  <SearchOffIcon
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
                    No matches found
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.disabled",
                      lineHeight: 1.6,
                    }}
                  >
                    Try different keywords or check your spelling
                  </Typography>
                </Paper>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default SearchPage
