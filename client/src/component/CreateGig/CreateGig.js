import React, {
  useContext,
  useState,
  useEffect,
  useReducer,
  useRef,
  createRef,
} from "react";
import "./CreateGig.css";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { windowContext } from "../../App";
import { useSelector, useDispatch } from "react-redux";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { categoriesData } from "./createGigData";
import { subCategoriesData } from "./createGigData";
import { packagesData } from "./createGigData";
import { deliveryTimeData } from "./createGigData";
import { revisionsData } from "./createGigData";
import { TextEditor } from "../TextEditor/TextEditor";
import { TfiText } from "react-icons/tfi";
import { TbGridDots } from "react-icons/tb";
import { FileDropIcon } from "../FileDropIcon/FileDropIcon";
import { RoundNumberIcon } from "../RoundNumberIcon/RoundNumberIcon";
import { fontWeight } from "@mui/system";
import { TextArea } from "../TextArea/TextArea";
import { Test } from "../Test/Test";
import { BsDash } from "react-icons/bs";
import { questionTypeData } from "./createGigData";
import { CheckInput } from "../CheckInput/CheckInput";
import {
  createGigQuestionReducer,
  QUESTION_DETAILS_INITIAL_STATE,
} from "../../reducers/createGigQuestionReducer";
import { AiOutlineEllipsis } from "react-icons/ai";
import SelectInput2 from "../SelectInput/SelectInput2";
import { IoClose } from "react-icons/io5";
import { AddorUpdateQuestion } from "./AddorUpdateQuestion";
import { MULTIPLE_CHOICE } from "./createGigConstants";
import { IoIosClose } from "react-icons/io";
import { countryWithPhoneCodesData } from "./CountryPhoneCode";
import { no_focus_color, green_color } from "../../utility/color";
import axios from "axios";
import { DataSendingLoading } from "../DataSendingLoading/DataSendingLoading";
import { AiFillExclamationCircle } from "react-icons/ai";
import { getGigDetail } from "../../actions/gigAction";
import { RESET_ALL } from "../../constants/createGigQuestionConstants";
import { uploadToCloudinary } from "../../utility/cloudinary";
import { FREE_TEXT } from "../../constants/globalConstants";

