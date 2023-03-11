import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post("/users/log-in", "UsersController.login");

  Route.post("/users", "UsersController.create");
});
