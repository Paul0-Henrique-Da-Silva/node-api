import { Express } from 'express'
import { boryParser } from '../midlewares/body-parser'

export default (app: Express): void  => {
    app.use(boryParser)
}