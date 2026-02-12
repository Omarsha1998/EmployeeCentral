import axios from "axios";
import helperMethods from "src/helperMethods";

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "users" + "/";
const timeOut = process.env.BACKEND_REST_API_TIMEOUT;

export default {
  async login({ dispatch }, { employeeID, password, rememberMe }) {
    try {
      const body = JSON.stringify({
        employee_id: employeeID,
        password: password,
      });
      const headers = {
        "Content-Type": "application/json",
      };

      const response = await fetch(api + controllerName + "login", {
        method: "POST",
        headers: headers,
        body: body,
        timeout: timeOut,
      });

      if (response.status !== 200) throw await response.json();

      const responseData = await response.json();

      const token = responseData.token;

      if (rememberMe) {
        const numberOfDays = 3;
        const expires = helperMethods.addDays(
          helperMethods.getDateTimeToday(),
          numberOfDays,
        );
        helperMethods.createCookie("token", token, expires);
      } else helperMethods.createCookie("token", token);

      dispatch("setNewValues", token);
    } catch (error) {
      throw error;
    }
  },

  async loginViaPwHash({ dispatch }, { employeeID }) {
    try {
      const body = JSON.stringify({ employee_id: employeeID });
      const headers = {
        "Content-Type": "application/json",
      };

      const response = await fetch(api + controllerName + "loginViaPwHash", {
        method: "POST",
        headers: headers,
        body: body,
        timeout: timeOut,
      });

      if (response.status !== 200) return { error: "Token not valid" };

      const responseData = await response.json();
      let token = responseData.token;
      helperMethods.createCookie("token", token);
      dispatch("setNewValues", token);

      return { token };
    } catch (error) {
      return { error: "Unable to fetch data." };
    }
  },

  async logout({ dispatch }, employeeID) {
    try {
      const token = helperMethods.getCookie("token");
      const body = JSON.stringify({ employee_id: employeeID }); // Convert to JSON string
      const headers = {
        Authorization: "Bearer " + token,
      };
      const response = await fetch(api + controllerName + "logout", {
        method: "POST",
        headers: headers,
        body: body,
        timeout: timeOut,
      });

      if (response.status === 200 || response.status === 401)
        dispatch("setDefaultValues");
      else throw new Error("An error has occurred in user_module.logout()");
    } catch (error) {
      throw error;
    }
  },
  async upload(context, body) {
    try {
      const token = helperMethods.getCookie("token");
      const headers = { headers: { Authorization: "Bearer " + token } };
      return await axios.post(
        api + helperMethods.getControllerBase() + "uploads",
        body,
        headers,
        { timeout: timeOut },
      );
    } catch (error) {
      throw error;
    }
  },

  setNewValues({ commit }, token) {
    try {
      const [, payloadBase64] = token.split(".");
      const cleanedPayload = payloadBase64
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const decodedPayload = JSON.parse(
        decodeURIComponent(escape(atob(cleanedPayload))),
        "utf-8",
      );
      decodedPayload.token = token;

      commit("SET_NEW_VALUES", decodedPayload);
    } catch (error) {
      throw error;
    }
  },

  setDefaultValues({ commit }, refreshPage = false) {
    try {
      helperMethods.deleteCookie("token");
      helperMethods.deleteCookie("exposed_license_indexes");
      helperMethods.deleteCookie("not_exposed_notification_index");
      commit("SET_DEFAULT_VALUES");
      if (refreshPage === true) helperMethods.refreshPage();
    } catch (error) {
      throw error;
    }
  },
};
