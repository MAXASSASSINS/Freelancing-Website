import React, { useState, forwardRef, useImperativeHandle } from "react";
import "./checkInput.css";
import { GoCheck } from "react-icons/go";
import "../../utility/color";

type CheckInputProps = {
  label?: string;
  labelColor?: string;
  defaultValue?: boolean;
  getInputCheckedVal?: (val: boolean) => void;
};

export type CheckInputRef = {
  setIsCheckedComingFromParent: (isChecked: boolean) => void;
  currValue: boolean;
};

export const CheckInput = forwardRef(
  (
    {
      label,
      labelColor,
      defaultValue = false,
      getInputCheckedVal,
    }: CheckInputProps,
    ref: React.Ref<CheckInputRef>
  ) => {
    const [isChecked, setIsChecked] = useState<boolean>(defaultValue);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsChecked(e.target.checked);
      getInputCheckedVal && getInputCheckedVal(e.target.checked);
    };

    useImperativeHandle(
      ref,
      () => ({
        currValue: isChecked,
        setIsCheckedComingFromParent: (val: boolean) => {
          setIsChecked(val);
        },
      }),
      [isChecked]
    );

    return (
      <label className="check-input-main noSelect">
        <input type="checkbox" onChange={handleChange} checked={isChecked} />
        <span
          className={`checkbox ${isChecked ? "checkbox--active" : ""}`}
          aria-hidden="true"
        >
          {isChecked && (
            <GoCheck style={{ color: "#62646a", fontWeight: "700" }} />
          )}
        </span>
        {label && (
          <div style={{ color: labelColor ? labelColor : "inherit" }}>
            {label}
          </div>
        )}
      </label>
    );
  }
);
