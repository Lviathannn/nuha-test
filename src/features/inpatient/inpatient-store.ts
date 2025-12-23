import dayjs from "dayjs";
import { create } from "zustand";

type TInpatientStates = {
  filter: {
    search?: string;
    sort?: "name" | "admissionDate";
    startDate: string;
    endDate: string;
  };
};

type TInpatientActions = {
  setSearch: (search: string) => void;
  setSort: (sort: "name" | "admissionDate") => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  resetFilter: () => void;
};

type TInpatientStore = {
  states: TInpatientStates;
  actions: TInpatientActions;
};

export const useInpatientStore = create<TInpatientStore>((set) => ({
  states: {
    filter: {
      search: "",
      sort: "name",
      startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
      endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    },
  },
  actions: {
    setSearch: (search: string) =>
      set((state) => ({
        states: {
          ...state.states,
          filter: { ...state.states.filter, search },
        },
      })),
    setSort: (sort: "name" | "admissionDate") =>
      set((state) => ({
        states: {
          ...state.states,
          filter: { ...state.states.filter, sort },
        },
      })),
    setStartDate: (startDate: string) =>
      set((state) => ({
        states: {
          ...state.states,
          filter: { ...state.states.filter, startDate },
        },
      })),
    setEndDate: (endDate: string) =>
      set((state) => ({
        states: {
          ...state.states,
          filter: { ...state.states.filter, endDate },
        },
      })),
    resetFilter: () =>
      set((state) => ({
        states: {
          ...state.states,
          filter: {
            search: "",
            sort: undefined,
            startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
            endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
          },
        },
      })),
  },
}));
