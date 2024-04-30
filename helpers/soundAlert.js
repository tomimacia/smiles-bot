import { exec } from 'child_process';
const playAlert = (numBeeps) => {
  const powershellCommand = `[console]::beep(1000, 500); `
    .repeat(numBeeps)
    .trimEnd();
  exec(powershellCommand, { shell: 'powershell.exe' });
};

export default playAlert;
