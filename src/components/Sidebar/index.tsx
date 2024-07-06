import { NavLink, useLocation, useNavigate } from "react-router-dom";
import cl from "classnames";
import { logoutHandler } from "reducers/auth";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store/rootConfig";
import { isMobile } from "@/utils/helpers";
import { sidebarHandler, toggleSidebar } from "@/store/reducers/selects";

import { Fragment, useState } from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  MenuItemStyles,
} from "react-pro-sidebar";
import "./index.scss";
import { MainPermissions } from "@/utils/types";
import useToken from "@/hooks/useToken";

const routes = [
  {
    name: "orders",
    url: "/orders",
    icon: "/icons/chat.svg",
    permission: MainPermissions.orders,
  },
  {
    name: "categories",
    url: "/categories",
    param: "",
    icon: "/icons/categories.svg",
    permission: MainPermissions.categories,
  },
  {
    name: "roles",
    url: "/roles",
    permission: MainPermissions.roles,
    icon: "/icons/roles.svg",
  },
  {
    name: "users",
    url: "/users",
    permission: MainPermissions.users,
    icon: "/icons/users.svg",
  },
  {
    name: "building",
    icon: "/icons/building.svg",
    subroutes: [
      {
        name: "orders",
        permission: MainPermissions.foremanOrders,
        url: "/foreman-orders",
        icon: "/icons/orders.svg",
      },
      {
        name: "buildingMaterial",
        url: "/building-materials",
        icon: "/icons/buildingMaterials.svg",
        permission: MainPermissions.buildingMaterials,
      },
      {
        name: "foremen",
        url: "/foremen",
        icon: "/icons/foreman.svg",
        permission: MainPermissions.foremanOrders,
      },
    ],
  },
];

const menuItemStyles: MenuItemStyles = {
  root: {
    fontSize: "13px",
    fontWeight: 400,
  },
  SubMenuExpandIcon: {
    color: "#b6b7b9",
  },
  label: ({ open }) => ({
    fontWeight: open ? 600 : undefined,
  }),
};

const CustomSidebar = () => {
  const { t } = useTranslation();
  const collapsed = useAppSelector(toggleSidebar);
  const { data: me } = useToken({});
  const dispatch = useAppDispatch();
  const handleOverlay = () => dispatch(sidebarHandler(!collapsed));
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuItem, $menuItem] = useState<string>();

  const toggleSubItems = (item: string) =>
    $menuItem(item === menuItem ? undefined : item);

  return (
    <>
      {collapsed && <div className={styles.overlay} onClick={handleOverlay} />}
      <Sidebar
        // collapsed={collapsed}
        className={cl(styles.sidebar, { [styles.collapsed]: collapsed })}
        toggled={collapsed}
        onBackdropClick={handleOverlay}
        image="https://user-images.githubusercontent.com/25878302/144499035-2911184c-76d3-4611-86e7-bc4e8ff84ff5.jpg"
        rtl={false}
        breakPoint="md"
        backgroundColor={"rgba(68, 125, 247, 0.8)"}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className={`${styles.link}`}>
              <img src={"/icons/logo.svg"} className={styles.logo} />
              <div className="w-full h-[80px] flex items-center">
                <img
                  height={50}
                  width={50}
                  src={"/icons/logoTitle.svg"}
                  className={styles.logo1}
                />
              </div>
              {/* <h3 className={styles.subTitle}>{t("purchase")}</h3> */}
            </div>
            <Menu menuItemStyles={menuItemStyles}>
              {routes &&
                routes.map((route) => (
                  <Fragment key={route.url + route.name}>
                    {!!route.subroutes &&
                    route.subroutes.some(
                      (subroute) => me?.permissions?.[subroute.permission]
                    ) ? (
                      <SubMenu
                        open={route.name === menuItem}
                        onClick={() => toggleSubItems(route.name)}
                        label={t(route.name)}
                        className={`${styles.content} ${styles.submenu}`}
                        icon={
                          <img
                            className={styles.routeIcon}
                            height={30}
                            width={30}
                            src={route.icon || ""}
                          />
                        }
                      >
                        {route?.subroutes?.map(
                          (subroute) =>
                            me?.permissions?.[subroute.permission!] && (
                              <MenuItem
                                onClick={() => navigate(`${subroute.url}`)}
                                icon={
                                  <img
                                    className={styles.routeIcon}
                                    height={30}
                                    width={30}
                                    src={subroute.icon || ""}
                                  />
                                }
                                active={pathname.includes(subroute.url!)}
                                className={styles.content}
                                key={subroute.url}
                              >
                                {t(subroute.name)}
                              </MenuItem>
                            )
                        )}
                      </SubMenu>
                    ) : (
                      me?.permissions?.[route.permission!] && (
                        <MenuItem
                          className={cl(styles.content)}
                          active={pathname.includes(route.url!)}
                          onClick={() =>
                            navigate(
                              `${route.url}${
                                !!route?.param ? route?.param : ""
                              }`
                            )
                          }
                          icon={
                            <img
                              className={styles.routeIcon}
                              height={30}
                              width={30}
                              src={route.icon || ""}
                            />
                          }
                        >
                          {t(route.name)}
                        </MenuItem>
                      )
                    )}
                  </Fragment>
                ))}
            </Menu>
          </div>
        </div>
      </Sidebar>
    </>
  );
};
export default CustomSidebar;
