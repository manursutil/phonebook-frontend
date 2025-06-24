const Persons = ({ personsToShow, handleDelete }) => (
  <>
    {personsToShow.map(person => (
      <p key={person.name}>
        {person.name} {person.number}
        <button type="button" onClick={() => handleDelete(person.id)}>delete</button>
      </p>
    ))}
  </>
)

export default Persons