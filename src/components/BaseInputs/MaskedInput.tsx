import {
  ChangeEvent,
  FC,
  HTMLInputTypeAttribute,
  KeyboardEventHandler,
} from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import styles from "./index.module.scss";
import InputMask from "react-input-mask";

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

  defaultValue?: any;
  onKeyDown?: KeyboardEventHandler;
  mask?: string;
}

const MaskedInput: FC<Props> = ({
  className = "",
  placeholder = "",
  register,
  mask = "+_ (___)-___-__-__",
  ...others
}) => {
  return (
    <InputMask
      mask={mask}
      className={`${className} ${styles.inputBox} pl-3`}
      placeholder={placeholder || ""}
      type="tel"
      {...register}
      {...others}
    />
  );
};

export default MaskedInput;
