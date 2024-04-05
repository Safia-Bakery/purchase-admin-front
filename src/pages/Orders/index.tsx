import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@/components/Card";
import Pagination from "@/components/Pagination";
import { dateTimeFormat, handleIdx } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import TableViewBtn from "@/components/TableViewBtn";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";

import EmptyList from "@/components/EmptyList";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";
import { BtnTypes, OrderStatus, OrderType } from "@/utils/types";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { useAppSelector } from "@/store/rootConfig";
import { langSelector } from "@/store/reducers/selects";
import useOrders from "@/hooks/useOrders";
import dayjs from "dayjs";

const column = [
  { name: "№", key: "" },
  { name: "order_number", key: "name" },
  { name: "client", key: "name" },
  { name: "category", key: "category" },
  { name: "created_at", key: "created_at" },
  { name: "status", key: "status" },
  { name: "", key: "" },
];

const Orders = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sort, $sort] = useState<OrderType[]>();
  const lang = useAppSelector(langSelector);
  const page = Number(useQueryString("page")) || 1;
  const { data: orders, isLoading } = useOrders({
    page,
  });
  const handleNavigate = (route: string) => navigate(route);

  return (
    <Card>
      <Header title={"orders"}>
        <div className="flex gap-2">
          <Button
            btnType={BtnTypes.primary}
            onClick={() => navigate(-1)}
            className="btn btn-primary btn-fill"
          >
            {t("back")}
          </Button>
        </div>
      </Header>

      <div className="p-4">
        <div className="table-responsive grid-view">
          <ItemsCount data={orders} />
          <table className="table table-hover">
            <TableHead
              column={column}
              onSort={(data) => $sort(data)}
              data={orders?.items}
            />

            <tbody>
              {!!orders?.items?.length &&
                (sort?.length ? sort : orders?.items)?.map((order, idx) => (
                  <tr key={idx} className="bg-blue">
                    <td width="40">{handleIdx(idx)}</td>
                    <td width="80">
                      <Link to={`${order.id}`}>{order.id}</Link>
                    </td>
                    <td>{order?.user?.name}</td>
                    <td>{order?.category?.[`name_${lang}`]}</td>
                    <td>{dayjs(order.created_at).format(dateTimeFormat)}</td>
                    <td>{t(OrderStatus[order?.status])}</td>
                    <td width={40}>
                      <TableViewBtn
                        onClick={() => handleNavigate(order.id.toString())}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {isLoading && <Loading />}

          {!orders?.items?.length && !isLoading && <EmptyList />}
          {!!orders && <Pagination totalPages={orders.pages} />}
        </div>
      </div>
    </Card>
  );
};

export default Orders;
