import { AddAccountModel } from "../../domain/usercases/add-account";
import { AccountModel } from "../../domain/models/account"; 

export interface AddAcccountRepository {
    add(accountData: AddAccountModel): Promise<AccountModel>
}
