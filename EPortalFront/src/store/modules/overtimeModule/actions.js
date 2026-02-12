import axios from "axios";
import { Cookies } from "quasar";
import helperMethods from "src/helperMethods";

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "overtime";

export default {
  async submitOvertimeRequest({}, data) {
    try {
      await axios.post(`${api}${controllerName}/overtimeRequest`, data, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
    } catch (error) {
      console.error("Error in submitOvertimeRequest:", error);
      throw error;
    }
  },

  async getOvertimeDetails({ commit }) {
    try {
      const response = await axios.get(
        `${api}${controllerName}/getOvertimeDetails`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
      commit("SET_OVERTIME_DETAILS", response.data);
    } catch (error) {
      console.error("Error in getOvertimeDetails:", error);
      throw error;
    }
  },

  async getPendingOvertime({ commit }) {
    try {
      const response = await axios.get(
        `${api}${controllerName}/getPendingOvertime`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
      commit("SET_OVERTIME_PENDING", response.data);
    } catch (error) {
      console.error("Error in getPendingOvertime:", error);
      throw error;
    }
  },

  async approveOvertime({}, data) {
    try {
      await axios.post(
        `${api}${controllerName}/overtime-admin-action`,
        {
          data: data,
          Status: "Approved",
        },
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
    } catch (error) {
      console.error("Error in approving Overtime:", error);
      throw error;
    }
  },

  async rejectOvertime({}, data) {
    try {
      await axios.post(`${api}${controllerName}/overtime-admin-action`, data, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
    } catch (error) {
      console.error("Error in rejectOvertime:", error);
      throw error;
    }
  },

  async updateOvertime({}, data) {
    try {
      await axios.post(`${api}${controllerName}/editOvertime-request`, data, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
    } catch (error) {
      console.error("Error in updateOvertime:", error);
      throw error;
    }
  },

  async cancelOvertime({}, data) {
    try {
      await axios.post(`${api}${controllerName}/cancelOvertime`, data, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
    } catch (error) {
      console.error("Error in cancelOvertime:", error);
      throw error;
    }
  },

  async getPendingCancelOvertime({ commit }) {
    try {
      const response = await axios.get(
        `${api}${controllerName}/getPendingCancelOvertime`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
      commit("SET_OVERTIME_PENDING_CANCEL", response.data);
    } catch (error) {
      console.error("Error in getPendingCancelOvertime:", error);
      throw error;
    }
  },

  async approveCancelOvertime({}, overtimeIds) {
    try {
      await axios.post(
        `${api}${controllerName}/cancelOvertimeAction`,
        {
          OvertimeIds: overtimeIds,
          Status: "Approved",
        },
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
    } catch (error) {
      console.error("Error in approveCancelOvertime:", error);
      throw error;
    }
  },

  async rejectOvertimeCancelLeaves({}, overtimeIds) {
    try {
      await axios.post(
        `${api}${controllerName}/cancelOvertimeAction`,
        {
          OvertimeIds: overtimeIds,
          Status: "R",
        },
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
    } catch (error) {
      console.error("Error in approve cancel overtime:", error);
      throw error;
    }
  },

  async rejectOvertimeCancelLeaves({}, data) {
    try {
      await axios.post(`${api}${controllerName}/cancelOvertimeAction`, data, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
    } catch (error) {
      console.error("Error in reject cancel overtime:", error);
      throw error;
    }
  },

  async getUserApprovedOvertime({ commit }, statusOvertime) {
    try {
      const response = await axios.post(
        `${api}${controllerName}/approvedRejectedOvertime`,
        statusOvertime,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
      commit("SET_USER_APPROVED_OVERTIME", response.data);
    } catch (error) {
      console.error("Error in getting user approved overtime: ", error);
      throw error;
    }
  },

  async getUseRejectedOvertime({ commit }, statusOvertime) {
    try {
      const response = await axios.post(
        `${api}${controllerName}/approvedRejectedOvertime`,
        statusOvertime,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );

      commit("SET_USER_REJECTED_OVERTIME", response.data);
    } catch (error) {
      console.error("Error in getting user approved overtime: ", error);
      throw error;
    }
  },

  async getApprovedOvertime({ commit }, statusOvertime) {
    try {
      const response = await axios.post(
        `${api}${controllerName}/approvedRejectedOvertime`,
        statusOvertime,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
      commit("SET_APPROVED_OVERTIME", response.data);
    } catch (error) {
      console.error("Error in getting user approved overtime: ", error);
      throw error;
    }
  },

  async getRejectedOvertime({ commit }, statusOvertime) {
    try {
      const response = await axios.post(
        `${api}${controllerName}/approvedRejectedOvertime`,
        statusOvertime,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
      commit("SET_REJECTED_OVERTIME", response.data);
    } catch (error) {
      console.error("Error in getting user approved overtime: ", error);
      throw error;
    }
  },

  async getPendingHrd({ commit }) {
    try {
      const response = await axios.get(
        `${api}${controllerName}/getPendingHrd`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
      commit("SET_PENDING_HRD", response.data);
    } catch (error) {
      console.error("Error in getting pending hrd: ", error);
      throw error;
    }
  },

  async approveRejectHrdReview({}, data) {
    try {
      const response = await axios.post(
        `${api}${controllerName}/approveRejectHrdReview`,
        data,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
    } catch (error) {
      console.error("Error in approving review hrd", error);
      throw error;
    }
  },

  async userApprovedCancelOvertime({ commit }, statusOvertime) {
    try {
      const response = await axios.post(
        `${api}${controllerName}/approvedRejectedCancelOvertime`,
        statusOvertime,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
      commit("SET_USER_APPROVED_CANCEL", response.data);
    } catch (error) {
      console.error("Error in approving review hrd", error);
      throw error;
    }
  },

  async userRejectedCancelOvertime({ commit }, statusOvertime) {
    try {
      const response = await axios.post(
        `${api}${controllerName}/approvedRejectedCancelOvertime`,
        statusOvertime,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
      commit("SET_USER_REJECTED_CANCEL", response.data);
    } catch (error) {
      console.error("Error in approving review hrd", error);
      throw error;
    }
  },

  async rejectedCancelOvertime({ commit }, statusOvertime) {
    try {
      const response = await axios.post(
        `${api}${controllerName}/approvedRejectedCancelOvertime`,
        statusOvertime,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
      commit("SET_REJECTED_CANCEL", response.data);
    } catch (error) {
      console.error("Error in approving review hrd", error);
      throw error;
    }
  },

  async approvedCancelOvertime({ commit }, statusOvertime) {
    try {
      const response = await axios.post(
        `${api}${controllerName}/approvedRejectedCancelOvertime`,
        statusOvertime,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
      commit("SET_APPROVED_CANCEL", response.data);
    } catch (error) {
      console.error("Error in approving review hrd", error);
      throw error;
    }
  },

  async submitAccomplishment({}, data) {
    try {
      const response = await axios.post(
        `${api}${controllerName}/submitAccomplishment`,
        data,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
    } catch (error) {
      console.error("Error in submitting overtime accomplishment");
      throw error;
    }
  },

  async getPendingAccomplishment({ commit }) {
    try {
      const response = await axios.get(
        `${api}${controllerName}/getPendingAccomplishment`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
      commit("SET_PENDING_ACCOMPLISHMENT", response.data);
    } catch (error) {
      console.error("Error in getting pending accomplishment");
      throw error;
    }
  },

  async approveAccomplishment({}, overtimeId) {
    try {
      await axios.post(
        `${api}${controllerName}/approveRejectAccomplishment`,
        {
          OvertimeIds: overtimeId,
          Status: "Approved",
        },
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
    } catch (error) {
      console.error("Error in approving accomplishment:", error);
      throw error;
    }
  },

  async rejectAccomplishment({}, statusOvertime) {
    try {
      await axios.post(
        `${api}${controllerName}/approveRejectAccomplishment`,
        statusOvertime,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
    } catch (error) {
      console.error("Error in approving accomplishment:", error);
      throw error;
    }
  },

  async unpaidOvertime({}, data) {
    try {
      const res = await axios.get(`${api}${controllerName}/unpaidOvertime`, {
        params: data,
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
};
