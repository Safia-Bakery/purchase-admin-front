import { TelegramApp } from "@/utils/tgHelpers";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const Success = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      TelegramApp?.expand();
      TelegramApp?.confirmClose();
    }, 400);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      TelegramApp?.toMainScreen();
    }, 500);
  }, []);
  return (
    <div className="h-full flex items-center">
      <div className="bg-[#161F28] text-white h-[204px] flex flex-col items-center text-2xl justify-center text-center p-2 w-full rounded-md">
        <span>{t("thanks")}.</span>
        <span>{`${t("your_order")} №${id} ${t("receivedd")}`}</span>
      </div>
    </div>
  );
};

export default Success;
