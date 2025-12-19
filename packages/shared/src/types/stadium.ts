export type Stadium =
  | "JAMSIL"
  | "GOCHUK"
  | "SUWON"
  | "INCHEON"
  | "DAEGU"
  | "GWANGJU"
  | "DAEJEON"
  | "BUSAN"
  | "CHANGWON";

export const baseBallStadiumItems: { value: Stadium; label: string }[] = [
  { value: "JAMSIL", label: "잠실종합운동장" },
  { value: "GOCHUK", label: "고척 스카이돔" },
  { value: "SUWON", label: "수원 KT위즈파크" },
  { value: "INCHEON", label: "인천 SSG 랜더스필드" },
  { value: "DAEGU", label: "대구 삼성 라이온즈 파크" },
  { value: "GWANGJU", label: "광주-KIA 챔피언스 필드" },
  { value: "DAEJEON", label: "대전 한화생명이글스파크" },
  { value: "BUSAN", label: "사직야구장" },
  { value: "CHANGWON", label: "창원 NC파크" },
];
