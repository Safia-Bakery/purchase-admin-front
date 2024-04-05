import { FC, ReactNode } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import styles from "./index.module.scss";
import cl from "classnames";
import { useTranslation } from "react-i18next";

interface BaseProps {
  label?: string;
  className?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  children?: ReactNode;
  labelClassName?: string;
}

const BaseInput: FC<BaseProps> = ({
  label,
  className = "",
  error,
  children,
  labelClassName,
}) => {
  const { t } = useTranslation();
  return (
    <div className={`${className} mb-2`}>
      {label && (
        <label className={cl(styles.label, labelClassName)}>{t(label)}</label>
      )}
      {children}
      {error && (
        <div className="text-[10px] text-red-500" role="alert">
          {error?.message?.toString()}
        </div>
      )}
    </div>
  );
};

export default BaseInput;
