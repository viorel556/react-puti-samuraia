import {usersAPI} from "../api/api";
import {updateObjectInArray} from "../utils/object-helpers";
import {UserType} from "../types/types";

const FOLLOW = "FOLLOW";
const UNFOLLOW = "UNFOLLOW";
const LOAD_USERS = "LOAD_USERS";
const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
const SET_TOTAL_USERS_COUNT = "SET_TOTAL_USERS_COUNT";
const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";
const TOGGLE_IS_FOLLOWING_PROGRESS = "TOGGLE_IS_FOLLOWING_PROGRESS";

// TYPES RELATED TO ACTION CREATORS:
type FollowActionType = {
    type: typeof FOLLOW
    userId: number
}
type UnfollowActionType = {
    type: typeof UNFOLLOW
    userId: number
}
type LoadUsersActionType = {
    type: typeof LOAD_USERS
    users: Array<UserType>
}
type SetCurrentPageActionType = {
    type: typeof SET_CURRENT_PAGE
    currentPage: number
}
type SetTotalUsersCountActionType = {
    type: typeof SET_TOTAL_USERS_COUNT
    count: number
}
type ToggleIsFetchingActionType = {
    type: typeof TOGGLE_IS_FETCHING
    isFetching: boolean
}
type ToggleFollowingProgressActionType = {
    type: typeof TOGGLE_IS_FOLLOWING_PROGRESS
    isFetching: boolean
    userId: number
}

 // [!] USING THE INFERENCE TYPE ASSIGMENT APPROACH:
// "InitialStateType" is created based on "initialState"
let initialState = {
    users: [] as Array<UserType>,
    pageSize: 5,
    totalUsersCount: 0,
    currentPage: 1,
    isFetching: false,
    followingInProgress: [] as Array<number> // array of users IDs
}
type InitialStateType = typeof initialState; // [!] inference type assignment;

const usersReducer = (state = initialState, action: any): InitialStateType => {

    switch (action.type) {

        // we COPY the state
        // we CHANGE only the "followed" parameter if the ID matches;
        case FOLLOW: {
            return { // THIS IS A STATE COPY:
                ...state,

                users: updateObjectInArray(
                    state.users,
                    action.userId,
                    "id",
                    {followed: true})
                // iterating and returning same array;
            }
        }

        case UNFOLLOW: {
            return { // THIS IS A STATE COPY:
                ...state,

                users: updateObjectInArray(
                    state.users,
                    action.userId,
                    "id",
                    {followed: false})
            }
        }

        case LOAD_USERS: {
            return {
                ...state,
                users: action.users,
            }
        }

        case SET_CURRENT_PAGE: {
            return {
                ...state,
                currentPage: action.currentPage
            }
        }

        case SET_TOTAL_USERS_COUNT: {
            return {
                ...state,
                totalUsersCount: action.count
            }
        }

        case TOGGLE_IS_FETCHING: {
            return {
                ...state,
                isFetching: action.isFetching
            }
        }

        case TOGGLE_IS_FOLLOWING_PROGRESS: {
            return {
                ...state,
                followingInProgress: action.isFetching
                    ? [...state.followingInProgress, action.userId]
                    : state.followingInProgress.filter(id => id != action.userId)
            }
        }

        default:
            return state;
    }
}

export const follow = (userId: number): FollowActionType => (
    {type: FOLLOW, userId}
);
export const unfollow = (userId: number): UnfollowActionType => (
    {type: UNFOLLOW, userId}
);
export const loadUsers = (users: Array<UserType>): LoadUsersActionType => (
    // LOADS THE USERS ON THE SCREEN; FUCKING RENDERS THEM;
    {type: LOAD_USERS, users}
);
export const setCurrentPage = (currentPage: number): SetCurrentPageActionType => (
    {type: SET_CURRENT_PAGE, currentPage}
);
export const setTotalUsersCount = (totalUsersCount: number): SetTotalUsersCountActionType => (
    {type: SET_TOTAL_USERS_COUNT, count: totalUsersCount}
);
export const toggleIsFetching = (isFetching: boolean): ToggleIsFetchingActionType => (
    {type: TOGGLE_IS_FETCHING, isFetching}
);
export const toggleFollowingProgress = (isFetching: boolean, userId: number): ToggleFollowingProgressActionType => (
    {
        type: TOGGLE_IS_FOLLOWING_PROGRESS,
        isFetching,
        userId
    }
);

// THUNKS ARE HERE:
export const getUsers = (page: number, pageSize: number) => async (dispatch: any) => {
    // to pass params to a Thunk we have to create a thunk Creator;
    try {
        dispatch(toggleIsFetching(true));
        dispatch(setCurrentPage(page));
        // server request to get initial users
        let data = await usersAPI.requestUsers(page, pageSize);
        dispatch(toggleIsFetching(false));
        dispatch(loadUsers(data.items));
        dispatch(setTotalUsersCount(data.totalCount));
    } catch (error) {
        console.log(error)
    }
}

// THUNK:
export const followUser = (userId: number) => async (dispatch: any) => {
    try {
        let apiMethod = usersAPI.requestFollowUser.bind(usersAPI);
        await followUnfollowFlow(dispatch, userId, apiMethod, follow);
    } catch (error) {
        console.log(error)
    }
}

// THUNK:
export const unfollowUser = (userId: number) => async (dispatch: any) => {
    try {
        let apiMethod = usersAPI.requestUnfollowUser.bind(usersAPI);
        await followUnfollowFlow(dispatch, userId, apiMethod, unfollow);
    } catch (error) {
        console.log(error);
    }
}

// EXTERNAL FUNCTIONAL:
async function followUnfollowFlow(dispatch: any, userId: number, apiMethod: any, actionCreator: any) {
    // func was created to avoid code doubling; encapsulates follow/unfollow logic;
    dispatch(toggleFollowingProgress(true, userId));
    let response = await apiMethod(userId);
    if (response.data.resultCode === 0) {
        dispatch(actionCreator(userId));
    }
    dispatch(toggleFollowingProgress(false, userId));
}

export default usersReducer;