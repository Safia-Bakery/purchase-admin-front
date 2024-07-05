import { useTranslation } from "react-i18next";
import { lazy, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

import useQueryString from "custom/useQueryString";
import { useNavigateParams } from "custom/useCustomNavigate";
import Loading from "@/components/Loader";
import Suspend from "@/components/Suspend";
import { BtnTypes, FileType, ModalTypes, OrderStatus } from "@/utils/types";
import orderMutation from "@/hooks/mutation/orders";
import { RoleObj, dateTimeFormat, detectFileType } from "@/utils/helpers";
import Container from "@/components/Container";
import Header from "@/components/Header";
import { useAppSelector } from "@/store/rootConfig";
import { langSelector } from "@/store/reducers/selects";
import Button from "@/components/Button";
import { errorToast, successToast } from "@/utils/toast";
import { baseURL } from "@/api/baseApi";
import useOrder from "@/hooks/useOrder";

const Modals = lazy(() => import("./modals"));

const ShowRequestApc = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const lang = useAppSelector(langSelector);
  const navigate = useNavigate();
  const modal = Number(useQueryString("modal"));
  const navigateParams = useNavigateParams();
  const { mutate, isPending } = orderMutation();
  const handleModal = (modal: ModalTypes) => navigateParams({ modal });

  const {
    data: order,
    refetch: orderRefetch,
    isLoading: orderLoading,
    isFetching: orderFetching,
  } = useOrder({ id: Number(id) });

  const handleBack = () => navigate("/orders");

  const handleShowPhoto = (file: string) => () => {
    return detectFileType(file) === FileType.other
      ? window.open(`${baseURL}/${file}`)
      : navigateParams({
          modal: ModalTypes.image,
          photo: `${baseURL}/${file}`,
        });
  };

  const handleOrder = (status: OrderStatus) => {
    mutate(
      {
        id: id!,
        status,
      },
      {
        onSuccess: () => {
          orderRefetch();
          successToast("success");
        },

        onError: (e) => errorToast(e.message),
      }
    );
  };

  const renderBtns = useMemo(() => {
    return (
      <div className="float-end mt-4 flex gap-4">
        {order?.status! < OrderStatus.done && (
          <Button
            onClick={() => handleModal(ModalTypes.deny_reason)}
            btnType={BtnTypes.danger}
          >
            {t("deny")}
          </Button>
        )}
        {order?.status! === OrderStatus.new && (
          <Button
            onClick={() => handleOrder(OrderStatus.received)}
            className="btn btn-danger"
          >
            {t("receive")}
          </Button>
        )}

        {order?.status! >= OrderStatus.received &&
          order?.status! < OrderStatus.done && (
            <Button
              onClick={() => handleOrder(OrderStatus.done)}
              className="btn btn-success"
            >
              {t("finish")}
            </Button>
          )}
      </div>
    );
  }, [order?.status]);

  const renderModal = useMemo(() => {
    if (
      !!order?.status.toString() &&
      (order?.status < OrderStatus.done || modal === ModalTypes.image)
    )
      return (
        <Suspend>
          <Modals />
        </Suspend>
      );
  }, [order?.status, modal]);

  if (isPending || isPending || orderLoading || orderFetching)
    return <Loading />;

  return (
    <>
      <Container className="overflow-hidden">
        <Header
          title={`${t("order")} №${id}`}
          subTitle={`${t("status")}: ${t(OrderStatus[order?.status!])}`}
        >
          <Button
            onClick={handleBack}
            btnType={BtnTypes.primary}
            className="ml-2"
          >
            {t("back")}
          </Button>
        </Header>
        <div className="mt-4">
          <div className="flex gap-6 mb-4">
            <div className="w-full">
              <table className="table">
                <tbody>
                  <tr>
                    <th className="w-1/3">{t("client_name")}</th>
                    <td>{order?.user?.name}</td>
                  </tr>
                  <tr>
                    <th>{t("phone_number")}</th>
                    <td>
                      <Link to={`tel:+${order?.user?.phone}`}>
                        +{order?.user?.phone}
                      </Link>
                    </td>
                  </tr>

                  <tr>
                    <th>{t("jur_addr")}</th>
                    <td>{order?.user?.address}</td>
                  </tr>

                  <tr>
                    <th>{t("name_company")}</th>
                    <td>{order?.user?.company_name}</td>
                  </tr>

                  <tr>
                    <th>{t("inn")}</th>
                    <td>{order?.user?.inn}</td>
                  </tr>
                  {order?.role && (
                    <tr>
                      <th>{t("role")}</th>
                      <td>{t(RoleObj[order?.role])}</td>
                    </tr>
                  )}
                  <tr>
                    <th>{t("email")}</th>
                    <td>
                      <Link to={`mailto:${order?.user?.email}`}>
                        {order?.user?.email}
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="w-full">
              <table
                id="w1"
                className="table table-striped table-bordered detail-view"
              >
                <tbody>
                  <tr>
                    <th>{t("brand")}</th>
                    <td>{order?.brend}</td>
                  </tr>
                  <tr>
                    <th>{t("group_problem")}</th>
                    <td>{order?.category?.[`name_${lang}`]}</td>
                  </tr>
                  <tr>
                    <th>{t("productt")}</th>
                    <td>{order?.product}</td>
                  </tr>
                  <tr>
                    <th className="w-1/3">{t("is_worked")}</th>
                    <td>{!order?.safia_worker ? t("no") : t("yes")}</td>
                  </tr>

                  <tr>
                    <th>{t("uploaded_images")}</th>
                    <td>
                      <div className="flex flex-col w-max">
                        {!!order?.product_images?.length
                          ? order?.product_images.map((file) => (
                              <button
                                key={file.id}
                                className="text-blue-500"
                                onClick={handleShowPhoto(file.url)}
                              >
                                {t("file")}
                              </button>
                            ))
                          : t("not_given")}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <th>{t("certificates")}</th>
                    <td>
                      <div className="flex flex-col w-max">
                        {!!order?.sertificates?.length
                          ? order?.sertificates.map((file) => (
                              <button
                                key={file.id}
                                className="text-blue-500"
                                onClick={handleShowPhoto(file.url)}
                              >
                                {t("file")}
                              </button>
                            ))
                          : t("not_given")}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>{t("commertial_reqs")}</th>
                    <td>
                      <div className="flex flex-col w-max">
                        {order?.brochures
                          ? order?.brochures.map((file) => (
                              <button
                                key={file.id}
                                className="text-blue-500"
                                onClick={handleShowPhoto(file.url)}
                              >
                                {t("file")}
                              </button>
                            ))
                          : t("not_given")}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <th>{t("receipt_date")}</th>
                    <td>
                      {order?.created_at
                        ? dayjs(order?.created_at).format(dateTimeFormat)
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("updated_at")}</th>
                    <td>
                      {order?.updated_at
                        ? dayjs(order?.updated_at).format(dateTimeFormat)
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("responsible")}</th>
                    <td>
                      <div className="flex items-center justify-between">
                        <span>
                          {order?.purchaser?.[0]?.user?.name || t("not_given")}
                        </span>
                        {order?.status! < OrderStatus.done && (
                          <Button
                            btnType={BtnTypes.success}
                            onClick={() => handleModal(ModalTypes.assign)}
                          >
                            {t("assign")}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {order?.deny_reason && (
                    <tr>
                      <th>{t("deny_reason")}</th>
                      <td>{order?.deny_reason}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <hr />
          {renderBtns}
        </div>
      </Container>
      {renderModal}
    </>
  );
};

export default ShowRequestApc;
