import axios from 'axios';
import helperMethods from 'src/helperMethods';

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "trainings-or-seminars" + "/";
const timeOut = process.env.BACKEND_REST_API_TIMEOUT;

export default {
  async get({ commit }, employeeID ) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      let response = await axios.get(api + controllerName + 'get' + '?' +'employeeID=' + employeeID + "&token=" + token
      , headers , { timeout: timeOut });

      commit('SET_DEFAULT_VALUES');
      commit('SET_NEW_VALUES', response.data.trainings_or_seminars);

    } catch (error) {
      throw error;
    }
  },
  async createRequest(context, body) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.post(api + controllerName + 'create-request', body, headers, { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },
}