export const CreateGig = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let [searchParams, setSearchParams] = useSearchParams();
  let gigId = searchParams.get("id");
  if (!gigId) navigate("/404");

  const { windowWidth, windowHeight } = useContext(windowContext);
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.user
  );

  const { gigDetail } = useSelector((state) => state.gigDetail);

  const [currentStep, setCurrentStep] = useState(1);
  const [stepCompleted, setStepCompleted] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [maxStep, setMaxStep] = useState(1);

  const gigTitleInputRef = useRef(null);
  const [gigTitleInput, setGigTitleInput] = useState("I will ");
  const [enalbeGigTitleInputWarning, setEnalbeGigTitleInputWarning] =
    useState(false);

  const selectedCategoryRef = useRef(null);
  const selectedSubCategoryRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("Select a category");
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    "Select a sub-category"
  );

  const [categoryWarning, setCategoryWarning] = useState("");

  const tagListRef = useRef(null);
  const [tagListWarning, setTagListWarning] = useState(false);

  const gigDescriptionRef = useRef(null);
  const [gigDescriptionError, setGigDescriptionError] = useState(false);

  const packageNameRefs = useRef([]);
  const packageDescriptionRefs = useRef([]);
  const deliveryTimeRefs = useRef([]);
  const deliveryRevisionsRefs = useRef([]);
  const packagePriceRefs = useRef([]);
  const sourceFileRefs = useRef([]);
  const commercialUseRefs = useRef([]);

  const [packagesWarning, setPackagesWarning] = useState(false);

  const [questionsDetails, questionDispatch] = useReducer(
    createGigQuestionReducer,
    QUESTION_DETAILS_INITIAL_STATE
  );
  const [showQuestions, setShowQuestions] = useState(true);
  const [questionType, setQuestionType] = useState(FREE_TEXT);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionRequiredInput, setQuestionRequiredInput] = useState(false);
  const [enableMultipleOptionsInput, setEnableMultipleOptionsInput] =
    useState(false);
  const [indexOfQuestionToEdit, setIndexOfQuestionToEdit] = useState(-1);

  const [options, setOptions] = useState(["", ""]);
  const [warnings, setWarnings] = useState(["", ""]);

  const [showEditQuestion, setShowEditQuestion] = useState(false);

  const [warningEnabled, setWarningEnabled] = useState(false);

  const hideEditRemoveOptionRefs = useRef([]);

  const [requirementsShortageWarning, setRequirementsShortageWarning] =
    useState(false);

  const [sellerShowcaseImages, setSellerShowcaseImages] = useState([
    null,
    null,
    null,
  ]);
  const [sellerShowcaseVideo, setSellerShowcaseVideo] = useState("");
  const [sellerShowcaseDocuments, setSellerShowcaseDocuments] = useState([
    null,
    null,
  ]);

  const sellerShowcaseImagesRefs = useRef([]);
  const sellerShowcaseDocumentsRefs = useRef([]);
  const sellerShowcaseVideoRef = useRef(null);

  const [sellerShowcaseVideoError, setSellerShowcaseVideoError] = useState("");
  const [sellerShowcaseImagesError, setSellerShowcaseImagesError] =
    useState("");
  const [sellerShowcaseDocumentsError, setSellerShowcaseDocumentsError] =
    useState("");

  const [showVerifyPhoneNumberModal, setShowVerifyPhoneNumberModal] =
    useState(false);

  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(
    countryWithPhoneCodesData
  );
  const [dialCode, setDialCode] = useState("");

  const [showCountryDropdown, setShowCountryDropdown] = useState(true);

  const [verificationCode, setVerificationCode] = useState("");
  const [showVerifyCodeInput, setShowVerifyCodeInput] = useState(false);

  const verificationCodeErrorRef = useRef(null);
  const invalidPhoneNumberRef = useRef(null);

  const [showGigPublishFinalModal, setShowGigPublishFinalModal] =
    useState(false);

  const [showDataSendingLoadingScreen, setShowDataSendingLoadingScreen] =
    useState(false);

  const [verifiedStatusOfSeller, setVerifiedStatusOfSeller] = useState(false);

  // initalizing all  the ref arrays
  packageNameRefs.current = packagesData.map(
    (item, index) => packageNameRefs.current[index] || createRef()
  );
  packageDescriptionRefs.current = packagesData.map(
    (item, index) => packageDescriptionRefs.current[index] || createRef()
  );
  deliveryTimeRefs.current = packagesData.map(
    (item, index) => deliveryTimeRefs.current[index] || createRef()
  );
  deliveryRevisionsRefs.current = packagesData.map(
    (item, index) => deliveryRevisionsRefs.current[index] || createRef()
  );
  packagePriceRefs.current = packagesData.map(
    (item, index) => packagePriceRefs.current[index] || createRef()
  );
  sourceFileRefs.current = packagesData.map(
    (item, index) => sourceFileRefs.current[index] || createRef()
  );
  commercialUseRefs.current = packagesData.map(
    (item, index) => commercialUseRefs.current[index] || createRef()
  );

  sellerShowcaseImagesRefs.current = [1, 2, 3].map(
    (item, index) => sellerShowcaseImagesRefs.current[index] || createRef()
  );
  // sellerShowcaseDocumentsRefs.current = [1, 2].map((item, index) => sellerShowcaseDocumentsRefs.current[index] || createRef());

  // redirecting to login page if user is not authenticated

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [user]);

  // fetching gig details if user is editing a gig
  useEffect(() => {
    if (gigId != "null") {
      console.log("gig id is not null");
      dispatch(getGigDetail(gigId));
    }
  }, [searchParams.get("id")]);

  // populating the respective fields with the gig details fetched from server
  useEffect(() => {
    if (gigDetail && gigId != "null") {
      console.log(gigDetail);
      const {
        title,
        category,
        subCategory,
        images,
        video,
        documents,
        description,
        pricing,
        requirements,
        searchTags,
        active,
      } = gigDetail;

      // step 1
      gigTitleInputRef.current.setTextComingFromParent(title);
      selectedCategoryRef.current.setChoosedOptionComingFromParent(category);
      selectedSubCategoryRef.current.setChoosedOptionComingFromParent(
        subCategory
      );
      setGigTitleInput(title);
      setSelectedCategory(category);
      setSelectedSubCategory(subCategory);
      tagListRef.current.value = searchTags.join(", ");

      // step 2
      pricing.map((item, index) => {
        packageNameRefs.current[index].current.setTextComingFromParent(
          item.packageTitle
        );
        packageDescriptionRefs.current[index].current.setTextComingFromParent(
          item.packageDescription
        );
        deliveryTimeRefs.current[
          index
        ].current.setChoosedOptionComingFromParent(item.packageDeliveryTime);
        deliveryRevisionsRefs.current[
          index
        ].current.setChoosedOptionComingFromParent(item.revisions);
        packagePriceRefs.current[index].current.value = item.packagePrice;
        sourceFileRefs.current[index].current.setIsCheckedComingFromParent(
          item.sourceFile
        );
        commercialUseRefs.current[index].current.setIsCheckedComingFromParent(
          item.commercialUse
        );
      });

      // step 3
      gigDescriptionRef.current.setDescriptionComingFromParent(description);

      // step 4
      requirements.map((item, index) => {
        const data = {
          type: item.questionType,
          question: item.questionTitle,
          requiredStatus: item.answerRequired,
          options: item.options,
          multipleOptionSelectionStatus: item.multipleOptionSelect,
        };
        questionDispatch({ type: "ADD_NEW_QUESTION", payload: data });
      });

      // step 5
      images.map((item, index) => {
        sellerShowcaseImagesRefs.current[index].current.setFileComingFromParent(
          item
        );
      });
      sellerShowcaseVideoRef.current.setFileComingFromParent(video);

      for (let i = 3 - images.length; i > 0; i--) {
        images.push(null);
      }
      setSellerShowcaseImages(images);
      setSellerShowcaseVideo(video);

      // step 6
      setVerifiedStatusOfSeller(active);
      setShowGigPublishFinalModal(active);

      return () => {
        questionDispatch({ type: RESET_ALL });
      };
    }
  }, [gigDetail]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    setSelectedSubCategory("Select a sub-category");
  }, [selectedCategory]);

  useEffect(() => {
    setCategoryWarning("");
  }, [selectedSubCategory, selectedCategory]);

  const getGigTitleInput = (val) => {
    if (val.trim().length < 15) {
      setEnalbeGigTitleInputWarning(true);
    } else {
      setEnalbeGigTitleInputWarning(false);
    }
    setGigTitleInput(val);
  };

  const getSelectedCategory = (val) => {
    setSelectedCategory(val);
  };

  const getSelectedSubCategory = (val) => {
    setSelectedSubCategory(val);
  };

  const getSubCategoryList = (val) => {
    if (val !== "Select a category") {
      const index = Object.keys(subCategoriesData).indexOf(val);
      const list = Object.values(subCategoriesData)[index];
      return list;
    } else {
      return [];
    }
  };

  const handleSaveAndContinue = async () => {
    if (checkForWarnings()) return true;
    await handleSendData();

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
  };

  const handleSendData = async () => {
    setShowDataSendingLoadingScreen(true);
    const data = await collectRequiredData();
    // console.log(data);

    if (searchParams.get("id") === "null") {
      const res = await axios.post("/gig/create", data);
      if (res.status === 201) {
        setSearchParams({ ...searchParams, id: res.data.gigId });
      }
      console.log(res.data);
    } else {
      console.log(data);
      const res = await axios.put(
        `/gig/update/${searchParams.get("id")}`,
        data
      );

      console.log(res.data);
    }
    setShowDataSendingLoadingScreen(false);
  };

  const checkForWarnings = () => {
    switch (currentStep) {
      case 1:
        if (gigTitleInput.length < 15) {
          setEnalbeGigTitleInputWarning(true);
          return true;
        }
        if (selectedCategory === "Select a category") {
          setCategoryWarning("Please select a category and sub-category");
          return true;
        }
        if (selectedSubCategory === "Select a sub-category") {
          setCategoryWarning("Please select a sub-category");
          return true;
        }

        if (tagListRef.current.value.length < 1) {
          setTagListWarning(true);
          return true;
        }
        setEnalbeGigTitleInputWarning(false);
        setTagListWarning(false);
        break;
      case 2:
        let warning = false;
        packageNameRefs.current.forEach((item, index) => {
          if (item.current.currValue.trim().length < 1) {
            warning = true;
            setPackagesWarning(true);
            return true;
          }
        });
        if (warning) return true;

        packageDescriptionRefs.current.forEach((item, index) => {
          if (item.current.currValue.trim().length < 2) {
            warning = true;
            setPackagesWarning(true);
            return true;
          }
        });
        if (warning) return true;

        deliveryTimeRefs.current.forEach((item, index) => {
          if (item.current.currValue === "Choose a delivery time") {
            warning = true;
            setPackagesWarning(true);
            return true;
          }
        });
        if (warning) return true;

        deliveryRevisionsRefs.current.forEach((item, index) => {
          if (item.current.currValue === "Select no. of revisions") {
            setPackagesWarning(true);
            warning = true;
            return true;
          }
        });
        if (warning) return true;

        packagePriceRefs.current.forEach((item, index) => {
          if (item.current.currValue < 5 && item.current.currValue > 10000) {
            warning = true;
            setPackagesWarning(true);
            return true;
          }
        });
        if (warning) return true;
        setPackagesWarning(false);
        break;
      case 3:
        if (gigDescriptionRef.current.getDescriptionLength() < 120) {
          setGigDescriptionError(true);
          return true;
        }
        setGigDescriptionError(false);
        break;
      case 4:
        if (questionsDetails.length < 1) {
          setRequirementsShortageWarning(true);
          return true;
        }
        break;
      case 5:
        let foundOneImage = false;
        sellerShowcaseImages.forEach((item, index) => {
          if (item !== null && item !== "") {
            foundOneImage = true;
          }
        });
        if (!foundOneImage) {
          setSellerShowcaseImagesError("Please upload at least one image");
          return true;
        }
        if (
          sellerShowcaseImagesError ||
          sellerShowcaseDocumentsError ||
          sellerShowcaseVideoError
        )
          return true;
        break;
    }
  };

  const collectRequiredData = async () => {
    switch (currentStep) {
      case 1:
        const data = {
          title: gigTitleInput,
          category: selectedCategory,
          subCategory: selectedSubCategory,
          searchTags: getSearchTags(tagListRef.current.value),
        };
        return { data, step: 1 };
      case 2:
        const packagesData = [];
        packageNameRefs.current.forEach((item, index) => {
          const data = {
            packageTitle: item.current.currValue,
            packageDescription:
              packageDescriptionRefs.current[index].current.currValue,
            packageDeliveryTime:
              deliveryTimeRefs.current[index].current.currValue,
            revisions: Number(
              deliveryRevisionsRefs.current[index].current.currValue
            ),
            sourceFile: sourceFileRefs.current[index].current.currValue,
            commercialUse: commercialUseRefs.current[index].current.currValue,
            packagePrice: Number(packagePriceRefs.current[index].current.value),
          };
          packagesData.push(data);
        });
        return { data: packagesData, step: 2 };
      case 3:
        const obj = gigDescriptionRef.current.getDescription();

        return { data: obj, step: 3 };
      case 4:
        const questionsDetailsData = [];
        questionsDetails.forEach((item, index) => {
          const questionData = {
            questionTitle: item.question,
            questionType: item.type,
            options: item.options,
            answerRequired: item.requiredStatus,
            multipleOptionSelect: item.multipleOptionSelectionStatus,
          };
          questionsDetailsData.push(questionData);
        });
        const requirements = {
          requirements: questionsDetailsData,
        };
        return { data: requirements, step: 4 };
      case 5:
        const images = [];
        sellerShowcaseImages.forEach((item, index) => {
          if (item) {
            images.push(item);
          }
        });

        const videos = [];
        if (sellerShowcaseVideo) videos.push(sellerShowcaseVideo);

        const res1 = await uploadToCloudinary(images);
        const res2 = await uploadToCloudinary(videos);
        console.log(res2);

        const media = {
          images: res1,
          video: res2[0],
        };

        return { data: media, step: 5 };
    }
  };

  const getSearchTags = (val) => {
    const tags = val.split(",");
    const tagsList = [];
    tags.forEach((item, index) => {
      tagsList.push(item.trim());
    });
    return tagsList;
  };

  const handleNavigateToStep = (step) => {
    if (step <= maxStep) {
      setCurrentStep(step);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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

  const handleRemoveQuestion = (index) => {
    const payload = {
      questionIndex: index,
    };
    questionDispatch({ type: "REMOVE_QUESTION", payload: payload });
  };

  const handleEditQuestion = (index) => {
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

  const handleUpdateQuestion = (index) => {
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

  const getQuestionOptions = (options) => {
    const string = options.join(", ");
    return string;
  };

  const handleShowEditQuestion = (index) => {
    const showEditQuestion = questionsDetails[index].showEditQuestion;
    // console.log(showEditQuestion);
    const payload = {
      questionIndex: index,
      showEditQuestion: questionsDetails[index].showEditQuestion,
    };
    questionDispatch({ type: "UPDATE_SHOW_EDIT_QUESTION", payload: payload });
  };

  const getQuestionType = (val) => {
    setQuestionType(val);
  };

  const handleAddNewOption = () => {
    setOptions([...options, ""]);
    setWarnings([...warnings, ""]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((item, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (e, index) => {
    const newOptions = options.map((item, i) => {
      if (i === index) {
        return e.target.value;
      } else {
        return item;
      }
    });
    setOptions(newOptions);
  };

  const getQuestionTitle = (val) => {
    setQuestionTitle(val);
  };

  const getRequiredStatusOfQuestion = (val) => {
    setQuestionRequiredInput(val);
  };

  const getMultipleOptionSelectionStatus = (val) => {
    setEnableMultipleOptionsInput(val);
  };

  const handleClickOutside = (event) => {
    let check = true;
    for (let i = 0; i < hideEditRemoveOptionRefs?.current?.length; i++) {
      if (hideEditRemoveOptionRefs?.current[i]?.contains(event.target)) {
        check = false;
        break;
      }
    }
    if (check) {
      dispatch({ type: "HIDE_ALL_EDIT_QUESTION" });
    }
  };

  const getSellerShowcaseVideo = (val) => {
    setSellerShowcaseVideoError("");
    setSellerShowcaseVideo(val);
  };

  const getSellerShowcaseImages = (val, index) => {
    setSellerShowcaseImagesError("");
    const newSellerShowcaseImages = sellerShowcaseImages.map((item, i) => {
      if (i === index) {
        return val;
      } else {
        return item;
      }
    });
    setSellerShowcaseImages(newSellerShowcaseImages);
    console.log(newSellerShowcaseImages);
  };

  // const getSellerShowcaseDocuments = (val, index) => {
  //   setSellerShowcaseDocumentsError('');
  //   const newSellerShowcaseDocuments = sellerShowcaseDocuments.map((item, i) => {
  //     if (i === index) {
  //       return val;
  //     }
  //     else {
  //       return item;
  //     }
  //   })
  //   setSellerShowcaseDocuments(newSellerShowcaseDocuments);
  //   console.log(newSellerShowcaseDocuments);
  // }

  const getSellerShowcaseVideoError = (val) => {
    setSellerShowcaseVideoError(val);
  };

  const getSellerShowcaseImagesError = (val) => {
    setSellerShowcaseImagesError(val);
  };

  // const getSellerShowcaseDocumentsError = (val) => {
  //   setSellerShowcaseDocumentsError(val);
  // }

  const handleCloseVerifyPhoneNumberModal = () => {
    setShowVerifyPhoneNumberModal(false);
    setShowVerifyCodeInput(false);
    setVerificationCode("");
  };

  const handleShowVerifyPhoneNumberModal = () => {
    setShowVerifyPhoneNumberModal(true);
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  useEffect(() => {
    let temp = countryWithPhoneCodesData
      .filter((item) =>
        item.name.toLowerCase().startsWith(country.toLowerCase())
      )
      .slice(0, 8);
    setFilteredCountries(temp);
  }, [country]);

  const handleClickOnCountryListItem = (item) => {
    setCountry(item.name);
    setDialCode(item.dial_code);
  };

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
    verificationCodeErrorRef.current.style.display = "none";
  };

  const handleGoBackToEnterPhoneNumber = () => {
    setShowVerifyCodeInput(false);
    setVerificationCode("");
    verificationCodeErrorRef.current.style.display = "none";
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    invalidPhoneNumberRef.current.style.display = "none";
  };

  const handleVerifyPhoneNumber = async () => {
    const to = dialCode.toString() + phoneNumber.toString();
    console.log(to);
    const body = {
      to,
    };
    let data;
    try {
      data = await axios.post("/verify/number", body);
      data = data.data;
    } catch (err) {
      invalidPhoneNumberRef.current.style.display = "block";
      console.log(err);
    }
    if (data.success) {
      setShowVerifyCodeInput(true);
    }
  };

  const handleVerifyCode = async () => {
    const to = dialCode.toString() + phoneNumber.toString();
    const body = {
      code: verificationCode,
      to: to,
    };
    const { data } = await axios.post("/verify/code", body);

    console.log(data);

    if (data.success) {
      verificationCodeErrorRef.current.style.display = "none";
      setShowVerifyPhoneNumberModal(false);
      setShowVerifyCodeInput(false);
      setVerificationCode("");
      setShowGigPublishFinalModal(true);
      setVerifiedStatusOfSeller(true);
    } else {
      verificationCodeErrorRef.current.style.display = "block";
      console.log(data.error);
    }
  };

  const handlePublishGig = async () => {
    const data = {
      step: 6,
      data: {
        active: true,
      },
    };

    try {
      const res = await axios.put(
        `/gig/update/${searchParams.get("id")}`,
        data
      );
      console.log(res);
      const id = searchParams.get("id");
      navigate(`/gig/details/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickOnNavigationSave = () => {
    if (currentStep < 6) {
      handleSaveAndContinue();
    } else {
      if (verifiedStatusOfSeller) {
        handlePublishGig();
      } else {
        handleShowVerifyPhoneNumberModal();
      }
    }
  };

  const handleClickOnNavigationSaveAndPreview = async () => {
    if (currentStep === 6) {
      navigate(`/gig/details/${gigId}`);
      return;
    }
    const temp = await handleSaveAndContinue();
    if (temp) return;
    setTimeout(() => {}, 2000);
    navigate(`/gig/details/${gigId}`);
  };

  return (
    <div className="create-gig-main">
      <nav>
        <ul>
          <li
            onClick={() => handleNavigateToStep(1)}
            className={`${1 <= currentStep && "step-completed"} ${
              currentStep === 1 && "current-step"
            }`}
          >
            <div className="nav-icon">
              {stepCompleted[1] && currentStep > 1 ? (
                <CheckCircleIcon style={{ color: "#1dbf73", fontSize: "28" }} />
              ) : (
                <RoundNumberIcon
                  number={1}
                  bcgColor={currentStep === 1 ? "#1dbf73" : "#74767e"}
                />
              )}
            </div>
            <div className={`${1 <= maxStep && "hover"}`}>Overview</div>
            <div style={{ color: "#222831" }}>
              <ChevronRightIcon
                style={{ fontSize: "20", fontWeight: "light" }}
              />
            </div>
          </li>
          <li
            onClick={() => handleNavigateToStep(2)}
            className={`${2 <= currentStep && "step-completed"} ${
              currentStep === 2 && "current-step"
            }`}
          >
            <div className="nav-icon">
              {stepCompleted[2] && currentStep > 2 ? (
                <CheckCircleIcon style={{ color: "#1dbf73", fontSize: "28" }} />
              ) : (
                <RoundNumberIcon
                  number={2}
                  bcgColor={currentStep === 2 ? "#1dbf73" : "#a6a5a5"}
                />
              )}
            </div>
            <div className={`${2 <= maxStep && "hover"}`}>Pricing</div>
            <ChevronRightIcon style={{ fontSize: "20", fontWeight: "light" }} />
          </li>
          <li
            onClick={() => handleNavigateToStep(3)}
            className={`${3 <= currentStep && "step-completed"} ${
              currentStep === 3 && "current-step"
            }`}
          >
            <div className="nav-icon">
              {stepCompleted[3] && currentStep > 3 ? (
                <CheckCircleIcon style={{ color: "#1dbf73", fontSize: "28" }} />
              ) : (
                <RoundNumberIcon
                  number={3}
                  bcgColor={currentStep === 3 ? "#1dbf73" : "#a6a5a5"}
                />
              )}
            </div>
            <div className={`${3 <= maxStep && "hover"}`}>Description</div>
            <ChevronRightIcon style={{ fontSize: "20", fontWeight: "light" }} />
          </li>
          <li
            onClick={() => handleNavigateToStep(4)}
            className={`${4 <= currentStep && "step-completed"} ${
              currentStep === 4 && "current-step"
            }`}
          >
            <div className="nav-icon">
              {stepCompleted[4] && currentStep > 4 ? (
                <CheckCircleIcon style={{ color: "#1dbf73", fontSize: "28" }} />
              ) : (
                <RoundNumberIcon
                  number={4}
                  bcgColor={currentStep === 4 ? "#1dbf73" : "#a6a5a5"}
                />
              )}
            </div>
            <div className={`${4 <= maxStep && "hover"}`}>Requirements</div>
            <ChevronRightIcon style={{ fontSize: "20", fontWeight: "light" }} />
          </li>
          <li
            onClick={() => handleNavigateToStep(5)}
            className={`${5 <= currentStep && "step-completed"} ${
              currentStep === 5 && "current-step"
            }`}
          >
            <div className="nav-icon">
              {stepCompleted[5] && currentStep > 5 ? (
                <CheckCircleIcon style={{ color: "#1dbf73", fontSize: "28" }} />
              ) : (
                <RoundNumberIcon
                  number={5}
                  bcgColor={currentStep === 5 ? "#1dbf73" : "#a6a5a5"}
                />
              )}
            </div>
            <div className={`${5 <= maxStep && "hover"}`}>Gallery</div>
            <ChevronRightIcon style={{ fontSize: "20", fontWeight: "light" }} />
          </li>
          <li
            onClick={() => handleNavigateToStep(6)}
            className={`${6 <= currentStep && "step-completed"} ${
              currentStep === 6 && "current-step"
            }`}
          >
            <div className="nav-icon">
              {stepCompleted[6] && currentStep !== 6 ? (
                <CheckCircleIcon style={{ color: "#1dbf73", fontSize: "28" }} />
              ) : (
                <RoundNumberIcon
                  number={6}
                  bcgColor={currentStep === 6 ? "#1dbf73" : "#a6a5a5"}
                />
              )}
            </div>
            <div className={`${6 <= maxStep && "hover"}`}>Publish</div>
          </li>
        </ul>
        <ul className="save-and-preview-wrapper noSelect">
          <li onClick={handleClickOnNavigationSave}>Save</li>
          <p>|</p>
          <li onClick={handleClickOnNavigationSaveAndPreview}>
            Save & Preview
          </li>
        </ul>
      </nav>

      <div
        className="overview"
        style={{ display: currentStep === 1 ? "" : "none" }}
      >
        <DataSendingLoading
          show={showDataSendingLoadingScreen}
          finishedLoading={!showDataSendingLoadingScreen}
        />
        <div className="overview-wrapper">
          <div className="left-side">
            <div>
              <h3>Gig title</h3>
              <p>
                As your Gig storefront, your title is the most important place
                to include keywords that buyers would likely use to search for a
                service like yours.
              </p>
            </div>
            <div>
              <h3>Category</h3>
              <p>
                Choose the category and sub-category most suitable for your Gig.
              </p>
            </div>
            <div>
              <h3>Search tags</h3>
              <p>
                Tag your Gig with buzz words that are relevant to the services
                you offer. Use all 5 tags to get found.
              </p>
            </div>
          </div>
          <div className="right-side">
            <div>
              <TextArea
                maxLength={100}
                minLength={0}
                placeholder="I will do something I'm really good at"
                defaultText={"I will "}
                fontSize="18px"
                getText={getGigTitleInput}
                ref={gigTitleInputRef}
              />
              {enalbeGigTitleInputWarning && (
                <div className="gig-title-input-warning">
                  15 characters minimum
                </div>
              )}
            </div>
            <div className="category-section">
              <div>
                <SelectInput2
                  defaultOption={"Select a category"}
                  data={categoriesData}
                  style={{ textTransform: "uppercase" }}
                  getChoosenOption={getSelectedCategory}
                  ref={selectedCategoryRef}
                />
                <SelectInput2
                  defaultOption={"Select a sub-category"}
                  data={
                    selectedCategory && getSubCategoryList(selectedCategory)
                  }
                  style={{ textTransform: "uppercase" }}
                  getChoosenOption={getSelectedSubCategory}
                  ref={selectedSubCategoryRef}
                />
              </div>
              {categoryWarning !== "" && (
                <div className="category-warning">{categoryWarning}</div>
              )}
            </div>

            <div className="keyword-section">
              <h6>Positive keywords</h6>
              <p>
                Enter search terms you feel your buyers will use when looking
                for your service.
              </p>
              <input ref={tagListRef}></input>
              <p className="recommend">
                5 tags maximum. Use letters and numbers only. <br />
                Tags should be comma seprated.
              </p>
              {tagListWarning && (
                <p className="tag-list-warning">
                  Tag list must contain at least 1 tag
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="pricing"
        style={{ display: currentStep === 2 ? "" : "none" }}
      >
        <DataSendingLoading
          show={showDataSendingLoadingScreen}
          finishedLoading={!showDataSendingLoadingScreen}
        />
        <div className="pricing-wrapper">
          <h2>Scope & Pricing</h2>
          <h3>Packages</h3>
          <div className="pricing-section">
            {packagesData.map((pack, index) => {
              return (
                <div className="package" key={"package" + index}>
                  <h4>{pack}</h4>
                  <div className="package-name">
                    <TextArea
                      className="package-name"
                      maxLength={40}
                      minLength={0}
                      placeholder="Enter your package name"
                      style={{
                        fontSize: "14px",
                        height: "40px",
                        borderRadius: "0px",
                      }}
                      // reference={packageNameRefs.current[index]}
                      ref={packageNameRefs.current[index]}
                    />
                    {packagesWarning && (
                      <div className="package-name-required-icon">
                        <AiFillExclamationCircle />
                      </div>
                    )}
                  </div>
                  <div className="package-description">
                    <TextArea
                      maxLength={100}
                      minLength={0}
                      placeholder="Enter your package description"
                      defaultText=""
                      style={{ fontSize: "14px", borderRadius: "0" }}
                      // reference={packageDescriptionRefs.current[index]}
                      ref={packageDescriptionRefs.current[index]}
                    />
                    {packagesWarning && (
                      <div className="package-description-required-icon">
                        <AiFillExclamationCircle />
                      </div>
                    )}
                  </div>

                  <div className="package-delivery-time">
                    <SelectInput2
                      data={deliveryTimeData}
                      defaultOption={"Choose a delivery time"}
                      ref={deliveryTimeRefs.current[index]}
                    />
                    {packagesWarning && (
                      <div className="package-delivery-time-required-icon">
                        <AiFillExclamationCircle />
                      </div>
                    )}
                  </div>

                  <div className="package-revisions-required">
                    <SelectInput2
                      data={revisionsData}
                      defaultOption={"Select no. of revisions"}
                      ref={deliveryRevisionsRefs.current[index]}
                    />
                    {packagesWarning && (
                      <div className="package-revisions-required-icon">
                        <AiFillExclamationCircle />
                      </div>
                    )}
                  </div>

                  <div className="package-price">
                    <div className="price-details">
                      <input
                        ref={packagePriceRefs.current[index]}
                        className="price-value"
                        step="5"
                        placeholder="Price"
                        type="number"
                        min={5}
                        max={10000}
                      ></input>
                      <span>$</span>
                    </div>
                    {packagesWarning && (
                      <div className="package-price-required-icon">
                        <AiFillExclamationCircle />
                      </div>
                    )}
                  </div>
                  <div className="source">
                    <CheckInput
                      label="Source File"
                      // reference={sourceFileRefs.current[index]}
                      ref={sourceFileRefs.current[index]}
                    />
                  </div>
                  <div className="commercial">
                    <CheckInput
                      label="Commercial Use"
                      // reference={commercialUseRefs.current[index]}
                      ref={commercialUseRefs.current[index]}
                    />
                  </div>
                </div>
              );
            })}
            {packagesWarning && (
              <p className="pricing-section-warning">
                <AiFillExclamationCircle></AiFillExclamationCircle> Please fill
                all the required fields
              </p>
            )}
          </div>
        </div>
      </div>

      <div
        className="description"
        style={{ display: currentStep === 3 ? "" : "none" }}
      >
        <DataSendingLoading
          show={showDataSendingLoadingScreen}
          finishedLoading={!showDataSendingLoadingScreen}
        />
        <div className="description-wrapper">
          <h1>Description</h1>
          <h3>Briefly Describe Your Gig</h3>
          <TextEditor maxLength={1200} ref={gigDescriptionRef} />
          {gigDescriptionError && (
            <p className="gig-description-error">
              Description should be at least 120 chars long.
            </p>
          )}
        </div>
      </div>

      <div
        className="requirements"
        style={{ display: currentStep === 4 ? "" : "none" }}
      >
        <DataSendingLoading
          show={showDataSendingLoadingScreen}
          finishedLoading={!showDataSendingLoadingScreen}
        />
        <div className="requirements-wrapper">
          <header>
            Get all the information you need from buyers to get started
          </header>
          <p className="requirements-message">
            Add questions to help buyers provide you with exactly what you need
            to start working on their order.
          </p>
          <div className="your-questions">
            <hr />
            <strong>Your Questions</strong>
          </div>

          {showEditQuestion ? (
            <AddorUpdateQuestion
              getRequiredStatusOfQuestion={getRequiredStatusOfQuestion}
              getMultipleOptionSelectionStatus={
                getMultipleOptionSelectionStatus
              }
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
              getMultipleOptionSelectionStatus={
                getMultipleOptionSelectionStatus
              }
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
                    {question.type === "Free Text" ? (
                      <span>
                        <TfiText />
                      </span>
                    ) : (
                      <span>
                        <TbGridDots />
                      </span>
                    )}
                    <span>{question.type}</span>
                  </div>
                  <div
                    className="edit-and-remove"
                    // ref={hideEditRemoveOptionRefs[index]}
                    ref={(el) => (hideEditRemoveOptionRefs.current[index] = el)}
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

      <div
        className="gallery"
        style={{ display: currentStep === 5 ? "" : "none" }}
      >
        <DataSendingLoading
          show={showDataSendingLoadingScreen}
          finishedLoading={!showDataSendingLoadingScreen}
        />

        <div className="gallery-wrapper">
          <h3>Showcase Your Services In A Gig Gallery</h3>
          <p className="heading-para">
            Encourage buyers to choose your Gig by featuring a variety of your
            work.
          </p>

          <div className="gallery-file-formats-wrapper">
            <section>
              <h4 className="gallery-heading">Images(up to 3)</h4>
              <p className="gallery-heading-para">
                Get noticed by the right buyers with visual examples of your
                services.
              </p>
              <div className="custom-file-input-wrapper">
                {[1, 2, 3].map((num, index) => {
                  return (
                    <FileDropIcon
                      type="image"
                      fileAcceptType="image/*"
                      getSelectedFile={getSellerShowcaseImages}
                      index={index}
                      maxFileSize={5 * 1024 * 1024}
                      getError={getSellerShowcaseImagesError}
                      ref={sellerShowcaseImagesRefs.current[index]}
                    />
                  );
                })}
              </div>
              {sellerShowcaseImagesError && (
                <p className="gallery-input-error">
                  {sellerShowcaseImagesError}
                </p>
              )}
            </section>
            <section className="video">
              <h4 className="gallery-heading">Video (one only)</h4>
              <p className="gallery-heading-para">
                Capture buyers' attention with a video that showcases your
                service.
              </p>
              <p className="size-limit-warning">
                Please choose a video shorter than 75 seconds and smaller than
                50MB
              </p>
              <div className="custom-file-input-wrapper">
                <FileDropIcon
                  fileAcceptType="video/*"
                  type="video"
                  getSelectedFile={getSellerShowcaseVideo}
                  maxFileSize={50 * 1024 * 1024}
                  getError={getSellerShowcaseVideoError}
                  maxDuration={75}
                  ref={sellerShowcaseVideoRef}
                />
              </div>
              {sellerShowcaseVideoError && (
                <p className="gallery-input-error">
                  {sellerShowcaseVideoError}
                </p>
              )}
            </section>

            {/* documents section  */}
            {/* <section>
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
                        ref={sellerShowcaseDocumentsRefs.current[index]}
                      />
                    )
                  })
                }
              </div>
              {
                sellerShowcaseDocumentsError &&
                <p className='gallery-input-error'>{sellerShowcaseDocumentsError}</p>
              }
            </section> */}
          </div>
        </div>
      </div>

      <div
        className="publish"
        style={{ display: currentStep === 6 ? "" : "none" }}
      >
        <div className="publish-wrapper">
          {showGigPublishFinalModal && verifiedStatusOfSeller ? (
            <>
              <div className="gig-publish-final-modal">
                <h3>Almost there...</h3>
                <p>
                  Let's publish your Gig and get <br /> some buyers rolling in.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="publish-image-wrapper"></div>
              <div className="publish-text-wrapper">
                <h3>Congratulations!</h3>
                <p className="main-para">
                  You're almost done with your first Gig.
                </p>
                <p>
                  Before you start selling on FreelanceMe, there is one last
                  thing we need you to do: The security of your account is
                  important to us. Therefore, we require all our sellers to
                  verify their phone number before we can publish their Gig.
                </p>
              </div>
            </>
          )}

          {showVerifyPhoneNumberModal && (
            <div className="verify-phone-number-modal-wrapper">
              <div className="verify-phone-number-modal">
                <div
                  className="close-icon"
                  onClick={handleCloseVerifyPhoneNumberModal}
                >
                  <IoIosClose />
                </div>
                <h5>Verify Phone Number</h5>

                {showVerifyCodeInput ? (
                  <>
                    <p className="verfication-code-sent-notification">
                      A verification code has been sent to:
                    </p>

                    <div className="verification-code-recipent-number">
                      <span>{dialCode}</span>
                      {/* <span>+91</span> */}
                      <span>-</span>
                      <span>{phoneNumber}</span>
                      {/* <span>8130022685</span> */}
                    </div>

                    <div className="verification-code-wrapper">
                      <p className="enter-verification-code-message">
                        Please enter the Verification code
                      </p>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={verificationCode}
                        onChange={handleVerificationCodeChange}
                      />
                      <p
                        ref={verificationCodeErrorRef}
                        className="invalid-code-message"
                      >
                        Oops... that code is wrong..
                        <br />
                        Please verify your code and try again.
                      </p>
                      <button
                        className={
                          verificationCode.length === 6 ? "active" : ""
                        }
                        onClick={handleVerifyCode}
                      >
                        Submit Code
                      </button>
                    </div>

                    <p className="verification-code-not-receive-message">
                      If you did not receive the code, please click
                      <span
                        onClick={() => {
                          setShowVerifyCodeInput(false);
                          setVerificationCode("");
                        }}
                        onclick={handleGoBackToEnterPhoneNumber}
                      >
                        {" "}
                        Back
                      </span>
                      , check that you have entered the right number, and try
                      again
                    </p>
                  </>
                ) : (
                  <>
                    <p className="thanks-para">
                      Thank you for taking a moment to verify your phone number.{" "}
                    </p>

                    <div className="modal-inputs-wrapper">
                      <div className="modal-input">
                        <h6>Enter Country</h6>
                        <input
                          type="text"
                          value={country}
                          onChange={handleCountryChange}
                          id="country"
                          onFocus={() => setShowCountryDropdown(true)}
                        />
                        {showCountryDropdown &&
                          country &&
                          filteredCountries.length > 0 && (
                            <ul className="country-code-wrapper">
                              {filteredCountries.map((countryData, index) => {
                                return (
                                  <li
                                    className="country-code"
                                    onClick={() =>
                                      handleClickOnCountryListItem(countryData)
                                    }
                                  >
                                    <p>{countryData.name}</p>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                      </div>
                      <div className="modal-input">
                        <h6>Enter Phone Number</h6>
                        {dialCode && <p className="dial-code">{dialCode} - </p>}
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                          onFocus={() => setShowCountryDropdown(false)}
                        />
                      </div>
                      <div
                        ref={invalidPhoneNumberRef}
                        className="wrong-phone-number-warning"
                      >
                        Please enter a valid number
                      </div>
                    </div>

                    <div className="verify-buttons">
                      <button
                        className={
                          phoneNumber.length >= 5 && country && dialCode
                            ? "button-active"
                            : ""
                        }
                        onClick={handleVerifyPhoneNumber}
                      >
                        Verify
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="save-and-verify">
        {currentStep === 6 ? (
          showGigPublishFinalModal && verifiedStatusOfSeller ? (
            <button onClick={handlePublishGig}>Publish Gig</button>
          ) : (
            <button onClick={handleShowVerifyPhoneNumberModal}>
              Verify Now
            </button>
          )
        ) : (
          <button onClick={handleSaveAndContinue}>Save & Continue</button>
        )}
      </div>

      <div
        className="back-button"
        style={{ display: currentStep <= 1 ? "none" : "" }}
      >
        <button onClick={handleStepBack}>back</button>
      </div>
    </div>
  );
};
