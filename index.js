const express = require('express')
const { v4: uuidv4 } = require('uuid')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))



app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}))

let persons = [
    {
        "id": uuidv4(),
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": uuidv4(),
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": uuidv4(),
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": uuidv4(),
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    let id = req.params.id
    let person = persons.find(person => person.id === id)
    if (!person) {
        res.status(404).json({
            error: `nobody found with id ${id}`
        })
    }
    res.json(person);
})

app.get('/info', (req, res) => {
    let phoneBookCap = `Phonebook has info for ${persons.length} people`
    let newDate = new Date()
    let dateInfo = `${newDate.toString()}`
    res.send(`${phoneBookCap}<br/>${dateInfo}`)
})

app.delete('/api/persons/:id', (req, res) => {
    let id = req.params.id
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    let body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "name and/or number is missing"
        })
    }

    if (isNameAvailable(body.name)) {
        return res.status(400).json({
            error: "person with name is already available"
        })
    }

    let newPerson = {
        id: uuidv4(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(newPerson);

    res.json(newPerson)
})

const isNameAvailable = name => persons.some(person => person.name === name)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})