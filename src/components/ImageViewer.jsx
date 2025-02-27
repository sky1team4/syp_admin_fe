import React from 'react';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

const ImageViewer = ({ isOpen, onClose, imageUrl }) => {
  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      slides={[{ src: imageUrl }]}
      plugins={[Zoom]}
      animation={{ fade: 300 }}
      carousel={{ finite: true }}
      render={{
        backdrop: ({ onClick }) => (
          <div
            onClick={onClick}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-300"
            style={{
              zIndex: 1000,
              animation: isOpen ? 'fadeIn 300ms ease-in-out' : 'fadeOut 300ms ease-in-out'
            }}
          />
        )
      }}
      styles={{
        container: { backgroundColor: 'transparent' },
        root: { 
          "--yarl__color_backdrop": "transparent",
          "--yarl__transition_duration": "300ms"
        }
      }}
    />
  );
};

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default ImageViewer;