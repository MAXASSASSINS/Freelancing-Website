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
  handleOptionChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
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
    <div className="bg-separator border border-dark_separator p-6 text-light_heading">
      <header className="font-normal flex justify-between text-base mb-3">
        <h6 className="text-light_grey font-semibold">Add a question</h6>
        <CheckInput
          label="Required"
          getInputCheckedVal={getRequiredStatusOfQuestion}
          defaultValue={questionRequiredInput}
        />
      </header>

      <div className="mb-4 relative">
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
          className="absolute text-warning text-sm bottom-0"
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

      <div>
        <h6 className="font-semibold text-light_heading mb-4">
          Get it in a form of:
        </h6>
        <div className="flex justify-between">
          <div>
            <SelectInput2
              data={questionTypeData}
              defaultOption={questionType}
              onChange={getQuestionType}
              style={{ width: "15rem", textTransform: "capitalize" }}
            />
          </div>

          {questionType === MULTIPLE_CHOICE && (
            <div>
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
        <div className="mt-5">
          {options.map((option, index) => (
            <div className="option" key={"option" + index}>
              <div className="relative w-full flex items-center">
                <input
                  className="block w-full my-2 p-2 border border-no_focus rounded placeholder:text-no_focus hover:border-light_heading focus:outline-none"
                  placeholder="Add Option"
                  onChange={(e) => handleOptionChange(e, index)}
                  value={option}
                />
                <span
                  style={{ display: options.length <= 2 ? "none" : "block" }}
                  className="absolute right-4 text-dark_grey hover:cursor-pointer"
                  onClick={() => handleRemoveOption(index)}
                >
                  <IoClose />
                </span>
              </div>
              <div
                className="text-warning text-sm -mt-2 mb-4"
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
          <button
            onClick={handleAddNewOption}
            className="px-8 py-3 rounded border border-link text-link mt-2 hover:bg-link hover:cursor-pointer hover:text-white"
          >
            + Add New Option
          </button>
        </div>
      )}

      <div className="flex mt-4 justify-end">
        <button
          className="px-8 py-3 rounded transition-all duration-200 hover:cursor-pointer border border-light_heading text-light_heading mr-4 hover:bg-light_heading hover:text-white"
          onClick={handleCancelAdd}
        >
          Cancel
        </button>
        <button
          className="text-white rounded transition-all duration-200  px-8 py-3 bg-primary border-none hover:bg-primary_hover hover:cursor-pointer"
          style={{ display: !edit ? "block" : "none" }}
          onClick={handleAddQuestion}
        >
          Add
        </button>
        <button
          className="text-white transition-all duration-200 hover:cursor-pointer rounded  px-8 py-3 bg-primary border-none hover:bg-primary_hover"
          style={{ display: edit ? "block" : "none" }}
          onClick={() =>
            handleUpdateQuestion && handleUpdateQuestion(indexOfQuestionToEdit!)
          }
        >
          Update
        </button>
      </div>
    </div>
  );
};
