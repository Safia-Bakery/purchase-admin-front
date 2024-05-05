import { Link, useLocation } from "react-router-dom";
import styles from "./index.module.scss";
import { ChangeEvent, FC } from "react";
import { logoutHandler } from "reducers/auth";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store/rootConfig";
import { changeLanguage, langSelector } from "@/store/reducers/selects";
import { Language } from "@/utils/types";
import useToken from "@/hooks/useToken";

interface Breadcrumb {
  path: string;
  name: string;
}

const Breadcrumbs: FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useAppDispatch();
  const handleLogout = () => dispatch(logoutHandler());
  const lang = useAppSelector(langSelector);
  const { data } = useToken({});

  // const { data: me } = useToken({ enabled: false });

  const handleLang = (e: ChangeEvent<HTMLSelectElement>) =>
    dispatch(changeLanguage(e.target.value as Language));

  const breadcrumbs: Breadcrumb[] = [];

  const pathSegments = pathname
    .split("/")
    .filter((segment: string) => segment !== "");

  pathSegments.reduce((prevPath: string, currentPath: string) => {
    const path = `${prevPath}/${currentPath}`;
    const name = currentPath;
    breadcrumbs.push({ path, name });

    return path;
  }, "");

  return (
    <div className={styles.block}>
      <div className={styles.container}>
        <ul className={styles.breadcrump}>
          {window.location.pathname !== "/home" && (
            <li>
              <Link to="/home">{t("main")}</Link>
            </li>
          )}
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.path}>
              {index === breadcrumbs.length - 1 ? (
                <span>{t(breadcrumb.name)}</span>
              ) : (
                <Link to={breadcrumb.path + location.search}>
                  {t(breadcrumb.name)}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="flex md:gap-4 gap-2">
          <select
            onChange={handleLang}
            value={lang}
            className="!bg-transparent"
          >
            {Object.keys(Language).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <span
            onClick={handleLogout}
            id="logout_btn"
            className={styles.logout}
          >
            {t("leave")} ({data?.name})
          </span>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbs;
