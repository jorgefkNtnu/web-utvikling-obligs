import express from 'express';
import childProcess from 'child_process';

/**
 * Express router containing task methods.
 */
const router = express.Router();

router.post('/run', (req, res) => {
  if (typeof req.body.language == 'string' && typeof req.body.source == 'string') {
    let stdout = '';
    let stderr = '';
    const process = childProcess.spawn('docker', [
      'run',
      '--rm',
      'node-image',
      'node',
      '-e',
      req.body.source,
    ]);
    process.stdout.on('data', (data) => {
      stdout += data;
    });
    process.stderr.on('data', (data) => {
      stderr += data;
    });
    process.on('close', (exitStatus: number) => {
      res.send({ exitStatus: exitStatus, stdout: stdout, stderr: stderr });
    });
  } else res.status(400).send('Missing properties');
});

export default router;