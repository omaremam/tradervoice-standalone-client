import * as React from 'react';
import {Button, Stack, Tooltip} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {ExportToCsv} from 'export-to-csv';
import PropTypes from 'prop-types';

const Download = ({weights, ...props}) => {
  const handleDownloadCsv = () => {
    const count = weights.length;

    const headers = ['Timestamp (UTC)'];
    const pointsByTimestamp = new Map();
    for (let i = 0; i < count; i++) {
      const weightsItem = weights[i];

      headers.push(`Prevalence: ${weightsItem.text}`, `Sentiment: ${weightsItem.text}`);

      weightsItem.points.forEach(p => {
        const timestamp = p.tstamp.substring(0, 19).replace('T', ' '); // Remove sub-second precision (and TZ), then replace 'T' with space.
        let values = pointsByTimestamp.get(timestamp);
        if (values === undefined) {
          values = new Array(count * 2).fill(null);
          pointsByTimestamp.set(timestamp, values);
        }

        values[i * 2] = p.prevalence;
        values[i * 2 + 1] = p.sentiment;
      });
    }

    const data = [];
    pointsByTimestamp.forEach((v, k) => {
      data.push([k, ...v]);
    });
    data.sort((a, b) => a[0].localeCompare(b[0]));

    new ExportToCsv({
      filename: 'tradervoice',
      showLabels: true,
      headers: headers.map(h => `"${h.replaceAll('"', '""')}"`) // Headers are not escaped properly in export-to-csv@0.2.1
    }).generateCsv(data);
  }

  return (
    <Stack
      alignItems="center"
      direction="row"
      spacing={1}
      {...props}
    >
      <Button
        onClick={handleDownloadCsv}
        startIcon={<DownloadIcon/>}
        variant="outlined"
      >
        Download CSV
      </Button>
      <Tooltip arrow title={`Download the current prevalence and sentiment series as a CSV file for local processing/analysis. The CSV file will consist of ${weights.length} series of prevalence and sentiment values.`}>
        <HelpOutlineIcon fontSize="small"/>
      </Tooltip>
    </Stack>
  );
}

Download.propTypes = {
  weights: PropTypes
    .arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        points: PropTypes
          .arrayOf(
            PropTypes.shape({
              tstamp: PropTypes.string.isRequired,
              prevalence: PropTypes.number.isRequired,
              sentiment: PropTypes.number.isRequired
            })
          ).isRequired
      })
    ).isRequired
}

export default Download;
