// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'

const ProfilePictureSkeleton = styled(Skeleton)(({ theme }) => ({
  width: 108,
  height: 108,
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

const UserProfileSkeleton = () => {
  return (
    <Grid container spacing={6}>
      {/* Header Skeleton */}
      <Grid item xs={12}>
        <Card>
          <Skeleton
            variant='rectangular'
            sx={{
              height: { xs: 150, md: 250 }
            }}
          />
          <CardContent
            sx={{
              pt: 0,
              mt: -8,
              display: 'flex',
              alignItems: 'flex-end',
              flexWrap: { xs: 'wrap', md: 'nowrap' },
              justifyContent: { xs: 'center', md: 'flex-start' }
            }}
          >
            <ProfilePictureSkeleton variant='circular' />
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                ml: { xs: 0, md: 6 },
                alignItems: 'flex-end',
                flexWrap: ['wrap', 'nowrap'],
                justifyContent: ['center', 'space-between']
              }}
            >
              <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
                <Skeleton variant='text' width={200} height={40} sx={{ mb: 2.5 }} />
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    justifyContent: ['center', 'flex-start']
                  }}
                >
                  <Skeleton variant='text' width={120} height={24} />
                  <Skeleton variant='text' width={100} height={24} />
                  <Skeleton variant='text' width={150} height={24} />
                </Box>
              </Box>
              <Skeleton variant='circular' width={40} height={40} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Tabs and Content Skeleton */}
      <Grid item xs={12}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Skeleton variant='rounded' width={130} height={38} />
            <Skeleton variant='rounded' width={130} height={38} />
          </Box>
        </Box>

        {/* Content Skeleton */}
        <Card
          sx={{
            background: theme =>
              `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.light}02 100%)`,
            border: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header Section */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant='circular' width={48} height={48} />
              <Box>
                <Skeleton variant='text' width={120} height={28} sx={{ mb: 0.5 }} />
                <Skeleton variant='text' width={150} height={20} />
              </Box>
            </Box>

            <Skeleton variant='rectangular' height={1} sx={{ mb: 3 }} />

            {/* Sections Skeleton */}
            <Grid container spacing={3}>
              {/* Personal Information Section */}
              <Grid item xs={12}>
                <Skeleton variant='text' width={180} height={20} sx={{ mb: 2 }} />
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 1.5,
                        border: theme => `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <Skeleton variant='circular' width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant='text' width={80} height={14} sx={{ mb: 0.5 }} />
                        <Skeleton variant='text' width={120} height={20} />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 1.5,
                        border: theme => `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <Skeleton variant='circular' width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant='text' width={80} height={14} sx={{ mb: 0.5 }} />
                        <Skeleton variant='text' width={100} height={20} />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 1.5,
                        border: theme => `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <Skeleton variant='circular' width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant='text' width={80} height={14} sx={{ mb: 0.5 }} />
                        <Skeleton variant='text' width={80} height={20} />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              {/* Contact Information Section */}
              <Grid item xs={12}>
                <Skeleton variant='rectangular' height={1} sx={{ my: 1.5 }} />
                <Skeleton variant='text' width={180} height={20} sx={{ mb: 2 }} />
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 1.5,
                        border: theme => `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <Skeleton variant='circular' width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant='text' width={60} height={14} sx={{ mb: 0.5 }} />
                        <Skeleton variant='text' width={180} height={20} />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 1.5,
                        border: theme => `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <Skeleton variant='circular' width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant='text' width={100} height={14} sx={{ mb: 0.5 }} />
                        <Skeleton variant='text' width={120} height={20} />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              {/* Professional Information Section */}
              <Grid item xs={12}>
                <Skeleton variant='rectangular' height={1} sx={{ my: 1.5 }} />
                <Skeleton variant='text' width={200} height={20} sx={{ mb: 2 }} />
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 1.5,
                        border: theme => `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <Skeleton variant='circular' width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant='text' width={120} height={14} sx={{ mb: 0.5 }} />
                        <Skeleton variant='text' width={100} height={20} />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              {/* Address Information Section */}
              <Grid item xs={12}>
                <Skeleton variant='rectangular' height={1} sx={{ my: 1.5 }} />
                <Skeleton variant='text' width={180} height={20} sx={{ mb: 2 }} />
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 1.5,
                        border: theme => `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <Skeleton variant='circular' width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant='text' width={60} height={14} sx={{ mb: 0.5 }} />
                        <Skeleton variant='text' width={100} height={20} />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 1.5,
                        border: theme => `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <Skeleton variant='circular' width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant='text' width={100} height={14} sx={{ mb: 0.5 }} />
                        <Skeleton variant='text' width={80} height={20} />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 1.5,
                        border: theme => `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <Skeleton variant='circular' width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant='text' width={80} height={14} sx={{ mb: 0.5 }} />
                        <Skeleton variant='text' width={60} height={20} />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 1.5,
                        border: theme => `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <Skeleton variant='circular' width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant='text' width={40} height={14} sx={{ mb: 0.5 }} />
                        <Skeleton variant='text' width={80} height={20} />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserProfileSkeleton

