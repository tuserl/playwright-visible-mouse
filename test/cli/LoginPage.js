class LoginPage {

  constructor(ui) {
    this.ui = ui;
    this.page = ui.page;
  }


  async goto() {
    await this.page.goto("/login");
  }


  username() {
    return this.ui.field("Username");
  }


  password() {
    return this.ui.field("Password");
  }


  loginButton() {
    return this.ui.btn("Login");
  }


  async login(user, pass) {
    await this.username().fill(user);
    await this.password().fill(pass);
    await this.loginButton().click();
  }

}

module.exports = LoginPage;
