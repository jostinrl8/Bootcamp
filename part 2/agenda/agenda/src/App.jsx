import { useState } from 'react'
import { useEffect } from 'react'

import personService from './services/persons'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [personsToShow, setPersonsToShow] = useState(persons)
  const [errorMessage, setErrorMessage] = useState(null)
  const [className, setClassName] = useState('noti')

  useEffect(() => {
    personService.getPersons().then(list => {
      setPersons(list)
      setPersonsToShow(list)
    })
}, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setPersonsToShow(persons.filter(person => 
      person.name.toLowerCase().includes(event.target.value.toLowerCase())))
  }

  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find(object => object.name === newName)
    if(person) {
      if(window.confirm(newName + " is already added to the phonebook. Do you want to replace the old number with a new one?")){
        personService.updateNumber(person.id, {name: newName, number: newNumber})
          .then(newPerson => {
            const list = persons.map(object => object.id === newPerson.id ? newPerson : object)
            setPersons(list)
            setPersonsToShow(list)
            setNewName('')
            setNewNumber('')
            setClassName('noti')
            setErrorMessage('Edited ' + person.name + "'s number")
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
          .catch(error => {
            setClassName('error')
            setErrorMessage(error.response.data.error)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService.createPerson(personObject).then(newPerson => {
      const newPersons = persons.concat(newPerson)
      setPersons(newPersons)
      setPersonsToShow(newPersons)
      setNewName('')
      setNewNumber('')
      setClassName('noti')
      setErrorMessage('Added ' + newPerson.name + "'s number")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })
    .catch(error => {
      setClassName('error')
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })
  }

  const deletePerson = (id, name) => {
    if(window.confirm("Do you want to delete "+ name +"?")){
      personService.deletePerson(id).then(() => {
        const newPersons = persons.filter(person => person.id !== id)
        setPersons(newPersons)
        setPersonsToShow(newPersons)
        setClassName('noti')
        setErrorMessage('Deleted ' + name)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    }

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} className={className}></Notification>
      <Filter handleFilterChange = {handleFilterChange}></Filter>

      <h2>Add a new person</h2>
      <PersonForm addPerson={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}></PersonForm>
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDelete={deletePerson}></Persons>
    </div>
  )
}

export default App