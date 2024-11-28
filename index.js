const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const token = morgan.token('body', function(req, res) {return JSON.stringify(req.body)})

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send(
        `Hello World!`
    )
})

app.get('/info', (request, response) => {
    const num = phonebook.length
    const time = new Date(Date.now())
    response.send(
        `<p>Phonebook has info for ${num} people</p>
        <p>${time}</p>`
    )
})

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook.find((elem) => {return elem.id === id})
    console.log(person)
    if(person){
        return response.json(person)
    }
    response.status(400).json({ 
        error: 'content missing' 
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter(person => person.id !== id)

    response.status(204).end()
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name){
        return response.status(400).json({
            error: 'name missing'
        })
    }
    else if(!body.number){
        return response.status(400).json({
            error: 'number missing'
        })
    }
    else if(findPerson(body)){
        return response.status(400).json({
            error: 'person already exists'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateID(),
    }

    phonebook = phonebook.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


//===============FUNCTIONS================//

const findPerson = (body) => {
    return phonebook.find(person => person.name === body.name)
}

const generateID = () => {
    const maxID = phonebook.length > 0
    ? Math.max(...phonebook.map(n => Number(n.id)))
    : 0
    return String(maxID + 1)
}