import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "../../../node_modules/draft-js/dist/Draft.css";
import "./textEditor.css";
import { convertFromHTML, convertToHTML } from "draft-convert";
import {
  inlineStyleButtons,
  blockTypeButtons,
  getIcon,
  InlineStyleButton,
  BlockStyleButton,
} from "./textEditorUtil";

export const TextEditor = forwardRef(
  ({ maxLength, hideToolbar, hideFooter, readOnly }, ref) => {
    const [length, setLength] = useState(0);
    const [editorState, setEditorState] = useState(() =>
      EditorState.createEmpty()
    );

    const handleChange = (editorState) => {
      setEditorState(editorState);
      setLength(editorState.getCurrentContent().getPlainText().length);
    };

    const toggleInlineStyle = (event) => {
      event.preventDefault();

      let style = event.currentTarget.getAttribute("data-style");
      setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    };

    const toggleBlockType = (event) => {
      event.preventDefault();

      let block = event.currentTarget.getAttribute("data-block");
      setEditorState(RichUtils.toggleBlockType(editorState, block));
    };

    const styleMap = {
      HIGHLIGHT: {
        backgroundColor: "yellow",
      },
    };

    useImperativeHandle(
      ref,
      () => ({
        getDescriptionLength() {
          return length;
        },
        getDescription() {
          const contentState = JSON.stringify(
            convertToRaw(editorState.getCurrentContent())
          );
          const desc = editorState.getCurrentContent().getPlainText();
          return { contentState, desc };
        },
        setDescriptionComingFromParent(description) {
          if (!description) return;
          let contentState = convertFromRaw(JSON.parse(description));
          let editorState = EditorState.createWithContent(contentState);
          setLength(editorState.getCurrentContent().getPlainText().length);
          setEditorState(editorState);
        },
      }),
      [editorState, length]
    );

    return (
      <div className="textEditor-main" ref={ref}>
        <div
          className="textEditor-toolbar"
          style={{ display: hideToolbar ? "none" : null }}
        >
          {inlineStyleButtons.map((button, index) => {
            return (
              <InlineStyleButton
                key={index}
                block={button.block}
                style={button.style}
                editorState={editorState}
                setEditorState={setEditorState}
                toggleInlineStyle={toggleInlineStyle}
              />
            );
          })}
          {blockTypeButtons.map((button, index) => {
            return (
              <BlockStyleButton
                key={index}
                value={button.value}
                block={button.block}
                editorState={editorState}
                setEditorState={setEditorState}
                toggleBlockType={toggleBlockType}
              />
            );
          })}
        </div>

        <Editor
          editorState={editorState}
          onChange={handleChange}
          customStyleMap={styleMap}
          customStyleFn={() => {
            return {
              lineHeight: 1.5,
            };
          }}
        />

        <div
          className="textEditor-footer"
          style={{ display: hideFooter ? "none" : null }}
        >
          <p>
            {length} / {maxLength} Characters
          </p>
        </div>
      </div>
    );
  }
);
