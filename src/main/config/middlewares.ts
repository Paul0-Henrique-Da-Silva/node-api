import { Express } from 'express'
import { boryParser } from '../midlewares/body-parser'
import { contentType } from '../midlewares/content-type'
import { cors } from '../midlewares/cors'

export default (app: Express): void  => {
    app.use(boryParser)
    app.use(cors)
    app.use(contentType)
}