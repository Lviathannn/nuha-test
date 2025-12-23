export const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

export const parseRupiah = (value: string | number) => {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed = parseInt(value.replace(/[^0-9]/g, ""), 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

export const formatNumberWithUnit = (value: number) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(value % 1000000000 === 0 ? 0 : 1)}M`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}jt`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}rb`;
  }
  return `${value}`;
};
