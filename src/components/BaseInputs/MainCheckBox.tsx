import { ChangeEvent, FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";

interface Props {
  onChange?: (val: ChangeEvent<HTMLInputElement>) => void;
  value?: boolean;
  disabled?: boolean;
  register?: UseFormRegisterReturn;
  label: string;
}
const MainCheckBox: FC<Props> = ({ value, register, label, ...others }) => {
  const { t } = useTranslation();
  return (
    <div className={`${styles.inputBox} flex align-center`}>
      <label className="mb-0 mr-2">{t(label)}</label>
      <input type="checkbox" defaultChecked={value} {...register} {...others} />
    </div>
  );
};

export default MainCheckBox;
