import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/bills/:billId", "BillsController.getOne");

  Route.get("/bills", "BillsController.getList");

  Route.post("/bills", "BillsController.create");

  Route.delete("/bills/:billId", "BillsController.delete");

  Route.put("/bills/:billId", "BillsController.update");
}).middleware("auth");
