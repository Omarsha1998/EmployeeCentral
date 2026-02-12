import axios from 'axios';
import helperMethods from 'src/helperMethods';

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "export-personal-informations" + "/";
const timeOut = process.env.BACKEND_REST_API_TIMEOUT;

export default {
  async getAllOptions() {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.get(api + controllerName + 'get-all-options', headers, { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },
  async searchEmployee(context, body) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.post(api + controllerName + 'search-employee', body, headers, { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },
  async exportToExcel(context, body) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } };
      return await axios.post(api + controllerName + 'export-to-excel', body, headers, { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },
}
