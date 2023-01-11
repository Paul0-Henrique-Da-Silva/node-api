import request from 'supertest'
import app from '../src/main/config/app'

describe('Body Parser Middleware', () => {
    test('Corpo responde em json', async () => {
        app.post('/test_body_parser', (req, res) => {
            res.send(req.body)
        }) //rota temporaria

        await request(app)
            .post('/test_body_parser')
            .send({ name: 'Paulo'})
            .expect({ name: 'Paulo'})
    })
})