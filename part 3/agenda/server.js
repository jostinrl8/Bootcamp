const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date()
    console.log('Este es el tiempo: ', date.toTimeString());

    response.send(
        '<p>Phonebook has info for '+persons.length+' people</p>'+
        '<p>'+date.toTimeString()+'</p>'

    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        persons = persons.filter(p => p.id !== id)
        response.status(204).end()
    }
    else{
        response.status(404).end()
    }
})

app.post('/api/persons/', (request, response) => {
    const id = Math.random(1000)
    const person = request.body

    if(!request.body.name || !request.body.number){
        response.status(400).send({error: 'name and number must be filled'}).end()
    }
    else if(persons.find(p => p.name === request.body.name)){
        response.status(400).send({error: 'name must be unique'})
    }
    else{
        person.id = id

        persons = persons.concat(person)
        
        response.json(person)
    }
})

app.listen(3001, () => [
    console.log('Server running on 3001 port')
])