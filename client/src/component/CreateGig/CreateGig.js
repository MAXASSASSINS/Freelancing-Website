import React, { useContext, useState, useEffect, useReducer, useRef, createRef } from 'react'
import './CreateGig.css'
import { Navigate, useNavigate } from 'react-router-dom'
import { windowContext } from '../../App'
import { useSelector, useDispatch } from 'react-redux'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { categoriesData } from './createGigData'
import { subCategoriesData } from './createGigData'
import { packagesData } from './createGigData'
import { deliveryTimeData } from './createGigData'
import { revisionsData } from './createGigData'
import { TextEditor } from '../TextEditor/TextEditor'
import { TfiText } from 'react-icons/tfi'
import { TbGridDots } from 'react-icons/tb'
import { FileDropIcon } from '../FileDropIcon/FileDropIcon'
import { RoundNumberIcon } from '../RoundNumberIcon/RoundNumberIcon'
import { fontWeight } from '@mui/system'
import { TextArea } from '../TextArea/TextArea'
import { Test } from '../Test/Test'
import { BsDash } from 'react-icons/bs'
import { questionTypeData } from './createGigData'
import { CheckInput } from '../CheckInput/CheckInput'
import { createGigQuestionReducer, QUESTION_DETAILS_INITIAL_STATE } from '../../reducers/createGigQuestionReducer'
import { AiOutlineEllipsis } from 'react-icons/ai'
import SelectInput2 from '../SelectInput/SelectInput2'
import { IoClose } from 'react-icons/io5'
import { AddorUpdateQuestion } from './AddorUpdateQuestion'
import { MULTIPLE_CHOICE } from './createGigConstants'

