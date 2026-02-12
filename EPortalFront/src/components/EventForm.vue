<template>
  <div>
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-sm-4">
        <q-input
          v-model="localFormData.programTitle"
          outlined
          label="Program Title"
          label-color="primary"
          class="blue-outline"
          type="textarea"
          :rows="1"
        />
      </div>
      <div class="col-12 col-sm-4">
        <q-select
          v-model="localFormData.platform"
          outlined
          label-color="primary"
          class="blue-outline"
          label="Platform"
          :options="trainingModeOptions"
          emit-value
          map-options
        />
      </div>
      <div class="col-12 col-sm-4">
        <q-input
          v-model="localFormData.venue"
          outlined
          label-color="primary"
          class="blue-outline"
          :label="venueLabel"
          type="textarea"
          :rows="1"
        />
      </div>
      <div class="col-12 col-sm-4">
        <q-input
          v-model="localFormData.participants"
          outlined
          label-color="primary"
          class="blue-outline"
          label="Participants"
          type="textarea"
          :rows="1"
        />
      </div>
      <q-input
        outlined
        :model-value="convertTo24Hour(localFormData.timeFrom)"
        @update:model-value="updateTimeFrom"
        type="time"
        label="Time From"
        label-color="primary"
        class="col-12 col-sm-4 blue-outline hide-native-time-controls"
      >
        <template v-slot:append>
          <q-icon name="schedule" class="cursor-pointer">
            <q-popup-proxy :breakpoint="1440" cover ref="timeFromPopUp">
              <div class="q-date-container">
                <q-time v-model="localFormData.timeFrom" mask="h:mm A" />
                <q-btn
                  push
                  icon="close"
                  class="bg-white absolute-top-right"
                  round
                  padding="xs"
                  @click="$refs.timeFromPopUp.hide()"
                  style="margin: 10px"
                />
              </div>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input
        outlined
        :model-value="convertTo24Hour(localFormData.timeTo)"
        @update:model-value="updateTimeTo"
        type="time"
        label="Time To"
        label-color="primary"
        class="col-12 col-sm-4 blue-outline hide-native-time-controls"
      >
        <template v-slot:append>
          <q-icon name="schedule" class="cursor-pointer">
            <q-popup-proxy :breakpoint="1440" cover ref="timeToPopUp">
              <div class="q-date-container">
                <q-time v-model="localFormData.timeTo" mask="h:mm A" />
                <q-btn
                  push
                  icon="close"
                  class="bg-white absolute-top-right"
                  round
                  padding="xs"
                  @click="$refs.timeToPopUp.hide()"
                  style="margin: 10px"
                />
              </div>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <div class="col-12 col-sm-4">
        <q-input
          v-model="localFormData.trainingProvider"
          outlined
          label-color="primary"
          class="blue-outline"
          label="Training Provider"
          type="textarea"
          :rows="1"
        />
      </div>

      <div class="col-12 col-sm-4">
        <q-input
          outlined
          v-model="localFormData.fromDate"
          label="From Date"
          label-color="primary"
          mask="##/##/####"
          placeholder="MM/DD/YYYY"
          class="blue-outline"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="fromDatePopUp"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <div class="q-date-container">
                  <q-date v-model="localFormData.fromDate" mask="MM/DD/YYYY" />
                  <q-btn
                    push
                    icon="close"
                    class="bg-white absolute-top-right"
                    round
                    padding="xs"
                    @click="$refs.fromDatePopUp.hide()"
                    style="margin: 10px"
                  />
                </div>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="col-12 col-sm-4">
        <q-input
          outlined
          v-model="localFormData.toDate"
          label="To Date"
          label-color="primary"
          mask="##/##/####"
          placeholder="MM/DD/YYYY"
          class="blue-outline"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="toDatePopUp"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <div class="q-date-container">
                  <q-date v-model="localFormData.toDate" mask="MM/DD/YYYY" />
                  <q-btn
                    push
                    icon="close"
                    class="bg-white absolute-top-right"
                    round
                    padding="xs"
                    @click="$refs.toDatePopUp.hide()"
                    style="margin: 10px"
                  />
                </div>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="col-12">
        <q-file
          v-model="localFormData.fileData"
          outlined
          label-color="primary"
          label="Upload PDF (Max: 10MB), Image (Max: 2MB)"
          accept=".pdf,image/*"
          class="blue-outline"
          max-file-size="10485760"
          @rejected="onRejected"
          @update:model-value="handleFileSelect"
        >
          <template v-slot:prepend>
            <q-icon class="q-pa-none" color="primary" name="attach_file" />
          </template>
          <template v-slot:append>
            <q-icon
              v-if="localFormData.fileData"
              name="close"
              @click.stop.prevent="clearFile"
              class="cursor-pointer"
            />
          </template>
        </q-file>
      </div>
    </div>

    <div class="q-mt-md text-right">
      <q-btn
        push
        :label="submitLabel"
        class="bg-positive text-white q-pa-sm text-bold"
        @click="handleSubmit"
        :loading="isConverting"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "EventForm",

  props: {
    formData: {
      type: Object,
      required: true,
    },
    submitLabel: {
      type: String,
      default: "Submit Event",
    },
  },

  data() {
    return {
      localFormData: { ...this.formData },
      selectedFile: null,
      trainingModeOptions: [
        { label: "On Site", value: "On Site" },
        { label: "Online", value: "Online" },
      ],
      isConverting: false,
    };
  },

  computed: {
    venueLabel() {
      return this.localFormData.platform === "Online" ? "Link / URL" : "Venue";
    },
  },

  methods: {
    onRejected(rejectedEntries) {
      if (rejectedEntries[0].failedPropValidation === "accept") {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: `You can only upload .PDF, img, .jpeg and .png file.`,
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }
      if (rejectedEntries[0].failedPropValidation === "max-file-size") {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: `You are allowed only to upload max of 10mb file.`,
          icon: "report_problem",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
        return;
      }
    },

    handleFileSelect(file) {
      this.localFormData.fileData = file;

      if (!file) return;

      const fileType = file.type;
      const fileSize = file.size;

      // PDF limit: 10MB
      const pdfLimit = 10 * 1024 * 1024; // 10MB
      // Image limit: 2MB
      const imageLimit = 2 * 1024 * 1024; // 2MB

      if (fileType === "application/pdf" && fileSize > pdfLimit) {
        this.$q.notify({
          message: "PDF exceeds the 10MB limit.",
          position: "center",
          icon: "warning",
          color: "negative",
          timeout: 1000,
        });
        this.localFormData.fileData = null;
        return;
      }

      if (fileType.startsWith("image/") && fileSize > imageLimit) {
        this.$q.notify({
          message: "Image exceeds the 2MB limit.",
          position: "center",
          icon: "warning",
          color: "negative",
          timeout: 1000,
        });
        this.localFormData.fileData = null;
        return;
      }
    },

    clearFile() {
      this.selectedFile = null;
      this.localFormData.fileData = null;
    },

    convertTo24Hour(time12h) {
      if (!time12h) return "";
      const [time, period] = time12h.split(" ");
      let [hours, minutes] = time.split(":");
      hours = parseInt(hours);

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      return `${hours.toString().padStart(2, "0")}:${minutes}`;
    },

    convertTo12Hour(time24h) {
      if (!time24h) return "";
      let [hours, minutes] = time24h.split(":");
      hours = parseInt(hours);

      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;

      return `${hours}:${minutes} ${period}`;
    },

    updateTimeFrom(value) {
      this.localFormData.timeFrom = this.convertTo12Hour(value);
    },

    updateTimeTo(value) {
      this.localFormData.timeTo = this.convertTo12Hour(value);
    },

    convertFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    },

    async handleSubmit() {
      this.isConverting = true;

      const dataToSubmit = { ...this.localFormData };

      if (this.localFormData.fileData) {
        const base64 = await this.convertFileToBase64(
          this.localFormData.fileData,
        );

        const fileExtension = this.localFormData.fileData.type.replace(
          /^.*\//,
          "",
        );

        dataToSubmit.fileData = {
          fileName: this.localFormData.fileData.name,
          fileSize: this.localFormData.fileData.size,
          fileType: fileExtension,
          fileContent: base64,
        };
        this.isConverting = false;
      } else {
        dataToSubmit.fileData = null;
        this.isConverting = false;
      }

      this.$emit("submit", dataToSubmit);
    },
  },

  watch: {
    formData: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.localFormData)) {
          this.localFormData = { ...newVal };
        }
      },
      deep: true,
    },
  },
};
</script>
