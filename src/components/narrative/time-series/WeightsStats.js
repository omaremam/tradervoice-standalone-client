import * as React from 'react';
import {Typography} from '@mui/material';
import PropTypes from 'prop-types';

const WeightsStats = ({stats, ...props}) => {
  const NUMBER_FORMAT = new Intl.NumberFormat('en-US');
  const INCREMENT_RATE_PER_SEC = 0.182;
  const tstamp = new Date(stats.tstamp);
  const startEpocMs = tstamp.getTime();

  const interpolateProjection = () => {
    const elapsedMs = Date.now() - startEpocMs;
    const increment = Math.floor(INCREMENT_RATE_PER_SEC * (elapsedMs / 1_000));

    return stats.significant + increment;
  }

  const [updates, setUpdates] = React.useState(0);
  const [projection, setProjection] = React.useState(interpolateProjection());

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setUpdates(updates + 1);
      setProjection(interpolateProjection());
    }, Math.floor(Math.random() * 10_000) + 500);

    return () => clearTimeout(timeoutId);
  }, [updates]);

  return (
    <Typography paragraph variant="body2" {...props}>
      Based on <strong>{NUMBER_FORMAT.format(projection)}</strong> high-quality news articles. Latest processing: {tstamp.toLocaleString()}.
    </Typography>
  );
}

WeightsStats.propTypes = {
  stats: PropTypes
    .shape({
      tstamp: PropTypes.string.isRequired,
      significant: PropTypes.number.isRequired
    })
    .isRequired
};


export default WeightsStats;
