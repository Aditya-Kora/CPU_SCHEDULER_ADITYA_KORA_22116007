const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/execute", (req, res) => {
  const { numProcesses, arrivalTimes, burstTimes, priorities, timeQuantum } =
    req.body;

  // Log received data
  console.log("Received data:", req.body);

  // Prepare the input data for the C++ program
  const inputData = `${numProcesses}\n${arrivalTimes.join(
    " "
  )}\n${burstTimes.join(" ")}\n${priorities.join(" ")}\n${timeQuantum}\n`;

  // Log input data
  console.log("Input data for C++ program:", inputData);

  // Write the input data to a file
  fs.writeFileSync("input.txt", inputData);

  // Determine OS-specific commands and executable names
  const isWindows = os.platform() === "win32";
  const compileCommand = isWindows
    ? "g++ -o a.exe cpu_scheduler.cpp"
    : "g++ -o a.out cpu_scheduler.cpp";
  const execCommand = isWindows ? "a.exe < input.txt" : "./a.out < input.txt";
  const executable = isWindows ? "a.exe" : "a.out";

  // Compile the C++ program
  exec(compileCommand, (compileError, compileStdout, compileStderr) => {
    if (compileError) {
      console.error("Compilation error:", compileStderr);
      return res.status(500).json({ output: compileStderr });
    }

    // Execute the compiled C++ program
    exec(execCommand, (execError, execStdout, execStderr) => {
      if (execError) {
        console.error("Execution error:", execStderr);
        return res.status(500).json({ output: execStderr });
      }
      res.json({ output: execStdout });

      // Clean up: remove the input file and executable
      fs.unlinkSync("input.txt");
      fs.unlinkSync(executable);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
