import AdminDataService from "../adminDataService";

export default {
  toggleSponsorPaid({ state, commit }, sponsor) {
    let svc = new AdminDataService(state.currentCamp.moniker);
    commit("setBusy");
    return svc.togglePaid(sponsor)
      .then(res => {
        if (res.data) commit("setSponsorIsPaid", { sponsor, value: !sponsor.paid });
      })
      .catch(() => commit("setError", "Failed to toggle isPaid"))
      .finally(() => commit("clearBusy"));
  },
  addSponsor({ state, commit }, sponsor) {
    let svc = new AdminDataService(state.currentCamp.moniker);
    commit("setBusy");
    return svc.saveSponsor(sponsor)
      .then(() => commit("addSponsor", sponsor))
      .catch(() => commit("setError", "Failed to save sponsor"))
      .finally(() => commit("clearBusy"));
  },
  deleteSponsor({ state, commit }, sponsor) {
    let svc = new AdminDataService(state.currentCamp.moniker);
    commit("setBusy");
    return svc.deleteSponsor(sponsor)
      .then(() => commit("deleteSponsor", sponsor))
      .catch(() => commit("setError", "Failed to delete sponsor"))
      .finally(() => commit("clearBusy"));
  }

}