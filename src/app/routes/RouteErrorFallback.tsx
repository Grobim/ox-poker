import { FallbackProps } from "react-error-boundary";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

function RouteErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h4">RouteErrorFallback</Typography>
        <Typography>The route didn't load correctly</Typography>
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={resetErrorBoundary}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}

export default RouteErrorFallback;
