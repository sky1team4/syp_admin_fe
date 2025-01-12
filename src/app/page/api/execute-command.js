// File: /pages/api/execute-command.js
import { exec } from "child_process";

export default function handler(req, res) {
  exec("ls", (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    if (stderr) {
      res.status(500).json({ error: stderr });
      return;
    }
    res.status(200).json({ output: stdout });
  });
}
