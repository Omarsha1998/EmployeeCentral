import axios from "axios";
import { Cookies } from "quasar";
import helperMethods from "src/helperMethods";

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "announcement";

export default {
  async fetchAnnouncements({ commit, rootGetters }, announcements) {
    try {
      const response = await axios.get(
        `${api}${controllerName}/getAnnouncements`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );
      const isProd = rootGetters["configModule/prodEnvironment"];

      commit("SET_ANNOUNCEMENTS", {
        announcements: response.data,
        isProd,
      });
    } catch (error) {
      console.error("Error Fetching Announcement", error);
      throw error;
    }
  },

  async setTraining({ commit }, data) {
    try {
      const response = await axios.post(
        `${api}${controllerName}/setTraining`,
        data,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
    } catch (error) {
      console.error("Error Requesting Leaves", error);
      throw error;
    }
  },

  async getEvents({ commit }) {
    try {
      const response = await axios.get(
        `${api}${controllerName}/eventsInCalendar`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );

      commit("SET_EVENTS", response.data);
    } catch (error) {
      console.error("Error on getting events", error);
      throw error;
    }
  },

  async removeSetSchedule({}, data) {
    try {
      const response = await axios.post(
        `${api}${controllerName}/removeSetSchedule`,
        data,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
    } catch (error) {
      console.error("Error in reomving set event", error);
      throw error;
    }
  },

  async updateEvent({}, data) {
    try {
      const response = await axios.post(
        `${api}${controllerName}/updateSetSchedule`,
        data,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
    } catch (error) {
      console.error("Error in updating event", error);
      throw error;
    }
  },
};
