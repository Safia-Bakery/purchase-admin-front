import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import Button from "@/components/Button";
import Loading from "@/components/Loader";
import loginMutation from "@/hooks/mutation/login";
import {
  lastUrlSelector,
  loginHandler,
  tokenSelector,
} from "@/store/reducers/auth";
import { useAppDispatch, useAppSelector } from "@/store/rootConfig";
import { successToast } from "@/utils/toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector(tokenSelector);
  const [error, $error] = useState(false);
  const lastUrl = useAppSelector(lastUrlSelector);

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate, isPending } = loginMutation();

  const onSubmit = () => {
    const { username, password } = getValues();

    mutate(
      { username, password },
      {
        onSuccess: (data) => {
          dispatch(loginHandler(data.access_token));
          successToast(t("welcome"));
          if (error) $error(false);
        },
        onError: () => $error(true),
      }
    );
  };
  useEffect(() => {
    if (token) navigate(lastUrl === "/login" ? "/" : lastUrl);
  }, [token]);

  return (
    <div className="h-screen flex flex-1 w-screen">
      <div className="flex flex-[4] items-center justify-center bg-lightBrown">
        <img
          src="/images/safia-img.png"
          className="max-h-[21vh] max-w-[12vw] h-full w-full object-contain"
          alt="safia-logo"
        />
      </div>

      <div className="flex flex-[3] flex-col justify-between items-center py-8">
        <div />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-1 max-w-[24vw] w-full"
        >
          <h3 className="text-3xl font-bold mb-1">{t("entrance")}</h3>
          <BaseInput error={errors.login}>
            <MainInput
              placeholder={"login"}
              register={register("username", {
                required: t("required_field"),
              })}
            />
          </BaseInput>
          <BaseInput error={errors.password}>
            <MainInput
              placeholder={"password"}
              type="password"
              register={register("password", { required: t("required_field") })}
            />
          </BaseInput>
          {error && (
            <p className={"text-sm text-red-400"}>{t("incorrect_username")}</p>
          )}

          <Button className="!bg-lightBrown" type="submit">
            {t("login")}
          </Button>
        </form>

        <div className="max-w-[24vw] w-full">
          <p className="text-lg leading-5 text-textColor">
            {t("problem_descr")}
          </p>
        </div>
      </div>

      {isPending && <Loading />}
    </div>
  );
};

export default Login;
