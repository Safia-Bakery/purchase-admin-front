import useQueryString from "@/hooks/custom/useQueryString";
import { QueryClient } from "@tanstack/react-query";
import { FileType } from "./types";

export enum EPresetTimes {
  SECOND = 1000,
  MINUTE = SECOND * 60,
  HOUR = MINUTE * 60,
  DAY = HOUR * 24,
  WEEK = DAY * 7,
  TEN_DAYS = DAY * 10,
}
export const itemsPerPage = 50;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      gcTime: EPresetTimes.MINUTE * 10,
      staleTime: EPresetTimes.SECOND * 10,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  },
});

export const handleIdx = (index: number) => {
  const currentPage = Number(useQueryString("page")) || 1;
  if (currentPage === 1) return index + 1;
  else return index + 1 + itemsPerPage * (currentPage - 1);
};

export const isMobile = window.innerWidth <= 960;

export const dateTimeFormat = "DD.MM.YYYY HH:mm";
export const dateMonthYear = "DD.MM.YYYY";
export const yearMonthDate = "YYYY-MM-DD";

export const StatusName = [
  { name_ru: "Активный", name_uz: "Faol", id: 1 },
  { name_ru: "Не активный", name_uz: "faoliyatsiz", id: 0 },
];

export const detectFileType = (url: string) => {
  const extension = url.split(".").pop()?.toLowerCase();
  const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "heic",
    "img",
    "tiff",
    "svg",
  ];
  const videoExtensions = ["mp4", "avi", "mkv", "mov", "webm"];

  if (extension && imageExtensions.includes(extension)) {
    return FileType.photo;
  } else if (extension && videoExtensions.includes(extension)) {
    return FileType.video;
  } else {
    return FileType.other;
  }
};
type CancelReasonType = {
  [key: number]: string;
};
export const CancelReason: CancelReasonType = {
  1: "incorrect_request",
  2: "re_application",
  3: "test_request",
  4: "other",
};
export const RoleObj: { [key: string]: string } = {
  "1": "manufacturer",
  "2": "distributor",
  "3": "importer",
  "4": "other",
};
