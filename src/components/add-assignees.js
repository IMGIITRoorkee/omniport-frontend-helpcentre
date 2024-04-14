import React, { useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { debounce } from 'lodash'

import { UserCard } from 'formula_one'
import { changeAssignees } from '../actions'
import { urlSearchMaintainer } from '../urls'
import { tailwindWrapper } from "formula_one/src/utils/tailwindWrapper"

const AddAssignees = ({ maintainers, activeIssue, changeAssignees }) => {
    const [value, setValue] = useState('')
    const [results, setResults] = useState([])

    const debouncedHandleSearchChange = debounce((value) => {
        if (value) {
            axios
                .get(urlSearchMaintainer(), { params: { search: value } })
                .then((res) => {
                    setResults(
                        res.data.slice(0, 3).map((person) => ({
                        person, title: person.person.fullName
                        }))
                    )
                })
        }
    }, 500)

    const handleInputChange = (e) => {
        const inputValue = e.target.value
        setValue(inputValue)
        debouncedHandleSearchChange(inputValue)
    }

    const handleResultSelect = (result) => {
        const data = [
            ...activeIssue.assignees.map((x) => (x.id ? x.id : x)),
            result.person.id
        ]
        changeAssignees(activeIssue.id, data)
        setValue("")
    }

    const resultRenderer = ({ person }) => (
        <UserCard
            key={person.id}
            name={person.person.fullName}
            image={person.person.displayPicture}
            right={
                activeIssue.assignees.find((x) =>
                    x.id ? x.id === person.id : x === person.id
                ) && <span className={tailwindWrapper("text-green-500")}>✓</span>
            }
        />)

    return (
        <>
            <form>
                <div className={tailwindWrapper("mb-2")}>
                    <input
                        className={tailwindWrapper("border p-2 w-full focus:outline-none focus:border-blue-300")}
                        type="text"
                        placeholder="Add members by their name or contact information"
                        value={value}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <div className={tailwindWrapper(`${(results.length === 0 || !value) && "hidden"} flex-col py-4 px-3 border rounded-md`)}>
                        {value && results.length > 0 && (
                            <ul>
                            {results.map((result, index) => (
                                <li className={tailwindWrapper(`${index !== results.length - 1 && "mb-4"} cursor-pointer`)} key={result.person.id} onClick={() => handleResultSelect(result)}>
                                    {resultRenderer(result)}
                                </li>
                            ))}
                            </ul>
                        )}
                    </div>
                </div>
            </form>
        </>)}

const mapStateToProps = (state) => ({
    maintainers: state.maintainers,
    activeIssue: state.activeIssue
})

const mapDispatchToProps = (dispatch) => ({
    changeAssignees: (id, assignees) => dispatch(changeAssignees(id, assignees))
})

export default connect(mapStateToProps, mapDispatchToProps)(AddAssignees)
