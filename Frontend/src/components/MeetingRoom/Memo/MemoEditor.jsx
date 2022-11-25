import React from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const MemoEditor = () => {
  return (
    <div>
      <Editor
        placeholder="이곳에 기록하세요!"
        previewStyle="vertical"
        height="100%"
        initialEditType="wysiwyg"
      />
    </div>
  );
};
