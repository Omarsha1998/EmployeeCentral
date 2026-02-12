import axios from 'axios';
import helperMethods from 'src/helperMethods';

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "educational-backgrounds" + "/";
const timeOut = process.env.BACKEND_REST_API_TIMEOUT;

export default {
  async get({ commit }, employeeID ) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      let response = await axios.get(api + controllerName + 'get' + '?' +'employeeID=' + employeeID + '&token=' + token
      , headers , { timeout: timeOut });

      commit('SET_DEFAULT_VALUES');
      commit('SET_NEW_VALUES', response.data.educational_backgrounds);

    } catch (error) {
      throw error;
    }
  },
  async getOptions() {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      let response = await axios.get(api + controllerName + 'get-options', headers , { timeout: timeOut });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async getMajors(context, courseID) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      let response = await axios.get(api + controllerName + 'get-majors' + "?" + "courseID=" + courseID, headers , { timeout: timeOut });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async createRequest(context, body) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.post(api + controllerName + 'create-request', body, headers, { timeout: this.timeOut });
    } catch (error) {
      throw error;
    }
  },
}
