import axios from 'axios';
import helperMethods from 'src/helperMethods';

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "my-employee-dependents" + "/";
const timeOut = process.env.BACKEND_REST_API_TIMEOUT;

export default {
  async getDetails(context, employeeID) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.get(api + controllerName + 'get-details' + '?' +'employeeID=' + employeeID, headers , { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },
}
