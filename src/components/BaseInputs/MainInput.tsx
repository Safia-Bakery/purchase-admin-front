import {
  ChangeEvent,
  FC,
  HTMLInputTypeAttribute,
  KeyboardEventHandler,
} from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";

interface Props {
  onChange?: (val: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  value?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string | null;
  autoFocus?: boolean;
  disabled?: boolean;
  register?: UseFormRegisterReturn;
  onFocus?: () => void;
  ref?: any;
  defaultValue?: any;
  onKeyDown?: KeyboardEventHandler;
}

const MainInput: FC<Props> = ({
  className = "",
  placeholder = "",
  register,
  ref,
  defaultValue,
  ...others
}) => {
  const { t } = useTranslation();
  return (
    <input
      className={`${className} ${styles.inputBox}`}
      placeholder={t(placeholder || "")}
      ref={ref}
      // @ts-ignore
      onWheel={(e) => e.target?.blur()}
      defaultValue={defaultValue}
      {...register}
      {...others}
    />
  );
};

export default MainInput;
