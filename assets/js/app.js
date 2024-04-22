class DatePicker {

    /**
     * Document object to access the DOM and make changes to it
     */
    document = document;

    /**
     * Making a presentation of the months of the year to convert the month number to the name of the month in the solar date language
     */
    jalaliMonth = [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند",
    ];

    /**
     * DatePicker formats
     */
    fullNumberFormatJalali = 'jYYYY/jMM/jDD';

    /**
     * Constructor function of the mentioned class
     */
    constructor() {
        this.document.addEventListener("DOMContentLoaded", () => {
            this.initializeMoment()
            this.openCalendarEvent();
            this.closeCalendarEvent();
            this.updateCurrentMonthYear();
            this.setNowDay();
            this.clearDay();
            this.changeMonth();
            this.changeYear();
            this.renderCalendar({
                date: this.selectedDate,
                selectedDay: moment(this.getInputValue(), this.fullNumberFormatJalali)
            });
        });
    }

    /**
     * Get Input value
     */
    getInputValue() {
        return this.query("#datePickerInput").value;
    }

    /**
     * Set Input value
     */
    setInputValue(value) {
        return this.query("#datePickerInput").value = value;
    }

    /**
     * A method to select elements in the DOM
     * @param {string} selector 
     */
    query(selector) {
        return this.document.querySelectorAll(selector).length > 1 ? this.document.querySelectorAll(selector) : this.document.querySelector(selector);
    }

    /**
     * A method to initialize the moment library
     */
    initializeMoment() {
        this.selectedDate = moment(); // Default Select Date
        this.nowDate = moment(); // Now Date
        moment.locale('fa'); // Set Local
    }

    /**
     * Two dates are compared by typing the moment.
     * I can't use the built-in functions of moment.js.
     * 
     * @param {Moment} firstDate 
     * @param {Moment} secondDate 
     * @returns 
     */
    compareDate(firstDate, secondDate) {
        return firstDate.format(this.fullNumberFormatJalali) ===
            secondDate.format(this.fullNumberFormatJalali);
    }

    /**
     * The event for to the opening of the calendar
     */
    openCalendarEvent() {
        this.query('#datePickerInput').addEventListener('click', () => {
            const popupElement = this.query('#datePickerPopup');
            popupElement.style = `display:flex;`;
        });
    }

    /**
     * The event for to the closing of the calendar
     */
    closeCalendarEvent() {
        this.document.addEventListener('click', (event) => {
            if (!this.query('#datePicker').contains(event.target)) {
                this.query('#datePickerPopup').style.display = 'none';
            }
        });
    }

    /**
     * Display the current year and month
     */
    updateCurrentMonthYear(date = this.nowDate) {
        this.query('#currentYear').innerText = date.format('jYYYY');
        this.query('#currentMonth').innerText = this.jalaliMonth[date.format('jM') - 1];
    }

    /**
     * Event to select today's date
     */
    setNowDay() {
        this.query('#actionNow').addEventListener('click', () => {
            this.setInputValue(this.nowDate.format(this.fullNumberFormatJalali))
            this.renderCalendar({
                date: this.nowDate,
                selectedDay: this.nowDate
            });
            this.updateCurrentMonthYear();
        });
    }

    /**
     * Event to clear the selected date
     */
    clearDay() {
        this.query('#actionClear').addEventListener('click', () => {
            this.query('#datePickerInput').value = "";
            this.setInputValue("")
            this.renderCalendar({
                date: this.nowDate,
                selectedDay: null
            });
            this.updateCurrentMonthYear();
        });
    }

    /**
     * Change calendar months
     */
    changeMonth() {
        const change = (type = "increment") => {
            const selectedDate = moment(this.getInputValue(), this.fullNumberFormatJalali);
            this.renderCalendar({
                date: this.selectedDate.add(type === "increment" ? 1 : -1, "jM"),
                selectedDay: selectedDate
            });
            this.updateCurrentMonthYear(this.selectedDate)
        }
        this.query('#nextMonth').addEventListener('click', () => {
            change("increment")
        });
        this.query('#prevMonth').addEventListener('click', () => {
            change("decrement")
        });
    }


    /**
     * Change calendar Year
     */
    changeYear() {
        const change = (type = "increment") => {
            const selectedDate = moment(this.getInputValue(), this.fullNumberFormatJalali);
            this.renderCalendar({
                date: this.selectedDate.add(type === "increment" ? 1 : -1, "jY"),
                selectedDay: selectedDate
            });
            this.updateCurrentMonthYear(this.selectedDate)
        }
        this.query('#nextYear').addEventListener('click', () => {
            change("increment")
        });
        this.query('#prevYear').addEventListener('click', () => {
            change("decrement")
        });
    }

    /**
     * Event to select days
     */
    daysAction(date) {
        this.query('.calendarDay')?.forEach(day => {
            day.addEventListener('click', () => {
                const selectedDay = parseInt(day.innerText);
                const selectedDate = moment(date).jDate(selectedDay).format(this.fullNumberFormatJalali);
                this.query('#datePickerInput').value = selectedDate;
                const newSelectedDate = moment(selectedDate, this.fullNumberFormatJalali);
                this.renderCalendar({
                    date: newSelectedDate,
                    selectedDay: newSelectedDate
                });
            });
        });
    }

    /**
     * 
     * Render Calendar 
     * 
     * @param {Object} param0 
     */
    renderCalendar({
        date,
        selectedDay
    }) {
        const startDate = moment(date).date(1);
        const endDate = moment(startDate).endOf('month');
        const currentDate = moment(startDate).startOf('week');
        let calendarHtml = '';
        while (currentDate.isBefore(endDate)) {
            calendarHtml += '<div class="show-calendar-week">';

            for (let i = 0; i < 7; i++) {
                if (currentDate.isSame(startDate, 'month')) {
                    calendarHtml += `<button class="calendarDay calendar-day${this.compareDate(currentDate, this.nowDate) ? " calendar-day--today" : ""}${!!selectedDay && this.compareDate(currentDate, selectedDay) ? " calendar-day--selected" : ""}">${currentDate.date()}</button>`;
                } else {
                    calendarHtml += '<div></div>';
                }
                currentDate.add(1, 'days');
            }

            calendarHtml += '</div>';
        }

        this.query('#datePickerCalendar').innerHTML = calendarHtml;

        /**
         * Add Action
         */
        this.daysAction(date)
    }
}

const createInstanseClass = new DatePicker();