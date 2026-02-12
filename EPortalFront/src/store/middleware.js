import axios from 'axios';

// Check if 401 occur when using the axios
export default store => {
  axios.interceptors.response.use(
    response => response,
    async error => {
      if (error.response && 
        (error.response.status === 401 || error.response.status === 403) ) {
        // Handle 401 error, for example, dispatch logout action
        await store.dispatch('user_module/setDefaultValues', true);    
      }
      return Promise.reject(error);
    }
  );
};
