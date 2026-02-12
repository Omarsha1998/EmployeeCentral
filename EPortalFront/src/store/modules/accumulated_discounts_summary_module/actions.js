import axios from 'axios';
import helperMethods from 'src/helperMethods';

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "accumulated-discounts-summary" + "/";
const timeOut = process.env.BACKEND_REST_API_TIMEOUT;

export default {
  async onSearch(context, body) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.post(api + controllerName + 'on-search', body, headers, { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  }
}
