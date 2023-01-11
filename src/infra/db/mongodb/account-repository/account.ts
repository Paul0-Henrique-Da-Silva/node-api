import { AddAcccountRepository } from "../../../../data/protocols/add-acccount-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usercases/add-account";
import { MongoHelper } from "../mongo-helper/mongo-helper";

export class AccountMongoRepository  implements AddAcccountRepository {
   async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollerction = MongoHelper.getCollection('accounts')
    const result = await accountCollerction.insertOne(accountData)
    // findbyid()
    return MongoHelper.map()
}
}