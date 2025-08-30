"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const RichTextEditor: React.FC = () => {
  const [value, setValue] = useState("");

  return (
    <div className="p-4 space-y-4">
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <div className="border p-4 rounded bg-white" dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  );
};

export default RichTextEditor;
