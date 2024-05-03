import BaseInput from "@/components/BaseInputs";
import BranchSelect from "@/components/BranchSelect";
import Button from "@/components/Button";
import useQueryString from "@/hooks/custom/useQueryString";
import { BtnTypes } from "@/utils/types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const SelectBranch = () => {
  const { t } = useTranslation();

  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);

  return (
    <div className="pt-4 h-full flex flex-col justify-between">
      <BaseInput label="select_branch">
        <BranchSelect placeholdeer={t("search")} />
      </BaseInput>

      <Link
        to={`/tg/select-product${window.location.search}&title=${branch?.name}`}
        className="w-full"
      >
        <Button
          className="w-full"
          btnType={BtnTypes.primary}
          disabled={!branch?.id}
        >
          {t("next")}
        </Button>
      </Link>
    </div>
  );
};

export default SelectBranch;
