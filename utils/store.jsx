import { create } from 'zustand';

export const useSupportStore = create((set) => ({
  supports: [],
  departCollected: [],
  loading: false,

  updateSupports: (value) => {
    set({ supports: value })
  },
  activeLoading: () => {
    set({ loading: true })
  },
  desactiveLoading: () => {
    set({ loading: false })
  },
  updateListDepartCollected: (value) => {
    set({ departCollected: value })
  }
}))

export const useTransfoStore = create((set) => ({
  transfos: [],
  updateTransfoCollected: (value) => {
    set({ transfos: value })
  },
}))

export const useIacmStore = create((set) => ({
  iacms: [],
  updateIacms: (value) => {
    set({ iacms: value })
  },
}))

export const useCCStore = create((set) => ({
  coupesCircuit: [],
  updateCoupesCircuit: (value) => {
    set({ coupesCircuit: value })
  },
}))

export const useAbattage = create((set) => ({
  tab_abattage: [],
  updateAbattage: (value) => {
    set({ tab_abattage: value })
  },
}))
export const useElagage = create((set) => ({
  tab_elagage: [],
  updateElagage: (value) => {
    set({ tab_elagage: value })
  },
}))
export const useMarecage = create((set) => ({
  tab_marecage: [],
  updateMarecage: (value) => {
    set({ tab_marecage: value })
  },
}))
export const useDebroussaillage = create((set) => ({
  tab_debroussaillage: [],
  updateDebroussaillage: (value) => {
    set({ tab_debroussaillage: value })
  },
}))