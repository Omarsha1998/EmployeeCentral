import helperMethods from "../../../helperMethods.js";

export default {
  SET_NEW_VALUES(state, data) {
    data.forEach(function (obj) {
     obj.expiration_date = helperMethods.correctDate(obj.expiration_date);
  });
  
    state.licenses = data;
  },
  SET_DEFAULT_VALUES(state) {
    state.licenses = null;
  }
};
