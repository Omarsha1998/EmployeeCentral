import axios from 'axios';
import helperMethods from 'src/helperMethods';

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "employee-dependents" + "/";
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
  async getEmployees(context, body) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.post(api + controllerName + 'get-employees', body, headers, { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },
  async getEmployeeDependents(context, employeeID) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.get(api + controllerName + 'get-employee-dependents' + '?' +'employeeID=' + employeeID, headers , { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },
}
