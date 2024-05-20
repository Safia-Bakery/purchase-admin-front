import { FC, useEffect } from "react";
import Select, { ActionMeta, MultiValue } from "react-select";
import { useState } from "react";
import useDebounce from "custom/useDebounce";
import useToolsSearch from "@/hooks/useToolsSearch";
import { SelectValue } from "@/utils/types";
import "./index.scss";

interface Props {
  origin?: number;
  enabled?: boolean;
  warehouse?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  onChange: (arg: SelectValue) => void;
}

const ToolsSelect: FC<Props> = ({
  enabled,
  placeholder = "",
  autoFocus = false,
  onChange,
}) => {
  const [query, $query] = useDebounce("");

  const { data, isFetching, isLoading } = useToolsSearch({
    enabled,
    ...(!!query && { name: query }),
  });

  const [items, $items] = useState<SelectValue[]>([]);

  const handleChange = (_: any, actionMeta: ActionMeta<SelectValue>) =>
    actionMeta.option && onChange(actionMeta.option);

  useEffect(() => {
    if (data?.items?.length)
      $items((prev) => [
        ...prev,
        ...data.items.map((item) => {
          return {
            value: item.id,
            label: item.name,
            count: 1,
          };
        }),
      ]);
    if (!!query && data?.items)
      $items(
        data.items.map((item) => {
          return {
            value: item.id,
            label: item.name,
            count: 1,
          };
        })
      );
  }, [data?.items, query]);

  return (
    <Select
      options={items}
      isLoading={isFetching || isLoading}
      isMulti
      onChange={handleChange}
      className="z-50 branch-select"
      onInputChange={(e) => $query(e)}
      isClearable
      backspaceRemovesValue={false}
      autoFocus={autoFocus}
      placeholder={placeholder}
    />
  );
};

export default ToolsSelect;
