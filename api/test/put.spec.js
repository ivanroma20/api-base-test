import chai from 'chai';
import chaiHttp from 'chai-http';
import { before } from 'mocha';
import tasksModel from '../models/task'

chai.use(chaiHttp)

const app = require('../app');
const request = chai.request.agent(app); //mantener conexion hasta finalizar todas las prueba
const expect = chai.expect;

describe('put' , () => {
    context('cuando yo altero una tarea' ,() => {

        let task = {
            _id: require('mongoose').Types.ObjectId(),
            title: 'Comprar Fandangos',
            owner: 'ivanbeto@gmail.com',
            done: false
        }

        before((done) => {
            tasksModel.insertMany([task])
            done()
        })

        it('entonces debe retornar 200', (done) => {
            task.title = 'Comprar Baconzitos',
            task.done = true
            request
            .put('/task/' + task._id)
            .send(task)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.eql({})
                done()
                
            })
        })

        it ('y debe retornar los datos actualizados', (done) => {

            request
            .get('/task/' + task._id)
            .send(task)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.data.title).to.eql(task.title)
                expect(res.body.data.done).to.be.true
                done()
                
            })
        })
    })
})