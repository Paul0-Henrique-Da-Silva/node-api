import { MongoClient, Collection } from "mongodb";

export const MongoHelper = {
    client: null as MongoClient,

    getCollection (name: string): Collection {
        return this.client.db().collection(name)
    },

    map: (collection: any): any => {
        const { _id, ...accountWithoutId} = collection
        return Object.assign({}, accountWithoutId, {id: _id})
    }
}
