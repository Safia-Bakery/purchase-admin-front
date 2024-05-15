import { FC, useEffect } from "react";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainSelect from "@/components/BaseInputs/MainSelect";

import useCategories from "@/hooks/useCategories";
import useQueryString from "custom/useQueryString";
import { StatusName } from "@/utils/helpers";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";
import { useForm } from "react-hook-form";
import useClients from "@/hooks/useClients";

const OrdersFilter: FC = () => {
  const navigate = useNavigateParams();

  const category_id = useQueryString("category_id");
  const status = useQueryString("status");
  const user_id = useQueryString("user_id");
  const id = useQueryString("id");
  const date = useQueryString("date");
  const { reset, getValues, register } = useForm();

  const handleSubmit = () => navigate(getValues());

  const { data: users, refetch } = useClients({
    enabled: false,
    status: 1,
  });

  const { data: categories, refetch: catRefetch } = useCategories({
    enabled: false,
    status: 1,
  });

  useEffect(() => {
    reset({ date, id });
  }, [date, id]);

  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainInput
            register={register("id")}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            type="number"
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainSelect
            value={user_id}
            onFocus={() => refetch()}
            onChange={(e) => navigate({ user_id: e.target.value })}
          >
            <option value={undefined}></option>
            {users?.items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </MainSelect>
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainSelect
            values={categories?.items}
            onFocus={() => catRefetch()}
            value={category_id}
            onChange={(e) => navigate({ category_id: e.target.value })}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainInput
            type="date"
            value={date}
            onChange={(e) => navigate({ date: e.target.value })}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainSelect
            values={StatusName}
            value={status}
            onChange={(e) => navigate({ status: e.target.value })}
          />
        </BaseInputs>
      </td>
    </>
  );
};

export default OrdersFilter;
