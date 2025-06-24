const PersonForm = ({ handleSubmit, setNewName, setNewNumber }) => {
    const handleName = (e) => {
        const name = e.target.value
        setNewName(name)
    }
    
    const handleNumber = (e) => {
        const number = e.target.value
        setNewNumber(number)
    }

    return (
        <form>
            <div>
            name: <input name='name' onChange={handleName}/>
            </div>
            <div>
            number : <input name='number' onChange={handleNumber}/>
            </div>
            <div>
            <button type="submit" onClick={handleSubmit}>add</button>
            </div>
        </form>
    )
}

export default PersonForm