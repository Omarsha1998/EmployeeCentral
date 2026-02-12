export default {
  SET_NEW_VALUES(state, data) {
    state.family_backgrounds = data;
  },
  SET_DEFAULT_VALUES(state) {
    state.family_backgrounds = null;
  }
};
