import { SHOW_DIM_BACKGROUND, HIDE_DIM_BACKGROUND } from "../constants/dimBackgroundConstants";

export const showDimBackground = () => (dispatch) => {
    try{
        dispatch({type: SHOW_DIM_BACKGROUND});
    }
    catch(error){
        console.log(error);
    }
}
export const hideDimBackground = () => (dispatch) => {
    try{
        dispatch({type: HIDE_DIM_BACKGROUND});
    }
    catch(error){
        console.log(error);
    }
}