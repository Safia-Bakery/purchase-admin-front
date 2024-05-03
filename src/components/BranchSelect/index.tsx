import { FC, useEffect } from "react";
import Select, { SingleValue } from "react-select";
import { useState } from "react";
import useDebounce from "custom/useDebounce";
import { useNavigateParams } from "custom/useCustomNavigate";
import useBranches from "@/hooks/useBranches";

interface Props {
  origin?: number;
  enabled?: boolean;
  warehouse?: boolean;
  placeholdeer?: string;
  autoFocus?: boolean;
}

interface SelectValue {
  value: number;
  label: string;
}

const BranchSelect: FC<Props> = ({
  enabled,
  placeholdeer = "",
  autoFocus = false,
}) => {
  const navigate = useNavigateParams();
  const [query, $query] = useDebounce("");

  const { data, isFetching, isLoading } = useBranches({
    enabled,
    ...(!!query && { name: query }),
  });

  const [items, $items] = useState<SelectValue[]>([]);

  const handleChange = (e: SingleValue<SelectValue>) => {
    navigate({ branch: JSON.stringify({ id: e?.value, name: e?.label }) });
  };

  useEffect(() => {
    if (data?.items?.length)
      $items((prev) => [
        ...prev,
        ...data.items.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        }),
      ]);
    if (!!query && data?.items)
      $items(
        data.items.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        })
      );
  }, [data?.items, query]);

  return (
    <Select
      options={items}
      isLoading={isFetching || isLoading}
      onChange={handleChange}
      className="z-50 branch-select"
      onInputChange={(e) => $query(e)}
      isClearable
      autoFocus={autoFocus}
      placeholder={placeholdeer}
    />
  );
};

export default BranchSelect;
