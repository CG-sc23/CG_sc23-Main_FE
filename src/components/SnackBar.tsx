import { snackBarAtom } from '@/store';
import { AnimatePresence, motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import { colors } from './constant/color';

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
  font-weight: 900;
  background-color: white;
  box-shadow: 5px 5px 10px ${colors.grey500};
  z-index: 15;

  white-space: pre-line;
  line-height: 1.5rem;
  text-align: center;

  &:hover {
    cursor: pointer;
  }
`;

export default function SnackBar() {
  const snackBar = useRecoilValue(snackBarAtom);
  return (
    <AnimatePresence>
      {snackBar.visible && (
        <ModalBlock
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {snackBar.message}
        </ModalBlock>
      )}
    </AnimatePresence>
  );
}
