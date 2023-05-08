import {Paper, Stack, Typography} from '@mui/material';

const Section = props => (
  <Paper
    component="article"
    sx={{
      backgroundColor: theme => theme.palette.action.hover,
      flex: '1 1 50%',
      hyphens: 'auto',
      p: 2,
      pb: 0
  }}>
    {props.children}
  </Paper>
);

export default function Intro() {
  return (
    <Stack
      component="aside"
      direction={{'xs': 'column', 'sm': 'row'}}
      justifyContent="space-between"
      alignItems="stretch"
      spacing={2}
    >
      <Section>
        <Typography textAlign="justify" variant="body1" paragraph={true}>
          Tradervoice lets you <strong>search and discover news trends</strong> and relevant articles.
        </Typography>

        <Typography textAlign="justify" variant="body1" paragraph={true}>
          Your searches are based on thousands of news sources from around the world.
        </Typography>

        <Typography textAlign="justify" variant="body1" paragraph={true}>
          We update our data every two hours to ensure that you receive the most current results.
        </Typography>
      </Section>

      <Section>
        <Typography textAlign="justify" variant="body1" paragraph={true}>
          By overlaying different ticker symbols, you can use Tradervoice to explore the relationship between your search and the financial markets and economy.
        </Typography>

        <Typography textAlign="justify" variant="body1" paragraph={true}>
          You can download the results of your customized searches for further analysis.
        </Typography>
      </Section>
    </Stack>
  );
}
