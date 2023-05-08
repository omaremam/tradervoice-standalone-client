import * as React from 'react';
import {Container, Link, Typography} from '@mui/material';

export default function Footer() {
  return (
    <Container
      component="footer"
      maxWidth={false}
      sx={{
        backgroundColor: theme => theme.palette.action.hover,
        borderTop: theme => `1px solid ${theme.palette.divider}`,
        mt: 6,
        py: 6
      }}
    >
      <Typography variant="body2" color="text.secondary" textAlign="center" gutterBottom={true}>
        Tradervoice version 3. Free Research Preview.
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Our goal is to provide accurate narratives. Your feedback will help us improve.
        <br/>
        {'Please write us at: '}
        <Link href="mailto:tradervoice@nordicanalytics.dk">
          tradervoice@nordicanalytics.dk
        </Link>
      </Typography>
    </Container>
  );
}
