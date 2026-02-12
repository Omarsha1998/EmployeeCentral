import axios from "axios";
import { Cookies } from "quasar";
import helperMethods from "src/helperMethods";

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "dtr";

export default {
  async fetchDTR({ commit }, data) {
    try {
      const response = await axios.get(
        `${api}${controllerName}/getDTRDetails`,
        {
          params: data,
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      // Convert string representations to Date objects
      const dtrDetails = response.data.map((item) => ({
        ...item,
        schedFrom: new Date(item.schedFrom),
        schedTo: new Date(item.schedTo),
        TimeIN: new Date(item.TimeIN),
      }));

      commit("SET_DTR_DETAILS", dtrDetails);
    } catch (error) {
      console.error("Error Fetching Announcement", error);
      throw error;
    }
  },

  async fetchNoDtrEmployee({ commit }, data) {
    try {
      const response = await axios.get(
        `${api}${controllerName}/no-dtr-employee`,
        {
          params: data,
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
      commit("SET_EMPLOYEE_NODTR", response.data.result);
    } catch (error) {
      console.error("Error Fetching Employee With No DTR", error);
      throw error;
    }
  },

  async employeeClass({ commit }) {
    try {
      const response = await axios.get(
        `${api}${controllerName}/employeeClass`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );

      commit("SET_EMPLOYEE_CLASS", response.data);
    } catch (error) {
      console.error("Error in getting employee class", error);
      throw error;
    }
  },

  async residentFaculty({ commit }, data) {
    try {
      const response = await axios.get(
        `${api}${controllerName}/residentFaculty`,
        {
          params: data,
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );
      commit("SET_DTR_DETAILS", response.data);
    } catch (error) {
      console.error("Error in searching employee's daily time record", error);
      throw error;
    }
  },

  async searchDtr({ commit }, data) {
    try {
      const response = await axios.get(`${api}${controllerName}/searchDtr`, {
        params: data,
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      commit("SET_DTR_DETAILS", response.data);
    } catch (error) {
      console.error("Error in searching employee's daily time record", error);
      throw error;
    }
  },

  async dtrPosting({}, data) {
    try {
      const response = await axios.post(
        `${api}${controllerName}/dtrPosting`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );
      return response;
    } catch (error) {
      console.error("Error in updating dtr time posting", error);
      throw error;
    }
  },

  async finalizeTimeData({}, data) {
    try {
      const result = await axios.post(
        `${api}${controllerName}/finalizeTImeData`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );
      return result;
    } catch (error) {
      console.error("Error finalizing time data", error);
      throw error;
    }
  },

  async saveTimeData({ commit }, data) {
    try {
      const result = await axios.post(
        `${api}${controllerName}/saveTimeData`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      commit("UPDATE_DTR_DETAILS", result.data);
    } catch (error) {
      console.error("Error saving time data changes", error);
      throw error;
    }
  },

  async checkOwnership({}, data) {
    try {
      const response = await axios.post(
        `${api}${controllerName}/checkApproverOwnership`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error checking ownership", error);
      throw error;
    }
  },
};
