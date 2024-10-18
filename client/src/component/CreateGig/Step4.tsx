import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
  useState,
} from "react";
import { AiOutlineEllipsis } from "react-icons/ai";
import { TbGridDots } from "react-icons/tb";
import { TfiText } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { RESET_ALL } from "../../constants/createGigQuestionConstants";
import { FREE_TEXT, MULTIPLE_CHOICE } from "../../constants/globalConstants";
import { StepProps, StepRef } from "../../Pages/CreateGig";
import {
  createGigQuestionReducer,
  QUESTION_DETAILS_INITIAL_STATE,
} from "../../reducers/createGigQuestionReducer";
import { AppDispatch, RootState } from "../../store";
import { IGigRequirement } from "../../types/gig.types";
import { AddorUpdateQuestion } from "./AddorUpdateQuestion";
import { questionTypeData } from "./createGigData";

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
    <div className="mt-16 mb-4 mx-[18%] pb-8">
      <div className="rounded-[5px] border border-dark_separator p-8 bg-white">
        <header className="text-lg font-semibold text-light_grey mb-4">
          Get all the information you need from buyers to get started
        </header>
        <p className="text-no_focus text-sm mb-4">
          Add questions to help buyers provide you with exactly what you need to
          start working on their order.
        </p>
        <div className="text-center flex items-center justify-between uppercase text-[0.8rem] text-light_heading relative mb-4">
          <hr className="text-no_focus w-full" />
          <strong className="absolute translate-x-1/2 leading-4 right-1/2 z-[1] bg-white px-8 text-xs">
            Your Questions
          </strong>
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
            <div className=" border border-dark_separator rounded-[3px] p-5 my-4 shadow-[0_0_3px_0] shadow-dark_separator">
              <div className=" flex items-center justify-between text-icons mb-4">
                <div className=" flex items-center gap-2 text-xs">
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
                  className="relative"
                  // ref={hideEditRemoveOptionRefs[index]}
                  ref={hideEditRemoveOptionRefs.current[index]}
                >
                  <div
                    className=" text-icons p-[0.2rem] hover:cursor-pointer hover:bg-separator hover:rounded-full"
                    onClick={() => handleShowEditQuestion(index)}
                  >
                    <AiOutlineEllipsis />
                  </div>
                  {question.showEditQuestion && (
                    <div>
                      {
                        <div className="border border-dark_separator absolute -left-12 top-6 minw-[7rem] z-[5] bg-white shadow-[0_0_3px_0] shadow-dark_separator">
                          <div
                            className="p-3 text-light_heading cursor-pointer hover:bg-separator "
                            onClick={() => handleEditQuestion(index)}
                          >
                            Edit
                          </div>
                          <div
                            className="p-3 text-light_heading cursor-pointer hover:bg-separator "
                            onClick={() => handleRemoveQuestion(index)}
                          >
                            Remove
                          </div>
                        </div>
                      }
                    </div>
                  )}
                </div>
              </div>
              <div className="font-bold text-light_grey text-sm mb-3">
                {question.question}
              </div>

              {question.type === MULTIPLE_CHOICE && (
                <div className="text-sm">
                  {getQuestionOptions(question.options)}
                </div>
              )}
            </div>
          ))
        )}
        {showQuestions && (
          <div className="mt-4">
            <button
              className="bg-white py-3 px-6 rounded text-link border border-link transition-all duration-200 hover:bg-link hover:text-white hover:cursor-pointer"
              onClick={() => setShowQuestions(false)}
            >
              {" "}
              + Add New Question
            </button>
          </div>
        )}
        {requirementsShortageWarning && (
          <p className="text-warning text-sm mt-4">
            You must add at least 1 requirement
          </p>
        )}
      </div>
    </div>
  );
};

export default forwardRef(Step4);
