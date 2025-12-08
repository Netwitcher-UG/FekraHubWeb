import React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'

const customScrollbarStyles = {
  '& ::-webkit-scrollbar': {
    height: 8
  },
  '& ::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: 10,
    '&:hover': {
      backgroundColor: '#555'
    }
  }
}

const EmptyStateOverlay = () => {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '400px',
        py: 8,
        px: 4,
        position: 'relative'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
          maxWidth: 480,
          textAlign: 'center'
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: theme =>
              `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.info.main}15)`,
            mb: 4,
            boxShadow: theme =>
              `0 2px 10px ${theme.palette.primary.main}15, inset 0 1px 2px ${theme.palette.common.white}20`,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              border: theme => `2px solid ${theme.palette.primary.main}15`,
              opacity: 0.3
            }
          }}
        >
          <Icon fontSize={50} icon='mdi:database-search-outline' style={{ color: 'var(--mui-palette-primary-main)' }} />
        </Box>
        <Typography
          variant='h5'
          sx={{
            fontWeight: 700,
            mb: 1.5,
            lineHeight: 1.2,
            background: theme =>
              `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.info.main} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {t('No Data Available')}
        </Typography>
        <Typography
          variant='body1'
          sx={{
            color: 'text.secondary',
            maxWidth: 360,
            lineHeight: 1.7,
            fontSize: '1rem',
            fontWeight: 400
          }}
        >
          {t('There are no records to display at this time')}
        </Typography>
      </Box>
    </Box>
  )
}

const SkeletonDataGrid = ({ columns, sx }) => {
  const skeletonRows = Array.from({ length: 10 }, (_, index) => ({ id: index }))

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        '& ::-webkit-scrollbar': {
          height: 8
        },
        '& ::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: 10,
          '&:hover': {
            backgroundColor: '#555'
          }
        },
        ...sx
      }}
    >
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={column.field || index}
                  sx={{
                    background: theme =>
                      theme.palette.mode === 'light'
                        ? 'linear-gradient(135deg, #03bef7 0%, #00a8d4 50%, #0095c7 100%)'
                        : 'linear-gradient(135deg, #4A5072 0%, #3d425f 50%, #2f3349 100%)',
                    borderRight: theme =>
                      `1px solid ${theme.palette.mode === 'light' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
                    borderBottom: theme => `2px solid ${theme.palette.primary.main}`,
                    padding: '16px',
                    height: '62px',
                    boxShadow: theme => theme.shadows[2],
                    '&:last-child': {
                      borderRight: 'none'
                    }
                  }}
                >
                  <Skeleton
                    variant='text'
                    width={column.width || 150}
                    height={20}
                    sx={{
                      bgcolor: theme =>
                        theme.palette.mode === 'light' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)'
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {skeletonRows.map(row => (
              <TableRow key={row.id} sx={{ height: '62px' }}>
                {columns.map((column, index) => (
                  <TableCell
                    key={column.field || index}
                    sx={{
                      borderRight: '1px solid #ccc',
                      borderBottom: '1px solid #f0f0f0',
                      padding: '16px',
                      '&:last-child': {
                        borderRight: 'none'
                      }
                    }}
                  >
                    <Skeleton variant='text' width={column.width || 150} height={20} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

const CustomDataGrid = ({
  rows,
  columns,
  handleRowClick,
  sx,
  loading,
  pagination = false,
  totalPages,
  currentPage,
  setCurrentPage
}) => {
  const { t } = useTranslation()

  const handlePageChange = (event, value) => {
    if (setCurrentPage) {
      setCurrentPage(value)
    }
  }

  if (loading) {
    return (
      <Box sx={{ height: '100%', ...sx }}>
        <SkeletonDataGrid columns={columns} sx={sx} />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', ...sx }}>
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <DataGrid
          columns={columns}
          rowHeight={62}
          rows={rows || []}
          className='custom-data-grid'
          onRowClick={handleRowClick}
          slots={{
            noRowsOverlay: EmptyStateOverlay
          }}
          localeText={{
            columnMenuSortAsc: t('sortAscending'),
            columnMenuSortDesc: t('sortDescending'),
            columnMenuFilter: t('filter'),
            columnMenuHideColumn: t('hideColumn'),
            columnMenuManageColumns: t('manageColumns')
          }}
          sx={{
            height: '100%',
            overflowY: 'auto',
            overflowX: 'auto',
            ...customScrollbarStyles,
            fontSize: '1rem',
            '& .MuiDataGrid-columnHeaderTitle': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: '0.5px'
            },
            '& .MuiDataGrid-columnHeaders': {
              background: theme =>
                theme.palette.mode === 'light'
                  ? 'linear-gradient(135deg, #03bef7 0%, #00a8d4 50%, #0095c7 100%)'
                  : 'linear-gradient(135deg, #4A5072 0%, #3d425f 50%, #2f3349 100%)',
              boxShadow: theme => theme.shadows[2],
              borderBottom: theme => `2px solid ${theme.palette.primary.main}`,
              overflow: 'visible',
              '& .MuiDataGrid-columnHeader': {
                color: theme => (theme.palette.mode === 'light' ? '#1a237e' : theme.palette.common.white),
                fontWeight: 600,
                transition: 'background-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease',
                position: 'relative !important',
                paddingRight: '0px !important',
                overflow: 'visible !important',
                display: 'flex !important',
                alignItems: 'center',
                '& > *': {
                  overflow: 'visible !important'
                },
                '& .MuiDataGrid-columnHeaderTitleContainer': {
                  overflow: 'visible',
                  minWidth: 0,
                  flex: '1 1 auto',
                  maxWidth: 'calc(100% - 24px)'
                },
                '&:hover': {
                  backgroundColor: theme =>
                    theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: theme => theme.shadows[4],
                  '& .MuiDataGrid-columnSeparator': {
                    opacity: '1 !important',
                    width: '24px !important',
                    minWidth: '24px !important',
                    maxWidth: '24px !important',
                    backgroundColor: theme =>
                      theme.palette.mode === 'light' ? 'rgba(26, 35, 126, 0.1)' : 'rgba(255, 255, 255, 0.15)',
                    '&::before': {
                      backgroundColor: theme =>
                        theme.palette.mode === 'light' ? 'rgba(26, 35, 126, 0.8)' : 'rgba(255, 255, 255, 0.7)',
                      width: '5px !important'
                    }
                  }
                },
                '&:not(.MuiDataGrid-columnHeaderCheckbox):hover .MuiDataGrid-columnSeparator': {
                  opacity: '1 !important',
                  width: '24px !important',
                  minWidth: '24px !important',
                  maxWidth: '24px !important',
                  visibility: 'visible !important',
                  display: 'flex !important',
                  backgroundColor: theme =>
                    theme.palette.mode === 'light' ? 'rgba(26, 35, 126, 0.1)' : 'rgba(255, 255, 255, 0.15)',
                  '&::before': {
                    backgroundColor: theme =>
                      theme.palette.mode === 'light' ? 'rgba(26, 35, 126, 0.8)' : 'rgba(255, 255, 255, 0.7)',
                    width: '5px !important',
                    visibility: 'visible !important'
                  },
                  '&::after': {
                    visibility: 'visible !important'
                  }
                },
                '&:focus': {
                  backgroundColor: theme =>
                    theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.15)'
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  color: theme => (theme.palette.mode === 'light' ? '#1a237e' : theme.palette.common.white),
                  fontWeight: 600,
                  textShadow: theme => (theme.palette.mode === 'light' ? 'none' : 'none'),
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flexShrink: 1,
                  minWidth: 0
                },
                '& .MuiDataGrid-columnHeaderTitleContainer': {
                  overflow: 'visible',
                  minWidth: 0,
                  flex: 1
                },
                '& .MuiDataGrid-iconButtonContainer': {
                  '& .MuiIconButton-root': {
                    color: theme => (theme.palette.mode === 'light' ? '#1a237e' : theme.palette.common.white),
                    transition: 'background-color 0.15s ease',
                    '&:hover': {
                      backgroundColor: theme =>
                        theme.palette.mode === 'light' ? 'rgba(26, 35, 126, 0.1)' : 'rgba(255, 255, 255, 0.2)'
                    }
                  }
                },
                '& .MuiDataGrid-sortIcon': {
                  color: theme => (theme.palette.mode === 'light' ? '#1a237e' : theme.palette.common.white)
                }
              },
              '& .MuiDataGrid-columnHeaderCheckbox': {
                color: theme => (theme.palette.mode === 'light' ? '#1a237e' : theme.palette.common.white)
              }
            },
            '& .MuiDataGrid-virtualScroller': {
              overflowY: 'auto'
            },
            '& .MuiDataGrid-row:hover': {
              cursor: handleRowClick ? 'pointer' : 'default'
            },
            '& .MuiDataGrid-columnSeparator': {
              width: '18px !important',
              minWidth: '18px !important',
              maxWidth: '18px !important',
              cursor: 'col-resize !important',
              transition:
                'background-color 0.2s ease, opacity 0.2s ease, width 0.2s ease, min-width 0.2s ease, max-width 0.2s ease',
              position: 'relative',
              opacity: 0.7,
              backgroundColor: 'transparent',
              zIndex: 100,
              pointerEvents: 'auto',
              display: 'flex !important',
              visibility: 'visible !important',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              '&::after': {
                content: '""',
                position: 'absolute',
                left: '-12px',
                right: '-12px',
                top: 0,
                bottom: 0,
                cursor: 'col-resize',
                zIndex: 101,
                pointerEvents: 'auto'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                left: '50%',
                top: '20%',
                bottom: '20%',
                width: '2px',
                transform: 'translateX(-50%)',
                backgroundColor: theme =>
                  theme.palette.mode === 'light' ? 'rgba(26, 35, 126, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                transition: 'background-color 0.2s ease, width 0.2s ease',
                borderRadius: '1px',
                zIndex: 102
              },
              '&:hover': {
                opacity: '1 !important',
                width: '24px !important',
                minWidth: '24px !important',
                maxWidth: '24px !important',
                backgroundColor: theme =>
                  theme.palette.mode === 'light' ? 'rgba(26, 35, 126, 0.1)' : 'rgba(255, 255, 255, 0.15)',
                '&::before': {
                  backgroundColor: theme =>
                    theme.palette.mode === 'light' ? 'rgba(26, 35, 126, 0.8)' : 'rgba(255, 255, 255, 0.7)',
                  width: '5px !important'
                }
              },
              '&:active': {
                opacity: '1 !important',
                backgroundColor: theme =>
                  theme.palette.mode === 'light' ? 'rgba(26, 35, 126, 0.15)' : 'rgba(255, 255, 255, 0.2)',
                '&::before': {
                  backgroundColor: theme => (theme.palette.mode === 'light' ? '#1a237e' : 'rgba(255, 255, 255, 0.9)'),
                  width: '3px !important'
                }
              }
            },
            '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
              transition: 'background-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease',
              '&.MuiDataGrid-columnHeader--resizing, &.MuiDataGrid-cell--resizing': {
                transition: 'none !important'
              },
              display: 'flex',
              alignItems: 'center',
              '&[style*="width"]': {
                transition: 'background-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease !important'
              }
            },
            '& .MuiDataGrid-columnHeader--resizing, & .MuiDataGrid-cell--resizing': {
              '&, & *': {
                transition: 'none !important'
              }
            }
          }}
          hideFooter={true}
          disableRowSelectionOnClick
          pagination={true}
        />
      </Box>
      {pagination && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, flexShrink: 0 }}>
          <Pagination count={totalPages || 1} page={currentPage || 1} onChange={handlePageChange} color='primary' />
        </Box>
      )}
    </Box>
  )
}

export default CustomDataGrid
