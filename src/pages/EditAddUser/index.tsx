import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import userMutation from "@/hooks/mutation/userMutation";
import { errorToast, successToast } from "@/utils/toast";
import { fixedString } from "@/utils/helpers";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import BaseInputs from "@/components/BaseInputs";
import useRoles from "@/hooks/useRoles";
import { useTranslation } from "react-i18next";
import useUsers from "@/hooks/useUsers";
import MySelect from "@/components/BaseInputs/MySelect";
import Button from "@/components/Button";
import { BtnTypes } from "@/utils/types";
import MaskedInput from "@/components/BaseInputs/MaskedInput";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import Loading from "@/components/Loader";

const EditAddUser = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const { data: roles, isLoading: roleLoading } = useRoles({});
  const {
    data,
    refetch: userRefetch,
    isLoading,
  } = useUsers({
    id: Number(id),
    enabled: !!id,
  });

  const { refetch: usersRefetch } = useUsers({});
  const user = data?.items?.[0];

  const { mutate } = userMutation();

  const onSubmit = () => {
    const {
      password,
      phone_number,
      name,
      email,
      group_id,
      address,
      inn,
      company_name,
      status,
    } = getValues();
    mutate(
      {
        name,
        role_id: group_id,
        password,
        ...(fixedString(phone_number).length > 5 && {
          phone: fixedString(phone_number).toString(),
        }),
        status: Number(status),
        ...(!!email && { email }),
        ...(!!address && { address }),
        ...(!!inn && { inn }),
        ...(!!company_name && { company_name }),
        ...(!!id && { id: Number(id) }),
      },
      {
        onSuccess: () => {
          usersRefetch();
          navigate("/users");
          successToast(!!id ? "successfully updated" : "successfully created");
          if (!!id) userRefetch();
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  useEffect(() => {
    if (id && user) {
      reset({
        name: user.name,
        group_id: user.role?.id,
        email: user.email,
        phone: user.phone,
        phone_number: user.phone,
        inn: user.inn,
        company_name: user.company_name,
        address: user.address,
        status: !!user.status ? true : false,
      });
    }
  }, [user, id, getValues("phone_number")]);

  if (roleLoading || isLoading) return <Loading />;

  return (
    <Card>
      <Header title={!id ? t("add") : `${t("edit_user")} №${id}`}>
        <Button btnType={BtnTypes.primary} onClick={goBack}>
          {t("back")}
        </Button>
      </Header>

      <form className="p-2 " onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-1 flex-col">
            <BaseInputs label="name" error={errors.name}>
              <MainInput
                register={register("name", {
                  required: t("required_field"),
                })}
              />
            </BaseInputs>

            <BaseInputs label="phone" error={errors.phone_number}>
              <MaskedInput
                mask="(999-99)-999-99-99"
                defaultValue={"998"}
                register={register("phone_number", {
                  required: "required",
                })}
              />
            </BaseInputs>
            <BaseInput label="role" error={errors.department}>
              <MySelect values={roles} register={register("group_id")} />
            </BaseInput>

            <BaseInputs label="email">
              <MainInput register={register("email")} />
            </BaseInputs>

            <BaseInputs label="status">
              <MainCheckBox label={"active"} register={register("status")} />
            </BaseInputs>
          </div>
          <div className="flex flex-1 flex-col">
            <BaseInputs label="address">
              <MainInput register={register("address")} />
            </BaseInputs>

            <BaseInputs label="inn">
              <MainInput register={register("inn")} />
            </BaseInputs>

            <BaseInputs label="company_name">
              <MainInput register={register("company_name")} />
            </BaseInputs>

            <BaseInput error={errors.password} label="password">
              <MainInput
                type={"password"}
                register={register("password", {
                  required: t("required_field"),
                  minLength: {
                    value: 6,
                    message: t("six_symbols_required"),
                  },
                })}
              />
            </BaseInput>
            {/* <BaseInput label="status">
              <MainCheckBox label={"active"} register={register("status")} />
            </BaseInput> */}
            {/* <BaseInput label="description">
              <MainTextArea register={register("description")} />
            </BaseInput> */}
          </div>
        </div>
        <div className="w-full flex justify-center">
          <Button
            btnType={BtnTypes.success}
            className="min-w-60 mt-4"
            type="submit"
          >
            {t("save")}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EditAddUser;
