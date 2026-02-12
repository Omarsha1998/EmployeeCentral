import axios from 'axios';
import helperMethods from 'src/helperMethods';

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "other-requests" + "/";
const timeOut = process.env.BACKEND_REST_API_TIMEOUT;

export default {
  async get({ commit }, { employeeID, dateRangeSearch }) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      const body = { 'employee_id': employeeID, 'date_range_search': dateRangeSearch }
      let response = await axios.post(api + controllerName + 'get', body, headers, { timeout: timeOut });

      commit('SET_DEFAULT_VALUES');
      commit('SET_NEW_VALUES', response.data.other_requests);

    } catch (error) {
      throw error;
    }
  },
  async requestNotHighLightedToHR({commit}, body) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
       await axios.put(api + controllerName + 'request-not-high-lighted-to-hr', body, headers, { timeout: timeOut });
      
       commit('SET_NOT_HIGHLIGHTED_TO_HR', body.currentIndex);
    } catch (error) {
      throw error;
    }
  },
  async approveRequest(context, { employeeID, body }) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.put(api + controllerName + 'approve-request/' + employeeID, body, headers, { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },
  async setHRRemarks(context, { employeeID, body }) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
     return await axios.put(api + controllerName + 'set-hr-remarks/' + employeeID, body, headers, { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },
  async deleteRequest(context, { employeeID, body }) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.put(api + controllerName + 'delete-request/' + employeeID, body, headers, { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },
}
