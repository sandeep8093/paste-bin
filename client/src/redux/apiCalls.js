import { loginFailure, loginStart, loginSuccess,logoutUser } from "./userRedux";
import { publicRequest } from "../requestMethods";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));

  } catch (err) {
    dispatch(loginFailure());
  }
};

export const logout = async (dispatch, user) => {
  const res = await publicRequest.post("/auth/logout", user)
  dispatch(logoutUser());
}