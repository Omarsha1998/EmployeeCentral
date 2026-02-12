<template>
  <div class="q-mt-lg">
    <q-btn
      :label="typeReport === 'unpaidOvertime' ? 'Print Excel' : 'Print PDF'"
      push
      color="positive"
      @click="generatePdf"
      :loading="isGenerating"
      :disable="isGenerating"
    />
  </div>

  <q-dialog v-model="dialogVisible" maximized>
    <q-card
      :class="[
        'bold-text',
        $q.screen.name + '-text',
        $q.screen.name + '-width',
        $q.screen.name + '-min-height',
      ]"
    >
      <q-card-section class="bg-primary text-white row items-center q-pb-md">
        <div class="bg-primary text-white text-bold">Time Data Report</div>
        <q-space></q-space>
        <q-btn
          class="bg-yellow-10 text-white text-bold q-mr-lg"
          label="Download"
          push
          @click="downloadPDF"
        />
        <q-btn
          class="bg-white text-blue"
          icon="close"
          push
          round
          dense
          v-close-popup
        ></q-btn>
      </q-card-section>

      <iframe
        v-if="pdfUrl"
        :src="pdfUrl"
        style="width: 100%; height: 100%; border: none"
        id="pdfViewer"
      >
      </iframe>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PDFGenerator",

  props: {
    columns: Array,
    items: Array,
    typeReport: String,
    payrollPeriod: String,
    classDescription: String,
    leaveTypes: Array,
  },

  data() {
    return {
      dialogVisible: false,
      pdfUrl: "",
      pdfFileName: "",
      w: undefined,
      isGenerating: false,
    };
  },

  computed: {
    ...mapGetters({ base64Image: "leaveModule/getBgImage" }),
  },

  methods: {
    // async generatePdf() {
    //   this.isGenerating = true;

    //   const workerData = await JSON.parse(
    //     JSON.stringify({
    //       columns: this.columns,
    //       items: this.items,
    //       payrollPeriod: this.payrollPeriod ? this.payrollPeriod : "",
    //       classDescription: this.classDescription,
    //       leaveTypes: this.leaveTypes,
    //       base64Image: this.base64Image,
    //       typeReport: this.typeReport,
    //     }),
    //   );

    //   if (typeof Worker !== "undefined") {
    //     if (typeof this.w === "undefined") {
    //       const workerPath =
    //         this.typeReport === "unpaidOvertime"
    //           ? "../store/worker.js"
    //           : "../store/workerHelper.js";

    //       this.w = new Worker(
    //         new URL(/* @vite-ignore */ workerPath, import.meta.url),
    //         { type: "module" },
    //       );
    //     }

    //     this.w.postMessage({
    //       data: workerData,
    //       module: this.typeReport,
    //     });

    //     this.w.onmessage = (event) => {
    //       if (event.data.success) {
    //         const { pdfData, fileName } = event.data.result;
    //         fetch(pdfData)
    //           .then((res) => res.blob())
    //           .then((blob) => {
    //             if (this.pdfUrl) {
    //               URL.revokeObjectURL(this.pdfUrl);
    //             }
    //             this.pdfUrl = URL.createObjectURL(blob);
    //             this.pdfFileName = fileName;
    //             this.dialogVisible = true;
    //             this.$q.notify({
    //               color: "positive",
    //               position: "center",
    //               message: "PDF generated successfully!",
    //               icon: "check_circle",
    //               timeout: 2000,
    //               progress: true,
    //             });
    //           });
    //         this.isGenerating = false;
    //       } else {
    //         this.isGenerating = false;

    //         this.$q.notify({
    //           color: "negative",
    //           position: "center",
    //           message: "Failed to generate PDF",
    //           icon: "report_problem",
    //           timeout: 2000,
    //           progress: true,
    //         });
    //       }
    //     };

    //     this.w.onerror = (error) => {
    //       this.isGenerating = false;
    //       console.error("Worker error:", error);
    //       this.$q.notify({
    //         color: "negative",
    //         position: "center",
    //         message: "Worker error occurred",
    //         icon: "report_problem",
    //         timeout: 2000,
    //         progress: true,
    //       });
    //     };
    //   }
    // },

    async generatePdf() {
      this.isGenerating = true;

      const workerData = await JSON.parse(
        JSON.stringify({
          columns: this.columns,
          items: this.items,
          payrollPeriod: this.payrollPeriod ? this.payrollPeriod : "",
          classDescription: this.classDescription,
          leaveTypes: this.leaveTypes,
          base64Image: this.base64Image,
          typeReport: this.typeReport,
        }),
      );

      if (typeof Worker !== "undefined") {
        if (this.workerType !== this.typeReport) {
          if (this.w) {
            this.w.terminate();
            this.w = null;
          }
          this.workerType = this.typeReport;
        }

        // Create new worker if needed
        if (!this.w) {
          if (this.typeReport === "unpaidOvertime") {
            this.w = new Worker(
              new URL("../store/worker.js", import.meta.url),
              /* @vite-ignore */
            );
          } else {
            this.w = new Worker(
              new URL("../store/workerHelper.js", import.meta.url),
              /* @vite-ignore */
              { type: "module" },
            );
          }
        }

        this.w.postMessage({
          data: workerData,
          module: this.typeReport,
        });

        this.w.onmessage = (event) => {
          if (event.data.success) {
            const result = event.data.result;

            // Check if it's an Excel file (from unpaidOvertime module)
            if (this.typeReport === "unpaidOvertime") {
              // Create download link for Excel
              const url = URL.createObjectURL(result);
              const a = document.createElement("a");
              a.href = url;
              a.download = `Unpaid_Overtime_Report_${
                new Date().toISOString().split("T")[0]
              }.xlsx`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);

              this.$q.notify({
                color: "positive",
                position: "center",
                message: "Excel file downloaded successfully!",
                icon: "check_circle",
                timeout: 2000,
                progress: true,
              });

              this.isGenerating = false;
            } else {
              // Handle PDF (for other report types)
              const { pdfData, fileName } = result;
              fetch(pdfData)
                .then((res) => res.blob())
                .then((blob) => {
                  if (this.pdfUrl) {
                    URL.revokeObjectURL(this.pdfUrl);
                  }
                  this.pdfUrl = URL.createObjectURL(blob);
                  this.pdfFileName = fileName;
                  this.dialogVisible = true;
                  this.$q.notify({
                    color: "positive",
                    position: "center",
                    message: "PDF generated successfully!",
                    icon: "check_circle",
                    timeout: 2000,
                    progress: true,
                  });
                  this.isGenerating = false;
                })
                .catch((error) => {
                  console.error("❌ Failed to process PDF:", error);
                  this.isGenerating = false;
                  this.$q.notify({
                    color: "negative",
                    position: "center",
                    message: `Failed to process PDF: ${error.message}`,
                    icon: "report_problem",
                    timeout: 3000,
                    progress: true,
                  });
                });
            }
          } else {
            console.error("❌ Worker returned error:", event.data.error);
            this.isGenerating = false;

            this.$q.notify({
              color: "negative",
              position: "center",
              message: `Failed: ${event.data.error}`,
              icon: "report_problem",
              timeout: 3000,
              progress: true,
            });
          }
        };

        this.w.onerror = (error) => {
          this.isGenerating = false;
          console.error("❌ WORKER ERROR:", error);
          console.error("Error message:", error.message);
          console.error("Error filename:", error.filename);
          console.error("Error lineno:", error.lineno);

          this.$q.notify({
            color: "negative",
            position: "center",
            message: `Worker error: ${error.message}`,
            icon: "report_problem",
            timeout: 3000,
            progress: true,
          });
        };
      } else {
        // Handle case where Web Workers aren't supported
        this.isGenerating = false;
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Web Workers are not supported in this browser",
          icon: "report_problem",
          timeout: 3000,
          progress: true,
        });
      }
    },

    downloadPDF() {
      if (!this.pdfUrl) {
        this.$q.notify({
          color: "warning",
          position: "center",
          message: "No PDF available to download",
          icon: "warning",
          timeout: 2000,
        });
        return;
      }

      const link = document.createElement("a");
      link.href = this.pdfUrl;
      link.download = this.pdfFileName || "Time Data.pdf";
      link.click();

      this.$q.notify({
        color: "positive",
        position: "center",
        message: "PDF downloaded successfully!",
        icon: "download",
        timeout: 2000,
      });
    },
  },

  beforeUnmount() {
    if (this.w) {
      this.w.terminate();
      this.w = undefined;
    }

    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl);
      this.pdfUrl = "";
    }
  },
};
</script>
