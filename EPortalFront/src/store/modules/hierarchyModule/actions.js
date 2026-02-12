import axios from "axios";
import { Cookies } from "quasar";
import helperMethods from "src/helperMethods";

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + "hierarchy";

export default {
  // async getHiearchy({ commit }) {
  //   try {
  //     const result = await axios.get(`${api}${controllerName}/getHiearchy`, {
  //       headers: { Authorization: `Bearer ${Cookies.get("token")}` },
  //     });

  //     const { tree, rawData } = result.data;

  //     console.log(tree, rawData);

  //     const processNode = (node, targetArrays) => {
  //       const { level, code, name, children } = node;

  //       if (targetArrays[level]) {
  //         targetArrays[level].push({
  //           deptCode: code,
  //           codeDescription: name,
  //         });
  //       }

  //       if (children && Object.keys(children).length > 0) {
  //         for (const childNode of Object.values(children)) {
  //           processNode(childNode, targetArrays);
  //         }
  //       }
  //     };

  //     const targetArrays = {
  //       CorporateOfficer1: [],
  //       CorporateOfficer2: [],
  //       Department: [],
  //       Division1: [],
  //       Division2: [],
  //       Group: [],
  //       Section: [],
  //       Area: [],
  //     };

  //     for (const value of Object.values(tree)) {
  //       processNode(value, targetArrays);
  //     }

  //     const {
  //       CorporateOfficer1: corporateOfficer1,
  //       CorporateOfficer2: corporateOfficer2,
  //       Department: department,
  //       Division1: division1,
  //       Division2: division2,
  //       Group: group,
  //       Section: section,
  //       Area: area,
  //     } = targetArrays;

  //     commit("SET_HIEARCHY", {
  //       corporateOfficer1,
  //       corporateOfficer2,
  //       division1,
  //       division2,
  //       group,
  //       department,
  //       section,
  //       area,
  //       hierarchyData: tree,
  //       rawData: rawData,
  //     });
  //   } catch (error) {
  //     console.error("Error getting departments", error);
  //     throw error;
  //   }
  // },

  async getHiearchy({ commit }) {
    try {
      const result = await axios.get(`${api}${controllerName}/getHiearchy`, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });

      const { tree, rawData } = result.data;

      const processNode = (node, targetArrays) => {
        const { level, code, name, children } = node;

        if (targetArrays[level]) {
          targetArrays[level].push({
            deptCode: code,
            codeDescription: name,
          });
        }

        if (children && Object.keys(children).length > 0) {
          for (const childNode of Object.values(children)) {
            processNode(childNode, targetArrays);
          }
        }
      };

      const targetArrays = {
        CorporateOfficer1: [],
        CorporateOfficer2: [],
        Department: [],
        Division1: [],
        Division2: [],
        Group: [],
        Section: [],
        Area: [],
      };

      for (const value of Object.values(tree)) {
        processNode(value, targetArrays);
      }

      const {
        CorporateOfficer1: corporateOfficer1,
        CorporateOfficer2: corporateOfficer2,
        Department: department,
        Division1: division1,
        Division2: division2,
        Group: group,
        Section: section,
        Area: area,
      } = targetArrays;

      commit("SET_HIEARCHY", {
        corporateOfficer1,
        corporateOfficer2,
        division1,
        division2,
        group,
        department,
        section,
        area,
        hierarchyData: tree, // This is the tree object
        rawData: rawData,
      });

      // Return the data for immediate use
      return { tree, rawData };
    } catch (error) {
      console.error("Error getting departments", error);
      throw error;
    }
  },

  async getDepartments({ commit }, data) {
    try {
      const request = await axios.get(
        `${api}${controllerName}/getDepartments`,
        {
          params: data,
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );

      commit("SET_DEPARTMENTS", request.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async checkDeptData({}, data) {
    try {
      const request = await axios.post(
        `${api}${controllerName}/checkDeptData`,
        data,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
      return request.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async setNewHierarchy({}, data) {
    try {
      const request = await axios.post(
        `${api}${controllerName}/setNewHierarchy`,
        data,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async addHierarchy({}, data) {
    try {
      const request = await axios.post(
        `${api}${controllerName}/addHierarchy`,
        data,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async removeHierarchy({}, data) {
    try {
      const request = await axios.post(
        `${api}${controllerName}/removeHierarchy`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
