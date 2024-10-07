import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { RoundNumberIcon } from "../RoundNumberIcon/RoundNumberIcon";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateGlobalLoading } from "../../context/globalLoadingContext";

type StepIndicatorProps = {
  handleSubmission: () => Promise<boolean>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
};

export type StepIndicatorRef = {
  handleStepBack: () => void;
  handleSaveAndContinue: () => void;
};

const StepIndicator = (
  { handleSubmission, currentStep, setCurrentStep }: StepIndicatorProps,
  ref: React.Ref<StepIndicatorRef>
) => {
  const updateGlobalLoading = useUpdateGlobalLoading();
  const navigate = useNavigate();
  const params = useParams();
  let gigId = params.id;

  // const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStep, setMaxStep] = useState<number>(1);
  const [stepCompleted, setStepCompleted] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const handleNavigateToStep = (step: number) => {
    if (step <= maxStep) {
      setCurrentStep(step);
    }
  };

  const handleClickOnNavigationSave = () => {
    if (currentStep < 6) {
      handleSaveAndContinue();
    }
  };

  const handleClickOnNavigationSaveAndPreview = async () => {
    if (currentStep === 6) {
      navigate(`/gig/details/${gigId}`, {
        replace: true,
      });
      return;
    }
    console.log("calling handleSaveAndContinue");
    const temp = await handleSaveAndContinue();
    console.log(temp);
    if (!temp) return;
    navigate(`/gig/details/${gigId}`, {
      replace: true,
    });
  };

  const handleSaveAndContinue = useCallback(async () => {
    try {
      updateGlobalLoading(true, "Saving Gig");
      const done = await handleSubmission();
      if (!done) return false;
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
      return true;
    } catch (err) {
      console.log(err);
      return false;
    } finally {
      updateGlobalLoading(false);
    }
  }, [
    currentStep,
    handleSubmission,
    maxStep,
    stepCompleted,
    setCurrentStep,
    updateGlobalLoading,
  ]);

  useImperativeHandle(
    ref,
    () => ({
      handleStepBack: () => {
        if (currentStep > 1) {
          setCurrentStep(currentStep - 1);
        }
      },
      handleSaveAndContinue: handleSaveAndContinue,
    }),
    [currentStep, handleSaveAndContinue, setCurrentStep]
  );

  return (
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
            <ChevronRightIcon style={{ fontSize: "20", fontWeight: "light" }} />
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
        <button className="disabled:cursor-not-allowed disabled:text-no_focus disabled:no-underline" disabled={currentStep === 6} onClick={handleClickOnNavigationSave}>Save</button>
        <p>|</p>
        <button onClick={handleClickOnNavigationSaveAndPreview}>Save & Preview</button>
      </ul>
    </nav>
  );
};

export default forwardRef(StepIndicator);
