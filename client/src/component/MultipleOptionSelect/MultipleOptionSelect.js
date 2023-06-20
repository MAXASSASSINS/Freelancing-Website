import React, {
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle,
  useRef,
  createRef,
} from "react";
import { CheckInput } from "../CheckInput/CheckInput";

export const MultipleOptionSelect = forwardRef(({ options, multiple }, ref) => {
  const optionsRefs = useRef([]);
  const [selectedOptions, setSelectedOptions] = useState(
    options.map(() => false)
  );

  optionsRefs.current = options.map(
    (item, index) => optionsRefs.current[index] || createRef()
  );

  useImperativeHandle(ref, () => ({
    currValue: selectedOptions,
  }));

  // const getSelectedOptions = () => {
  //   const selectedOptions = [];
  //   optionsRefs.current.forEach((optionRef, index) => {
  //     if (optionRef.current.currValue) selectedOptions.push(true);
  //     else selectedOptions.push(false);
  //   })
  //   return selectedOptions;
  // }

  const handleChange = (index) => {
    // console.log(index);
    optionsRefs.current[index].current.setIsCheckedComingFromParent(
      !optionsRefs.current[index].current.currValue
    );
    setSelectedOptions(
      options.map((item, i) =>
        i === index ? !selectedOptions[index] : selectedOptions[i]
      )
    );
    if (!multiple) {
      setSelectedOptions(
        options.map((item, i) =>
          i === index ? !selectedOptions[index] : false
        )
      );
      optionsRefs.current.forEach((optionRef, i) => {
        if (i !== index) {
          optionRef.current.setIsCheckedComingFromParent(false);
        }
      });
    }
  };

  return (
    <div>
      {options.map((option, index) => (
        <div className="my-2" key={index} onChange={() => handleChange(index)}>
          <CheckInput
            key={index}
            label={option.title}
            defaultValue={selectedOptions[index]}
            ref={optionsRefs.current[index]}
          />
        </div>
      ))}
    </div>
  );
});
