import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  CHOOSE_A_DELIVERY_TIME,
  SELECT_NUMBER_OF_REVISIONS,
} from "../../constants/globalConstants";
import { CheckInput, CheckInputRef } from "../CheckInput";
import SelectInput2, { SelectInput2Ref } from "../SelectInput2";
import { TextArea, TextAreaRef } from "../TextArea";
import { deliveryTimeData, packagesData, revisionsData } from "./createGigData";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type PackageFormProps = {
  categoryId: number;
};

export type PackageFormRef = {
  handlePackageSubmit: () => void;
};

const PackageForm = (
  { categoryId }: PackageFormProps,
  ref: Ref<PackageFormRef>
) => {
  const { gigDetail } = useSelector((state: RootState) => state.gigDetail);
  const nameRef = useRef<TextAreaRef>(null);
  const descriptionRef = useRef<TextAreaRef>(null);
  const deliveryTimeRef = useRef<SelectInput2Ref>(null);
  const revisionRef = useRef<SelectInput2Ref>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const sourceFileRef = useRef<CheckInputRef>(null);
  const commercialUseRef = useRef<CheckInputRef>(null);

  const [packageTitle, setPackageTitle] = useState<string>("");
  const [packageDescription, setPackageDescription] = useState<string>("");
  const [packageDeliveryTime, setPackageDeliveryTime] = useState<string>(
    CHOOSE_A_DELIVERY_TIME
  );
  const [revisions, setRevisions] = useState<string>(
    SELECT_NUMBER_OF_REVISIONS
  );
  const [packagePrice, setPackagePrice] = useState<string>("");
  const [sourceFile, setSourceFile] = useState<boolean>(false);
  const [commercialUse, setCommercialUse] = useState<boolean>(false);

  const [packageTitleWarning, setPackageTitleWarning] = useState<string>("");
  const [packageDescriptionWarning, setPackageDescriptionWarning] =
    useState<string>("");
  const [deliveryTimeWarning, setDeliveryTimeWarning] = useState<string>("");
  const [revisionsWarning, setRevisionsWarning] = useState<string>("");
  const [priceWarning, setPriceWarning] = useState<string>("");

  useEffect(() => {
    if (!gigDetail || gigDetail.pricing.length === 0) return;
    const { pricing } = gigDetail;
    const packageDetail = pricing[categoryId];
    const {
      packageTitle,
      packageDescription,
      packageDeliveryTime,
      commercialUse,
      packagePrice,
      revisions,
      sourceFile,
    } = packageDetail;

    setPackageTitle(packageTitle);
    setPackageDescription(packageDescription);
    setPackageDeliveryTime(packageDeliveryTime);
    setCommercialUse(commercialUse);
    setPackagePrice(packagePrice.toString());
    setRevisions(revisions.toString());
    setSourceFile(sourceFile);
    nameRef.current?.setTextComingFromParent(packageTitle);
    descriptionRef.current?.setTextComingFromParent(packageDescription);
    deliveryTimeRef.current?.setChoosedOptionComingFromParent(
      packageDeliveryTime
    );
    revisionRef.current?.setChoosedOptionComingFromParent(revisions.toString());
    if (priceRef.current)
      priceRef.current.value = packagePrice.toString() || "";

    sourceFileRef.current?.setIsCheckedComingFromParent(sourceFile);
    commercialUseRef.current?.setIsCheckedComingFromParent(commercialUse);
  }, [gigDetail, categoryId]);

  const handlePackageSubmit = () => {
    setPackageTitleWarning(getPackageTitleWarning(packageTitle));
    setPackageDescriptionWarning(
      getPackageDescriptionWarning(packageDescription)
    );
    setDeliveryTimeWarning(getDeliveryTimeWarning(packageDeliveryTime));
    setRevisionsWarning(getRevisionsWarning(revisions));
    setPriceWarning(getPriceWarning(packagePrice));

    console.log({
      packageTitle,
      packageDescription,
      packageDeliveryTime,
      revisions,
      packagePrice,
      sourceFile,
      commercialUse,
    });
  };

  useImperativeHandle(ref, () => ({
    handlePackageSubmit,
  }));

  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-base font-bold -mb-8 text-light_grey bg-dark_separator p-4">
        {packagesData[categoryId]}
      </h4>
      <TextArea
        maxLength={40}
        minLength={0}
        placeholder="Enter your package name"
        className="text-sm h-10 rounded-none"
        // ref={nameRef}
        warning={packageTitleWarning}
        onChange={(text) => {
          setPackageTitle(text);
          setPackageTitleWarning(getPackageTitleWarning(text));
        }}
        value={packageTitle}
      />
      <TextArea
        maxLength={100}
        minLength={0}
        placeholder="Enter your package description"
        className="text-sm rounded-none"
        // ref={descriptionRef}
        warning={packageDescriptionWarning}
        onChange={(text) => {
          setPackageDescription(text);
          setPackageDescriptionWarning(getPackageDescriptionWarning(text));
        }}
        value={packageDescription}
      />
      <div className="mb-4">
        <SelectInput2
          data={deliveryTimeData}
          defaultOption={CHOOSE_A_DELIVERY_TIME}
          ref={deliveryTimeRef}
          warning={deliveryTimeWarning}
          getChoosenOption={(option) => {
            setPackageDeliveryTime(option);
            setDeliveryTimeWarning(getDeliveryTimeWarning(option));
          }}
        />
      </div>
      <div className="mb-4">
        <SelectInput2
          data={revisionsData}
          defaultOption={SELECT_NUMBER_OF_REVISIONS}
          ref={revisionRef}
          warning={revisionsWarning}
          getChoosenOption={(option) => {
            setRevisions(option);
            setRevisionsWarning(getRevisionsWarning(option));
          }}
        />
      </div>
      <div className="relative">
        <div className="flex items-center mb-2">
          <input
            ref={priceRef}
            className="border border-no_focus focus:outline-none focus:border-dark_grey w-full py-2 px-3 pr-8 placeholder:text-[0.9rem]"
            step="5"
            placeholder="Price"
            type="number"
            min={5}
            max={10000}
            onChange={(e) => {
              setPackagePrice(e.target.value);
              setPriceWarning(getPriceWarning(e.target.value));
            }}
          ></input>
          <span className="right-4 absolute">₹</span>
        </div>
        <p className="text-sm absolute -bottom-3 text-warning leading-[1.4]">
          {priceWarning}
        </p>
      </div>
      <div className=" flex items-center gap-2">
        <CheckInput label="Source File" ref={sourceFileRef} />
      </div>
      <div className=" flex items-center gap-2">
        <CheckInput label="Commercial Use" ref={commercialUseRef} />
      </div>
    </div>
  );
};

export default forwardRef(PackageForm);

const getPackageTitleWarning = (text: string) => {
  if (!text) return "Title is required";
  return "";
};

const getPackageDescriptionWarning = (text: string) => {
  if (!text) return "Description is required";
  return "";
};

const getDeliveryTimeWarning = (text: string) => {
  if (!text || text.toLowerCase() === CHOOSE_A_DELIVERY_TIME.toLowerCase())
    return "Delivery Time is required";
  return "";
};

const getRevisionsWarning = (text: string) => {
  if (!text || text.toLowerCase() === SELECT_NUMBER_OF_REVISIONS.toLowerCase())
    return "Revisions is required";
  return "";
};

const getPriceWarning = (text: string) => {
  if (!text) return "Price is required";
  if (parseInt(text) < 5) return "Price must be greater than 5";
  if (parseInt(text) > 10000) return "Price must be less than 10000";
  return "";
};
