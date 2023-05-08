import * as React from 'react';
import {
  Paper,
  IconButton,
  CircularProgress,
  Tooltip,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const SearchEntry = ({search, onEdit, onDelete, ...props}) => {
  const icon = React.useMemo(() => {
    switch (search.state) {
      case 'loading': return <CircularProgress size={35} sx={{color: search.color}}/>;
      case 'error':
        return (
          <Tooltip arrow title={search.data}>
            <ErrorIcon fontSize="large" color="error"/>
          </Tooltip>
        );
      case 'editing': return <EditIcon fontSize="large" sx={{color: search.color}}/>;
      default: return <ShowChartIcon fontSize="large" sx={{color: search.color}}/>;
    }
  }, [search]);

  return (
    <Paper
      {...props}
      sx={{
        ...props.sx,
        display: 'flex',
        alignItems: 'center',
        minWidth: 'fit-content',
        p: 1
      }}
    >
      {icon}
      <Typography
        mx={2}
        color="text.secondary"
      >
        {search.text}
      </Typography>
      <IconButton
        aria-label="edit"
        size="small"
        sx={{color: 'text.secondary'}}
        onClick={() => onEdit()}
        disabled={search.state === 'editing'}
      >
        <EditIcon fontSize="inherit"/>
      </IconButton>
      <IconButton aria-label="delete" size="small" sx={{color: 'text.secondary'}} onClick={() => onDelete()}>
        <DeleteIcon fontSize="inherit"/>
      </IconButton>
    </Paper>
  );
}

export default SearchEntry;
