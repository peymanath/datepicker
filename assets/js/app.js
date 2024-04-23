class DatePicker {

    /**
     * Document object to access the DOM and make changes to it
     */
    document = document;

    /**
     * Making a presentation of the months of the year to convert the month number to 
     * the name of the month in the solar date language.
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
            this.changeYearMonthEvent();
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
        return this.document.querySelectorAll(selector).length > 1
            ? this.document.querySelectorAll(selector)
            : this.document.querySelector(selector);
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
            this.query('#datePickerPopup').classList.add("date-picker__popup--active");
        });
    }

    /**
     * The event for to the closing of the calendar
     */
    closeCalendarEvent() {
        this.document.addEventListener('click', (event) => {
            if (!this.query('#datePicker').contains(event.target)) {
                this.query('#datePickerPopup').classList.remove("date-picker__popup--active");
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
     * Change calendar Year and month logic
     * @param {string} format 
     * @param {"increment"|"decrement"} type 
     */
    changeYearMonth(format, type = "increment") {
        const selectedDate = moment(this.getInputValue(), this.fullNumberFormatJalali);
        this.renderCalendar({
            date: this.selectedDate.add(type === "increment" ? 1 : -1, format),
            selectedDay: selectedDate
        });
        this.updateCurrentMonthYear(this.selectedDate)
    }

    /**
     * Change calendar Year and month Event
     */
    changeYearMonthEvent() {

        // Years
        this.query('#nextYear').addEventListener('click', () => this.changeYearMonth("jY", "increment"));
        this.query('#prevYear').addEventListener('click', () => this.changeYearMonth("jY", "decrement"));

        // Month
        this.query('#nextMonth').addEventListener('click', () => this.changeYearMonth("jM", "increment"));
        this.query('#prevMonth').addEventListener('click', () => this.changeYearMonth("jM", "decrement"));
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
            calendarHtml += '<div class="date-picker__calendar-week">';

            for (let i = 0; i < 7; i++) {
                if (currentDate.isSame(startDate, 'month')) {
                    calendarHtml += `<button class="calendarDay date-picker__calendar-day${this.compareDate(currentDate, this.nowDate) ? " date-picker__calendar-day--today" : ""}${!!selectedDay && this.compareDate(currentDate, selectedDay) ? " date-picker__calendar-day--selected" : ""}">${currentDate.date()}</button>`;
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

const createInstanceClass = new DatePicker();