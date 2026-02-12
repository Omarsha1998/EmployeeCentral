export default {
  namespaced: true,

  state: {
    prodEnvironment: process.env.conditionPath === "PROD",
  },

  getters: {
    prodEnvironment: (state) => state.prodEnvironment,
  },
};
