import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BillCreateService from "App/Services/Bill/BillCreateService";
import BillDeleteService from "App/Services/Bill/BillDeleteService";
import BillGetListService from "App/Services/Bill/BillGetListService";
import BillGetOneService from "App/Services/Bill/BillGetOneService";
import BillUpdateService from "App/Services/Bill/BillUpdateService";

export default class BillController {
  public async create({ request, response, auth }: HttpContextContract) {
    const service = new BillCreateService();

    const input = await request.validate(service.schemaValidator);

    const output = await service.execute({ ...input, userId: auth.user!.id });

    return response.created({ data: output, errors: [] });
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const service = new BillUpdateService();

    const input = await request.validate(service.schemaValidator);

    await service.execute({ ...input, userId: auth.user!.id });

    return response.ok({ data: {}, errors: [] });
  }

  public async getOne({ request, response, auth }: HttpContextContract) {
    const service = new BillGetOneService();

    const input = await request.validate(service.schemaValidator);

    const output = await service.execute({ ...input, userId: auth.user!.id });

    return response.ok({ data: output, errors: [] });
  }

  public async getList({ request, response, auth }: HttpContextContract) {
    const service = new BillGetListService();

    const input = await request.validate(service.schemaValidator);

    const output = await service.execute({ ...input, userId: auth.user!.id });

    return response.ok({ data: output, errors: [] });
  }

  public async delete({ request, response, auth }: HttpContextContract) {
    const service = new BillDeleteService();

    const input = await request.validate(service.schemaValidator);

    const output = await service.execute({ ...input, userId: auth.user!.id });

    return response.ok({ data: output, errors: [] });
  }
}
