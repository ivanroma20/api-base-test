import chai from 'chai';
import chaiHttp from 'chai-http';
import tasksModel from '../models/task'

chai.use(chaiHttp)

const app = require('../app');
const request = chai.request.agent(app); //mantener conexion hasta finalizar todas las prueba
const expect = chai.expect;
const rabbit = chai.request('http://rabbitmq:15672')

describe('post', () => {

    context('cuando yo registro una tarifa', () => {

        let task = { title: 'Estudiar Mongoose', owner: 'ivanbeto@gmail.com', done: false }

        before((done) => {
            rabbit
                .delete('/api/queues/%2F/tasksdev/contents')
                .auth('guest', 'guest')
                .end((err, res) => {
                    expect(res).to.have.status(204) //success sin content in body
                    done()
                })
        })

        it('entonces debo retornar 200', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body.data.title).to.be.an('string')
                    expect(res.body.data.owner).to.be.an('string')
                    expect(res.body.data.done).to.be.an('boolean')
                    done()
                })
        })

        it('entonces debe enviar un email', (done) => {

            let payload = {
                vhost: "/",
                name: "tasksdev",
                truncate: "50000",
                ackmode: "ack_requeue_true",
                encoding: "auto",
                count: "1"
            }

            rabbit
                .post('/api/queues/%2F/tasksdev/get')
                .auth('guest', 'guest')
                .send(payload)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body[0].payload).to.contain(`Tarefa ${task.title} criada com sucesso!`)
                    done()
                })
        })
    })

    context('cuando no informo un título', () => {
        let task = { title: '', owner: 'ivanbeto@gmail.com', done: false }

        it('entonces debo retornar 400', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(400);
                    expect(res.body.errors.title.message).to.eql('Oops! Title is required.')
                    done()
                })
        })
    })

    context('cuando no informo un dueño', () => {
        let task = { title: '', owner: '', done: false }

        it('entonces debo retornar 400', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(400);
                    expect(res.body.errors.owner.message).to.eql('Oops! Owner is required.')
                    done()
                })
        })
    })

    context('cuando una tarea ya existe', () => {

        let task = { title: 'PLanear viaje a china', owner: 'ivanbeto@gmail.com', done: false }

        before((done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    done()
                })
        })

        it('debe retornar 409', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(409);
                    expect(res.body.errmsg).to.include('duplicate key')
                    done()
                })
        })
    })
})