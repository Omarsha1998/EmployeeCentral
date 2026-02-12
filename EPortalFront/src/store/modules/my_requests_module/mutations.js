export default {
  SET_NEW_VALUES(state, data) {
    state.my_requests = data;
  },
  SET_DEFAULT_VALUES(state) {
    state.my_requests = null;
  },
  SET_NOT_HIGHLIGHTED_TO_REQUESTER(state, currentIndex) {
    state.my_requests.pending[currentIndex].should_high_lighted_to_requester = false;
    state.my_requests = state.my_requests;
  }
};
