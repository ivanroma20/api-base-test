
import chai from 'chai';
import chaiHttp from 'chai-http';
import tasksModel from '../models/task'

chai.use(chaiHttp)

const app = require('../app');
const request = chai.request.agent(app); //mantener conexion hasta finalizar todas las prueba
const expect = chai.expect;

describe('delete', () => {


    context('cuando elimino una tarea', () => {
        let task = {
            _id: require('mongoose').Types.ObjectId(),
            title: 'Pagar cuenta de celular',
            owner: 'ivanbeto@gmail.com',
            done: false
        }

        before((done) => {
            tasksModel.insertMany([task], (error, docs) => {
                request
                    .delete('/task/' + task._id)
                    .end((err, res) => {
                        expect(res).to.have.status(200)
                        expect(res.body).to.eql({})
                        done()
                    })
            })

        })

        it('entonces debe retornar 404', (done) => {
            request
            .get('/task/' + task._id)
            .end((err, res) => {
                expect(res).to.have.status(404)
                done()
            })
        })
    })

    context('cuando la tarea no existe', () => {
        it('debe retornar 404', (done) => {
            let id = require('mongoose').Types.ObjectId();
            request
                .delete('/task/' + id)
                .end((err, res) => {
                    expect(res).to.have.status(404)
                    expect(res.body).to.eql({})
                    done()
                })
        })
    })

})