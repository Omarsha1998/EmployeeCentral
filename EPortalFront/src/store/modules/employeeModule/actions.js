import axios from "axios";
import { Cookies } from "quasar";
import helperMethods from "src/helperMethods";

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "employeeDetails";

export default {
  async getClass({ commit }) {
    try {
      const response = await axios.get(`${api}${controllerName}/getClass`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      commit("SET_CLASS", response.data);
    } catch (error) {
      console.error(error);
    }
  },

  async getInformation({ commit }, data) {
    try {
      const response = await axios.get(
        `${api}${controllerName}/getInformation`,
        {
          params: data,
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      commit("SET_EMPLOYEE_INFO", response.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
