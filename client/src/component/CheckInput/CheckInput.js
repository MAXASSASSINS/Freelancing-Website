import React, { useState, forwardRef, useImperativeHandle } from "react";
import "./checkInput.css";
import { GoCheck } from "react-icons/go";
import "../../utility/color";

export const CheckInput = forwardRef(
  (
    { label, labelColor, reference, defaultValue = false, getInputCheckedVal },
    ref
  ) => {
    const [isChecked, setIsChecked] = useState(defaultValue);

    const handleChange = (e) => {
      // console.log(getInputCheckedVal);
      // console.log(e.target.checked);
      setIsChecked(e.target.checked);
      getInputCheckedVal && getInputCheckedVal(e.target.checked);
    };

    useImperativeHandle(
      ref,
      () => ({
        currValue: isChecked,
        setIsCheckedComingFromParent: (val) => {
          setIsChecked(val);
        },
      }),
      [isChecked]
    );

    // console.log(isChecked);

    return (
      <label className="check-input-main noSelect">
        <input
          type="checkbox"
          onChange={handleChange}
          value={isChecked}
          defaultChecked={defaultValue}
        />
        <span
          className={`checkbox ${isChecked ? "checkbox--active" : ""}`}
          aria-hidden="true"
        >
          {isChecked && (
            <GoCheck style={{ color: "#62646a", fontWeight: "700" }} />
          )}
        </span>
        <div style={{ color: labelColor ? labelColor : "inherit" }}>
          {label}
        </div>
      </label>
    );
  }
);
