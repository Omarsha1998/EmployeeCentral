export default {
  SET_NEW_VALUES(state, data) {
    state.work_experiences = data;
  },
  SET_DEFAULT_VALUES(state) {
    state.work_experiences = null;
  }
};
