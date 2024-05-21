import { useTranslation } from "react-i18next";
import { lazy, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

import useQueryString from "custom/useQueryString";
import { useNavigateParams } from "custom/useCustomNavigate";
import Loading from "@/components/Loader";
import Suspend from "@/components/Suspend";
import { BtnTypes, ModalTypes, OrderStatus } from "@/utils/types";
import { dateTimeFormat, disableAction, excelBtnId } from "@/utils/helpers";
import Container from "@/components/Container";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { errorToast, successToast } from "@/utils/toast";
import useExpenditure from "@/hooks/useExpenditure";
import expenditureMutation from "@/hooks/mutation/expenditure";
import ProdsTable from "./table";
import DownloadToolsExcel from "@/components/DownloadToolsExcel";

const Modals = lazy(() => import("./modals"));

const ShowForemenOrder = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const modal = Number(useQueryString("modal"));
  const navigateParams = useNavigateParams();
  const { mutate, isPending } = expenditureMutation();
  const handleModal = (modal: ModalTypes) => navigateParams({ modal });

  const {
    data,
    refetch: orderRefetch,
    isLoading: orderLoading,
    isFetching: orderFetching,
  } = useExpenditure({ id });

  const order = data?.items?.[0];

  const handleBack = () => navigate("/foreman-orders");

  const handleOrder = (status: OrderStatus) => {
    mutate(
      {
        id: +id!,
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
            {t("to_handle")}
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
      (!disableAction[order?.status!] || modal === ModalTypes.image)
    )
      return (
        <Suspend>
          <Modals />
        </Suspend>
      );
  }, [order?.status, modal]);

  if (isPending || orderLoading || orderFetching) return <Loading />;

  return (
    <>
      <Container className="overflow-hidden">
        <Header
          title={`${t("order")} №${id}`}
          subTitle={`${t("status")}: ${t(OrderStatus[order?.status!])}`}
        >
          <DownloadToolsExcel />
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
                    <th className="w-1/3">{t("branch")}</th>
                    <td>{order?.branch?.name}</td>
                  </tr>
                  <tr>
                    <th>{t("order_created_date")}</th>
                    <td>
                      {order?.created_at
                        ? dayjs(order?.created_at).format(dateTimeFormat)
                        : t("not_given")}
                    </td>
                  </tr>

                  <tr>
                    <th>{t("foreman")}</th>
                    <td>{order?.client?.name}</td>
                  </tr>

                  <tr>
                    <th>{t("total_summ")}</th>
                    <td>{order?.total_sum ?? 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="w-full">
              <table className="table table-striped table-bordered detail-view">
                <tbody>
                  <tr>
                    <th>{t("status")}</th>
                    <td>{t(OrderStatus[+order?.status!])}</td>
                  </tr>

                  <tr>
                    <th>{t("date_handling")}</th>
                    <td>
                      {order?.updated_at
                        ? dayjs(order?.updated_at).format(dateTimeFormat)
                        : t("not_given")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("author")}</th>
                    <td>
                      {!!order?.user?.name ? order?.user?.name : t("not_given")}
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

          <Header title={"products"}>
            {!disableAction[order?.status!] && (
              <Button
                btnType={BtnTypes.success}
                onClick={() => navigateParams({ modal: ModalTypes.add_prods })}
              >
                {t("add_products")}
              </Button>
            )}
          </Header>
          <ProdsTable />

          {renderBtns}
        </div>
      </Container>
      {renderModal}
    </>
  );
};

export default ShowForemenOrder;
