// src/store/workerHelper.js
import { generateDTRPdf } from "./DTRUnpaidOvertimePdf.js";

self.onmessage = async (event) => {
  const { data, module } = event.data;

  try {
    let result;

    switch (module) {
      case "dailyTimeRecord":
      case "tally":
      case "print":
      case "unpaidOvertime":
        result = await generateDTRPdf(data);
        self.postMessage({ success: true, result });
        break;

      default:
        throw new Error(`Unknown module: ${module}`);
    }
  } catch (error) {
    console.error("Worker error:", error);
    self.postMessage({
      success: false,
      error: error.message,
    });
  }
};
