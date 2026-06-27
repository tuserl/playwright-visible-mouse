class {{ CLASS_NAME }} {

  constructor(ui) {
    this.ui = ui;
    this.page = ui.page;
  }


    async goto() {
    await this.page.goto("/");
  }

}

module.exports = {{ CLASS_NAME }};
