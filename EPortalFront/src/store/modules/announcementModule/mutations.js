export default {
  SET_ANNOUNCEMENTS(state, { announcements, isProd }) {
    if (announcements) {
      if (
        announcements.announcements &&
        Array.isArray(announcements.announcements)
      ) {
        for (const ann of announcements.announcements) {
          if (ann.links) {
            ann.links = ann.links.replace(
              "http://10.107.5.253",
              "https://apps.uerm.edu.ph",
            );
          }

          if (ann.description) {
            ann.description = ann.description.replace(
              /src="http:\/\/10\.107\.5\.253/g,
              'src="https://apps.uerm.edu.ph',
            );
          }
        }
      }

      state.announcements = announcements;
    }

    // if (isProd) {
    //   if (announcements.announcements) {
    //     for (const ann of announcements.announcements) {
    //       if (ann.links) {
    //         ann.links = ann.links.replace(/http:\/\//g, "https://");
    //       }
    //       if (ann.description) {
    //         ann.description = ann.description.replace(/http:\/\//g, "https://");
    //       }
    //     }
    //   }
    // }
  },

  SET_EVENTS(state, events) {
    state.events = events;
  },
};
