import React, {useState, useEffect, useRef} from 'react';

import './ModalStyle.css';

import CloseIcon from './SVG/close.svg';

const Modal = (props) => {
  
  
  const [modal, setModal] = useState(true);
  const modalRef = useRef()
  
  function close(){
    setModal(false);
  }
  
  console.log(modal)
  console.log(props.dealing)
  
  if(props.dealing===true){
    return (
    <div>
      <div className={`modal__overlay ${modal && "is-opened"}`}>
        <div className="modal__box">
          <div>{props.children}</div>
        </div>
      </div>
    </div>
  );
    
  }else{
    return (
    <div>
      <div className={`modal__overlay ${modal && "is-opened"}`}  onClick={e=>{if(modalRef.current === e.target) close()}} ref={modalRef}>
        <div className="modal__box">
          <div className="modal__closeBtn p-1" onClick={() => close()} style={{width:'24px'}}><img src={CloseIcon}/></div>
          <div>{props.children}</div>
        </div>
      </div>
    </div>
  );
    
    
  }
  

}

export default Modal;