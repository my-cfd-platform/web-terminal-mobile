import { useEffect, FC, useRef } from 'react';
import ReactDOM from 'react-dom';

const Modal: FC = ({ children }) => {
  const modalRoot = document.getElementById('portal');
  const element = useRef(document.createElement('div'));
  
  useEffect(() => {
    modalRoot?.appendChild(element.current);
    return () => {
      modalRoot?.removeChild(element.current);
    };
  }, [modalRoot]);

  return ReactDOM.createPortal(children, element.current);
};

export default Modal;
