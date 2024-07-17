require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'})
    }
    else if(error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }
    next(error)
}

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const date = new Date()
    Person.find({}).then(persons => {
        response.send(
            '<p>Phonebook has info for '+persons.length+' people</p>'+
            '<p>'+date.toTimeString()+'</p>'
    
        )
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id).then(person => {
        if(person){
            response.json(person)
        }
        else{
            response.status(404).end()
        }
    })
    .catch(error => {next(error)})
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(person => {
        if(person){
            response.status(204).end()
        }
        else{
            response.status(404).end()
        }
    })
    .catch(error => {next(error)})
})

app.post('/api/persons/', (request, response, next) => {
    const person = request.body
    /*if(!request.body.name || !request.body.number){
        response.status(400).send({error: 'name and number must be filled'}).end()
    }
    else if(persons.find(p => p.name === request.body.name)){
        response.status(400).send({error: 'name must be unique'})
    }
    else{
        const newPerson = new Person({
            name: person.name,
            number: person.number
        })

        newPerson.save().then(person => {
            response.json(person)
        })
    }*/
    const newPerson = new Person({
        name: person.name,
        number: person.number
    })

    newPerson.save().then(person => {
        response.json(person)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const person = request.body

    const updatedPerson = {
        name: person.name,
        number: person.number
    }

    Person.findByIdAndUpdate(request.params.id, updatedPerson, {new: true, runValidators: true, context: 'query'})
        .then(updatedObject => {
            response.json(updatedObject)
        })
        .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => [
    console.log('Server running on 3001 port')
])