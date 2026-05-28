import React, { useState } from 'react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const Datepicker = () => {

    const [selectedDate, setSelectedDate] = useState(null)

    return (
        <div className="App">

            <DatePicker

                selected={selectedDate}

                onChange={setSelectedDate}

                placeholderText="Select a date"

                dateFormat="dd/MM/yyyy"

                filterDate={(date)=>
                    date.getDay() !== 0 &&
                    date.getDay() !== 6
                }

                isClearable

                showMonthDropdown

                showYearDropdown

                scrollableMonthYearDropdown

                yearDropdownItemNumber={10}

                showPopperArrow={false}

                todayButton="Today"

                dropdownMode="scroll"

                autoComplete="off"

            />

        </div>
    )
}

export default Datepicker