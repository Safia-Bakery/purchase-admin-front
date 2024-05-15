import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import Card from "@/components/Card";
import useCategories from "@/hooks/useCategories";
import { errorToast, successToast } from "@/utils/toast";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import { useTranslation } from "react-i18next";
import categoryMutation from "@/hooks/mutation/category";
import Header from "@/components/Header";
import Button from "@/components/Button";

const EditAddCategory = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  const { data, isLoading, refetch } = useCategories({ id: Number(id) });
  const { refetch: categoryRefetch } = useCategories({
    enabled: false,
  });
  const category = data?.items?.[0];
  const { mutate } = categoryMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = () => {
    const { name_ru, name_uz, status } = getValues();
    mutate(
      {
        name_ru,
        name_uz,
        status: +!!status,
        id,
      },
      {
        onSuccess: () => {
          categoryRefetch();
          successToast(!!id ? "updated" : "created");
          goBack();
          if (id) refetch();
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  useEffect(() => {
    if (category) {
      reset({
        name_ru: category?.name_ru,
        name_uz: category?.name_uz,
        status: !!category.status,
      });
    }
  }, [category, reset]);

  if (isLoading && !!id) return;

  return (
    <Card className="overflow-hidden pb-3">
      <Header title={!id ? "add_category" : "edit_category"}>
        <Button green onClick={goBack}>
          {t("back")}
        </Button>
      </Header>
      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        <BaseInput label="name_ru" error={errors.name_ru}>
          <MainInput
            register={register("name_ru", { required: t("required_field") })}
          />
        </BaseInput>
        <BaseInput label="name_uz" error={errors.name_uz}>
          <MainInput
            register={register("name_uz", { required: t("required_field") })}
          />
        </BaseInput>

        <MainCheckBox label={"active"} register={register("status")} />

        <Button green type="submit" className="mt-4 float-end">
          {t("save")}
        </Button>
      </form>
    </Card>
  );
};

export default EditAddCategory;
