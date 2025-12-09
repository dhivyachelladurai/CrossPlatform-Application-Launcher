Launcher Project – Development Summary & Build Guide
1. Development Process Summary
I developed the launcher by dividing it into two components: a Node.js backend and a React frontend.
The backend was built first using Express to expose APIs for adding, deleting, and launching
applications.
A key part of the implementation was integrating a PowerShell-based file picker using the
node-powershell
library to allow selecting .exe files through a native Windows dialog. Application data was stored using
a
small JSON file, and executables were launched and terminated using Node’s child_process module.
After the backend was functional, I built the UI using React, React Router, and Axios. The interface
included a Home screen, a Running screen, and a Settings screen (restricted to local access). Once
complete, the frontend was built into production assets and served by the backend.
Finally, I packaged the backend into a Windows executable using pkg, allowing the server to run on any
Windows system without Node installed. I created a Windows batch script to automate building both the
frontend and backend. No Android application was created; the UI was accessed via LAN IP on mobile.
2. Technology Used- Node.js (Express)- PowerShell for file dialogs- React (Create React App)- Axios- React Router- pkg for Windows EXE packaging- Windows Batch Script for automated builds
3. Build Instructions
Backend:
cd backend
npm install
npm start
Frontend:
cd frontend
npm install
npm run build
Packaging (EXE):
npm install -g pkg
cd backend
pkg server.js --target node18-win --output launcher-server.exe
4. Windows Build Script (build-win.bat)
@echo off
cd frontend
npm install
npm run build
cd ..
cd backend
npm install
pkg server.js --target node18-win --output launcher-server.exe
cd ..
echo Build Completed
pause
