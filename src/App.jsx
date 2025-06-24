import { useEffect, useState } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personsService from './services/personsService'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [notificationType, setNotificationType] = useState('notification')

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleSubmitNewPerson = (event) => {
    event.preventDefault()
    const person = persons.find(person => person.name === newName)
    if (person) {
      if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) {
        const newObject = {
          ...person,
          number: newNumber,
        }

        personsService
          .update(person.id, newObject)
          .then(response => {
            setPersons(persons.map(p => p.id === person.id ? response : p))
            setNewName('')
            setNewNumber('')
            setErrorMessage(`Updated ${person.name}'s number`)
            setNotificationType('notification')
            setTimeout(() => setErrorMessage(''), 4000)
          })
          .catch(error => {
            setErrorMessage('Failed to update person. They may have been removed from the server.')
            setNotificationType('error')
            setPersons(persons.filter(p => p.id !== person.id))
            setTimeout(() => setErrorMessage(''), 4000)
          })
      }
    } else {
      const personsObject = {
        name: newName,
        number: newNumber,
      }

      personsService
        .create(personsObject)
        .then(response => {
          setPersons(persons.concat(response))
          setNewName('')
          setNewNumber('')
          setErrorMessage(`Added ${response.name}`)
          setNotificationType('notification')
          setTimeout(() => setErrorMessage(''), 4000)
        })
        .catch(error => {
          setErrorMessage('Failed to add person.')
          setNotificationType('error')
          setTimeout(() => setErrorMessage(''), 4000)
        })
    }
  }

  const handleDelete = (id) => {
    const person = persons.find(person => person.id === id)
    if (person) {
      if (window.confirm(`Delete ${person.name}?`)) {
        personsService
          .deletePerson(id)
          .then(() => {
            setPersons(persons.filter(p => p.id !== id))
            setErrorMessage(`Deleted ${person.name}`)
            setNotificationType('notification')
            setTimeout(() => setErrorMessage(''), 4000)
          })
          .catch(error => {
            setErrorMessage(`${person.name} has already been deleted from the server`)
            setNotificationType('error')
            setPersons(persons.filter(p => p.id !== id))
            setTimeout(() => setErrorMessage(''), 4000)
          })
      }
    }
  }

  const handleFilter = (e) => {
    setFilter(e.target.value)
  }

  const personsToShow = filter 
  ? persons.filter(person => person.name.toLowerCase().startsWith(filter.toLowerCase())) 
  : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} type={notificationType}/>
      <Filter filter={filter} handleFilter={handleFilter} />
      <h3>Add a new</h3>
      <PersonForm handleSubmit={handleSubmitNewPerson} setNewName={setNewName} setNewNumber={setNewNumber}/>
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete}/>
    </div>
  )
}

export default App