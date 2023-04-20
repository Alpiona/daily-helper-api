import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("/users/log-in", "UsersController.login");

  Route.post("/users", "UsersController.create");

  Route.post("/users/send-reset-password", "UsersController.sendResetPassword");
});

Route.group(() => {
  Route.put("/users/active", "UsersController.active");

  Route.post("/users/reset-password", "UsersController.resetPassword");
}).middleware("auth");
