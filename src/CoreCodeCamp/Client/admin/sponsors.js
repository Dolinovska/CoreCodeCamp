// External JS Libraries
import Vue from "vue";
const $ = require("jquery");
import mount from "../common/mount";
import dataService from "../common/dataService";
import imageUploadService from "../common/imageUploadService";

let theView = {
  data: {
    busy: true,
    sponsors: [],
    currentSponsor: null,
    errorMessage: "",
    userMessage: "",
    imageError: ""
  },
  computed: {
    validImage: function () {
      return (this.currentSponsor && this.currentSponsor.imageUrl && this.currentSponsor.imageUrl.length > 0) ? true : false;
    },
    isPristine: function () {
      return
    }
  },
  methods: {
    onTogglePaid(sponsor) {
      this.busy = true;
      dataService.togglePaid(sponsor)
        .then(() => sponsor.paid = !sponsor.paid, () => this.errorMessage = "Could not toggle paid")
        .finally(() => this.busy = false);
    },
    onEdit(sponsor) {
      this.currentSponsor = sponsor;
      this.$validator.validateAll();
    },
    onDelete(sponsor) {
      this.busy = true;
      dataService.deleteSponsor(sponsor)
        .then(() => this.sponsors.splice(this.sponsors.indexOf(sponsor), 1), () => this.errorMessage = "Could not delete sponsor")
        .finally(() => this.busy = false);
    },
    onNew() {
      this.currentSponsor = {};
      this.$validator.validateAll();
    },
    onSave() {

      var old = this.sponsors.indexOf(this.currentSponsor);
      if (old > -1) this.sponsors.splice(this.sponsors.indexOf(this.currentSponsor), 1);
      this.busy = true;

      dataService.saveSponsor(this.currentSponsor)
        .then(res => {
          this.sponsors.push(res.data);
          this.currentSponsor = null;
        }, () => this.errorMessage = "Could not save sponsor")
        .finally(() => this.busy = false);
    },
    onCancel() {
      this.currentSponsor = null;
    },
    onImagePicked(filePicker) {
      this.busy = true;
      let file = $("#thePicker")[0].files[0];
      imageUploadService.uploadSponsor(file)
        .then((imageUrl) => {
          Vue.set(this.currentSponsor, "imageUrl", imageUrl);
        }, (e) => this.errorMessage = "Failed to upload Image")
        .finally(() => this.busy = false);
    },
    onShowPicker() {
      $("#thePicker").click();
    }
  },
  mounted() {
    dataService.getSponsors()
      .then(result => {
        this.sponsors = result.data;
        this.currentSponsor = null;
      }, () => this.errorMessage = "Failed to load data")
      .finally(() => this.busy = false);

  }
};

mount(theView, "#sponsors-view");
