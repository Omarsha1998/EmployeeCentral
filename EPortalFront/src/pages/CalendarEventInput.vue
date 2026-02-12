<template>
  <q-layout>
    <q-page-container>
      <div class="containermainn">
        <div style="width: 95%">
          <q-card>
            <q-tabs
              v-model="tab"
              indicator-color="text-primary"
              active-color="text-primary"
              active-bg-color="yellow-8 text-blue"
              class="ann-outline bg-primary text-white row text-bold"
            >
              <q-tab
                :class="$q.screen.gt.md ? 'col-6' : 'col-12'"
                name="inputEvent"
                icon="edit_calendar"
                label="Add Events in Calendar"
                inline-label
                mobile-arrows
              />
              <q-tab
                :class="$q.screen.gt.md ? 'col-6' : 'col-12'"
                name="employeeInputEvent"
                icon="date_range"
                label="Events"
              />
            </q-tabs>

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="inputEvent">
                <event-form
                  :formData="formData"
                  @update:formData="formData = $event"
                  @submit="submitEvent"
                />
              </q-tab-panel>

              <q-tab-panel name="employeeInputEvent">
                <q-table
                  class="custom-scroll"
                  :rows="events"
                  :columns="eventsCol"
                  row-key="programTitle"
                  virtual-scroll
                  :virtual-scroll-item-size="11"
                  hide-pagination
                  :rows-per-page-options="[0]"
                >
                  <template v-slot:header>
                    <q-tr class="sticky-thead">
                      <q-th
                        v-for="col in eventsCol"
                        :key="col.name"
                        class="text-bold text-center text-primary bg-blue-2"
                        :style="{ width: col.width || 'auto' }"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>

                  <template v-slot:body="props">
                    <q-tr :props="props" :key="props.row.programTitle">
                      <q-td
                        v-for="col in eventsCol"
                        :key="col.name"
                        class="text-center"
                        :style="{
                          width: col.width || 'auto',
                          whiteSpace: [
                            'programTitle',
                            'participants',
                            'trainingProvider',
                            'venue',
                          ].includes(col.name)
                            ? 'normal'
                            : 'nowrap',
                          wordWrap: [
                            'programTitle',
                            'participants',
                            'trainingProvider',
                            'venue',
                          ].includes(col.name)
                            ? 'break-word'
                            : 'normal',
                        }"
                      >
                        <template v-if="col.name === 'Action'">
                          <q-btn
                            unelavated
                            color="positive"
                            label="Edit"
                            class="q-mr-xs text-bold"
                            @click="openUpdateDialog(props.row)"
                          />
                          <q-btn
                            unelavated
                            label="Remove"
                            color="negative"
                            class="q-mr-xs text-bold"
                            @click="removeSetSchedule(props.row)"
                          />
                        </template>
                        <template
                          v-else-if="
                            props.row[col.field] === null ||
                            props.row[col.field] === '' ||
                            props.row[col.field] === undefined ||
                            props.row[col.field] === 0
                          "
                        >
                          -
                        </template>
                        <template v-else>{{ props.row[col.field] }}</template>
                      </q-td>
                    </q-tr>
                  </template>
                  <template v-slot:no-data>
                    <div
                      class="full-width row flex-center text-black text-subtitle2"
                    >
                      <div>
                        No data available
                        <q-icon
                          class="text-red"
                          size="2em"
                          name="sentiment_dissatisfied"
                        ></q-icon>
                      </div>
                    </div>
                  </template>
                </q-table>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>

        <!-- Update Dialog with same form -->
        <q-dialog
          v-model="updateDialog"
          :class="[
            'bold-text',
            $q.screen.name + '-text',
            $q.screen.name + '-width',
            $q.screen.name + '-min-height',
          ]"
          style="
            width: auto;
            height: auto;
            min-width: 600px;
            max-width: 90vw;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
          "
        >
          <q-card
            style="display: flex; flex-direction: column; min-width: 1000px"
          >
            <q-card-section
              class="bg-primary text-white row items-center q-pb-md"
            >
              <div class="bg-primary text-white text-bold">Edit Event</div>
              <q-space></q-space>

              <q-btn
                class="bg-white text-blue"
                icon="close"
                push
                round
                dense
                v-close-popup
              ></q-btn>
            </q-card-section>
            <q-card-section>
              <event-form
                :formData="editFormData"
                @update:formData="editFormData = $event"
                @submit="updateEvent"
                submitLabel="Update Event"
              />
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { QSpinnerIos } from "quasar";
import helperMethods from "src/helperMethods";
import { mapGetters } from "vuex";
import EventForm from "src/components/EventForm.vue";

