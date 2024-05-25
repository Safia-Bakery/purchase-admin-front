import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import Card from "@/components/Card";
import { errorToast, successToast } from "@/utils/toast";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Button from "@/components/Button";
import toolUpdateMutation from "@/hooks/mutation/toolUpdate";
import useTool from "@/hooks/useTool";
import useTools from "@/hooks/useTools";
import useQueryString from "@/hooks/custom/useQueryString";
import { BtnTypes } from "@/utils/types";

const UpdateTools = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const parent_id = useQueryString("parent_id");

  const goBack = () => navigate(-1);

  const { data: tool, isLoading, refetch } = useTool({ id: Number(id) });
  const { refetch: toolsRefetch } = useTools({
    enabled: false,
    ...(!!parent_id && { parent_id }),
  });

  const { mutate } = toolUpdateMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = () => {
    const { name, status, price, mainunit, code } = getValues();
    mutate(
      {
        [id!]: +price,

        // status: +!!status,
        // id: Number(id),
        // name,
        // price: +price,
        // mainunit,
        // code,
      },
      {
        onSuccess: () => {
          toolsRefetch();
          refetch();
          successToast(!!id ? "updated" : "created");
          goBack();
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  useEffect(() => {
    if (tool) {
      reset({
        // status: !!tool.status,
        price: tool.price,
        // mainunit: tool.mainunit,
        // code: tool.code,
        // name: tool.name,
      });
    }
  }, [tool, reset]);

  if (isLoading && !!id) return;

  return (
    <Card className="overflow-hidden pb-3">
      <Header title={!id ? "add_category" : "edit_category"}>
        <Button btnType={BtnTypes.primary} onClick={goBack}>
          {t("back")}
        </Button>
      </Header>
      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        {/* <BaseInput label="name_in_table" error={errors.name_in_table}>
          <MainInput
            register={register("name", { required: t("required_field") })}
          />
        </BaseInput> */}
        <BaseInput label="price">
          <MainInput type="number" register={register("price")} />
        </BaseInput>
        {/* <BaseInput label="measurement">
          <MainInput register={register("mainunit")} />
        </BaseInput>
        <BaseInput label="code">
          <MainInput register={register("code")} />
        </BaseInput>

        <MainCheckBox label={"active"} register={register("status")} /> */}

        <Button green type="submit" className="mt-4 float-end">
          {t("save")}
        </Button>
      </form>
    </Card>
  );
};

export default UpdateTools;
