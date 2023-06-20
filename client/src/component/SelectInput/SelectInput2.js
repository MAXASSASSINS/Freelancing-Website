import React, { useImperativeHandle, forwardRef, useState } from "react";
import "./selectInput.css";

const SelectInput2 = (
  { data, defaultOption, style, getChoosenOption },
  ref
) => {
  const [choosedOption, setChoosedOption] = useState(defaultOption);

  useImperativeHandle(
    ref,
    () => ({
      currValue: choosedOption,
      setChoosedOptionComingFromParent: (option) => {
        setChoosedOption(option);
      },
    }),
    [choosedOption]
  );

  const handleChange = (e) => {
    setChoosedOption(e.target.value);
    getChoosenOption && getChoosenOption(e.target.value);
  };

  return (
    <div className="select-input-main">
      <select style={style} value={choosedOption} onChange={handleChange}>
        <option value={defaultOption}>{defaultOption}</option>
        {data?.map((item, index) => {
          if (defaultOption !== item) {
            return (
              <option key={index + item} value={item}>
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
