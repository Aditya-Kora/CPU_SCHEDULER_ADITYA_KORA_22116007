// import React, { useState } from "react";
// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Alert,
//   IconButton,
// } from "@mui/material";
// import { Add, Delete } from "@mui/icons-material";
// import "./App.css";

// function App() {
//   const [processes, setProcesses] = useState([
//     { arrivalTime: "", burstTime: "", priority: "" },
//   ]);
//   const [timeQuantum, setTimeQuantum] = useState("");
//   const [output, setOutput] = useState("");
//   const [conclusion, setConclusion] = useState("");
//   const [error, setError] = useState("");

//   const handleAddProcess = () => {
//     setProcesses([
//       ...processes,
//       { arrivalTime: "", burstTime: "", priority: "" },
//     ]);
//   };

//   const handleRemoveProcess = (index) => {
//     setProcesses(processes.filter((_, i) => i !== index));
//   };

//   const handleProcessChange = (index, field, value) => {
//     const updatedProcesses = processes.map((process, i) =>
//       i === index ? { ...process, [field]: value } : process
//     );
//     setProcesses(updatedProcesses);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const numProcessesInt = processes.length;
//     if (numProcessesInt <= 0 || numProcessesInt > 10) {
//       setError("Number of processes must be between 1 and 10.");
//       return;
//     }

//     const arrivalTimesArray = processes.map((p) =>
//       parseFloat(p.arrivalTime.trim())
//     );
//     const burstTimesArray = processes.map((p) =>
//       parseFloat(p.burstTime.trim())
//     );
//     const prioritiesArray = processes.map((p) => parseFloat(p.priority.trim()));
//     const timeQuantumFloat = parseFloat(timeQuantum.trim());

//     if (
//       arrivalTimesArray.some((time) => isNaN(time) || time < 0) ||
//       burstTimesArray.some((time) => isNaN(time) || time < 0) ||
//       prioritiesArray.some((priority) => isNaN(priority) || priority < 0) ||
//       isNaN(timeQuantumFloat) ||
//       timeQuantumFloat <= 0
//     ) {
//       setError(
//         "All input values must be non-negative numbers and time quantum must be positive."
//       );
//       return;
//     }

//     setError("");

//     try {
//       const response = await fetch("http://localhost:5000/execute", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           numProcesses: numProcessesInt,
//           arrivalTimes: arrivalTimesArray,
//           burstTimes: burstTimesArray,
//           priorities: prioritiesArray,
//           timeQuantum: timeQuantumFloat,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await response.json();
//       setOutput(data.output);
//       setConclusion(data.conclusion || "");
//     } catch (error) {
//       setError(`Fetch error: ${error.message}`);
//     }
//   };

//   return (
//     <Container maxWidth="md">
//       <Typography variant="h4" component="h1" gutterBottom>
//         CPU Scheduler
//       </Typography>
//       <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//         {processes.map((process, index) => (
//           <Box key={index} display="flex" alignItems="center" mb={2}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               label="Arrival Time"
//               value={process.arrivalTime}
//               onChange={(e) =>
//                 handleProcessChange(index, "arrivalTime", e.target.value)
//               }
//               sx={{ mr: 1 }}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               label="Burst Time"
//               value={process.burstTime}
//               onChange={(e) =>
//                 handleProcessChange(index, "burstTime", e.target.value)
//               }
//               sx={{ mr: 1 }}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               label="Priority"
//               value={process.priority}
//               onChange={(e) =>
//                 handleProcessChange(index, "priority", e.target.value)
//               }
//               sx={{ mr: 1 }}
//             />
//             <IconButton
//               onClick={() => handleRemoveProcess(index)}
//               color="secondary"
//             >
//               <Delete />
//             </IconButton>
//           </Box>
//         ))}
//         <Button
//           onClick={handleAddProcess}
//           variant="outlined"
//           startIcon={<Add />}
//           sx={{ mb: 2 }}
//         >
//           Add Process
//         </Button>
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           id="timeQuantum"
//           label="Time Quantum Period (For Round Robin)"
//           value={timeQuantum}
//           onChange={(e) => setTimeQuantum(e.target.value)}
//         />
//         {error && <Alert severity="error">{error}</Alert>}
//         <Button
//           type="submit"
//           fullWidth
//           variant="contained"
//           sx={{ mt: 3, mb: 2 }}
//         >
//           Submit
//         </Button>
//       </Box>
//       <Box sx={{ mt: 4 }}>
//         <Typography variant="h6" component="h2">
//           Output
//         </Typography>
//         <pre>{output}</pre>
//         {conclusion && (
//           <>
//             <Typography variant="h6" component="h2">
//               Conclusion
//             </Typography>
//             <pre>{conclusion}</pre>
//           </>
//         )}
//       </Box>
//     </Container>
//   );
// }

// export default App;
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import { Container, AppBar, Toolbar, Typography, Button } from "@mui/material";
import Scheduler from "./Scheduler";
import Results from "./Results";
// import "./App.css";

function App() {
  const [processes, setProcesses] = useState([
    { arrivalTime: "", burstTime: "", priority: "" },
  ]);
  const [timeQuantum, setTimeQuantum] = useState("");
  const [output, setOutput] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [error, setError] = useState("");

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CPU Scheduler
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Scheduler
          </Button>
          <Button color="inherit" component={Link} to="/results">
            Results
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Routes>
          <Route
            path="/"
            element={
              <Scheduler
                processes={processes}
                setProcesses={setProcesses}
                timeQuantum={timeQuantum}
                setTimeQuantum={setTimeQuantum}
                setOutput={setOutput}
                setConclusion={setConclusion}
                error={error}
                setError={setError}
              />
            }
          />
          <Route
            path="/results"
            element={<Results output={output} conclusion={conclusion} />}
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
