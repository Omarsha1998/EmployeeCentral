export default {
  SET_NEW_VALUES(state, data) {
    state.other_requests = data;
  },
  SET_DEFAULT_VALUES(state) {
    state.other_requests = null;
  },
  SET_NOT_HIGHLIGHTED_TO_HR(state, currentIndex) {
    state.other_requests.pending[currentIndex].should_high_lighted_to_hr = false;
    state.other_requests = state.other_requests;
  }
};
