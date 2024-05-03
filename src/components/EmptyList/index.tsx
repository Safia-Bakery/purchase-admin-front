import { useTranslation } from "react-i18next";

type Props = {
  label?: string;
};

const EmptyList = ({ label }: Props) => {
  const { t } = useTranslation();
  return (
    <div className="w-full my-3">
      <p className="text-center w-full">{label || t("empty_list")}</p>
    </div>
  );
};

export default EmptyList;
