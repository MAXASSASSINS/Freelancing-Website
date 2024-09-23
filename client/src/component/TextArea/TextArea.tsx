import React, { forwardRef, useImperativeHandle, useState } from "react";
import "./textArea.css";

type TextAreaProps = {
  maxLength: number;
  minLength?: number;
  style?: React.CSSProperties;
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
      style,
      placeholder = '',
      defaultText = '',
      warning = '',
      getText,
    }: TextAreaProps,
    ref: React.Ref<TextAreaRef>
  ) => {
    const [currentTextLength, setCurrentTextLength] = useState<number>(
      defaultText ? defaultText.length : 0
    );
    const [text, setText] = useState<string>(defaultText ? defaultText : "");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentTextLength(e.target.value.trim().length);
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
      <div className="textarea-main">
        <textarea
          maxLength={maxLength}
          minLength={minLength}
          placeholder={placeholder}
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          onChange={handleChange}
          style={style}
          value={text}
          className="textarea"
        ></textarea>
        <div className="textarea-footer">
          <div className="warning">{warning}</div>
          <div className="textarea-label">
            {currentTextLength} / {maxLength} max
          </div>
        </div>
      </div>
    );
  }
);
