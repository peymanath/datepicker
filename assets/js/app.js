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
            this.closeCaledarEvent();
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
     * Get Input alue
     */
    getInputValue() {
        return this.query("#datepicker-input").value;
    }

    /**
     * Set Input alue
     */
    setInputValue(value) {
        return this.query("#datepicker-input").value = value;
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
        this.selectedDate = moment(); // Now Date
        this.nowDate = moment(); // Now Date
        moment.locale('fa'); // Set Local
    }

    /**
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
     * Open Calendar Event
     */
    openCalendarEvent() {
        this.query('#datepicker-input').addEventListener('click', () => {
            const popupElement = this.query('#datepicker-popup');
            popupElement.style = `display:flex;`;
        });
    }

    /**
     * Close Calendar Event
     */
    closeCaledarEvent() {
        this.document.addEventListener('click', (event) => {
            if (!this.query('.datepicker-container').contains(event.target)) {
                this.query('#datepicker-popup').style.display = 'none';
            }
        });
    }

    /**
     * Set Month and Year
     */
    updateCurrentMonthYear(date = this.nowDate) {
        this.query('.currentYear').innerText = date.format('jYYYY');
        this.query('.currentMonth').innerText = this.jalaliMonth[date.format('jM') - 1];
    }

    /**
     * Set Now Day
     */
    setNowDay() {
        this.query('.actionNow').addEventListener('click', () => {
            this.setInputValue(this.nowDate.format(this.fullNumberFormatJalali))
            this.renderCalendar({
                date: this.nowDate,
                selectedDay: this.nowDate
            });
            this.updateCurrentMonthYear();
        });
    }

    /**
     * Clear Input
     */
    clearDay() {
        this.query('.actionClear').addEventListener('click', () => {
            this.query('#datepicker-input').value = "";
            this.setInputValue("")
            this.renderCalendar({
                date: this.nowDate,
                selectedDay: null
            });
            this.updateCurrentMonthYear();
        });
    }

    /**
     * Change Month
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
        this.query('.nextMonth').addEventListener('click', () => {
            change("increment")
        });
        this.query('.prevMonth').addEventListener('click', () => {
            change("decrement")
        });
    }


    /**
     * Change Month
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
        this.query('.nextYear').addEventListener('click', () => {
            change("increment")
        });
        this.query('.prevYear').addEventListener('click', () => {
            change("decrement")
        });
    }

    /**
     * Add action to days
     */

    daysAction(date) {
        this.query('.calendar-day')?.forEach(day => {
            day.addEventListener('click', () => {
                const selectedDay = parseInt(day.innerText);
                const selectedDate = moment(date).jDate(selectedDay).format(this.fullNumberFormatJalali);
                this.query('#datepicker-input').value = selectedDate;
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
                    calendarHtml += `<button class="calendar-day${this.compareDate(currentDate, this.nowDate) ? " calendar-day--today" : ""}${!!selectedDay && this.compareDate(currentDate, selectedDay) ? " calendar-day--selected" : ""}">${currentDate.date()}</button>`;
                } else {
                    calendarHtml += '<div></div>';
                }
                currentDate.add(1, 'days');
            }

            calendarHtml += '</div>';
        }

        this.query('#datepicker-calendar').innerHTML = calendarHtml;

        /**
         * Add Action
         */
        this.daysAction(date)
    }
}

const createInstanseClass = new DatePicker();