import BaseInput from "@/components/BaseInputs";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import Button from "@/components/Button";
import Loading from "@/components/Loader";
import ToolsSelect from "@/components/ToolsSelect";
import useQueryString from "@/hooks/custom/useQueryString";
import expenditureMutation from "@/hooks/mutation/expenditure";
import { errorToast } from "@/utils/toast";
import { BtnTypes, Operations, SelectValue } from "@/utils/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MultiValue } from "react-select";

const SelectProduct = () => {
  const { t } = useTranslation();
  const [selected, $selected] = useState<MultiValue<SelectValue>>();
  const client_id = Number(useQueryString("client_id"));

  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);

  const { mutate, isPending } = expenditureMutation();

  const handleChange = (items: MultiValue<SelectValue>) => $selected(items);

  const { getValues, reset, setValue, register, handleSubmit } = useForm();

  const onSubmit = () => {
    const { comment, ...others } = getValues();
    mutate(
      {
        tools: { ...others },
        branch_id: branch.id,
        client_id,
        comment,
      },
      {
        onSuccess: (data: { success: boolean; id: number }) => {
          window.location.replace(
            `/tg/success/${data.id}?icon=tick&title=ready`
          );
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const handleIncrement = (id: number) =>
    setValue(`${id}`, +getValues(`${id}`) + 1);

  const handleDecrement = (id: number) => {
    return +getValues(`${id}`) > 1
      ? setValue(`${id}`, +getValues(`${id}`) - 1)
      : $selected(selected?.filter((item) => id !== item.value));
  };

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
                        className="w-16 bg-transparent text-center"
                        disabled
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
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <MainTextArea
        register={register("comment")}
        placeholder={t("comments")}
        className="my-4"
      />

      <Button className="w-full" btnType={BtnTypes.primary} type="submit">
        {t("next")}
      </Button>
    </form>
  );
};

export default SelectProduct;
