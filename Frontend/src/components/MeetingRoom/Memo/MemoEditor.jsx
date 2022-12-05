import React from "react";
// import { Editor } from "@toast-ui/react-editor";
// import "@toast-ui/editor/dist/toastui-editor.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { QuillBinding } from "y-quill";
import QuillCursors from "quill-cursors";
import Quill from "quill";
import { useRef, useEffect } from "react";
import host_config from "../../../config/serverHost";
import styled from "styled-components";

const MemoEditor = (props) => {
  const { roomName, setMemo, userName } = props;
  let quillRef = null;

  Quill.register("modules/cursors", QuillCursors);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ align: [] }, { color: [] }, { background: [] }],
      ["link", "code"],
    ],

    cursors: {
      transformOnTextChange: true,
      hide: false,
      selectionChangeSource: null,
    },

    history: {
      userOnly: true,
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "align",
    "color",
    "background",
    "link",
    "code",
  ];

  const getQuillEditor = () => {
    if (typeof quillRef.getEditor !== "function") return;
    return quillRef.getEditor();
  };

  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider(
      `http://${host_config.current_host}:${host_config.socket_port}/meetingRoom`,
      ydoc
    );
    const type = ydoc.getText("quill");
    const binding = new QuillBinding(
      type,
      getQuillEditor(),
      provider.awareness
    );

    provider.awareness.setLocalStateField("user", {
      name: userName,
      color: getRandomColor(),
    });
  }, []);

  return (
    <MouseBox>
      <ReactQuill
        placeholder="이곳에 기록하세요!"
        theme="snow"
        modules={modules}
        formats={formats}
        style={{ height: "94.5%" }}
        ref={(el) => {
          setMemo(el);
          return (quillRef = el);
        }}
      />
    </MouseBox>
  );
};

const MouseBox = styled.div`
  height: 100%;

  .ql-toolbar.ql-snow {
    border-radius: 5px 5px 0px 0px;
  }
  .ql-container.ql-snow {
    border-radius: 0 0 5px 5px;
  }
  .ql-editor strong {
    font-weight: bold;
  }
  .q1-cursor {
    opacity: 1 !important;
    visibility: visible !important;
  }
  .ql-cursor-flag {
    visibility: visible !important;
    opacity: 1 !important;
  }
  .show-flag {
  }
`;

export default MemoEditor;
