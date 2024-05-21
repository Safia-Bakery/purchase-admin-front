import BaseInput from "@/components/BaseInputs";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import Button from "@/components/Button";
import Loading from "@/components/Loader";
import ToolsSelect from "@/components/ToolsSelect";
import { useRemoveParams } from "@/hooks/custom/useCustomNavigate";
import useQueryString from "@/hooks/custom/useQueryString";
import expenditureMutation from "@/hooks/mutation/expenditure";
import useExpenditure from "@/hooks/useExpenditure";
import { errorToast } from "@/utils/toast";
import { BtnTypes, SelectValue } from "@/utils/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

type Props = {
  is_web?: boolean;
};

const SelectProduct = ({ is_web }: Props) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [selected, $selected] = useState<SelectValue[]>([]);
  const client_id = Number(useQueryString("client_id"));
  const removeParams = useRemoveParams();

  const { refetch: orderRefetch } = useExpenditure({ id, enabled: !!id });

  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);

  const { mutate, isPending } = expenditureMutation();

  const handleChange = (items: SelectValue) =>
    $selected((prev) => [...prev, items]);

  const { getValues, reset, setValue, register, handleSubmit } = useForm();

  const onSubmit = () => {
    const { comment, ...others } = getValues();
    mutate(
      {
        tools: { ...others },
        ...(branch?.id && { branch_id: branch.id }),
        ...(client_id && { client_id }),
        ...(comment && { comment }),
        ...(id && { id: +id }),
      },
      {
        onSuccess: (data: { success: boolean; id: number }) => {
          if (is_web) {
            orderRefetch();
            removeParams(["modal"]);
          } else
            window.location.replace(
              `/tg/success/${data.id}?icon=tick&title=ready`
            );
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const handleRemove = (id: number) =>
    $selected(selected?.filter((item) => id !== item.value));

  const handleIncrement = (id: number) =>
    setValue(`${id}`, +getValues(`${id}`) + 1);

  const handleDecrement = (id: number) =>
    +getValues(`${id}`) > 1 && setValue(`${id}`, +getValues(`${id}`) - 1);

  useEffect(() => {
    if (selected?.length) {
      const init = selected.reduce((acc: any, item) => {
        acc[item?.value!] = +getValues(`${item.value}`) || item?.count;
        return acc;
      }, {});
      reset(init);
    }
  }, [selected]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pt-4 h-full">
      {isPending && <Loading />}
      <div className="border-b-2 pb-3 mb-3 border-b-black">
        <BaseInput label="select_product">
          <ToolsSelect onChange={handleChange} />
        </BaseInput>
      </div>

      {!!selected?.length && (
        <table>
          <tbody>
            {selected?.map((item, idx) => (
              <tr key={item.value + idx}>
                <td>{idx + 1}</td>
                <td>{item.label}</td>
                <td>
                  <div className="flex gap-2 items-center">
                    <button
                      type="button"
                      className="text-xl"
                      onClick={() => handleDecrement(item.value)}
                    >
                      -
                    </button>
                    <span>
                      <input
                        className="w-16 bg-transparent text-center outline-none"
                        type="number" // @ts-ignore
                        onWheel={(e) => e.target?.blur()}
                        {...register(`${item.value}`)}
                      />
                    </span>
                    <button
                      type="button"
                      onClick={() => handleIncrement(item.value)}
                      className="text-xl"
                    >
                      +
                    </button>
                  </div>
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.value)}
                  >
                    <img src="/icons/crossRed.svg" alt="delete" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!is_web && (
        <MainTextArea
          register={register("comment")}
          placeholder={t("comments")}
          className="mt-4"
        />
      )}

      <Button className="w-full mt-4" btnType={BtnTypes.primary} type="submit">
        {t(is_web ? "add" : "next")}
      </Button>
    </form>
  );
};

export default SelectProduct;
