import axios from 'axios';
import helperMethods from 'src/helperMethods';

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "personal-informations" + "/";
const timeOut = process.env.BACKEND_REST_API_TIMEOUT;

export default {
  async get({ commit }, employeeID) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      let response = await axios.get(api + controllerName + 'get' + '?' + 'employeeID=' + employeeID
        , headers, { timeout: timeOut });

      commit('SET_DEFAULT_VALUES');
      commit('SET_NEW_VALUES', response.data.personal_informations);

    } catch (error) {
      throw error;
    }
  },

  async getAllReligions() {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.get(api + controllerName + 'get-all-religions', headers, { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },

  async getAllCivilStatuses() {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.get(api + controllerName + 'get-all-civil-statuses', headers, { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },

  async getAllRelationships() {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.get(api + controllerName + 'get-all-relationships', headers, { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },

  async getAllRegions() {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.get(api + controllerName + 'get-all-regions', headers, { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },

  async getAllProvinces(context, regionCode) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.get(api + controllerName + 'get-all-provinces' + '?' + 'regionCode=' + regionCode, headers, { timeout: timeOut });
    } catch (error) {
      throw error;
    }
  },


  async getAllCitiesOrMunicipalities(context, provinceCode) {
    try {
      const token = helperMethods.getCookie('token');
      const headers = { headers: { 'Authorization': 'Bearer ' + token } }
      return await axios.get(api + controllerName + 'get-all-cities-or-municipalities' + '?' + 'provinceCode=' + provinceCode, headers, { timeout: timeOut });
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