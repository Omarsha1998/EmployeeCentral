export default {
  SET_NEW_VALUES(state, data) {
    state.maintenances = data;
  },
  SET_DEFAULT_VALUES(state) {
    state.maintenances = null;
  }
};
