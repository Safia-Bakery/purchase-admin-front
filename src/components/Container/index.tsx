import { FC, ReactNode } from "react";
import styles from "./index.module.scss";

interface Props {
  children: ReactNode;
  className?: string;
}

const Container: FC<Props> = ({ children, className = "" }) => {
  return (
    <div className={`${className} ${styles.container} !pl-24`}>{children}</div>
  );
};

export default Container;
