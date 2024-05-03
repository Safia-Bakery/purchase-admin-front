import useQueryString from "@/hooks/custom/useQueryString";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

const TgRoutes = () => {
  const { t } = useTranslation();
  const title = useQueryString("title");
  const icon = useQueryString("icon");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="p-3 border-b-2 border-b-black flex gap-3 items-center">
        <h1 className="text-2xl">{t(title || "") || t("create_order")}</h1>
        {icon && <img src={`/icons/${icon}.svg`} alt="icon" />}
      </div>
      <div className="pt-2 px-2 h-[80lvh]">
        <Outlet />
      </div>
    </div>
  );
};

export default TgRoutes;
