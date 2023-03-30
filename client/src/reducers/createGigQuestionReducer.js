import {
    UPDATE_QUESTION_TYPE,
    UPDATE_MULTIPLE_OPTIONS_SELECT_STATUS,
    UPDATE_QUESTION,
    UPDATE_QUESTION_OPTIONS,
    UPDATE_REQUIRED_STATUS_QUESTION,
    UPDATE_SHOW_EDIT_QUESTION,
    ADD_NEW_QUESTION,
    REMOVE_QUESTION,
    HIDE_ALL_EDIT_QUESTION,
    RESET_ALL,
} from "../constants/createGigQuestionConstants";

// export const QUESTION_DETAILS_INITIAL_STATE = [{
//     type: null,
//     multipleOptionsSelectStatus: null,
//     question: null,
//     options: null,
//     requiredStatus: null,
//     showEditQuestion: null,
// }];

export const QUESTION_DETAILS_INITIAL_STATE = [];

export const createGigQuestionReducer = (state, action) => {
    switch (action.type) {
        // case UPDATE_QUESTION: {
        //     const { question, questionIndex } = action.payload;
        //     const newState = [...state];
        //     newState[questionIndex].question = question;
        //     return newState;
        // }

        // case UPDATE_QUESTION_TYPE: {
        //     const { questionType, questionIndex } = action.payload;
        //     const newState = [...state];
        //     newState[questionIndex].questionType = questionType;
        //     return newState;
        // }

        // case UPDATE_QUESTION_OPTIONS: {
        //     const { questionOptions, questionIndex } = action.payload;
        //     const newState = [...state];
        //     newState[questionIndex].questionOptions = questionOptions;
        //     return newState;
        // }

        // case UPDATE_MULTIPLE_OPTIONS_SELECT_STATUS: {
        //     const { multipleOptionsSelectStatus, questionIndex } = action.payload;
        //     const newState = [...state];
        //     newState[questionIndex].multipleOptionsSelectStatus = multipleOptionsSelectStatus;
        //     return newState;
        // }

        // case UPDATE_REQUIRED_STATUS_QUESTION: {
        //     const { requiredStatus, questionIndex } = action.payload;
        //     const newState = [...state];
        //     newState[questionIndex].requiredStatus = requiredStatus;
        //     return newState;
        // }

        case UPDATE_QUESTION: {
            const {questionIndex, type, multipleOptionSelectionStatus, question, options, requiredStatus} = action.payload;

            const updatedQuestion = {
                question,
                type,
                multipleOptionSelectionStatus,
                options,
                requiredStatus,
                showEditQuestion: false,
            }

            const newState = [...state];
            newState[questionIndex] = updatedQuestion;
            return newState;
        }

        case UPDATE_SHOW_EDIT_QUESTION: {
            const {questionIndex, showEditQuestion} = action.payload;
            let newState = [...state];
            newState = newState.map((question, index) => {
                if (index === questionIndex) {
                    return {
                        ...question,
                        showEditQuestion: showEditQuestion ? false : true,
                    }
                }
                return {
                    ...question,
                    showEditQuestion: false,
                }
            })
            return newState;
        }

        case ADD_NEW_QUESTION: {
            const {type, multipleOptionSelectionStatus, question, options, requiredStatus} = action.payload;
            // console.log(multipleOptionSelectionStatus);
            // console.log(requiredStatus)
            const newQuestion = {
                type,
                multipleOptionSelectionStatus,
                question,
                options,
                requiredStatus,
                showEditQuestion: false,
            }

            const newState = [...state, newQuestion];
            // console.log(newState);
            return newState;
        }

        case REMOVE_QUESTION: {
            const {questionIndex} = action.payload;
            const newState = [...state];
            newState.splice(questionIndex, 1);
            return newState;
        }
        
        case HIDE_ALL_EDIT_QUESTION: {
            const newState = [...state];
            newState.map((question) => {
                question.showEditQuestion = false;
                return question;
            })
            return newState;
        }

        case RESET_ALL: {
            return QUESTION_DETAILS_INITIAL_STATE;
        }




        default:
            return state;

    }
}

