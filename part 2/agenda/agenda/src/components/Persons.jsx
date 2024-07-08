const Persons = ({personsToShow, handleDelete}) => {
    return (
        <>
            {personsToShow.map(person => 
                <div key={person.name}>
                    <p>{person.name} {person.number}</p>
                    <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
                </div>
            )}
        </>
    )
}

export default Persons