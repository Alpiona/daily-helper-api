import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import PaymentCreateService from "App/Services/Payment/PaymentCreateService";
import PaymentGetListService from "App/Services/Payment/PaymentGetListService";
import PaymentGetOneService from "App/Services/Payment/PaymentGetOneService";
import PaymentUpdateService from "App/Services/Payment/PaymentUpdateService";

export default class PaymentController {
  public async create({ request, response, auth }: HttpContextContract) {
    const service = new PaymentCreateService();

    const input = await request.validate(service.schemaValidator);

    const output = await service.execute({ ...input, userId: auth.user!.id });

    return response.created(output);
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const service = new PaymentUpdateService();

    const input = await request.validate(service.schemaValidator);

    await service.execute({ ...input, userId: auth.user!.id });

    return response;
  }

  public async getOne({ request, response, auth }: HttpContextContract) {
    const service = new PaymentGetOneService();

    const input = await request.validate(service.schemaValidator);

    const output = await service.execute({ ...input, userId: auth.user!.id });

    return response.ok({ data: output });
  }

  public async getList({ request, response, auth }: HttpContextContract) {
    const service = new PaymentGetListService();

    const input = await request.validate(service.schemaValidator);

    const output = await service.execute({ ...input, userId: auth.user!.id });

    return response.ok({ data: output });
  }
}
