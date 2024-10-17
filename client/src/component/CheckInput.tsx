import React, { forwardRef, useImperativeHandle, useState } from "react";
import { GoCheck } from "react-icons/go";
import "../utility/color";

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
      <label className="check-input-main noSelect flex items-center">
        <input
          type="checkbox"
          className="[clip:rect(0_0_0_0)] [-webkit-clip-path:inset(50%)] [clip-path:inset(50%)] h-[1px] overflow-hidden absolute whitespace-nowrap w-[1px]"
          onChange={handleChange}
          checked={isChecked}
        />
        <span
          className={`checkbox cursor-pointer w-[1.125rem] h-[1.125rem] min-w-[1.125rem] min-h-[1.125rem] rounded-sm bg-white border border-no_focus mr-3 flex items-center justify-center ease-in-out duration-150 ${
            isChecked ? "checkbox--active" : ""
          }`}
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
