export default {
  SET_NEW_VALUES(state, data) {
    state.educational_backgrounds = data;
  },
  SET_DEFAULT_VALUES(state) {
    state.educational_backgrounds = null;
  }
};
