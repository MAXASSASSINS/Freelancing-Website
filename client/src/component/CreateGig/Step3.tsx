import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { StepProps, StepRef } from "./CreateGig";
import { TextEditor, TextEditorRef } from "../TextEditor/TextEditor";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

const Step3 = ({ handleSendData }: StepProps, ref: React.Ref<StepRef>) => {
  const { gigDetail } = useSelector((state: RootState) => state.gigDetail);
  const gigDescriptionRef = useRef<TextEditorRef>(null);
  const [minLengthError, setMinLengthError] = useState<boolean>(false);
  const [maxLengthError, setMaxLengthError] = useState<boolean>(false);

  const checkForWarnings = () => {
    if (gigDescriptionRef.current?.getDescriptionLength()! < 120) {
      setMinLengthError(true);
      return true;
    }
    if (gigDescriptionRef.current?.getDescriptionLength()! > 1200) {
      setMaxLengthError(true);
      return true;
    }
    setMinLengthError(false);
    setMaxLengthError(false);
  };

  const handleSubmit = async () => {
    if (checkForWarnings()) {
      return false;
    }
    const text = gigDescriptionRef.current?.getDescription();
    const payload = { data: text, step: 3 };
    const res = await handleSendData(payload);
    return res || false;
  };

  useEffect(() => {
    if (!gigDetail) return;
    const { description } = gigDetail;

    gigDescriptionRef.current?.setDescriptionComingFromParent(
      description || ""
    );
  }, [gigDetail]);

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  return (
    <div className="description">
      <div className="description-wrapper pr-0">
        <h1>Description</h1>
        <h3>Briefly Describe Your Gig</h3>
        <TextEditor maxLength={1200} ref={gigDescriptionRef} />
        {minLengthError && (
          <p className="gig-description-error">
            Description should be at least 120 chars long.
          </p>
        )}
        {maxLengthError && (
          <p className="gig-description-error">
            Description should be at most 1200 chars long.
          </p>
        )}
      </div>
    </div>
  );
};

export default forwardRef(Step3);
