import { ChangeEvent, FC, ReactNode, useRef } from "react";
import cl from "classnames";
import styles from "./index.module.scss";
import { UseFormRegisterReturn } from "react-hook-form";
import { SelectValues } from "@/utils/types";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/rootConfig";
import { langSelector } from "@/store/reducers/selects";

interface Props {
  onChange?: (val: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  value?: string | number;
  disabled?: boolean;
  register?: UseFormRegisterReturn;
  values?: SelectValues[];
  children?: ReactNode;
  onFocus?: () => void;
}

const MainSelect: FC<Props> = ({
  className,
  register,
  values,
  children,
  onFocus,
  ...others
}) => {
  const lang = useAppSelector(langSelector);
  const initialLoadRef = useRef(true);
  const handleFocus = () => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      onFocus?.();
    }
  };
  return (
    <select
      className={cl(className, styles.select, styles.inputBox)}
      onFocus={handleFocus}
      {...others}
      {...register}
    >
      {!children ? (
        <>
          <option value={undefined}></option>
          {values?.map((item) => (
            <option key={item.id} value={item.id}>
              {item[`name_${lang}`]}
            </option>
          ))}
        </>
      ) : (
        children
      )}
    </select>
  );
};

export default MainSelect;
