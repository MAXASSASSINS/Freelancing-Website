import {
  SHOW_DIM_BACKGROUND,
  HIDE_DIM_BACKGROUND,
} from "../constants/dimBackgroundConstants";

export const dimBackgroundReducer = (state = false, action) => {
  switch (action.type) {
    case SHOW_DIM_BACKGROUND:
      state = true;
      return true;
    case HIDE_DIM_BACKGROUND:
      state = false;
      return false;
    default:
      return state;
  }
};
