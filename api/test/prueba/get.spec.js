
import chai from 'chai';
import chaiHttp from 'chai-http';
import { before } from 'mocha';
import tasksModel from '../../models/task'

chai.use(chaiHttp)

const app = require('../../app');
const request = chai.request.agent(app); //mantener conexion hasta finalizar todas las prueba
const expect = chai.expect;

describe('prueba', () => {

    // before((done) => {
    //     tasksModel.deleteMany({});
    //     done();
    // })

    before((done) => {
        let tasks = [
            { title: 'Tarea1', owner: 'eu@papito.io', done: false },
            { title: 'prueba', owner: 'eu@papito.io', done: false },
            { title: 'Tarea2', owner: 'eu@papito.io', done: true }
        ]

        tasksModel.insertMany(tasks);
        done();
    })

    context('cuando yo tengo tareas registradas', () => {
        it('debe retornar una lista', (done) => {
            request
                .get('/task')
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    console.log(typeof res.body.data);
                    expect(res.body.data).to.be.an('array');
                    done();
                })
        })

        it('debe filtrar por palabra clave', (done) => {
            request
                .get('/task')
                .query({ title: 'Tarea' })
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    console.log(typeof res.body.data);
                    expect(res.body.data[0].title).to.equal('Tarea1')
                    expect(res.body.data[1].title).to.equal('Tarea2')
                    done();
                })
        })

    })

    context('cuando busco por id', ()=> {

        it('debe retornar una unica tarifa', (done) => {
            let tasks = [
                { title: 'colaborar con open source', owner: 'eu@papito.io', done: false },
            ]
    
            tasksModel.insertMany(tasks, (err, result) => {
                let id = result[0]._id
                request
                    .get('/task/' + id)
                    .end((err, res) => {
                        expect(res).to.has.status(200);
                        expect(res.body.data.title).to.equal(tasks[0].title)
                        done();
                    })
            });
        })
    })


    context('cuando una tarifa no existe', ()=> {

        it('debe retornar 404', (done) => {
            let id = require('mongoose').Types.ObjectId();
            request
            .get('/task/' + id)
            .end((err, res) => {
                expect(res).to.has.status(404);
                expect(res.body).to.eql({}) // eql compara valores sin importar el tipo
                done();
            })
            
        })
    })

})