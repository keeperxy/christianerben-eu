import React from "react";

interface CVPreviewFrameProps
  extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  src: string;
  title: string;
}

const CVPreviewFrame = React.forwardRef<HTMLIFrameElement, CVPreviewFrameProps>(
  ({ src, title, ...props }, ref) => (
    <iframe
      ref={ref}
      src={src}
      title={title}
      {...props}
    />
  ),
);

CVPreviewFrame.displayName = "CVPreviewFrame";

export default CVPreviewFrame;
