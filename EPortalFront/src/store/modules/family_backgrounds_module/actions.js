import axios from "axios";
import helperMethods from "src/helperMethods";

const api = process.env.BACKEND_REST_API_URL;
const controllerName =
  helperMethods.getControllerBase() + "family-backgrounds" + "/";
const timeOut = process.env.BACKEND_REST_API_TIMEOUT;

export default {
  async get({ commit }, employeeID) {
    try {
      const token = helperMethods.getCookie("token");
      const headers = { headers: { Authorization: "Bearer " + token } };
      const response = await axios.get(
        api +
          controllerName +
          "get" +
          "?" +
          "employeeID=" +
          employeeID +
          "&token=" +
          token,
        headers,
        { timeout: timeOut },
      );
      commit("SET_DEFAULT_VALUES");
      commit("SET_NEW_VALUES", response.data.family_backgrounds);
    } catch (error) {
      throw error;
    }
  },
  async getRelationships() {
    try {
      const token = helperMethods.getCookie("token");
      const headers = { headers: { Authorization: "Bearer " + token } };
      const response = await axios.get(
        api + controllerName + "get-relationships",
        headers,
        { timeout: timeOut },
      );
      return response.data.relationships;
    } catch (error) {
      throw error;
    }
  },
  async getRelationshipCategories() {
    try {
      const token = helperMethods.getCookie("token");
      const headers = { headers: { Authorization: "Bearer " + token } };
      const response = await axios.get(
        api + controllerName + "get-relationship-categories",
        headers,
        { timeout: timeOut },
      );
      return response.data.relationshipCategories;
    } catch (error) {
      throw error;
    }
  },
  async createRequest(context, body) {
    try {
      const token = helperMethods.getCookie("token");
      const headers = { headers: { Authorization: "Bearer " + token } };
      return await axios.post(
        api + controllerName + "create-request",
        body,
        headers,
        { timeout: timeOut },
      );
    } catch (error) {
      throw error;
    }
  },
};
