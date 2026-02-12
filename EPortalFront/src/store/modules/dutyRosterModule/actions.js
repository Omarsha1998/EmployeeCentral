import axios from "axios";
import { Cookies } from "quasar";
import helperMethods from "src/helperMethods";

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "dutyroster";

export default {
  async getDepartment({ commit }) {
    try {
      const response = await axios.get(
        `${api}${controllerName}/getDepartment`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );
      commit("SET_DEPARTMENT", response.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getEmployees({ commit }, data) {
    try {
      const response = await axios.get(`${api}${controllerName}/getEmployees`, {
        params: data,
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      commit("SET_EMPLOYEES", response.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getEmployeeDtr({ commit }, data) {
    try {
      const response = await axios.get(
        `${api}${controllerName}/getEmployeeDtr`,
        {
          params: data,
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      const dataResponse = response.data;

      const dtrDetails = dataResponse.employeeDtr.map((item) => {
        const schedFromDate = new Date(item.schedFrom);
        const schedToDate = new Date(item.schedTo);

        return {
          ...item,
          schedFrom: schedFromDate,
          schedTo: schedToDate,
          TimeIN: new Date(item.TimeIN),
          transDate: new Date(item.transDate),
          transDateTime: new Date(item.transDateTime),
          date: new Date(item.date),
          schedFromFormat: schedFromDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          schedToFormat: schedToDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      });

      const scheduleDetails = dataResponse.schedule.map((item) => {
        const timeFrom = item.from;
        const timeTo = item.to;

        return {
          ...item,
          combineTime: `${timeFrom} - ${timeTo}`,
        };
      });

      commit("SET_EMPLOYEE_DTR", dtrDetails);
      commit("SET_SCHEDULE", scheduleDetails);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async changeSchedule({ commit }, data) {
    try {
      const response = await axios.post(
        `${api}${controllerName}/setSchedule`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async submitNewSchedule({ commit }, data) {
    try {
      const response = await axios.post(
        `${api}${controllerName}/submitNewSchedule`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getPermanentScheduleList({ commit }) {
    try {
      const response = await axios.get(
        `${api}${controllerName}/getPermanentScheduleList`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );

      commit("SET_PERMASCHEDULE_LIST", response.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async setPermanentSched({ commit }, data) {
    try {
      const response = await axios.post(
        `${api}${controllerName}/setPermanentSched`,
        data,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
