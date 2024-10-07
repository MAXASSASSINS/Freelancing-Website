import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
  useState,
} from "react";
import { StepProps, StepRef } from "../../Pages/CreateGig/CreateGig";
import { AppDispatch, RootState } from "../../store";
import { useSelector } from "react-redux";
import {
  createGigQuestionReducer,
  QUESTION_DETAILS_INITIAL_STATE,
} from "../../reducers/createGigQuestionReducer";
import { FREE_TEXT, MULTIPLE_CHOICE } from "../../constants/globalConstants";
import { IGigRequirement } from "../../types/gig.types";
import { TbGridDots } from "react-icons/tb";
import { TfiText } from "react-icons/tfi";
import { AddorUpdateQuestion } from "./AddorUpdateQuestion";
import { questionTypeData } from "./createGigData";
import { useDispatch } from "react-redux";
import { AiOutlineEllipsis } from "react-icons/ai";
import { RESET_ALL } from "../../constants/createGigQuestionConstants";

const Step4 = ({ handleSendData }: StepProps, ref: React.Ref<StepRef>) => {
  const dispatch = useDispatch<AppDispatch>();
  const { gigDetail } = useSelector((state: RootState) => state.gigDetail);
  const [questionsDetails, questionDispatch] = useReducer(
    createGigQuestionReducer,
    QUESTION_DETAILS_INITIAL_STATE
  );
  const [showQuestions, setShowQuestions] = useState<boolean>(true);
  const [questionType, setQuestionType] = useState<string>(FREE_TEXT);
  const [questionTitle, setQuestionTitle] = useState<string>("");
  const [questionRequiredInput, setQuestionRequiredInput] =
    useState<boolean>(false);
  const [enableMultipleOptionsInput, setEnableMultipleOptionsInput] =
    useState<boolean>(false);
  const [indexOfQuestionToEdit, setIndexOfQuestionToEdit] =
    useState<number>(-1);
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [warnings, setWarnings] = useState<string[]>(["", ""]);
  const [showEditQuestion, setShowEditQuestion] = useState<boolean>(false);
  const [warningEnabled, setWarningEnabled] = useState<boolean>(false);
  const hideEditRemoveOptionRefs = useRef<React.RefObject<HTMLDivElement>[]>(
    []
  );
  const [requirementsShortageWarning, setRequirementsShortageWarning] =
    useState(false);

  const checkForWarnings = () => {
    if (questionsDetails.length < 1) {
      setRequirementsShortageWarning(true);
      return true;
    }
  };

  const handleSubmit = async () => {
    if (checkForWarnings()) {
      return false;
    }
    const questionsDetailsData: IGigRequirement[] = [];
    questionsDetails.forEach((item, index) => {
      const questionData = {
        questionTitle: item.question,
        questionType: item.type.toString().toLowerCase(),
        options: item.options,
        answerRequired: item.requiredStatus,
        multipleOptionSelect: item.multipleOptionSelectionStatus,
      };
      questionsDetailsData.push(questionData);
    });
    const requirements = {
      requirements: questionsDetailsData,
    };
    console.log(requirements);
    const payload = { data: requirements, step: 4 };
    console.log(payload);

    const res = await handleSendData(payload);
    return res || false;
  };

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const checkForAnyEmptyFieldsForQuestion = () => {
    let error = false;

    if (questionTitle.toString().trim().length < 2) {
      error = true;
      setWarningEnabled(true);
    }
    if (questionType === MULTIPLE_CHOICE) {
      options.forEach((item, index) => {
        if (item.toString().trim().length === 0) {
          error = true;
          setWarningEnabled(true);
        }
      });
    }
    return error;
  };

  const commonForEditAddCancelQuestion = () => {
    setOptions(["", ""]);
    setQuestionType(FREE_TEXT);
    setWarningEnabled(false);
    setQuestionTitle("");
    setShowEditQuestion(false);
    setEnableMultipleOptionsInput(false);
    setQuestionRequiredInput(false);
  };

  const handleCancelAdd = () => {
    setShowQuestions(true);
    commonForEditAddCancelQuestion();
  };

  const handleAddQuestion = () => {
    let error = checkForAnyEmptyFieldsForQuestion();

    if (error) return;

    const payload = {
      question: questionTitle.trim(),
      type: questionType,
      requiredStatus: questionRequiredInput,
      multipleOptionSelectionStatus: enableMultipleOptionsInput,
      options: options,
    };
    questionDispatch({ type: "ADD_NEW_QUESTION", payload: payload });
    setShowQuestions(true);
    setShowEditQuestion(false);
    commonForEditAddCancelQuestion();
    setRequirementsShortageWarning(false);
  };

  const handleRemoveQuestion = (index: number) => {
    const payload = {
      questionIndex: index,
    };
    questionDispatch({ type: "REMOVE_QUESTION", payload: payload });
  };

  const handleEditQuestion = (index: number) => {
    setIndexOfQuestionToEdit(index);
    setEnableMultipleOptionsInput(
      questionsDetails[index].multipleOptionSelectionStatus
    );
    setQuestionRequiredInput(questionsDetails[index].requiredStatus);
    setQuestionTitle(questionsDetails[index].question);
    setQuestionType(questionsDetails[index].type);
    setOptions(questionsDetails[index].options);
    setShowQuestions(false);
    setShowEditQuestion(true);
  };

  const handleUpdateQuestion = (index: number) => {
    let error = checkForAnyEmptyFieldsForQuestion();
    if (error) return;

    const payload = {
      questionIndex: index,
      question: questionTitle,
      type: questionType,
      requiredStatus: questionRequiredInput,
      multipleOptionSelectionStatus: enableMultipleOptionsInput,
      options: options,
    };

    questionDispatch({ type: "UPDATE_QUESTION", payload: payload });
    commonForEditAddCancelQuestion();
    setShowQuestions(true);
    setShowEditQuestion(false);
    setIndexOfQuestionToEdit(-1);
  };

  const getQuestionOptions = (options: string[]) => {
    const string = options.join(", ");
    return string;
  };

  const handleShowEditQuestion = (index: number) => {
    const payload = {
      questionIndex: index,
      showEditQuestion: questionsDetails[index].showEditQuestion,
    };
    questionDispatch({ type: "UPDATE_SHOW_EDIT_QUESTION", payload: payload });
  };

  const getQuestionType = (val: string) => {
    console.log(val);
    setQuestionType(val);
  };

  const handleAddNewOption = () => {
    setOptions([...options, ""]);
    setWarnings([...warnings, ""]);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((item, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newOptions = options.map((item, i) => {
      if (i === index) {
        return e.target.value;
      } else {
        return item;
      }
    });
    setOptions(newOptions);
  };

  const getQuestionTitle = (val: string) => {
    setQuestionTitle(val);
  };

  const getRequiredStatusOfQuestion = (val: boolean) => {
    setQuestionRequiredInput(val);
  };

  const getMultipleOptionSelectionStatus = (val: boolean) => {
    setEnableMultipleOptionsInput(val);
  };

  const handleClickOutside = (event: MouseEvent) => {
    let check = true;
    for (let i = 0; i < hideEditRemoveOptionRefs?.current?.length; i++) {
      if (
        hideEditRemoveOptionRefs?.current[i]?.current?.contains(
          event.target as Node
        )
      ) {
        check = false;
        break;
      }
    }
    if (check) {
      dispatch({ type: "HIDE_ALL_EDIT_QUESTION" });
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (!gigDetail) return;
    const { requirements } = gigDetail;
    console.log(requirements);
    requirements?.forEach((item, index) => {
      const data = {
        type: item.questionType,
        question: item.questionTitle,
        requiredStatus: item.answerRequired,
        options: item.options,
        multipleOptionSelectionStatus: item.multipleOptionSelect,
      };
      questionDispatch({ type: "ADD_NEW_QUESTION", payload: data });
    });

    return () => {
      questionDispatch({ type: RESET_ALL });
    };
  }, [gigDetail]);

  return (
    <div className="requirements pb-8">
      <div className="requirements-wrapper">
        <header>
          Get all the information you need from buyers to get started
        </header>
        <p className="requirements-message">
          Add questions to help buyers provide you with exactly what you need to
          start working on their order.
        </p>
        <div className="your-questions">
          <hr />
          <strong>Your Questions</strong>
        </div>

        {showEditQuestion ? (
          <AddorUpdateQuestion
            getRequiredStatusOfQuestion={getRequiredStatusOfQuestion}
            getMultipleOptionSelectionStatus={getMultipleOptionSelectionStatus}
            questionTitle={questionTitle}
            getQuestionTitle={getQuestionTitle}
            questionTypeData={questionTypeData}
            questionType={questionType}
            getQuestionType={getQuestionType}
            options={options}
            handleOptionChange={handleOptionChange}
            handleRemoveOption={handleRemoveOption}
            handleAddNewOption={handleAddNewOption}
            handleCancelAdd={handleCancelAdd}
            handleAddQuestion={handleAddQuestion}
            warningEnabled={warningEnabled}
            questionRequiredInput={questionRequiredInput}
            enableMultipleOptionsInput={enableMultipleOptionsInput}
            edit={true}
            handleUpdateQuestion={handleUpdateQuestion}
            indexOfQuestionToEdit={indexOfQuestionToEdit}
          />
        ) : !showQuestions ? (
          <AddorUpdateQuestion
            getRequiredStatusOfQuestion={getRequiredStatusOfQuestion}
            getMultipleOptionSelectionStatus={getMultipleOptionSelectionStatus}
            questionTitle={questionTitle}
            getQuestionTitle={getQuestionTitle}
            questionTypeData={questionTypeData}
            questionType={questionType}
            getQuestionType={getQuestionType}
            options={options}
            handleOptionChange={handleOptionChange}
            handleRemoveOption={handleRemoveOption}
            handleAddNewOption={handleAddNewOption}
            handleCancelAdd={handleCancelAdd}
            handleAddQuestion={handleAddQuestion}
            warningEnabled={warningEnabled}
            questionRequiredInput={questionRequiredInput}
            enableMultipleOptionsInput={enableMultipleOptionsInput}
            edit={false}
          />
        ) : (
          questionsDetails.map((question, index) => (
            <div className="question-details-section">
              <div className="question-type">
                <div className="text-or-multiple-choice">
                  {question.type === FREE_TEXT ? (
                    <span>
                      <TfiText />
                    </span>
                  ) : (
                    <span>
                      <TbGridDots />
                    </span>
                  )}
                  <span className="capitalize">{question.type}</span>
                </div>
                <div
                  className="edit-and-remove"
                  // ref={hideEditRemoveOptionRefs[index]}
                  ref={hideEditRemoveOptionRefs.current[index]}
                >
                  <div
                    className="ellipsis-icon"
                    onClick={() => handleShowEditQuestion(index)}
                  >
                    <AiOutlineEllipsis />
                  </div>
                  {question.showEditQuestion && (
                    <div className="edit-modal">
                      {
                        <div className="edit-and-remove-options">
                          <div onClick={() => handleEditQuestion(index)}>
                            Edit
                          </div>
                          <div onClick={() => handleRemoveQuestion(index)}>
                            Remove
                          </div>
                        </div>
                      }
                    </div>
                  )}
                </div>
              </div>
              <div className="question">{question.question}</div>

              {question.type === MULTIPLE_CHOICE && (
                <div className="options">
                  {getQuestionOptions(question.options)}
                </div>
              )}
            </div>
          ))
        )}
        {showQuestions && (
          <div className="add-question-button">
            <button onClick={() => setShowQuestions(false)}>
              {" "}
              + Add New Question
            </button>
          </div>
        )}
        {requirementsShortageWarning && (
          <p className="requirements-shortage-warning">
            You must add at least 1 requirement
          </p>
        )}
      </div>
    </div>
  );
};

export default forwardRef(Step4);
