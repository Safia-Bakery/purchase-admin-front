import { createRoot } from "react-dom/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App.tsx";
import { queryClient } from "./utils/helpers.ts";
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";

dayjs.extend(utc);
dayjs.extend(timezone);

let container: any = null;

document.addEventListener("DOMContentLoaded", function () {
  if (!container) {
    container = document.getElementById("root") as HTMLElement;
    const root = createRoot(container);
    root.render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ToastContainer autoClose={600} />
      </QueryClientProvider>
    );
  }
});
