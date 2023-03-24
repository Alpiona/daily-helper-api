import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/payments/:paymentId", "PaymentsController.getOne");

  Route.get("/payments", "PaymentsController.getList");

  Route.post("/payments", "PaymentsController.create");

  Route.delete("/payments/:paymentId", "PaymentsController.deleteOne");

  Route.put("/payments/:paymentId", "PaymentsController.update");
}).middleware("auth");
