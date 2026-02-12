import axios from 'axios';
import helperMethods from 'src/helperMethods';

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "maintenance" + "/";
const timeOut = process.env.BACKEND_REST_API_TIMEOUT;

export default {
  async getAllModules({ commit }) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      let response = await axios.get(api + controllerName + 'get-all-modules', headers, { timeout: timeOut });

      commit('SET_DEFAULT_VALUES');
      commit('SET_NEW_VALUES', response.data);

    } catch (error) {
      throw error;
    }
  },
  async getAllFields(context, moduleID) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.get(api + controllerName + 'get-all-fields' + '?' + 'moduleID=' + moduleID, headers, { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },
  async getList(context, {fieldName, statusID, description}) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.get(api + controllerName + 'get-list' + '?' + 'fieldName=' + fieldName + '&statusID=' + statusID + '&description=' + description, headers, { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },
  async submit(context, body) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.post(api + controllerName + 'submit', body, headers, { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },
  async getCourses() {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.get(api + controllerName + 'get-courses', headers, { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },
}
