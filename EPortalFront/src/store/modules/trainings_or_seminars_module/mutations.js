export default {
  SET_NEW_VALUES(state, data) {
    state.trainings_or_seminars = data;
  },
  SET_DEFAULT_VALUES(state) {
    state.trainings_or_seminars = null;
  }
};