export default {
  components: {
    EventForm,
  },

  data() {
    return {
      tab: "inputEvent",

      formData: {
        programTitle: null,
        platform: null,
        venue: null,
        participants: null,
        trainingProvider: null,
        timeFrom: null,
        timeTo: null,
        fromDate: null,
        toDate: null,
        fileData: null,
      },

      editFormData: {
        id: null,
        programTitle: null,
        platform: null,
        venue: null,
        participants: null,
        trainingProvider: null,
        timeFrom: null,
        timeTo: null,
        fromDate: null,
        toDate: null,
        fileData: null,
      },

      events: [],
      eventsCol: [
        {
          name: "Program Title",
          label: "Program Title",
          align: "center",
          field: "programTitle",
          sortable: false,
          width: "auto",
        },
        {
          name: "Venue",
          label: "Venue",
          align: "center",
          field: "venue",
          sortable: false,
          width: "auto",
        },
        {
          name: "Participants",
          label: "Participants",
          align: "center",
          field: "participants",
          sortable: false,
          width: "auto",
        },
        {
          name: "Training Provider",
          label: "Training Provider",
          align: "center",
          field: "trainingProvider",
          sortable: false,
          width: "auto",
        },
        {
          name: "Time",
          label: "Time",
          align: "center",
          field: "timeCombine",
          sortable: false,
          width: "auto",
        },
        {
          name: "Date",
          label: "Date",
          align: "center",
          field: "dateCombine",
          sortable: false,
          width: "auto",
        },
        {
          name: "Action",
          label: "Action",
          align: "center",
          field: "",
          sortable: false,
          width: "auto",
        },
      ],
      updateDialog: false,
    };
  },

  computed: {
    ...mapGetters({
      allEvents: "announcementModule/getEvents",
    }),
  },

  methods: {
    async getEvents() {
      try {
        helperMethods.delay(100);
        await this.$store.dispatch("announcementModule/getEvents");
        this.events = Array.isArray(this.allEvents) ? this.allEvents : [];
      } catch (error) {
        console.error(error);
        this.events = [];
        this.$q.notify({
          color: "negative",
          position: "center",
          message: `${
            error.response.status === 400
              ? `${error.response.data.message}`
              : "No events found."
          }`,
          icon: "warning",
          iconColor: "white",
          timeout: 1000,
          progress: true,
        });
      }
    },
    // Reset add form
    resetFormData() {
      this.formData = {
        programTitle: null,
        venue: null,
        participants: null,
        trainingProvider: null,
        timeFrom: null,
        timeTo: null,
        fromDate: null,
        toDate: null,
      };
    },

    // Helper method to extract time from ISO date string or time string
    extractTimeFromDate(dateTimeString) {
      if (!dateTimeString) return null;

      // If it's already in the correct format (h:mm A), return it
      if (
        (typeof dateTimeString === "string" && dateTimeString.includes("AM")) ||
        dateTimeString.includes("PM")
      ) {
        return dateTimeString;
      }

      // If it's an ISO date string, extract the time
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return null;

      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;

      return `${hours}:${minutes} ${period}`;
    },

    // Helper method to format date from ISO string to MM/DD/YYYY
    extractDateFromISO(isoString) {
      if (!isoString) return null;

      // If it's already in MM/DD/YYYY format, return it
      if (typeof isoString === "string" && isoString.includes("/")) {
        return isoString;
      }

      const date = new Date(isoString);
      if (isNaN(date.getTime())) return null;

      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${month}/${day}/${year}`;
    },

    async base64ToFile(base64String, fileName, fileType) {
      const dataUrl = `data:${fileType};base64,${base64String}`;
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      return new File([blob], fileName, { type: fileType });
    },

    async openUpdateDialog(row) {
      let fileObject = null;

      if (row.fileName && row.fileContent && row.fileType) {
        fileObject = await this.base64ToFile(
          row.fileContent,
          row.fileName,
          row.fileType,
        );
      }
      this.editFormData = {
        id: row.id,
        programTitle: row.programTitle,
        platform: row.platform,
        venue: row.venue,
        participants: row.participants,
        trainingProvider: row.trainingProvider,
        timeFrom: this.extractTimeFromDate(row.timeFrom),
        timeTo: this.extractTimeFromDate(row.timeTo),
        fromDate: this.extractDateFromISO(row.fromDate),
        toDate: this.extractDateFromISO(row.toDate),
        eventFileId: row.eventFileId,
        fileData: fileObject,
      };
      this.updateDialog = true;
    },

    async submitEvent(formData) {
      if (
        !formData.fromDate ||
        !formData.toDate ||
        !formData.programTitle ||
        !formData.platform ||
        !formData.venue ||
        !formData.timeFrom ||
        !formData.timeTo
      ) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Please specify all the inputs needed",
          icon: "report_problem",
          iconColor: "white",
          timeout: 2000,
          progress: true,
        });
        return;
      }

      const data = {
        programTitle: formData.programTitle,
        platform: formData.platform,
        venue: formData.venue,
        participants: formData.participants?.length
          ? formData.participants
          : null,
        trainingProvider: formData.trainingProvider?.length
          ? formData.trainingProvider
          : null,
        timeFrom: formData.timeFrom,
        timeTo: formData.timeTo,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        fileData: formData.fileData,
      };

      this.$q
        .dialog({
          title: "Confirmation",
          message: "Are you sure you want to set new event in calendar?",
          cancel: true,
          persistent: true,
          ok: {
            push: true,
            color: "primary",
            label: "Confirm",
            class: "text-subtitle1",
          },
          cancel: {
            push: true,
            color: "negative",
            label: "Cancel",
            class: "text-subtitle1",
          },
        })
        .onOk(async () => {
          this.$q.loading.show({
            spinner: QSpinnerIos,
            message: "Setting event in calendar...",
            messageColor: "primary",
            backgroundColor: "grey-1",
            spinnerColor: "primary",
            customClass: "custom-loading-style",
            spinnerSize: "7em",
          });

          try {
            helperMethods.disablePointerEvents();
            helperMethods.delay(100);
            await this.$store.dispatch("announcementModule/setTraining", data);
            await this.getEvents();
            this.resetFormData();
            this.$q.loading.hide();
            helperMethods.enablePointerEvents();
            this.$q.notify({
              color: "positive",
              position: "center",
              message: "Success setting new events in calendar.",
              icon: "check",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
          } catch (error) {
            this.$q.loading.hide();
            helperMethods.enablePointerEvents();
            console.error(error);
            this.$q.notify({
              color: "negative",
              position: "center",
              message: `${
                [400, 404, 422, 503].includes(error.response?.status)
                  ? `${error.response.data.message}${
                      error.response.status === 503 ? " (File is unsecure)" : ""
                    }`
                  : "Error setting new events in calendar."
              }`,
              icon: "warning",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
          }
        });
    },

    async updateEvent(formData) {
      if (
        !formData.fromDate ||
        !formData.toDate ||
        !formData.programTitle ||
        !formData.platform ||
        !formData.venue ||
        !formData.timeFrom ||
        !formData.timeTo
      ) {
        this.$q.notify({
          color: "negative",
          position: "center",
          message: "Please specify all the inputs needed",
          icon: "report_problem",
          iconColor: "white",
          timeout: 2000,
          progress: true,
        });
        return;
      }

      const data = {
        id: formData.id,
        programTitle: formData.programTitle,
        platform: formData.platform,
        venue: formData.venue,
        participants: formData.participants?.length
          ? formData.participants
          : null,
        trainingProvider: formData.trainingProvider?.length
          ? formData.trainingProvider
          : null,
        timeFrom: formData.timeFrom,
        timeTo: formData.timeTo,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        eventFileId: formData.eventFileId,
        fileData: formData.fileData,
      };

      this.$q
        .dialog({
          title: "Confirmation",
          message: "Are you sure you want to update this event?",
          cancel: true,
          persistent: true,
          ok: {
            push: true,
            color: "primary",
            label: "Confirm",
            class: "text-subtitle1",
          },
          cancel: {
            push: true,
            color: "negative",
            label: "Cancel",
            class: "text-subtitle1",
          },
        })
        .onOk(async () => {
          this.$q.loading.show({
            spinner: QSpinnerIos,
            message: "Updating event...",
            messageColor: "primary",
            backgroundColor: "grey-1",
            spinnerColor: "primary",
            customClass: "custom-loading-style",
            spinnerSize: "7em",
          });

          try {
            helperMethods.disablePointerEvents();
            helperMethods.delay(100);
            await this.$store.dispatch("announcementModule/updateEvent", data);
            await this.getEvents();
            this.updateDialog = false;
            this.$q.loading.hide();
            helperMethods.enablePointerEvents();
            this.$q.notify({
              color: "positive",
              position: "center",
              message: "Success updating event.",
              icon: "check",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
          } catch (error) {
            this.$q.loading.hide();
            helperMethods.enablePointerEvents();
            console.error(error);
            this.$q.notify({
              color: "negative",
              position: "center",
              message: `${
                error.response.status === 400 || error.response.status === 404
                  ? `${error.response.data.message}`
                  : "Error updating event."
              }`,
              icon: "warning",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
          }
        });
    },

    async removeSetSchedule(selectedData) {
      const data = {
        id: selectedData.id ? selectedData.id : null,
        programTitle: selectedData.programTitle
          ? selectedData.programTitle
          : null,
      };

      this.$q
        .dialog({
          title: "Confirmation",
          message: "Are you sure you want to remove set event in the calendar?",
          cancel: true,
          persistent: true,
          ok: {
            push: true,
            color: "primary",
            label: "Confirm",
            class: "text-subtitle1",
          },
          cancel: {
            push: true,
            color: "negative",
            label: "Cancel",
            class: "text-subtitle1",
          },
        })
        .onOk(async () => {
          this.$q.loading.show({
            spinner: QSpinnerIos,
            message: "Removing set event.",
            messageColor: "primary",
            backgroundColor: "grey-1",
            spinnerColor: "primary",
            customClass: "custom-loading-style",
            spinnerSize: "7em",
          });
          try {
            helperMethods.disablePointerEvents();
            helperMethods.delay(100);
            await this.$store.dispatch(
              "announcementModule/removeSetSchedule",
              data,
            );
            await this.getEvents();
            this.$q.loading.hide();
            helperMethods.enablePointerEvents();
            this.$q.notify({
              color: "positive",
              position: "center",
              message: "Success removing set event.",
              icon: "check",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
          } catch (error) {
            this.$q.loading.hide();
            helperMethods.enablePointerEvents();
            console.error(error);
            this.$q.notify({
              color: "negative",
              position: "center",
              message: `${
                error.response.status === 400 || error.response.status === 404
                  ? `${error.response.data.message}`
                  : "Error setting new events in calendar."
              }`,
              icon: "warning",
              iconColor: "white",
              timeout: 1000,
              progress: true,
            });
          }
        });
    },
  },

  created() {
    this.getEvents();
  },
};
</script>
