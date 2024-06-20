import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";
// import './Results.css';

function Results({ output, conclusion }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom className="title">
        Results
      </Typography>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" component="h3" className="section-title">
            Output
          </Typography>
          <pre className="output-content">{output}</pre>
          {conclusion && (
            <>
              <Typography variant="h6" component="h3" className="section-title">
                Conclusion
              </Typography>
              <pre className="output-content">{conclusion}</pre>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Results;
