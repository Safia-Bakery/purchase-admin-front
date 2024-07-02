import { FC, useEffect, useMemo, useState } from "react";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainSelect from "@/components/BaseInputs/MainSelect";

import useCategories from "@/hooks/useCategories";
import useQueryString from "custom/useQueryString";
import { OrderStatusName, StatusName } from "@/utils/helpers";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";
import { useForm } from "react-hook-form";
import useClients from "@/hooks/useClients";
import BranchSelect from "@/components/BranchSelect";
import MainDatePicker from "@/components/BaseInputs/MainDatePicker";
import dayjs from "dayjs";

const ForemanOrdersFilter: FC = () => {
  const navigate = useNavigateParams();
  const status = useQueryString("status");
  const client_id = useQueryString("client_id");
  const [enabled, $enabled] = useState(false);
  const id = useQueryString("id");
  const created_at = useQueryString("created_at");
  const { reset, getValues, register } = useForm();

  const handleSubmit = () => navigate(getValues());

  const { data: users, refetch } = useClients({
    enabled: !!client_id,
    status: 1,
  });

  useEffect(() => {
    reset({ id });
  }, [id]);

  return (
    <>
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
            value={client_id}
            onFocus={() => refetch()}
            onChange={(e) => navigate({ client_id: e.target.value })}
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
          <div onClick={() => $enabled(true)} className={"m-1"}>
            <BranchSelect enabled={enabled} />
          </div>
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainDatePicker
            selected={
              !!created_at && created_at !== "undefined"
                ? dayjs(created_at).toDate()
                : undefined
            }
            onChange={(e: any) => navigate({ created_at: e })}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainSelect
            values={OrderStatusName}
            value={status}
            onChange={(e) => navigate({ status: e.target.value })}
          />
        </BaseInputs>
      </td>
    </>
  );
};

export default ForemanOrdersFilter;
