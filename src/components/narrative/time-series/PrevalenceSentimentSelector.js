import * as React from 'react';
import PropTypes from 'prop-types';
import {ToggleButton, ToggleButtonGroup} from '@mui/material';

const PrevalenceSentimentSelector = ({sentimentSelected, onChange}) => {
  const handleChange = (_, newValue) => {
    if (newValue !== null) {
      onChange(newValue === 'sentiment');
    }
  }

  return (
    <ToggleButtonGroup
      color="primary"
      exclusive
      value={sentimentSelected ? 'sentiment' : 'prevalence'}
      onChange={handleChange}
      size="small"
    >
      <ToggleButton value="prevalence">Prevalence</ToggleButton>
      <ToggleButton value="sentiment">Sentiment</ToggleButton>
    </ToggleButtonGroup>
  );
}

PrevalenceSentimentSelector.propTypes = {
  sentimentSelected: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired // (bool) => void
}

export default PrevalenceSentimentSelector;
