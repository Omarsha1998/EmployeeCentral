import axios from "axios";
import { Cookies } from "quasar";
import helperMethods from "src/helperMethods";

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "faculty";

export default {
  async getColleges({ commit }) {
    try {
      const result = await axios.get(`${api}${controllerName}/getColleges`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
      commit("SET_COLLEGES", result.data);
    } catch (error) {
      console.error("Error getting colleges");
      throw error;
    }
  },

  async getSemesters({ commit }) {
    try {
      const result = await axios.get(`${api}${controllerName}/getSemesters`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
      commit("SET_SEMESTERS", result.data);
    } catch (error) {
      console.error("Error getting semesters");
    }
  },

  async getReports({ commit }, data) {
    try {
      const result = await axios.post(
        `${api}${controllerName}/getReports`,
        data,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
      commit("SET_REPORTS", result.data);
    } catch (error) {
      console.error("Error getting reports");
    }
  },
};
