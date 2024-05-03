import cl from "classnames";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Modal from "@/components/Modal";
import { FileType, ModalTypes, OrderStatus } from "@/utils/types";
import BaseInput from "@/components/BaseInputs";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import { CancelReason, detectFileType } from "@/utils/helpers";
import MainSelect from "@/components/BaseInputs/MainSelect";
import { errorToast, successToast } from "@/utils/toast";
import useOrder from "@/hooks/useOrders";
import useQueryString from "custom/useQueryString";
import { useRemoveParams } from "custom/useCustomNavigate";
import Loading from "@/components/Loader";
import orderMutation from "@/hooks/mutation/orders";
import Header from "@/components/Header";
import Button from "@/components/Button";
import expenditureMutation from "@/hooks/mutation/expenditure";
import useExpenditure from "@/hooks/useExpenditure";

const Modals = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const modal = useQueryString("modal");
  const removeParams = useRemoveParams();
  const { register, getValues, watch, handleSubmit } = useForm();

  const { mutate: attach } = expenditureMutation();

  const closeModal = () => removeParams(["modal"]);

  const { refetch: orderRefetch, isFetching: orderFetching } = useExpenditure({
    id: id,
  });

  const handleRequest =
    ({ status }: { status: OrderStatus }) =>
    () => {
      const { fixedReason, cancel_reason } = getValues();
      attach(
        {
          id: Number(id),
          status,
          ...(status === OrderStatus.denied && {
            deny_reason:
              fixedReason < 4 ? t(CancelReason[fixedReason]) : cancel_reason,
          }),
        },
        {
          onSuccess: () => {
            orderRefetch();
            successToast("assigned");
          },
          onError: (e) => errorToast(e.message),
        }
      );
      closeModal();
    };

  const renderModal = () => {
    switch (Number(modal)) {
      case ModalTypes.deny_reason:
        return (
          <form
            onSubmit={handleSubmit(
              handleRequest({ status: OrderStatus.denied })
            )}
          >
            <Header title="deny_reason">
              <button onClick={closeModal}>
                <span aria-hidden="true">&times;</span>
              </button>
            </Header>
            <div className="p-3">
              <BaseInput label="select_reason">
                <MainSelect
                  register={register("fixedReason", {
                    required: t("required_field"),
                  })}
                >
                  <option value={undefined} />

                  {Object.keys(CancelReason).map((item) => (
                    <option key={item} value={item}>
                      {t(CancelReason[+item])}
                    </option>
                  ))}
                </MainSelect>
              </BaseInput>

              {watch("fixedReason") == 4 && (
                <BaseInput label="comments">
                  <MainTextArea register={register("cancel_reason")} />
                </BaseInput>
              )}

              <Button className="btn btn-success w-full" type="submit">
                {t("send")}
              </Button>
            </div>
          </form>
        );
      // case ModalTypes.image:
      //   return (
      //     <div className={"relative"}>
      //       <button
      //         onClick={() => removeParams(["modal", "photo"])}
      //         className={cl(
      //           "absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center border border-white"
      //         )}
      //       >
      //         <span aria-hidden="true">&times;</span>
      //       </button>
      //       <Link to={photo || ""} target="_blank" rel="noopener noreferrer">
      //         {photo && detectFileType(photo) === FileType.photo ? (
      //           <img
      //             src={photo}
      //             className={"max-h-[80vh] max-w-[80vw] block h-full"}
      //             alt="uploaded-file"
      //           />
      //         ) : (
      //           <video
      //             src={photo || ""}
      //             className={"max-h-[80vh] max-w-[80vw] block h-full"}
      //             controls
      //           />
      //         )}
      //       </Link>
      //     </div>
      //   );

      default:
        return;
    }
  };

  if (orderFetching) return <Loading />;

  return (
    <Modal
      onClose={() => removeParams(["modal"])}
      isOpen={!!modal}
      className={cl("!h-[400px] w-min p-1 overflow-y-auto")}
    >
      {renderModal()}
    </Modal>
  );
};

export default Modals;
