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
    />
  );
};

export default ImageViewer;