export const CreateGig = () => {
  const navigate = useNavigate();
  const { windowWidth, windowHeight } = useContext(windowContext);
  const { user, isAuthenticated, loading, error } = useSelector(state => state.user);

  const [currentStep, setCurrentStep] = useState(1);
  const [stepCompleted, setStepCompleted] = useState([false, false, false, false, false, false]);
  const [maxStep, setMaxStep] = useState(6);

  const [gigTitleInput, setGigTitleInput] = useState("");
  const [enalbeGigTitleInputWarning, setEnalbeGigTitleInputWarning] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('Select a category');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Select a sub-category');

  const packageNameRefs = useRef([]);
  const packageDescriptionRefs = useRef([]);
  const deliveryTimeRefs = useRef([]);
  const deliveryRevisionsRefs = useRef([]);
  const packagePriceRefs = useRef([]);
  const sourceFileRefs = useRef([]);
  const commercialUseRefs = useRef([]);

  const [showQuestions, setShowQuestions] = useState(true);
  const [questionType, setQuestionType] = useState('Free Text');
  const [questionsDetails, dispatch] = useReducer(createGigQuestionReducer, QUESTION_DETAILS_INITIAL_STATE);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionRequiredInput, setQuestionRequiredInput] = useState(false);
  const [enableMultipleOptionsInput, setEnableMultipleOptionsInput] = useState(false);
  const [indexOfQuestionToEdit, setIndexOfQuestionToEdit] = useState(-1);

  const [options, setOptions] = useState(["", ""]);
  const [warnings, setWarnings] = useState(["", ""]);

  const [showEditQuestion, setShowEditQuestion] = useState(false);

  const [warningEnabled, setWarningEnabled] = useState(false);

  const hideEditRemoveOptionRefs = useRef([]);

  const [sellerShowcaseVideo, setSellerShowcaseVideo] = useState("");
  const [sellerShowcaseImages, setSellerShowcaseImages] = useState([null, null, null]);
  const [sellerShowcaseDocuments, setSellerShowcaseDocuments] = useState([null, null]);

  const [sellerShowcaseVideoError, setSellerShowcaseVideoError] = useState("");
  const [sellerShowcaseImagesError, setSellerShowcaseImagesError] = useState("");
  const [sellerShowcaseDocumentsError, setSellerShowcaseDocumentsError] = useState("");


  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [user])

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    setSelectedSubCategory('Select a sub-category');
  }, [selectedCategory])


  packageNameRefs.current = packagesData.map((item, index) => packageNameRefs.current[index] || createRef());
  packageDescriptionRefs.current = packagesData.map((item, index) => packageDescriptionRefs.current[index] || createRef());
  deliveryTimeRefs.current = packagesData.map((item, index) => deliveryTimeRefs.current[index] || createRef());
  deliveryRevisionsRefs.current = packagesData.map((item, index) => deliveryRevisionsRefs.current[index] || createRef());
  packagePriceRefs.current = packagesData.map((item, index) => packagePriceRefs.current[index] || createRef());
  sourceFileRefs.current = packagesData.map((item, index) => sourceFileRefs.current[index] || createRef());
  commercialUseRefs.current = packagesData.map((item, index) => commercialUseRefs.current[index] || createRef());

  const getGigTitleInput = (val) => {
    if(val.trim().length < 15){
      setEnalbeGigTitleInputWarning(true);
    }
    else{
      setEnalbeGigTitleInputWarning(false);
    }
    setGigTitleInput(val);
  }


  const getSelectedCategory = (val) => {
    setSelectedCategory(val);
  }

  const getSelectedSubCategory = (val) => {
    setSelectedSubCategory(val);
  }

  const getSubCategoryList = (val) => {
    if (val !== 'Select a category') {
      const index = Object.keys(subCategoriesData).indexOf(val);
      const list = Object.values(subCategoriesData)[index];
      return list;
    }
    else {
      return [];
    }
  }

  const handleSaveAndContinue = () => {
    if (currentStep < 7) {
      for (let i = 1; i < 7; i++) {
        if (i === currentStep) {
          stepCompleted[i] = true;
        }
      }
      if (maxStep < currentStep + 1) {
        setMaxStep(currentStep + 1);
      }
      setCurrentStep(currentStep + 1);
    }
  }

  const handleNavigateToStep = (step) => {
    if (step <= maxStep) {
      setCurrentStep(step);
    }
  }

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  const checkForAnyEmptyFieldsForQuestion = () => {
    let error = false;
    console.log(questionTitle);
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
      })
    }
    return error;
  }

  const commonForEditAddCancelQuestion = () => {
    setOptions(["", ""]);
    setQuestionType('Free Text');
    setWarningEnabled(false);
    setQuestionTitle('');
    setShowEditQuestion(false);
    setEnableMultipleOptionsInput(false);
    setQuestionRequiredInput(false);
  }

  const handleCancelAdd = () => {
    setShowQuestions(true);
    commonForEditAddCancelQuestion();
  }

  const handleAddQuestion = () => {
    let error = checkForAnyEmptyFieldsForQuestion();

    if (error) return;

    const payload = {
      question: questionTitle.trim(),
      type: questionType,
      requiredStatus: questionRequiredInput,
      multipleOptionSelectionStatus: enableMultipleOptionsInput,
      options: options
    }
    dispatch({ type: 'ADD_NEW_QUESTION', payload: payload });
    setShowQuestions(true);
    setShowEditQuestion(false);
    commonForEditAddCancelQuestion();
  }

  const handleRemoveQuestion = (index) => {
    const payload = {
      questionIndex: index
    }
    dispatch({ type: 'REMOVE_QUESTION', payload: payload });
  }

  const handleEditQuestion = (index) => {
    setIndexOfQuestionToEdit(index);
    setEnableMultipleOptionsInput(questionsDetails[index].multipleOptionSelectionStatus);
    setQuestionRequiredInput(questionsDetails[index].requiredStatus);
    setQuestionTitle(questionsDetails[index].question);
    setQuestionType(questionsDetails[index].type);
    setOptions(questionsDetails[index].options);
    setShowQuestions(false);
    setShowEditQuestion(true);
  }

  const handleUpdateQuestion = (index) => {
    let error = checkForAnyEmptyFieldsForQuestion();
    if (error) return;

    const payload = {
      questionIndex: index,
      question: questionTitle,
      type: questionType,
      requiredStatus: questionRequiredInput,
      multipleOptionSelectionStatus: enableMultipleOptionsInput,
      options: options
    }

    dispatch({ type: 'UPDATE_QUESTION', payload: payload });
    commonForEditAddCancelQuestion();
    setShowQuestions(true);
    setShowEditQuestion(false);
    setIndexOfQuestionToEdit(-1);
  }

  const getQuestionOptions = (options) => {
    const string = options.join(", ");
    return string;
  }

  const handleShowEditQuestion = (index) => {
    const showEditQuestion = questionsDetails[index].showEditQuestion;
    // console.log(showEditQuestion);
    const payload = {
      questionIndex: index,
      showEditQuestion: questionsDetails[index].showEditQuestion
    }
    dispatch({ type: 'UPDATE_SHOW_EDIT_QUESTION', payload: payload });
  }

  const getQuestionType = (val) => {
    setQuestionType(val);
  }

  const handleAddNewOption = () => {
    setOptions([...options, ""]);
    setWarnings([...warnings, ""]);
  }

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((item, i) => i !== index);
    setOptions(newOptions);
  }

  const handleOptionChange = (e, index) => {
    const newOptions = options.map((item, i) => {
      if (i === index) {
        return e.target.value;
      }
      else {
        return item;
      }
    })
    setOptions(newOptions);
  }

  const getQuestionTitle = (val) => {
    setQuestionTitle(val);
  }

  const getRequiredStatusOfQuestion = (val) => {
    setQuestionRequiredInput(val);
  }

  const getMultipleOptionSelectionStatus = (val) => {
    setEnableMultipleOptionsInput(val);
  }

  const handleClickOutside = (event) => {
    let check = true;
    for (let i = 0; i < hideEditRemoveOptionRefs?.current?.length; i++) {
      if (hideEditRemoveOptionRefs?.current[i]?.contains(event.target)) {
        check = false;
        break;
      }
    }
    if (check) {
      dispatch({ type: 'HIDE_ALL_EDIT_QUESTION' });
    }
  }

  const getSellerShowcaseVideo = (val) => {
    setSellerShowcaseVideoError('');
    setSellerShowcaseVideo(val);
  }

  const getSellerShowcaseImages = (val, index) => {
    setSellerShowcaseImagesError('');
    const newSellerShowcaseImages = sellerShowcaseImages.map((item, i) => {
      if (i === index) {
        return val;
      }
      else {
        return item;
      }
    })
    setSellerShowcaseImages(newSellerShowcaseImages);
    console.log(newSellerShowcaseImages);
  }

  const getSellerShowcaseDocuments = (val, index) => {
    setSellerShowcaseDocumentsError('');
    const newSellerShowcaseDocuments = sellerShowcaseDocuments.map((item, i) => {
      if (i === index) {
        return val;
      }
      else {
        return item;
      }
    })
    setSellerShowcaseDocuments(newSellerShowcaseDocuments);
    console.log(newSellerShowcaseDocuments);
  }

  const getSellerShowcaseVideoError = (val) => {
    setSellerShowcaseVideoError(val);
  }

  const getSellerShowcaseImagesError = (val) => {
    setSellerShowcaseImagesError(val);
  }

  const getSellerShowcaseDocumentsError = (val) => {
    setSellerShowcaseDocumentsError(val);
  }





  return (
    <div className='create-gig-main'>

      <nav>
        <ul>
          <li onClick={() => handleNavigateToStep(1)} className={`${1 <= currentStep && 'step-completed'} ${currentStep === 1 && 'current-step'}`}>
            <div className='nav-icon'>
              {
                stepCompleted[1] && currentStep > 1 ?
                  <CheckCircleIcon style={{ color: "#1dbf73", fontSize: "28" }} />
                  :
                  <RoundNumberIcon number={1} bcgColor={currentStep === 1 ? "#1dbf73" : "#74767e"} />
              }
            </div>
            <div className={`${1 <= maxStep && "hover"}`}>
              Overview
            </div>
            <div style={{ color: "#222831" }}>
              <ChevronRightIcon style={{ fontSize: '20', fontWeight: 'light' }} />
            </div>
          </li>
          <li onClick={() => handleNavigateToStep(2)} className={`${2 <= currentStep && 'step-completed'} ${currentStep === 2 && 'current-step'}`}>
            <div className='nav-icon'>
              {
                stepCompleted[2] && currentStep > 2 ?
                  <CheckCircleIcon style={{ color: "#1dbf73", fontSize: "28" }} />
                  :
                  <RoundNumberIcon number={2} bcgColor={currentStep === 2 ? "#1dbf73" : "#a6a5a5"} />
              }
            </div>
            <div className={`${2 <= maxStep && "hover"}`}>
              Pricing
            </div>
            <ChevronRightIcon style={{ fontSize: '20', fontWeight: 'light' }} />
          </li>
          <li onClick={() => handleNavigateToStep(3)} className={`${3 <= currentStep && 'step-completed'} ${currentStep === 3 && 'current-step'}`}>
            <div className='nav-icon'>
              {
                stepCompleted[3] && currentStep > 3 ?
                  <CheckCircleIcon style={{ color: "#1dbf73", fontSize: "28" }} />
                  :
                  <RoundNumberIcon number={3} bcgColor={currentStep === 3 ? "#1dbf73" : "#a6a5a5"} />
              }
            </div>
            <div className={`${3 <= maxStep && "hover"}`}>
              Description
            </div>
            <ChevronRightIcon style={{ fontSize: '20', fontWeight: 'light' }} />
          </li>
          <li onClick={() => handleNavigateToStep(4)} className={`${4 <= currentStep && 'step-completed'} ${currentStep === 4 && 'current-step'}`}>
            <div className='nav-icon'>
              {
                stepCompleted[4] && currentStep > 4 ?
                  <CheckCircleIcon style={{ color: "#1dbf73", fontSize: "28" }} />
                  :
                  <RoundNumberIcon number={4} bcgColor={currentStep === 4 ? "#1dbf73" : "#a6a5a5"} />
              }
            </div>
            <div className={`${4 <= maxStep && "hover"}`}>
              Requirements
            </div>
            <ChevronRightIcon style={{ fontSize: '20', fontWeight: 'light' }} />
          </li>
          <li onClick={() => handleNavigateToStep(5)} className={`${5 <= currentStep && 'step-completed'} ${currentStep === 5 && 'current-step'}`}>
            <div className='nav-icon'>
              {
                stepCompleted[5] && currentStep !== 5 ?
                  <CheckCircleIcon style={{ color: "#1dbf73", fontSize: "28" }} />
                  :
                  <RoundNumberIcon number={5} bcgColor={currentStep === 5 ? "#1dbf73" : "#a6a5a5"} />
              }
            </div>
            <div className={`${5 <= maxStep && "hover"}`}>
              Gallery
            </div>
            <ChevronRightIcon style={{ fontSize: '20', fontWeight: 'light' }} />
          </li>
          <li onClick={() => handleNavigateToStep(6)} className={`${6 <= currentStep && 'step-completed'} ${currentStep === 6 && 'current-step'}`}>
            <div className='nav-icon'>
              {
                stepCompleted[6] && currentStep !== 6 ?
                  <CheckCircleIcon style={{ color: "#1dbf73", fontSize: "28" }} />
                  :
                  <RoundNumberIcon number={6} bcgColor={currentStep === 6 ? "#1dbf73" : "#a6a5a5"} />
              }
            </div>
            <div className={`${6 <= maxStep && "hover"}`}>
              Publish
            </div>
          </li>
        </ul>
      </nav>

      <div className='overview' style={{ display: currentStep === 1 ? "" : "none" }}>
        <div className='left-side'>
          <div>
            <h3>Gig title</h3>
            <p>As your Gig storefront, your title is the most important place to include keywords that buyers would likely use to search for a service like yours.</p>
          </div>
          <div>
            <h3>Category</h3>
            <p>Choose the category and sub-category most suitable for your Gig.</p>
          </div>
          <div>
            <h3>Search tags</h3>
            <p>Tag your Gig with buzz words that are relevant to the services you offer. Use all 5 tags to get found.</p>
          </div>
        </div>
        <div className='right-side'>
          <div>
            <TextArea
              maxLength={100}
              minLength={0}
              placeholder="I will do something I'm really good at"
              defaultText="I will "
              fontSize="18px"
              getText={getGigTitleInput}
            />
            {
              enalbeGigTitleInputWarning &&
              <div className='gig-title-input-warning'>
                15 characters minimum
              </div>
            }
          </div>
          <div className='category-section'>
            <SelectInput2
              defaultOption={'Select a category'}
              data={categoriesData}
              style={{ textTransform: 'uppercase' }}
              getChoosenOption={getSelectedCategory}
            />
            <SelectInput2
              defaultOption={'Select a sub-category'}
              data={selectedCategory && getSubCategoryList(selectedCategory)}
              style={{ textTransform: 'uppercase' }}
              getChoosenOption={getSelectedSubCategory}
            />
          </div>
          <div className='keyword-section'>
            <h6>Positive keywords</h6>
            <p>Enter search terms you feel your buyers will use when looking for your service.</p>
            <input></input>
            <p className='recommend'>5 tags maximum. Use letters and numbers only. Tags should be comma seprated.</p>
          </div>
        </div>
      </div>

      <div className='pricing' style={{ display: currentStep === 2 ? "" : "none" }}>
        <h2>Scope & Pricing</h2>
        <h3>Packages</h3>
        <div className='pricing-section'>
          {
            packagesData.map((pack, index) => {
              return (
                <div className='package' key={'package' + index}>
                  <h4>{pack}</h4>
                  <TextArea
                    className='package-name'
                    maxLength={40}
                    minLength={0}
                    placeholder='Enter your package name'
                    style={{ fontSize: '14px', height: '40px', borderRadius: '0px' }}
                    reference={packageNameRefs.current[index]}
                  />
                  <TextArea
                    maxLength={100}
                    minLength={0}
                    placeholder='Enter your package description'
                    defaultText=''
                    style={{ fontSize: '14px', borderRadius: '0' }}
                    reference={packageDescriptionRefs.current[index]}
                  />

                  <SelectInput2
                    data={deliveryTimeData}
                    defaultOption={'Choose a delivery time'}
                    ref={deliveryTimeRefs.current[index]}
                  />

                  <SelectInput2
                    data={revisionsData}
                    defaultOption={'Select no. of revisions'}
                    ref={deliveryRevisionsRefs.current[index]}
                  />

                  <div className='price-details'>
                    <input ref={packagePriceRefs.current[index]} className='price-value' step="5" placeholder='Price' type="number" min={5} max={10000}></input>
                    <span>$</span>
                  </div>
                  <div className='source'>
                    <CheckInput
                      label='Source File'
                      reference={sourceFileRefs.current[index]}
                    />
                  </div>
                  <div className='commercial'>
                    <CheckInput
                      label='Commercial Use'
                      reference={commercialUseRefs.current[index]}
                    />
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>

      <div className='description' style={{ display: currentStep === 3 ? "" : "none" }}>
        <h1>Description</h1>
        <h3>Briefly Describe Your Gig</h3>
        <TextEditor
          maxLength={1200}
        />
      </div>

      <div className='requirements' style={{ display: currentStep === 4 ? "" : "none" }}>
        <header>Get all the information you need from buyers to get started</header>
        <p className='requirements-message'>Add questions to help buyers provide you with exactly what you need to start working on their order.</p>
        <div className='your-questions'>
          <hr />
          <strong>
            Your Questions
          </strong>
        </div>

        {
          showEditQuestion ?
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
            :
            !showQuestions ?
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
              :
              questionsDetails.map((question, index) => (
                <div className='question-details-section'>
                  <div className='question-type'>
                    <div className='text-or-multiple-choice'>
                      {
                        question.type === 'Free Text' ?
                          <span><TfiText /></span>
                          :
                          <span><TbGridDots /></span>
                      }
                      <span>{question.type}</span>
                    </div>
                    <div
                      className='edit-and-remove'
                      // ref={hideEditRemoveOptionRefs[index]}
                      ref={el => (hideEditRemoveOptionRefs.current[index] = el)}
                    >
                      <div className='ellipsis-icon' onClick={() => handleShowEditQuestion(index)}>
                        <AiOutlineEllipsis />
                      </div>
                      {
                        question.showEditQuestion &&
                        <div className='edit-modal'>
                          {
                            <div className='edit-and-remove-options'>
                              <div onClick={() => handleEditQuestion(index)}>Edit</div>
                              <div onClick={() => handleRemoveQuestion(index)}>Remove</div>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  </div>
                  <div className='question'>
                    {question.question}
                  </div>

                  {
                    question.type === MULTIPLE_CHOICE &&
                    <div className='options'>
                      {getQuestionOptions(question.options)}
                    </div>
                  }
                </div>
              ))
        }
        {
          showQuestions &&
          <div className='add-question-button' >
            <button onClick={() => setShowQuestions(false)}> + Add New Question</button>
          </div>
        }
      </div>

      <div className='gallery' style={{ display: currentStep === 5 ? "" : "none" }}>
        <h3>Showcase Your Services In A Gig Gallery</h3>
        <p className='heading-para'>Encourage buyers to choose your Gig by featuring a variety of your work.</p>

        <div className='gallery-file-formats-wrapper'>
          <section className='video'>
            <h4 className='gallery-heading'>Video (one only)</h4>
            <p className='gallery-heading-para'>Capture buyers' attention with a video that showcases your service.</p>
            <p className='size-limit-warning'>Please choose a video shorter than 75 seconds and smaller than 50MB</p>
            <div className='custom-file-input-wrapper'>
              <FileDropIcon
                fileAcceptType="video/*"
                type="video"
                getSelectedFile={getSellerShowcaseVideo}
                maxFileSize={50 * 1024 * 1024}
                getError={getSellerShowcaseVideoError}
                maxDuration={75}
              />
            </div>
            {
              sellerShowcaseVideoError &&
              <p className='gallery-input-error'>{sellerShowcaseVideoError}</p>
            }
          </section>
          <section>
            <h4 className='gallery-heading'>Images(up to 3)</h4>
            <p className='gallery-heading-para'>Get noticed by the right buyers with visual examples of your services.</p>
            <div className='custom-file-input-wrapper'>
              {
                [1, 2, 3].map((num, index) => {
                  return (
                    <FileDropIcon
                      type="image"
                      fileAcceptType="image/*"
                      getSelectedFile={getSellerShowcaseImages}
                      index={index}
                      maxFileSize={5 * 1024 * 1024}
                      getError={getSellerShowcaseImagesError}

                    />
                  )
                })
              }
            </div>
            {
              sellerShowcaseImagesError &&
              <p className='gallery-input-error'>{sellerShowcaseImagesError}</p>
            }
          </section>
          <section>
            <h4 className='gallery-heading'>Documents (up to 2)</h4>
            <p className='gallery-heading-para'>Show some of the best work you created in a document (PDFs only).</p>
            <div className='custom-file-input-wrapper'>
              {
                [1, 2].map((num, index) => {
                  return (
                    <FileDropIcon
                      fileAcceptType=".pdf"
                      type="document"
                      getSelectedFile={getSellerShowcaseDocuments}
                      index={index}
                      maxFileSize={2 * 1024 * 1024}
                      getError={getSellerShowcaseDocumentsError}
                    />
                  )
                })
              }
            </div>
            {
              sellerShowcaseDocumentsError &&
              <p className='gallery-input-error'>{sellerShowcaseDocumentsError}</p>
            }
          </section>
        </div>
      </div>

      <div style={{ display: currentStep === 6 ? "" : "none" }}>
        <h3>Congratulations!</h3>
        <p>You're almost done with your first Gig.</p>
        <p>Before you start selling on FreelanceMe, there is one last thing we need you to do:
          The security of your account is important to us. Therefore, we require all our sellers to verify their phone number before we can publish their first Gig.</p>
      </div>

      <div className='save-and-verify'>
        {
          currentStep === 6 ?
            <button>Verify Now Button</button>
            :
            <button onClick={handleSaveAndContinue}>Save & Continue</button>
        }
      </div>

      <div className='back-button' style={{ display: currentStep <= 1 ? "none" : "" }}>
        <button onClick={handleStepBack}>back</button>
      </div>
    </div>
  )

}
