import React, { forwardRef, useImperativeHandle, useState } from "react";

type TextAreaProps = {
  maxLength: number;
  minLength?: number;
  className?: string;
  placeholder?: string;
  defaultText?: string;
  warning?: string;
  getText?: (text: string) => void;
};

export type TextAreaRef = {
  currValue: string;
  setTextComingFromParent: (txt: string) => void;
};

export const TextArea = forwardRef(
  (
    {
      maxLength = Number.MAX_SAFE_INTEGER,
      minLength = 0,
      className,
      placeholder = "",
      defaultText = "",
      warning = "",
      getText,
    }: TextAreaProps,
    ref: React.Ref<TextAreaRef>
  ) => {
    const [currentTextLength, setCurrentTextLength] = useState<number>(
      defaultText ? defaultText.length : 0
    );
    const [text, setText] = useState<string>(defaultText ? defaultText : "");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentTextLength(e.target.value.length);
      setText(e.target.value);
      getText && getText(e.target.value);
    };

    useImperativeHandle(
      ref,
      () => ({
        currValue: text,
        setTextComingFromParent: (txt: string) => {
          setText(txt);
          setCurrentTextLength(txt.length);
        },
      }),
      [text]
    );

    return (
      <div className="w-full">
        <textarea
          maxLength={maxLength}
          minLength={minLength}
          placeholder={placeholder}
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          onChange={handleChange}
          value={text}
          className={`w-full resize-none h-20 rounded-[5px] py-2.5 px-4 text-inherit leading-5 outline-none border ${className?.replace(
            " ",
            " !"
          )} ${
            warning
              ? "border-warning"
              : "border-no_focus focus:border-dark_grey"
          }`}
        ></textarea>
        <div className="flex items-start [&>*]:leading-[1.4] justify-between text-sm">
          <div className="w-2/3 text-warning">{warning}</div>
          <div className="relative text-no_focus text-xs">
            {currentTextLength} / {maxLength} max
          </div>
        </div>
      </div>
    );
  }
);
