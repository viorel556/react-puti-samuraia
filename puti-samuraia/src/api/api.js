import axios from "axios";

const instance = axios.create(
    // making an Axios instance to reuse cookies & Api key;
    {
        baseURL: "https://social-network.samuraijs.com/api/1.0/",
        withCredentials: true,
        headers: { "Api-Key": "eb22c93c-4f75-43ef-9465-0df311624841" }
    }

);

export const usersAPI = {

    requestUsers (currentPage = 1 , pageSize = 5) {
        // SERVER REQUEST TO GET A BUNCH OF USERS (for page rendering)
        return (
            axios.get(`https://social-network.samuraijs.com/api/1.0/users?page=${currentPage}&count=${pageSize}`,
                {withCredentials: true}
            )
                .then(response => {
                    return response.data;
                })
        );
    },

    requestFollowUser (userId) {
        // SERVER REQUEST TO FOLLOW AN USER;
        return instance.post(  `follow/${userId}`, {} );
    },

    requestUnfollowUser (userId) {
        // SERVER REQUEST TO UNFOLLOW AN USER;
        return instance.delete(  `follow/${userId}`);
    },


}

export const profileAPI = {
    // SERVER REQUEST FOR AUTHORIZATION:
    authorizeMeRequest () {
        return instance.get('auth/me');
    },

    // SERVER REQUEST TO GET A SINGLE USER:
    requestUser (userId) {
        return instance.get(  `profile/`+userId);
    }

}





