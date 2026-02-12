<template>
  <q-layout>
    <q-page-container>
      <div class="containermainn">
        <div class="q-pt-lg" style="width: 95%">
          <div
            v-for="(monthGroup, monthYear) in groupedAnnouncements"
            :key="monthYear"
            class="q-mb-xl"
          >
            <q-card
              class="text-h5 text-bold text-white bg-primary q-pa-sm q-mb-md shadowcard2"
            >
              {{ monthYear }}
            </q-card>

            <div class="row q-col-gutter-lg">
              <div
                v-for="item in monthGroup"
                :key="item.type + '-' + item.id"
                class="col-12 col-sm-6"
              >
                <q-card
                  class="ann-outline q-pa-sm bg-grey-1"
                  style="height: 200px; border-radius: 10px; overflow: hidden"
                >
                  <q-card-section
                    class="row q-col-gutter-xs q-pa-none"
                    style="
                      height: 100%;
                      margin: 0;
                      border-radius: 10px;
                      overflow: hidden;
                    "
                  >
                    <!-- First Column - Image -->
                    <div
                      class="col-12 col-sm-3 q-pa-xs bg-grey-3"
                      style="height: 100%; border-radius: 10px"
                    >
                      <div
                        style="
                          border-radius: 10px;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          position: relative;
                          overflow: hidden;
                          width: 100%;
                          height: 100%;
                        "
                      >
                        <div
                          v-if="item.type === 'event'"
                          style="width: 100%; height: 100%"
                        >
                          <!-- No file attached - show default image -->
                          <div
                            v-if="!item.fileContent"
                            style="width: 100%; height: 100%"
                          >
                            <img
                              src="../assets/images/NewAnnouncerLogoNoBg.png"
                              alt="Event Template"
                              style="
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                                border-radius: 10px;
                              "
                            />
                          </div>

                          <!-- File attached - show preview based on type -->
                          <div
                            v-else
                            style="
                              width: 100%;
                              height: 100%;
                              position: relative;
                            "
                          >
                            <!-- PDF Preview -->
                            <div
                              v-if="item.fileType === 'pdf'"
                              style="
                                width: 100%;
                                height: 100%;
                                background-color: #f5f5f5;
                                border-radius: 10px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                opacity: 0.6;
                              "
                            >
                              <q-icon
                                name="insert_drive_file"
                                size="150px"
                                color="grey"
                              />
                            </div>

                            <!-- Image Preview (PNG, JPG, JPEG, etc.) -->
                            <div
                              v-else-if="
                                ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(
                                  item.fileType?.toLowerCase(),
                                )
                              "
                              style="
                                width: 100%;
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                              "
                            >
                              <img
                                :src="`data:image/${item.fileType};base64,${item.fileContent}`"
                                :alt="item.fileName"
                                style="
                                  max-width: 100%;
                                  max-height: 100%;
                                  border: 1px solid #ccc;
                                  border-radius: 4px;
                                  filter: blur(0.5px);
                                  opacity: 0.6;
                                  object-fit: cover;
                                "
                              />
                            </div>

                            <!-- Fallback for unknown file types -->
                            <div
                              v-else
                              style="
                                width: 100%;
                                height: 100%;
                                background-color: #f5f5f5;
                                border-radius: 10px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                opacity: 0.6;
                              "
                            >
                              <q-icon
                                name="insert_drive_file"
                                size="150px"
                                color="grey"
                              />
                            </div>

                            <!-- View button overlay -->
                            <div
                              style="
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                z-index: 10;
                                text-align: center;
                              "
                            >
                              <q-btn
                                class="text-bold bg-primary q-pa-xs"
                                text-color="white"
                                @click="openPdfLink(item, 'event')"
                                :label="
                                  item.fileType === 'pdf'
                                    ? 'CLICK FOR MORE INFO'
                                    : 'VIEW IMAGE'
                                "
                                style="font-size: 12px"
                              />
                            </div>
                          </div>
                        </div>

                        <!-- Announcement Type - Show Images -->
                        <template v-else>
                          <div
                            v-if="
                              item.fileType === 'img' || item.fileType === 'jpg'
                            "
                            style="width: 100%; height: 100%"
                          >
                            <img
                              :src="item.links"
                              alt="Announcement Image"
                              style="
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                                border-radius: 10px;
                              "
                            />
                          </div>

                          <div
                            v-else-if="item.fileType === 'content'"
                            style="width: 100%; height: 100%"
                          >
                            <img
                              src="../assets/images/NewAnnouncerLogoNoBg.png"
                              alt="Announcement Template"
                              style="
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                                border-radius: 10px;
                              "
                            />
                          </div>

                          <div
                            v-else-if="
                              item.fileType === 'pdf' ||
                              item.fileType === 'imgDialog'
                            "
                            style="
                              width: 100%;
                              height: 100%;
                              position: relative;
                            "
                          >
                            <div
                              v-if="item.fileType === 'imgDialog'"
                              style="
                                width: 100%;
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                              "
                            >
                              <img
                                :src="item.links"
                                alt="Announcement Image"
                                style="
                                  max-width: 100%;
                                  max-height: 100%;
                                  border: 1px solid #ccc;
                                  border-radius: 4px;
                                  filter: blur(0.5px);
                                  opacity: 0.6;
                                  object-fit: cover;
                                "
                              />
                            </div>

                            <div
                              v-else
                              class="blurred-image"
                              style="width: 100%; height: 100%"
                            ></div>

                            <div
                              style="
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                z-index: 10;
                              "
                            >
                              <q-btn
                                class="text-bold bg-primary q-pa-xs"
                                text-color="white"
                                @click="openPdfLink(item.links)"
                                :label="
                                  item.fileType === 'pdf'
                                    ? 'CLICK FOR MORE INFO'
                                    : 'VIEW IMAGE'
                                "
                                style="font-size: 12px"
                              />
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>

                    <!-- Second Column - Content -->
                    <div
                      class="col-12 col-sm-9 q-pa-md"
                      style="
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                      "
                    >
                      <div class="q-mb-xs" style="flex-shrink: 0">
                        <div class="text-subtitle2 text-black text-bold">
                          <template v-if="item.type === 'event'">
                            {{ getDatePart(item.fromDate, "dayOfWeek") }}
                            {{ getDatePart(item.fromDate, "month") }}
                            {{ getDatePart(item.fromDate, "day") }}
                            {{ getDatePart(item.fromDate, "year") }}
                            <span
                              v-if="
                                item.toDate && item.fromDate !== item.toDate
                              "
                            >
                              - {{ getDatePart(item.toDate, "dayOfWeek") }}
                              {{ getDatePart(item.toDate, "month") }}
                              {{ getDatePart(item.toDate, "day") }}
                              {{ getDatePart(item.toDate, "year") }}
                            </span>
                          </template>
                          <template v-else>
                            {{ getDatePart(item.dateTimeCreated, "dayOfWeek") }}
                            {{ getDatePart(item.dateTimeCreated, "month") }}
                            {{ getDatePart(item.dateTimeCreated, "day") }}
                            {{ getDatePart(item.dateTimeCreated, "year") }}
                          </template>
                        </div>
                      </div>

                      <div
                        class="text-subtitle1 text-bold q-mb-sm text-uppercase text-primary"
                        style="flex-shrink: 0"
                      >
                        {{
                          item.type === "event" ? item.programTitle : item.name
                        }}
                      </div>

                      <div
                        style="
                          flex: 1;
                          min-height: 0;
                          display: flex;
                          flex-direction: column;
                        "
                      >
                        <div
                          :ref="(el) => setContentRef(el, item)"
                          class="text-justify"
                          style="flex: 1; overflow: hidden; line-height: 1.5"
                        >
                          <!-- Event Details -->
                          <div
                            class="row text-subtitle2"
                            v-if="item.type === 'event'"
                          >
                            <div v-if="item.platform" class="q-mb-xs">
                              <q-badge
                                :color="
                                  item.platform === 'Online'
                                    ? 'blue-6'
                                    : 'green-6'
                                "
                                :label="item.platform"
                              >
                                <q-icon
                                  :name="
                                    item.platform === 'Online'
                                      ? 'videocam'
                                      : 'place'
                                  "
                                  size="14px"
                                  class="q-mr-xs"
                                />
                              </q-badge>
                            </div>
                            <div v-if="item.venue" class="col-12">
                              <div class="row items-center no-wrap">
                                <q-icon
                                  :name="
                                    item.platform === 'Online'
                                      ? 'link'
                                      : 'location_on'
                                  "
                                  :color="
                                    item.platform === 'Online'
                                      ? 'blue-6'
                                      : 'green-6'
                                  "
                                  size="xs"
                                  class="q-mr-xs"
                                />

                                <a
                                  v-if="item.platform === 'Online'"
                                  :href="formatUrl(item.venue)"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="text-primary"
                                >
                                  {{ truncateUrl(item.venue, 40) }}
                                  <q-icon
                                    name="open_in_new"
                                    size="12px"
                                    class="q-ml-xs"
                                  />
                                </a>

                                <span v-else>
                                  {{ item.venue }}
                                </span>
                              </div>
                            </div>

                            <div v-if="item.timeCombine" class="col-12">
                              <div class="row items-center no-wrap">
                                <q-icon
                                  name="schedule"
                                  color="orange-6"
                                  size="xs"
                                  class="q-mr-xs"
                                />
                                <span>{{ item.timeCombine }}</span>
                              </div>
                            </div>

                            <div v-if="item.participants" class="col-12">
                              <div class="row items-center no-wrap">
                                <q-icon
                                  name="group"
                                  color="purple-6"
                                  size="xs"
                                  class="q-mr-xs"
                                />
                                <span>{{ item.participants }}</span>
                              </div>
                            </div>

                            <div v-if="item.trainingProvider" class="col-12">
                              <div class="row items-center no-wrap">
                                <q-icon
                                  name="business"
                                  color="indigo-6"
                                  size="xs"
                                  class="q-mr-xs"
                                />
                                <span>{{ item.trainingProvider }}</span>
                              </div>
                            </div>
                          </div>

                          <!-- Announcement Description -->
                          <div
                            v-else-if="item.description"
                            v-html="item.description"
                          ></div>
                        </div>

                        <div
                          v-if="overflowItems.has(getItemKey(item))"
                          style="
                            text-align: right;
                            margin-top: 10px;
                            height: 10px;
                            padding-right: 0;
                            margin-right: -15px;
                          "
                        >
                          <q-btn
                            flat
                            color="primary"
                            label="See More"
                            @click="openAnnouncementDialog(item)"
                            class="text-bold q-pa-none"
                            style="min-height: auto"
                          />
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PDF/Image Dialog -->
      <q-dialog v-model="dialogVisible" maximized>
        <q-card
          :class="[
            'bold-text',
            $q.screen.name + '-text',
            $q.screen.name + '-width',
            $q.screen.name + '-min-height',
          ]"
          style="height: 100vh; display: flex; flex-direction: column"
        >
          <q-card-section
            class="bg-primary text-white row items-center q-pb-md"
            style="flex-shrink: 0"
          >
            <div class="bg-primary text-white text-bold">
              {{
                currentAnnouncement?.type === "event" ? "Event" : "Announcement"
              }}
            </div>
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

          <div
            style="
              flex: 1;
              display: flex;
              justify-content: center;
              padding: 20px;
              background: #f5f5f5;
              overflow-y: auto;
            "
          >
            <object
              v-if="pdfUrl"
              :data="pdfUrl"
              :type="getFileType(pdfUrl)"
              :style="`width: ${contentWidth}%;`"
            >
              <img :src="pdfUrl" alt="Announcement" @load="onImageLoad" />
            </object>
          </div>
        </q-card>
      </q-dialog>

      <!-- Announcement Details Dialog -->
      <q-dialog v-model="selectedAnnouncement">
        <q-card
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
          <q-card-section class="bg-primary row items-center q-pa-sm text-h6">
            <div class="bg-primary text-white text-bold">
              {{
                currentAnnouncement?.type === "event" ? "Event" : "Announcement"
              }}
            </div>
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

          <q-card-section
            class="q-pa-md virtual-scroll"
            v-if="currentAnnouncement"
          >
            <div class="text-h5 text-bold q-mb-xs">
              {{
                currentAnnouncement.type === "event"
                  ? currentAnnouncement.programTitle
                  : currentAnnouncement.name
              }}
            </div>
            <div class="text-subtitle2 text-bold text-grey-7 q-mb-sm">
              <template v-if="currentAnnouncement.type === 'event'">
                {{ getFullFormattedDate(currentAnnouncement.fromDate) }}
                <span
                  v-if="
                    currentAnnouncement.toDate &&
                    currentAnnouncement.fromDate !== currentAnnouncement.toDate
                  "
                >
                  - {{ getFullFormattedDate(currentAnnouncement.toDate) }}
                </span>
              </template>
              <template v-else>
                {{ getFullFormattedDate(currentAnnouncement.dateTimeCreated) }}
              </template>
            </div>

            <div v-if="currentAnnouncement.type === 'event'" class="q-mt-md">
              <div v-if="currentAnnouncement.platform">
                <q-badge
                  :color="
                    currentAnnouncement.platform === 'Online'
                      ? 'blue-6'
                      : 'green-6'
                  "
                  :label="currentAnnouncement.platform"
                  class="text-subtitle1"
                >
                  <q-icon
                    :name="
                      currentAnnouncement.platform === 'Online'
                        ? 'videocam'
                        : 'place'
                    "
                    size="sm"
                    class="q-mr-xs"
                  />
                </q-badge>
              </div>

              <div v-if="currentAnnouncement.venue" class="col-12 q-mt-md">
                <div class="row items-start no-wrap">
                  <div class="q-pa-xs bg-grey-3 rounded-borders q-mr-md">
                    <q-icon
                      :name="
                        currentAnnouncement.platform === 'Online'
                          ? 'link'
                          : 'location_on'
                      "
                      :color="
                        currentAnnouncement.platform === 'Online'
                          ? 'blue-6'
                          : 'green-6'
                      "
                      size="md"
                    />
                  </div>

                  <div class="column">
                    <span class="text-weight-medium">
                      {{
                        currentAnnouncement.platform === "Online"
                          ? "Link / URL"
                          : "Venue"
                      }}
                    </span>

                    <a
                      v-if="currentAnnouncement.platform === 'Online'"
                      :href="formatUrl(currentAnnouncement.venue)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary"
                    >
                      {{ truncateUrl(currentAnnouncement.venue, 40) }}
                      <q-icon name="open_in_new" size="12px" class="q-ml-xs" />
                    </a>
                    <span v-else>{{ currentAnnouncement.venue }}</span>
                  </div>
                </div>
              </div>

              <div
                v-if="currentAnnouncement.timeCombine"
                class="col-12 q-mt-sm"
              >
                <div class="row items-start no-wrap">
                  <div class="q-pa-xs bg-grey-3 rounded-borders q-mr-md">
                    <q-icon name="schedule" color="orange-6" size="md" />
                  </div>
                  <div class="column">
                    <span class="text-weight-medium">Time</span>
                    <span>{{ currentAnnouncement.timeCombine }}</span>
                  </div>
                </div>
              </div>

              <div
                v-if="currentAnnouncement.participants"
                class="col-12 q-mt-sm"
              >
                <div class="row items-start no-wrap">
                  <div class="q-pa-xs bg-grey-3 rounded-borders q-mr-md">
                    <q-icon name="group" color="purple-6" size="md" />
                  </div>
                  <div class="column">
                    <span class="text-weight-medium">Participants</span>
                    <span>{{ currentAnnouncement.participants }}</span>
                  </div>
                </div>
              </div>

              <div
                v-if="currentAnnouncement.trainingProvider"
                class="col-12 q-mt-sm"
              >
                <div class="row items-start no-wrap">
                  <div class="q-pa-xs bg-grey-3 rounded-borders q-mr-md">
                    <q-icon name="business" color="indigo-6" size="md" />
                  </div>
                  <div class="column">
                    <span class="text-weight-medium">Training Provider</span>
                    <span>{{ currentAnnouncement.trainingProvider }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else-if="currentAnnouncement.description"
              class="text-justify"
              v-html="currentAnnouncement.description"
            ></div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Announcements",

  data() {
    return {
      displayedCount: 10,
      itemsPerLoad: 10,
      isLoadingMore: false,
      scrollThreshold: 1000,
      dialogVisible: false,
      pdfUrl: "",
      contentWidth: 45,
      selectedAnnouncement: false,
      currentAnnouncement: null,
      overflowItems: new Set(),
      contentRefs: new Map(),
      resizeObserver: null,
      resizeTimeout: null,
    };
  },

  computed: {
    ...mapGetters({
      combineEvents: "announcementModule/getAnnouncements",
    }),

    combinedItems() {
      const announcements = (this.combineEvents.announcements || []).map(
        (item) => ({
          ...item,
          type: "announcement",
          sortDate: new Date(item.dateTimeCreated),
        }),
      );

      const events = (this.combineEvents.events || []).map((item) => ({
        ...item,
        type: "event",
        sortDate: new Date(item.fromDate),
      }));

      return [...announcements, ...events];
    },

    sortedAnnouncements() {
      return this.combinedItems.sort((a, b) => b.sortDate - a.sortDate);
    },

    displayedAnnouncement() {
      return this.sortedAnnouncements.slice(0, this.displayedCount);
    },

    groupedAnnouncements() {
      const groups = {};
      this.displayedAnnouncement.forEach((item) => {
        const dateToUse =
          item.type === "event" ? item.fromDate : item.dateTimeCreated;
        const monthYear = this.getDatePart(dateToUse, "monthyear");
        if (!groups[monthYear]) {
          groups[monthYear] = [];
        }
        groups[monthYear].push(item);
      });
      return groups;
    },
  },

  methods: {
    formatUrl(url) {
      if (!url) return "";
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return `https://${url}`;
      }
      return url;
    },

    truncateUrl(url, maxLength) {
      if (!url) return "";
      if (url.length <= maxLength) return url;
      return url.substring(0, maxLength) + "...";
    },
    async getAnnouncements() {
      try {
        await this.$store.dispatch("announcementModule/fetchAnnouncements");
        this.checkOverflow();
      } catch (error) {
        console.error("Failed getting announcements", error);
      }
    },

    getItemKey(item) {
      return `${item.type}-${item.id}`;
    },

    setContentRef(el, item) {
      if (el) {
        const key = this.getItemKey(item);
        this.contentRefs.set(key, el);
      }
    },

    checkOverflow() {
      this.contentRefs.forEach((el, key) => {
        if (el && el.scrollHeight > el.clientHeight) {
          this.overflowItems.add(key);
        } else {
          this.overflowItems.delete(key);
        }
      });
    },

    setupResizeObserver() {
      if (typeof ResizeObserver === "undefined") {
        // Fallback for browsers that don't support ResizeObserver
        window.addEventListener("resize", this.handleWindowResize);
        return;
      }

      this.resizeObserver = new ResizeObserver((entries) => {
        // Debounce the overflow check
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
          this.checkOverflow();
        }, 100);
      });

      // Observe the container
      const container = this.$el.querySelector(".container");
      if (container) {
        this.resizeObserver.observe(container);
      }
    },

    handleWindowResize() {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.checkOverflow();
      }, 250);
    },

    getDatePart(dateTimeCreated, part) {
      const date = new Date(dateTimeCreated);

      const months = [
        "JANUARY",
        "FEBRUARY",
        "MARCH",
        "APRIL",
        "MAY",
        "JUNE",
        "JULY",
        "AUGUST",
        "SEPTEMBER",
        "OCTOBER",
        "NOVEMBER",
        "DECEMBER",
      ];

      const daysOfWeek = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ];

      switch (part.toLowerCase()) {
        case "day":
          return date.getDate();
        case "dayofweek":
          return daysOfWeek[date.getDay()];
        case "month":
          return months[date.getMonth()];
        case "year":
          return date.getFullYear();
        case "monthyear":
          return `${months[date.getMonth()]} ${date.getFullYear()}`;
        default:
          return "";
      }
    },

    getFullFormattedDate(dateTimeCreated) {
      const date = new Date(dateTimeCreated);
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();

      return `${month} ${day}, ${year}`;
    },

    openPdfLink(link, module) {
      this.currentAnnouncement = link;
      if (module === "event") {
        if (!link.fileContent) return;

        const blob = this.base64ToBlob(link.fileContent, "application/pdf");
        this.pdfUrl = URL.createObjectURL(blob);
        this.dialogVisible = true;
        return;
      }
      this.pdfUrl = link;
      this.dialogVisible = true;
    },

    base64ToBlob(base64, mimeType) {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: mimeType });
    },

    openAnnouncementDialog(item) {
      this.currentAnnouncement = item;
      this.selectedAnnouncement = true;
    },

    onImageLoad(event) {
      const img = event.target;
      this.contentWidth = img.naturalWidth > 5000 ? 90 : 45;
    },

    // getFileType(url) {
    //   if (url.toLowerCase().endsWith(".pdf")) {
    //     return "application/pdf";
    //   }
    //   return "image/jpeg";
    // },

    getFileType(url) {
      if (!url || typeof url !== "string") {
        return "application/pdf"; // default fallback
      }

      if (url.toLowerCase().endsWith(".pdf")) {
        return "application/pdf";
      }
      return "image/jpeg";
    },

    handleScroll() {
      if (this.isLoadingMore) return;

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      if (distanceFromBottom < this.scrollThreshold) {
        this.loadMoreAnnouncements();
      }
    },

    async loadMoreAnnouncements() {
      if (this.isLoadingMore) return;
      if (this.displayedCount >= this.sortedAnnouncements.length) return;

      this.isLoadingMore = true;

      await new Promise((resolve) => setTimeout(resolve, 650));

      const newCount = Math.min(
        this.displayedCount + this.itemsPerLoad,
        this.sortedAnnouncements.length,
      );

      this.displayedCount = newCount;
      this.isLoadingMore = false;

      this.$nextTick(() => {
        this.checkOverflow();
      });
    },
  },

  async created() {
    await this.getAnnouncements();
  },

  mounted() {
    window.addEventListener("scroll", this.handleScroll);

    this.setupResizeObserver();

    this.$nextTick(() => {
      requestAnimationFrame(() => {
        this.checkOverflow();
      });
    });
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleWindowResize);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.contentRefs.clear();
    this.overflowItems.clear();
  },
};
</script>
