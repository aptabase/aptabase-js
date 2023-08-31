import { initialize, trackEvent } from "@aptabase/electron/main";
import { BrowserWindow, app } from "electron";

initialize("A-DEV-7523634193");

app.whenReady().then(() => {
  trackEvent("app_started");

  const win = new BrowserWindow({
    title: "Main window",
  });

  // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    // Load your file
    win.loadFile("dist/index.html");
  }
});
