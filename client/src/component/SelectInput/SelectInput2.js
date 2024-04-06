import React, { useImperativeHandle, forwardRef, useState } from "react";
import "./selectInput.css";

const SelectInput2 = (
  { data, defaultOption, style, getChoosenOption, disabled = false },
  ref
) => {
  const [choosedOption, setChoosedOption] = useState(defaultOption.toLowerCase());

  useImperativeHandle(
    ref,
    () => ({
      currValue: choosedOption,
      setChoosedOptionComingFromParent: (option) => {
        setChoosedOption(option.toString().toLowerCase());
      },
    }),
    [choosedOption]
  );

  const handleChange = (e) => {
    setChoosedOption(e.target.value.toLowerCase());
    getChoosenOption && getChoosenOption(e.target.value.toLowerCase());
  };

  return (
    <div className="select-input-main">
      <select disabled={disabled} className="disabled:bg-separator disabled:cursor-not-allowed" style={style} value={choosedOption} onChange={handleChange}>
        <option className="max-h-64 overflow-hidden" value={defaultOption.toLowerCase()}>{defaultOption}</option>
        {data?.map((item, index) => {
          if (defaultOption.toLowerCase() !== item.toLowerCase()) {
            return (
              <option key={index + item} value={item.toLowerCase()}>
                {item}
              </option>
            );
          }
        })}
      </select>
    </div>
  );
};

export default forwardRef(SelectInput2);
