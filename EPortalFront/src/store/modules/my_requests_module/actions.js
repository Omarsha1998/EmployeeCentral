import axios from "axios";
import helperMethods from "src/helperMethods";

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "my-requests" + "/";
const timeOut = process.env.BACKEND_REST_API_TIMEOUT;

export default {
  async get({ commit }, { employeeID, dateRangeSearch }) {
    try {
      const token = helperMethods.getCookie("token");
      const headers = { headers: { Authorization: "Bearer " + token } };
      const body = {
        employee_id: employeeID,
        date_range_search: dateRangeSearch,
      };
      let response = await axios.post(
        api + controllerName + "get",
        body,
        headers,
        { timeout: timeOut },
      );

      commit("SET_DEFAULT_VALUES");
      commit("SET_NEW_VALUES", response.data.my_requests);
    } catch (error) {
      throw error;
    }
  },
  async requestNotHighLightedToRequester({ commit }, data) {
    try {
      const token = helperMethods.getCookie("token");
      const headers = { headers: { Authorization: "Bearer " + token } };
      const body = { request_id: data.requestID };
      await axios.put(
        api + controllerName + "request-not-high-lighted-to-requester",
        body,
        headers,
        { timeout: timeOut },
      );
      commit("SET_NOT_HIGHLIGHTED_TO_REQUESTER", data.currentIndex);
    } catch (error) {
      throw error;
    }
  },
  async submitComply({ context }, { employeeID, body }) {
    try {
      const token = helperMethods.getCookie("token");
      const headers = { headers: { Authorization: "Bearer " + token } };
      await axios.put(
        api + controllerName + "submit-comply/" + employeeID,
        body,
        headers,
        { timeout: timeOut },
      );
    } catch (error) {
      throw error;
    }
  },

  async getAllProvinces(context, requestDtlID) {
    try {
      const token = helperMethods.getCookie("token");
      const headers = { headers: { Authorization: "Bearer " + token } };
      return await axios.get(
        api +
          controllerName +
          "get-all-provinces" +
          "?" +
          "requestDtlID=" +
          requestDtlID,
        headers,
        { timeout: timeOut },
      );
    } catch (error) {
      throw error;
    }
  },

  async getAllCitiesOrMunicipalities(context, requestDtlID) {
    try {
      const token = helperMethods.getCookie("token");
      const headers = { headers: { Authorization: "Bearer " + token } };
      return await axios.get(
        api +
          controllerName +
          "get-all-cities-or-municipalities" +
          "?" +
          "requestDtlID=" +
          requestDtlID,
        headers,
        { timeout: timeOut },
      );
    } catch (error) {
      throw error;
    }
  },
  async getAllInstitutions() {
    try {
      const token = helperMethods.getCookie("token");
      const headers = { headers: { Authorization: "Bearer " + token } };
      return await axios.get(
        api + controllerName + "get-all-institutions",
        headers,
        { timeout: timeOut },
      );
    } catch (error) {
      throw error;
    }
  },
  async getAllDegrees() {
    try {
      const token = helperMethods.getCookie("token");
      const headers = { headers: { Authorization: "Bearer " + token } };
      return await axios.get(
        api + controllerName + "get-all-degrees",
        headers,
        { timeout: timeOut },
      );
    } catch (error) {
      throw error;
    }
  },
  async getAllCourses() {
    try {
      const token = helperMethods.getCookie("token");
      const headers = { headers: { Authorization: "Bearer " + token } };
      return await axios.get(
        api + controllerName + "get-all-courses",
        headers,
        { timeout: timeOut },
      );
    } catch (error) {
      throw error;
    }
  },
  async getAllMajors(context, requestDtlID) {
    try {
      const token = helperMethods.getCookie("token");
      const headers = { headers: { Authorization: "Bearer " + token } };
      return await axios.get(
        api +
          controllerName +
          "get-all-majors" +
          "?" +
          "requestDtlID=" +
          requestDtlID,
        headers,
        { timeout: timeOut },
      );
    } catch (error) {
      throw error;
    }
  },
  async deleteRequest(context, { employeeID, body }) {
    try {
      const token = helperMethods.getCookie("token");
      const headers = { headers: { Authorization: "Bearer " + token } };
      return await axios.put(
        api + controllerName + "delete-request/" + employeeID,
        body,
        headers,
        { timeout: timeOut },
      );
    } catch (error) {
      throw error;
    }
  },
};
