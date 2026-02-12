import axios from 'axios';
import helperMethods from 'src/helperMethods';

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "attachment-archives" + "/";
const timeOut = process.env.BACKEND_REST_API_TIMEOUT;

export default {
  async getAllDepartments() {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.get(api + controllerName + 'get-all-departments', headers, { timeout: timeOut });
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
  async getEmployeeAttachments(context, employeeID) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
     return await axios.get(api + controllerName + 'get-employee-attachments' + '?' +'employeeID=' + employeeID, headers , { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },
}
