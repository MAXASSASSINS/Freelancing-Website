import React, { useImperativeHandle, forwardRef, useState } from "react";
import "./selectInput.css";

const SelectInput2 = (
  { data, defaultOption, style, getChoosenOption },
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
      <select style={style} value={choosedOption} onChange={handleChange}>
        <option value={defaultOption.toLowerCase()}>{defaultOption}</option>
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
