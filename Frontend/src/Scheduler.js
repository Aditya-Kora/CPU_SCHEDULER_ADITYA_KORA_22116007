import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  Paper,
  Container,
  Grid,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Scheduler({
  processes,
  setProcesses,
  timeQuantum,
  setTimeQuantum,
  setOutput,
  setConclusion,
  error,
  setError,
}) {
  const navigate = useNavigate();

  const handleProcessChange = (index, field, value) => {
    const newProcesses = [...processes];
    newProcesses[index][field] = value;
    setProcesses(newProcesses);
  };

  const addProcess = () => {
    setProcesses([
      ...processes,
      { arrivalTime: "", burstTime: "", priority: "" },
    ]);
  };

  const removeProcess = (index) => {
    const newProcesses = processes.filter((_, i) => i !== index);
    setProcesses(newProcesses);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const numProcessesInt = processes.length;
    const arrivalTimesArray = processes.map((p) => parseFloat(p.arrivalTime));
    const burstTimesArray = processes.map((p) => parseFloat(p.burstTime));
    const prioritiesArray = processes.map((p) => parseFloat(p.priority));
    const timeQuantumFloat = parseFloat(timeQuantum);

    if (
      arrivalTimesArray.some((time) => isNaN(time) || time < 0) ||
      burstTimesArray.some((time) => isNaN(time) || time < 0) ||
      prioritiesArray.some((priority) => isNaN(priority) || priority < 0) ||
      isNaN(timeQuantumFloat) ||
      timeQuantumFloat <= 0
    ) {
      setError(
        "All input values must be non-negative numbers and time quantum must be positive."
      );
      return;
    }

    setError("");

    try {
      const response = await fetch("http://localhost:5000/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numProcesses: numProcessesInt,
          arrivalTimes: arrivalTimesArray,
          burstTimes: burstTimesArray,
          priorities: prioritiesArray,
          timeQuantum: timeQuantumFloat,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setOutput(data.output);
      setConclusion(data.conclusion || "");
      navigate("/results");
    } catch (error) {
      setError(`Fetch error: ${error.message}`);
    }
  };

  return (
    <Container component="main">
      <Typography variant="h4" component="h1" gutterBottom mt={2}>
        Scheduler Input
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        {processes.map((process, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2, my: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={3}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id={`arrivalTime-${index}`}
                  label="Arrival Time"
                  name={`arrivalTime-${index}`}
                  value={process.arrivalTime}
                  onChange={(e) =>
                    handleProcessChange(index, "arrivalTime", e.target.value)
                  }
                  size="small" // Use 'small' size variant
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id={`burstTime-${index}`}
                  label="Burst Time"
                  name={`burstTime-${index}`}
                  value={process.burstTime}
                  onChange={(e) =>
                    handleProcessChange(index, "burstTime", e.target.value)
                  }
                  size="small" // Use 'small' size variant
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id={`priority-${index}`}
                  label="Priority"
                  name={`priority-${index}`}
                  value={process.priority}
                  onChange={(e) =>
                    handleProcessChange(index, "priority", e.target.value)
                  }
                  size="small" // Use 'small' size variant
                />
              </Grid>
              <Grid item xs={12} sm={3} sx={{ textAlign: "right" }}>
                <IconButton
                  onClick={() => removeProcess(index)}
                  color="secondary"
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))}
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={addProcess}
          sx={{ mt: 2 }}
        >
          Add Process
        </Button>
        <TextField
          margin="normal"
          required
          fullWidth
          id="timeQuantum"
          label="Time Quantum Period (For Round Robin)"
          name="timeQuantum"
          value={timeQuantum}
          onChange={(e) => setTimeQuantum(e.target.value)}
          size="small" // Use 'small' size variant
          sx={{ mt: 2 }} // Adjust margin top
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
}

export default Scheduler;
