const Filter = ({handleFilterChange}) => {
    return (
        <div>
            Filter shown with <input type="text" onChange={handleFilterChange} />
        </div>
    )
}

export default Filter