import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import roleMutation from "@/hooks/mutation/role";
import { errorToast, successToast } from "@/utils/toast";
import useRoles from "@/hooks/useRoles";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import { useTranslation } from "react-i18next";
import usePermissions from "@/hooks/usePermissions";
import MultiSelect, { MultiValue } from "react-select";
import { BtnTypes, SelectValue } from "@/utils/types";
import useRole from "@/hooks/useRole";
import Button from "@/components/Button";
import Loading from "@/components/Loader";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";

const EditAddRole = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { refetch: usersRefetch } = useRoles({ enabled: false });
  const { mutate: postRole } = roleMutation();
  const [items, $items] = useState<SelectValue[]>([]);
  const [selectedPerm, setSelectedPerm] = useState<MultiValue<SelectValue>>();
  const { data: permissions, isLoading: permLoading } = usePermissions({});
  const {
    data: role,
    refetch: roleRefecth,
    isLoading,
  } = useRole({ id: +id!, enabled: !!id });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const handleSelectChange = (selectValue: MultiValue<SelectValue>) => {
    if (selectValue) setSelectedPerm(selectValue);
  };

  const onSubmit = () => {
    const accesses = selectedPerm?.map((item) => Number(item?.value));

    const { name, description, status } = getValues();
    postRole(
      { name, description, id: Number(id), accesses, status },
      {
        onSuccess: () => {
          successToast(!id ? "role created" : "role updated");
          goBack();
          usersRefetch();
          if (!!id) roleRefecth();
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  useEffect(() => {
    if (id && role) {
      setSelectedPerm(
        role.access?.map((item) => ({
          value: item.permission_id,
          label: item?.permission?.name,
        }))
      );
      reset({
        name: role.name,
        description: role.description,
        status: !!role.status ? true : false,
      });
    }
  }, [role, id]);

  useEffect(() => {
    if (!!permissions)
      $items((prev) => [
        ...prev,
        ...permissions.map((item: any) => {
          return {
            value: item.id,
            label: item.name,
          };
        }),
      ]);
  }, [permissions]);

  if (permLoading || isLoading) return <Loading />;

  return (
    <Card>
      <Header title={!id ? t("add") : `${t("edit_role")} №${id}`}>
        <Button btnType={BtnTypes.primary} onClick={goBack}>
          {t("back")}
        </Button>
      </Header>

      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        <BaseInputs label="name_in_table" error={errors.name}>
          <MainInput
            placeholder={"name_in_table"}
            register={register("name", { required: t("required_field") })}
          />
        </BaseInputs>
        <BaseInputs label="description" error={errors.description}>
          <MainTextArea
            placeholder={t("description")}
            register={register("description")}
          />
        </BaseInputs>

        <BaseInputs label="accesses" error={errors.description}>
          <MultiSelect
            placeholder={"Выберите разрешении"}
            options={items}
            onChange={handleSelectChange}
            value={selectedPerm}
            isMulti
          />
        </BaseInputs>

        <BaseInputs label="status">
          <MainCheckBox label={"active"} register={register("status")} />
        </BaseInputs>

        <Button className="mt-2" btnType={BtnTypes.success} type="submit">
          {t("save")}
        </Button>
      </form>
    </Card>
  );
};

export default EditAddRole;
