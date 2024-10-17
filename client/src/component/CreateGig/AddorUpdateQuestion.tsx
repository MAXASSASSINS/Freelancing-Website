import React from "react";
import { TextArea } from "../TextArea";
import SelectInput2 from "../SelectInput2";
import { CheckInput } from "../CheckInput";
import { IoClose } from "react-icons/io5";
import { MULTIPLE_CHOICE } from "../../constants/globalConstants";

type AddorUpdateQuestionProps = {
  getQuestionTitle: (text: string) => void;
  questionTitle: string;
  warningEnabled: boolean;
  getQuestionType: (option: string) => void;
  handleCancelAdd: () => void;
  handleAddNewOption: () => void;
  handleAddQuestion: () => void;
  questionType: string;
  options: string[];
  questionTypeData: string[];
  handleOptionChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  handleRemoveOption: (index: number) => void;
  getRequiredStatusOfQuestion: (val: boolean) => void;
  getMultipleOptionSelectionStatus: (val: boolean) => void;
  questionRequiredInput: boolean;
  enableMultipleOptionsInput: boolean;
  edit: boolean;
  handleUpdateQuestion?: (index: number) => void;
  indexOfQuestionToEdit?: number;
};

export const AddorUpdateQuestion = ({
  getQuestionTitle,
  questionTitle,
  warningEnabled,
  getQuestionType,
  handleCancelAdd,
  handleAddNewOption,
  handleAddQuestion,
  questionType,
  options,
  questionTypeData,
  handleOptionChange,
  handleRemoveOption,
  getRequiredStatusOfQuestion,
  getMultipleOptionSelectionStatus,
  questionRequiredInput,
  enableMultipleOptionsInput,
  edit,
  handleUpdateQuestion,
  indexOfQuestionToEdit,
}: AddorUpdateQuestionProps) => {

  console.log("questionType", questionType, questionType === MULTIPLE_CHOICE);
  

  return (
    <div className="add-question-wrapper">
      <header>
        <h6>Add a question</h6>
        <CheckInput
          label="Required"
          getInputCheckedVal={getRequiredStatusOfQuestion}
          defaultValue={questionRequiredInput}
        />
      </header>

      <div className="question-box">
        <TextArea
          maxLength={400}
          minLength={2}
          placeholder={
            "Request necessary details such as dimensions, brand guidelines, and more"
          }
          className="h-32"
          onChange={getQuestionTitle}
          defaultText={questionTitle}
        />
        <div
          className="question-description-warning"
          style={{
            display:
              questionTitle.trim().length < 2 && warningEnabled
                ? "block"
                : "none",
          }}
        >
          Description should be at least 2 characters long
        </div>
      </div>

      <div className="question-form-and-options">
        <h6>Get it in a form of:</h6>
        <div className="question-type-wrapper">
          <div>
            <SelectInput2
              data={questionTypeData}
              defaultOption={questionType}
              getChoosenOption={getQuestionType}
              style={{ width: "15rem", textTransform: "capitalize" }}
            />
          </div>

          {questionType === MULTIPLE_CHOICE && (
            <div className="">
              <CheckInput
                label="Enable to choose more than 1 option"
                getInputCheckedVal={getMultipleOptionSelectionStatus}
                defaultValue={enableMultipleOptionsInput}
              />
            </div>
          )}
        </div>
      </div>

      {questionType === MULTIPLE_CHOICE && (
        <div className="add-options-wrapper">
          {options.map((option, index) => (
            <div className="option" key={"option" + index}>
              <div className="option-wrapper">
                <input
                  placeholder="Add Option"
                  onChange={(e) => handleOptionChange(e, index)}
                  value={option}
                />
                <span
                  style={{ display: options.length <= 2 ? "none" : "block" }}
                  className="close-icon"
                  onClick={() => handleRemoveOption(index)}
                >
                  <IoClose />
                </span>
              </div>
              <div
                className="option-warning"
                style={{
                  display:
                    options[index].trim().length === 0 && warningEnabled
                      ? "block"
                      : "none",
                }}
              >
                Description should be at least 1 character long
              </div>
            </div>
          ))}
          <button onClick={handleAddNewOption}>+ Add New Option</button>
        </div>
      )}

      <div className="add-cancel-buttons-wrapper">
        <button className="cancel-add" onClick={handleCancelAdd}>
          Cancel
        </button>
        <button
          className="add-question"
          style={{ display: !edit ? "block" : "none" }}
          onClick={handleAddQuestion}
        >
          Add
        </button>
        <button
          className="add-question"
          style={{ display: edit ? "block" : "none" }}
          onClick={() =>
            handleUpdateQuestion  && handleUpdateQuestion(indexOfQuestionToEdit!)
          }
        >
          Update
        </button>
      </div>
    </div>
  );
};
