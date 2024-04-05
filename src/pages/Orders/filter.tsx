import { FC, useState } from "react";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainSelect from "@/components/BaseInputs/MainSelect";

import useCategories from "@/hooks/useCategories";
import useDebounce from "custom/useDebounce";
import useQueryString from "custom/useQueryString";
import { StatusName } from "@/utils/helpers";

const CategoriesFilter: FC = () => {
  const currentPage = Number(useQueryString("page")) || 1;
  const [name, $name] = useDebounce("");
  const [department, $department] = useDebounce("");
  const [category_status, $category_status] = useState<string>();

  const { refetch } = useCategories({
    page: currentPage,
    enabled: false,
    ...(!!department && { department }),

    ...(!!name && { name }),
    ...(!!category_status && { category_status }),
  });

  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainInput onChange={(e) => $name(e.target.value)} />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainInput onChange={(e) => $department(e.target.value)} />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainSelect
            values={StatusName}
            onChange={(e) => $category_status(e.target.value)}
          />
        </BaseInputs>
      </td>
      <td></td>
    </>
  );
};

export default CategoriesFilter;
