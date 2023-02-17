const getters = {
    getUserName(state) {
        return state.auth.userData.name;
    },
    getUserId(state) {
        return state.auth.userData._id;
    },

    getUserEmail(state) {
        return state.auth.userData.email;
    },
    getToken(state) {
        return state.auth.token;
    },

    isAuth(state) {
        return state.auth != null
    }
}

export default getters;