import { BiItalic } from "react-icons/bi";
import { GoBold, GoListOrdered, GoListUnordered } from "react-icons/go";
import { MdOutlineHighlight } from "react-icons/md";
import { RichUtils } from "draft-js";

export const inlineStyleButtons = [
  {
    value: "Bold",
    style: "BOLD",
  },

  {
    value: "Italic",
    style: "ITALIC",
  },

  {
    value: "Highlight",
    style: "HIGHLIGHT",
  },
];

export const blockTypeButtons = [
  {
    value: "Unordered List",
    block: "unordered-list-item",
  },

  {
    value: "Ordered List",
    block: "ordered-list-item",
  },
];

export const getIcon = (value) => {
  // console.log(value);
  switch (value) {
    case "BOLD":
      return <GoBold />;
    case "ITALIC":
      return <BiItalic />;
    case "HIGHLIGHT":
      return <MdOutlineHighlight />;
    case "unordered-list-item":
      return <GoListOrdered />;
    case "ordered-list-item":
      return <GoListUnordered />;
  }
};

export const InlineStyleButton = ({
  style,
  value,
  toggleInlineStyle,
  editorState,
}) => {
  const currentInlineStyle = editorState.getCurrentInlineStyle();
  let color = "";
  if (currentInlineStyle.has(style)) {
    color = "#1dbf73";
  }

  return (
    <button
      key={style}
      value={value}
      style={{ color: color }}
      data-style={style}
      onClick={(e) => toggleInlineStyle(e)}
      onMouseDown={(e) => e.preventDefault()}
    >
      {getIcon(style)}
    </button>
  );
};

export const BlockStyleButton = ({
  style,
  block,
  toggleBlockType,
  editorState,
}) => {
  const currentBlockType = RichUtils.getCurrentBlockType(editorState);
  let color = "";
  if (currentBlockType === block) {
    color = "#1dbf73";
  }

  return (
    <button
      block={block}
      key={style}
      style={{ color: color }}
      data-block={block}
      onClick={toggleBlockType}
      onMouseDown={(e) => e.preventDefault()}
    >
      {getIcon(block)}
    </button>
  );
};
