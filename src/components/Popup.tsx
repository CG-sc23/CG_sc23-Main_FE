import styled from "@emotion/styled";
import { motion, AnimatePresence, usePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { colors } from "./constant/color";

const ModalBlock = styled(motion.div)`
  position: fixed;
  right: 0;
  left: 0;
  margin: auto;
  top: 6rem;
  width: fit-content;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  color: black;
  font-weight: 500;
  background-color: white;
  box-shadow: 5px 5px 10px ${colors.grey500};
  z-index: 15;

  &:hover {
    cursor: pointer;
  }
`;

type ModalProps = { innerText: string; showModal: boolean };

export default function Modal({ innerText, showModal }: ModalProps) {
  const [reveal, setReveal] = useState(false);
  const [isPresent, safeToRemove] = usePresence();
  let timerId = useRef<any>();

  useEffect(() => {
    if (showModal) {
      setReveal(true);
      clearTimeout(timerId.current);
      timerId.current = setInterval(() => {
        setReveal(false);
      }, 2000);
    }
  }, [showModal, isPresent]);

  useEffect(() => {
    !isPresent && setTimeout(safeToRemove, 1000);
  }, [isPresent]);

  const removeModal = () => setReveal(false);

  return (
    <>
      {reveal && !!innerText.length && (
        <AnimatePresence>
          <ModalBlock
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            onClick={removeModal}
          >
            {innerText}
          </ModalBlock>
        </AnimatePresence>
      )}
    </>
  );
}
