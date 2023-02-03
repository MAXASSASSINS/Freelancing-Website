import React from 'react'
import { TextArea } from '../TextArea/TextArea'
import SelectInput2 from '../SelectInput/SelectInput2'
import { CheckInput } from '../CheckInput/CheckInput'
import { IoClose } from 'react-icons/io5'



export const AddorUpdateQuestion = ({ getQuestionTitle, questionTitle,
  warningEnabled, getQuestionType, handleCancelAdd, handleAddNewOption,
  handleAddQuestion, questionType, options, questionTypeData, handleOptionChange, handleRemoveOption,
  getRequiredStatusOfQuestion, getMultipleOptionSelectionStatus,
  questionRequiredInput, enableMultipleOptionsInput, edit, handleUpdateQuestion, indexOfQuestionToEdit}) => {
  
    // console.log(getRequiredStatusOfQuestion);

  return (
    <div className='add-question-wrapper'>
      <header>
        <h6>Add a question</h6>
        <CheckInput
          label='Required'
          getInputCheckedVal={getRequiredStatusOfQuestion}
          defaultValue={questionRequiredInput}
        />
      </header>

      <div className='question-box'>
        <TextArea
          maxLength={400}
          minLength={2}
          placeholder={'Request necessary details such as dimensions, brand guidelines, and more'}
          style={{ height: "8rem" }}
          getText={getQuestionTitle}
          defaultText={questionTitle}
        />
        <div
          className='question-description-warning'
          style={{ display: (questionTitle.length < 2 && warningEnabled) ? "block" : "none" }}
        >
          Description should be at least 2 characters long
        </div>
      </div>

      <div className='question-form-and-options'>
        <h6>Get it in a form of:</h6>
        <div className='question-type-wrapper'>
          <div>
            <SelectInput2
              data={questionTypeData}
              defaultOption={questionType}
              getChoosenOption={getQuestionType}
              style={{ width: "15rem" }}
            />
          </div>

          {
            questionType === 'Multiple Choice' &&
            <div className=''>
              <CheckInput
                label='Enable to choose more than 1 option'
                getInputCheckedVal={getMultipleOptionSelectionStatus}
                defaultValue={enableMultipleOptionsInput}
              />
            </div>
          }
        </div>
      </div>

      {
        questionType === 'Multiple Choice' &&
        <div className='add-options-wrapper'>
          {
            options.map((option, index) => (
              <div className='option' key={'option' + index}>
                <div className='option-wrapper'>
                  <input
                    placeholder='Add Option'
                    onChange={(e) => handleOptionChange(e, index)}
                    value={option}
                  />
                  <span
                    style={{ display: options.length <= 2 ? "none" : "block" }}
                    className='close-icon'
                    onClick={() => handleRemoveOption(index)}
                  >
                    <IoClose />
                  </span>
                </div>
                <div
                  className='option-warning'
                  style={{ display: (options[index].trim().length == 0 && warningEnabled) ? "block" : "none" }}
                >
                  Description should be at least 1 character long
                </div>
              </div>
            ))
          }
          <button onClick={handleAddNewOption}>+ Add New Option</button>
        </div>
      }

      <div className='add-cancel-buttons-wrapper'>
        <button className='cancel-add' onClick={handleCancelAdd}>Cancel</button>
        <button className='add-question' style={{display: !edit ? "block" : "none"}} onClick={handleAddQuestion}>Add</button>
        <button className='add-question' style={{display: edit ? "block" : "none"}} onClick={() => handleUpdateQuestion && handleUpdateQuestion(indexOfQuestionToEdit)}>Update</button>
      </div>

    </div>
  )
}
