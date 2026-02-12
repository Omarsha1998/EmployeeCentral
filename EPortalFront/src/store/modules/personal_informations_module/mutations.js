import helperMethods from "src/helperMethods";

export default {
  SET_NEW_VALUES(state, data) {
    if (data.birth_date) data.birth_date = helperMethods.correctDate(data.birth_date);
    state.personal_informations = data;
  },
  SET_DEFAULT_VALUES(state) {
    state.personal_informations = null;
  }
};
