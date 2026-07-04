@echo off
cd /d "%~dp0"
echo Iniciando invitacion en http://127.0.0.1:8080
start "" http://127.0.0.1:8080
node server.js
pause
