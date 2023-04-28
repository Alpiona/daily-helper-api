import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("/users/log-in", "UsersController.login");

  Route.post("/users", "UsersController.create");

  Route.post(
    "/users/send-reset-password",
    "UsersController.sendResetPasswordEmail"
  );
});

Route.group(() => {
  Route.patch("/users/activate", "UsersController.activate");

  Route.post("/users/reset-password", "UsersController.resetPassword");
}).middleware("auth");
