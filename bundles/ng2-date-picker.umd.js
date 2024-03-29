(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/forms'), require('@angular/common'), require('moment')) :
    typeof define === 'function' && define.amd ? define('ng2-date-picker', ['exports', '@angular/core', '@angular/forms', '@angular/common', 'moment'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ng2-date-picker'] = {}, global.ng.core, global.ng.forms, global.ng.common, global.moment));
}(this, (function (exports, i0, forms, common, momentNs) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var momentNs__namespace = /*#__PURE__*/_interopNamespace(momentNs);

    (function (ECalendarMode) {
        ECalendarMode[ECalendarMode["Day"] = 0] = "Day";
        ECalendarMode[ECalendarMode["DayTime"] = 1] = "DayTime";
        ECalendarMode[ECalendarMode["Month"] = 2] = "Month";
        ECalendarMode[ECalendarMode["Time"] = 3] = "Time";
    })(exports.ECalendarMode || (exports.ECalendarMode = {}));

    (function (ECalendarValue) {
        ECalendarValue[ECalendarValue["Moment"] = 1] = "Moment";
        ECalendarValue[ECalendarValue["MomentArr"] = 2] = "MomentArr";
        ECalendarValue[ECalendarValue["String"] = 3] = "String";
        ECalendarValue[ECalendarValue["StringArr"] = 4] = "StringArr";
    })(exports.ECalendarValue || (exports.ECalendarValue = {}));

    (function (SelectEvent) {
        SelectEvent["INPUT"] = "input";
        SelectEvent["SELECTION"] = "selection";
    })(exports.SelectEvent || (exports.SelectEvent = {}));

    var DomHelper = /** @class */ (function () {
        function DomHelper() {
        }
        DomHelper.setYAxisPosition = function (element, container, anchor, drops) {
            var anchorRect = anchor.getBoundingClientRect();
            var containerRect = container.getBoundingClientRect();
            var bottom = anchorRect.bottom - containerRect.top;
            var top = anchorRect.top - containerRect.top;
            if (drops === 'down') {
                element.style.top = (bottom + 1 + 'px');
            }
            else {
                element.style.top = (top - 1 - element.scrollHeight) + 'px';
            }
        };
        DomHelper.setXAxisPosition = function (element, container, anchor, dimElem, opens) {
            var anchorRect = anchor.getBoundingClientRect();
            var containerRect = container.getBoundingClientRect();
            var left = anchorRect.left - containerRect.left;
            if (opens === 'right') {
                element.style.left = left + 'px';
            }
            else {
                element.style.left = left - dimElem.offsetWidth + anchor.offsetWidth + 'px';
            }
        };
        DomHelper.isTopInView = function (el) {
            var top = el.getBoundingClientRect().top;
            return (top >= 0);
        };
        DomHelper.isBottomInView = function (el) {
            var bottom = el.getBoundingClientRect().bottom;
            return (bottom <= window.innerHeight);
        };
        DomHelper.isLeftInView = function (el) {
            var left = el.getBoundingClientRect().left;
            return (left >= 0);
        };
        DomHelper.isRightInView = function (el) {
            var right = el.getBoundingClientRect().right;
            return (right <= window.innerWidth);
        };
        DomHelper.prototype.appendElementToPosition = function (config) {
            var _this = this;
            var container = config.container, element = config.element;
            if (!container.style.position || container.style.position === 'static') {
                container.style.position = 'relative';
            }
            if (element.style.position !== 'absolute') {
                element.style.position = 'absolute';
            }
            element.style.visibility = 'hidden';
            setTimeout(function () {
                _this.setElementPosition(config);
                element.style.visibility = 'visible';
            });
        };
        DomHelper.prototype.setElementPosition = function (_a) {
            var element = _a.element, container = _a.container, anchor = _a.anchor, dimElem = _a.dimElem, drops = _a.drops, opens = _a.opens;
            DomHelper.setYAxisPosition(element, container, anchor, 'down');
            DomHelper.setXAxisPosition(element, container, anchor, dimElem, 'right');
            if (drops !== 'down' && drops !== 'up') {
                if (DomHelper.isBottomInView(dimElem)) {
                    DomHelper.setYAxisPosition(element, container, anchor, 'down');
                }
                else if (DomHelper.isTopInView(dimElem)) {
                    DomHelper.setYAxisPosition(element, container, anchor, 'up');
                }
            }
            else {
                DomHelper.setYAxisPosition(element, container, anchor, drops);
            }
            if (opens !== 'left' && opens !== 'right') {
                if (DomHelper.isRightInView(dimElem)) {
                    DomHelper.setXAxisPosition(element, container, anchor, dimElem, 'right');
                }
                else if (DomHelper.isLeftInView(dimElem)) {
                    DomHelper.setXAxisPosition(element, container, anchor, dimElem, 'left');
                }
            }
            else {
                DomHelper.setXAxisPosition(element, container, anchor, dimElem, opens);
            }
        };
        return DomHelper;
    }());
    DomHelper.ɵprov = i0.ɵɵdefineInjectable({ factory: function DomHelper_Factory() { return new DomHelper(); }, token: DomHelper, providedIn: "root" });
    DomHelper.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];

    var moment = momentNs__namespace;
    var UtilsService = /** @class */ (function () {
        function UtilsService() {
        }
        UtilsService.debounce = function (func, wait) {
            var timeout;
            return function () {
                var context = this, args = arguments;
                timeout = clearTimeout(timeout);
                setTimeout(function () {
                    func.apply(context, args);
                }, wait);
            };
        };
        ;
        UtilsService.prototype.createArray = function (size) {
            return new Array(size).fill(1);
        };
        UtilsService.prototype.convertToMoment = function (date, format) {
            if (!date) {
                return null;
            }
            else if (typeof date === 'string') {
                return moment(date, format);
            }
            else {
                return date.clone();
            }
        };
        UtilsService.prototype.isDateValid = function (date, format) {
            if (date === '') {
                return true;
            }
            return moment(date, format, true).isValid();
        };
        // todo:: add unit test
        UtilsService.prototype.getDefaultDisplayDate = function (current, selected, allowMultiSelect, minDate) {
            if (current) {
                return current.clone();
            }
            else if (minDate && minDate.isAfter(moment())) {
                return minDate.clone();
            }
            else if (allowMultiSelect) {
                if (selected && selected[selected.length]) {
                    return selected[selected.length].clone();
                }
            }
            else if (selected && selected[0]) {
                return selected[0].clone();
            }
            return moment();
        };
        // todo:: add unit test
        UtilsService.prototype.getInputType = function (value, allowMultiSelect) {
            if (Array.isArray(value)) {
                if (!value.length) {
                    return exports.ECalendarValue.MomentArr;
                }
                else if (typeof value[0] === 'string') {
                    return exports.ECalendarValue.StringArr;
                }
                else if (moment.isMoment(value[0])) {
                    return exports.ECalendarValue.MomentArr;
                }
            }
            else {
                if (typeof value === 'string') {
                    return exports.ECalendarValue.String;
                }
                else if (moment.isMoment(value)) {
                    return exports.ECalendarValue.Moment;
                }
            }
            return allowMultiSelect ? exports.ECalendarValue.MomentArr : exports.ECalendarValue.Moment;
        };
        // todo:: add unit test
        UtilsService.prototype.convertToMomentArray = function (value, config) {
            var retVal;
            switch (this.getInputType(value, config.allowMultiSelect)) {
                case (exports.ECalendarValue.String):
                    retVal = value ? [moment(value, config.format, true)] : [];
                    break;
                case (exports.ECalendarValue.StringArr):
                    retVal = value.map(function (v) { return v ? moment(v, config.format, true) : null; }).filter(Boolean);
                    break;
                case (exports.ECalendarValue.Moment):
                    retVal = value ? [value.clone()] : [];
                    break;
                case (exports.ECalendarValue.MomentArr):
                    retVal = (value || []).map(function (v) { return v.clone(); });
                    break;
                default:
                    retVal = [];
            }
            return retVal;
        };
        // todo:: add unit test
        UtilsService.prototype.convertFromMomentArray = function (format, value, convertTo) {
            switch (convertTo) {
                case (exports.ECalendarValue.String):
                    return value[0] && value[0].format(format);
                case (exports.ECalendarValue.StringArr):
                    return value.filter(Boolean).map(function (v) { return v.format(format); });
                case (exports.ECalendarValue.Moment):
                    return value[0] ? value[0].clone() : value[0];
                case (exports.ECalendarValue.MomentArr):
                    return value ? value.map(function (v) { return v.clone(); }) : value;
                default:
                    return value;
            }
        };
        UtilsService.prototype.convertToString = function (value, format) {
            var _this = this;
            var tmpVal;
            if (typeof value === 'string') {
                tmpVal = [value];
            }
            else if (Array.isArray(value)) {
                if (value.length) {
                    tmpVal = value.map(function (v) {
                        return _this.convertToMoment(v, format).format(format);
                    });
                }
                else {
                    tmpVal = value;
                }
            }
            else if (moment.isMoment(value)) {
                tmpVal = [value.format(format)];
            }
            else {
                return '';
            }
            return tmpVal.filter(Boolean).join(' | ');
        };
        // todo:: add unit test
        UtilsService.prototype.clearUndefined = function (obj) {
            if (!obj) {
                return obj;
            }
            Object.keys(obj).forEach(function (key) { return (obj[key] === undefined) && delete obj[key]; });
            return obj;
        };
        UtilsService.prototype.updateSelected = function (isMultiple, currentlySelected, date, granularity) {
            if (granularity === void 0) { granularity = 'day'; }
            if (isMultiple) {
                return !date.selected
                    ? currentlySelected.concat([date.date])
                    : currentlySelected.filter(function (d) { return !d.isSame(date.date, granularity); });
            }
            else {
                return !date.selected ? [date.date] : [];
            }
        };
        UtilsService.prototype.closestParent = function (element, selector) {
            if (!element) {
                return undefined;
            }
            var match = element.querySelector(selector);
            return match || this.closestParent(element.parentElement, selector);
        };
        UtilsService.prototype.onlyTime = function (m) {
            return m && moment.isMoment(m) && moment(m.format('HH:mm:ss'), 'HH:mm:ss');
        };
        UtilsService.prototype.granularityFromType = function (calendarType) {
            switch (calendarType) {
                case 'time':
                    return 'second';
                case 'daytime':
                    return 'second';
                default:
                    return calendarType;
            }
        };
        UtilsService.prototype.createValidator = function (_a, format, calendarType) {
            var _this = this;
            var minDate = _a.minDate, maxDate = _a.maxDate, minTime = _a.minTime, maxTime = _a.maxTime;
            var isValid;
            var value;
            var validators = [];
            var granularity = this.granularityFromType(calendarType);
            if (minDate) {
                var md_1 = this.convertToMoment(minDate, format);
                validators.push({
                    key: 'minDate',
                    isValid: function () {
                        var _isValid = value.every(function (val) { return val.isSameOrAfter(md_1, granularity); });
                        isValid = isValid ? _isValid : false;
                        return _isValid;
                    }
                });
            }
            if (maxDate) {
                var md_2 = this.convertToMoment(maxDate, format);
                validators.push({
                    key: 'maxDate',
                    isValid: function () {
                        var _isValid = value.every(function (val) { return val.isSameOrBefore(md_2, granularity); });
                        isValid = isValid ? _isValid : false;
                        return _isValid;
                    }
                });
            }
            if (minTime) {
                var md_3 = this.onlyTime(this.convertToMoment(minTime, format));
                validators.push({
                    key: 'minTime',
                    isValid: function () {
                        var _isValid = value.every(function (val) { return _this.onlyTime(val).isSameOrAfter(md_3); });
                        isValid = isValid ? _isValid : false;
                        return _isValid;
                    }
                });
            }
            if (maxTime) {
                var md_4 = this.onlyTime(this.convertToMoment(maxTime, format));
                validators.push({
                    key: 'maxTime',
                    isValid: function () {
                        var _isValid = value.every(function (val) { return _this.onlyTime(val).isSameOrBefore(md_4); });
                        isValid = isValid ? _isValid : false;
                        return _isValid;
                    }
                });
            }
            return function (inputVal) {
                isValid = true;
                value = _this.convertToMomentArray(inputVal, {
                    format: format,
                    allowMultiSelect: true
                }).filter(Boolean);
                if (!value.every(function (val) { return val.isValid(); })) {
                    return {
                        format: {
                            given: inputVal
                        }
                    };
                }
                var errors = validators.reduce(function (map, err) {
                    if (!err.isValid()) {
                        map[err.key] = {
                            given: value
                        };
                    }
                    return map;
                }, {});
                return !isValid ? errors : null;
            };
        };
        UtilsService.prototype.datesStringToStringArray = function (value) {
            return (value || '').split('|').map(function (m) { return m.trim(); }).filter(Boolean);
        };
        UtilsService.prototype.getValidMomentArray = function (value, format) {
            var _this = this;
            return this.datesStringToStringArray(value)
                .filter(function (d) { return _this.isDateValid(d, format); })
                .map(function (d) { return moment(d, format); });
        };
        UtilsService.prototype.shouldShowCurrent = function (showGoToCurrent, mode, min, max) {
            return showGoToCurrent &&
                mode !== 'time' &&
                this.isDateInRange(moment(), min, max);
        };
        UtilsService.prototype.isDateInRange = function (date, from, to) {
            return date.isBetween(from, to, 'day', '[]');
        };
        UtilsService.prototype.convertPropsToMoment = function (obj, format, props) {
            var _this = this;
            props.forEach(function (prop) {
                if (obj.hasOwnProperty(prop)) {
                    obj[prop] = _this.convertToMoment(obj[prop], format);
                }
            });
        };
        UtilsService.prototype.shouldResetCurrentView = function (prevConf, currentConf) {
            if (prevConf && currentConf) {
                if (!prevConf.min && currentConf.min) {
                    return true;
                }
                else if (prevConf.min && currentConf.min && !prevConf.min.isSame(currentConf.min, 'd')) {
                    return true;
                }
                else if (!prevConf.max && currentConf.max) {
                    return true;
                }
                else if (prevConf.max && currentConf.max && !prevConf.max.isSame(currentConf.max, 'd')) {
                    return true;
                }
                return false;
            }
            return false;
        };
        UtilsService.prototype.getNativeElement = function (elem) {
            if (!elem) {
                return null;
            }
            else if (typeof elem === 'string') {
                return document.querySelector(elem);
            }
            else {
                return elem;
            }
        };
        return UtilsService;
    }());
    UtilsService.ɵprov = i0.ɵɵdefineInjectable({ factory: function UtilsService_Factory() { return new UtilsService(); }, token: UtilsService, providedIn: "root" });
    UtilsService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];

    var moment$1 = momentNs__namespace;
    var DayCalendarService = /** @class */ (function () {
        function DayCalendarService(utilsService) {
            this.utilsService = utilsService;
            this.DEFAULT_CONFIG = {
                showNearMonthDays: true,
                showWeekNumbers: false,
                firstDayOfWeek: 'su',
                weekDayFormat: 'ddd',
                format: 'DD-MM-YYYY',
                allowMultiSelect: false,
                monthFormat: 'MMM, YYYY',
                enableMonthSelector: true,
                locale: moment$1.locale(),
                dayBtnFormat: 'DD',
                unSelectOnClick: true
            };
            this.DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
        }
        DayCalendarService.prototype.getConfig = function (config) {
            var _config = Object.assign(Object.assign({}, this.DEFAULT_CONFIG), this.utilsService.clearUndefined(config));
            this.utilsService.convertPropsToMoment(_config, _config.format, ['min', 'max']);
            moment$1.locale(_config.locale);
            return _config;
        };
        DayCalendarService.prototype.generateDaysMap = function (firstDayOfWeek) {
            var firstDayIndex = this.DAYS.indexOf(firstDayOfWeek);
            var daysArr = this.DAYS.slice(firstDayIndex, 7).concat(this.DAYS.slice(0, firstDayIndex));
            return daysArr.reduce(function (map, day, index) {
                map[day] = index;
                return map;
            }, {});
        };
        DayCalendarService.prototype.generateMonthArray = function (config, month, selected) {
            var _this = this;
            var monthArray = [];
            var firstDayOfWeekIndex = this.DAYS.indexOf(config.firstDayOfWeek);
            var firstDayOfBoard = month.clone().startOf('month');
            while (firstDayOfBoard.day() !== firstDayOfWeekIndex) {
                firstDayOfBoard.subtract(1, 'day');
            }
            var current = firstDayOfBoard.clone();
            var prevMonth = month.clone().subtract(1, 'month');
            var nextMonth = month.clone().add(1, 'month');
            var today = moment$1();
            var daysOfCalendar = this.utilsService.createArray(42)
                .reduce(function (array) {
                array.push({
                    date: current.clone(),
                    selected: !!selected.find(function (selectedDay) { return current.isSame(selectedDay, 'day'); }),
                    currentMonth: current.isSame(month, 'month'),
                    prevMonth: current.isSame(prevMonth, 'month'),
                    nextMonth: current.isSame(nextMonth, 'month'),
                    currentDay: current.isSame(today, 'day'),
                    disabled: _this.isDateDisabled(current, config)
                });
                current.add(1, 'day');
                return array;
            }, []);
            daysOfCalendar.forEach(function (day, index) {
                var weekIndex = Math.floor(index / 7);
                if (!monthArray[weekIndex]) {
                    monthArray.push([]);
                }
                monthArray[weekIndex].push(day);
            });
            if (!config.showNearMonthDays) {
                monthArray = this.removeNearMonthWeeks(month, monthArray);
            }
            return monthArray;
        };
        DayCalendarService.prototype.generateWeekdays = function (firstDayOfWeek) {
            var weekdayNames = {
                su: moment$1().day(0),
                mo: moment$1().day(1),
                tu: moment$1().day(2),
                we: moment$1().day(3),
                th: moment$1().day(4),
                fr: moment$1().day(5),
                sa: moment$1().day(6)
            };
            var weekdays = [];
            var daysMap = this.generateDaysMap(firstDayOfWeek);
            for (var dayKey in daysMap) {
                if (daysMap.hasOwnProperty(dayKey)) {
                    weekdays[daysMap[dayKey]] = weekdayNames[dayKey];
                }
            }
            return weekdays;
        };
        DayCalendarService.prototype.isDateDisabled = function (date, config) {
            if (config.isDayDisabledCallback) {
                return config.isDayDisabledCallback(date);
            }
            if (config.min && date.isBefore(config.min, 'day')) {
                return true;
            }
            return !!(config.max && date.isAfter(config.max, 'day'));
        };
        // todo:: add unit tests
        DayCalendarService.prototype.getHeaderLabel = function (config, month) {
            if (config.monthFormatter) {
                return config.monthFormatter(month);
            }
            return month.format(config.monthFormat);
        };
        // todo:: add unit tests
        DayCalendarService.prototype.shouldShowLeft = function (min, currentMonthView) {
            return min ? min.isBefore(currentMonthView, 'month') : true;
        };
        // todo:: add unit tests
        DayCalendarService.prototype.shouldShowRight = function (max, currentMonthView) {
            return max ? max.isAfter(currentMonthView, 'month') : true;
        };
        DayCalendarService.prototype.generateDaysIndexMap = function (firstDayOfWeek) {
            var firstDayIndex = this.DAYS.indexOf(firstDayOfWeek);
            var daysArr = this.DAYS.slice(firstDayIndex, 7).concat(this.DAYS.slice(0, firstDayIndex));
            return daysArr.reduce(function (map, day, index) {
                map[index] = day;
                return map;
            }, {});
        };
        DayCalendarService.prototype.getMonthCalendarConfig = function (componentConfig) {
            return this.utilsService.clearUndefined({
                min: componentConfig.min,
                max: componentConfig.max,
                format: componentConfig.format,
                isNavHeaderBtnClickable: true,
                allowMultiSelect: false,
                locale: componentConfig.locale,
                yearFormat: componentConfig.yearFormat,
                yearFormatter: componentConfig.yearFormatter,
                monthBtnFormat: componentConfig.monthBtnFormat,
                monthBtnFormatter: componentConfig.monthBtnFormatter,
                monthBtnCssClassCallback: componentConfig.monthBtnCssClassCallback,
                isMonthDisabledCallback: componentConfig.isMonthDisabledCallback,
                multipleYearsNavigateBy: componentConfig.multipleYearsNavigateBy,
                showMultipleYearsNavigation: componentConfig.showMultipleYearsNavigation,
                showGoToCurrent: componentConfig.showGoToCurrent,
                numOfMonthRows: componentConfig.numOfMonthRows
            });
        };
        DayCalendarService.prototype.getDayBtnText = function (config, day) {
            if (config.dayBtnFormatter) {
                return config.dayBtnFormatter(day);
            }
            return day.format(config.dayBtnFormat);
        };
        DayCalendarService.prototype.getDayBtnCssClass = function (config, day) {
            if (config.dayBtnCssClassCallback) {
                return config.dayBtnCssClassCallback(day);
            }
            return '';
        };
        DayCalendarService.prototype.removeNearMonthWeeks = function (currentMonth, monthArray) {
            if (monthArray[monthArray.length - 1].find(function (day) { return day.date.isSame(currentMonth, 'month'); })) {
                return monthArray;
            }
            else {
                return monthArray.slice(0, -1);
            }
        };
        return DayCalendarService;
    }());
    DayCalendarService.decorators = [
        { type: i0.Injectable }
    ];
    DayCalendarService.ctorParameters = function () { return [
        { type: UtilsService }
    ]; };

    var moment$2 = momentNs__namespace;
    var FIRST_PM_HOUR = 12;
    var TimeSelectService = /** @class */ (function () {
        function TimeSelectService(utilsService) {
            this.utilsService = utilsService;
            this.DEFAULT_CONFIG = {
                hours12Format: 'hh',
                hours24Format: 'HH',
                meridiemFormat: 'A',
                minutesFormat: 'mm',
                minutesInterval: 1,
                secondsFormat: 'ss',
                secondsInterval: 1,
                showSeconds: false,
                showTwentyFourHours: false,
                timeSeparator: ':',
                locale: moment$2.locale()
            };
        }
        TimeSelectService.prototype.getConfig = function (config) {
            var timeConfigs = {
                maxTime: this.utilsService.onlyTime(config && config.maxTime),
                minTime: this.utilsService.onlyTime(config && config.minTime)
            };
            var _config = Object.assign(Object.assign(Object.assign({}, this.DEFAULT_CONFIG), this.utilsService.clearUndefined(config)), timeConfigs);
            moment$2.locale(_config.locale);
            return _config;
        };
        TimeSelectService.prototype.getTimeFormat = function (config) {
            return (config.showTwentyFourHours ? config.hours24Format : config.hours12Format)
                + config.timeSeparator + config.minutesFormat
                + (config.showSeconds ? (config.timeSeparator + config.secondsFormat) : '')
                + (config.showTwentyFourHours ? '' : ' ' + config.meridiemFormat);
        };
        TimeSelectService.prototype.getHours = function (config, t) {
            var time = t || moment$2();
            return time && time.format(config.showTwentyFourHours ? config.hours24Format : config.hours12Format);
        };
        TimeSelectService.prototype.getMinutes = function (config, t) {
            var time = t || moment$2();
            return time && time.format(config.minutesFormat);
        };
        TimeSelectService.prototype.getSeconds = function (config, t) {
            var time = t || moment$2();
            return time && time.format(config.secondsFormat);
        };
        TimeSelectService.prototype.getMeridiem = function (config, time) {
            return time && time.format(config.meridiemFormat);
        };
        TimeSelectService.prototype.decrease = function (config, time, unit) {
            var amount = 1;
            switch (unit) {
                case 'minute':
                    amount = config.minutesInterval;
                    break;
                case 'second':
                    amount = config.secondsInterval;
                    break;
            }
            return time.clone().subtract(amount, unit);
        };
        TimeSelectService.prototype.increase = function (config, time, unit) {
            var amount = 1;
            switch (unit) {
                case 'minute':
                    amount = config.minutesInterval;
                    break;
                case 'second':
                    amount = config.secondsInterval;
                    break;
            }
            return time.clone().add(amount, unit);
        };
        TimeSelectService.prototype.toggleMeridiem = function (time) {
            if (time.hours() < FIRST_PM_HOUR) {
                return time.clone().add(12, 'hour');
            }
            else {
                return time.clone().subtract(12, 'hour');
            }
        };
        TimeSelectService.prototype.shouldShowDecrease = function (config, time, unit) {
            if (!config.min && !config.minTime) {
                return true;
            }
            var newTime = this.decrease(config, time, unit);
            return (!config.min || config.min.isSameOrBefore(newTime))
                && (!config.minTime || config.minTime.isSameOrBefore(this.utilsService.onlyTime(newTime)));
        };
        TimeSelectService.prototype.shouldShowIncrease = function (config, time, unit) {
            if (!config.max && !config.maxTime) {
                return true;
            }
            var newTime = this.increase(config, time, unit);
            return (!config.max || config.max.isSameOrAfter(newTime))
                && (!config.maxTime || config.maxTime.isSameOrAfter(this.utilsService.onlyTime(newTime)));
        };
        TimeSelectService.prototype.shouldShowToggleMeridiem = function (config, time) {
            if (!config.min && !config.max && !config.minTime && !config.maxTime) {
                return true;
            }
            var newTime = this.toggleMeridiem(time);
            return (!config.max || config.max.isSameOrAfter(newTime))
                && (!config.min || config.min.isSameOrBefore(newTime))
                && (!config.maxTime || config.maxTime.isSameOrAfter(this.utilsService.onlyTime(newTime)))
                && (!config.minTime || config.minTime.isSameOrBefore(this.utilsService.onlyTime(newTime)));
        };
        return TimeSelectService;
    }());
    TimeSelectService.decorators = [
        { type: i0.Injectable }
    ];
    TimeSelectService.ctorParameters = function () { return [
        { type: UtilsService }
    ]; };

    var moment$3 = momentNs__namespace;
    var DAY_FORMAT = 'YYYYMMDD';
    var TIME_FORMAT = 'HH:mm:ss';
    var COMBINED_FORMAT = DAY_FORMAT + TIME_FORMAT;
    var DayTimeCalendarService = /** @class */ (function () {
        function DayTimeCalendarService(utilsService, dayCalendarService, timeSelectService) {
            this.utilsService = utilsService;
            this.dayCalendarService = dayCalendarService;
            this.timeSelectService = timeSelectService;
            this.DEFAULT_CONFIG = {
                locale: moment$3.locale()
            };
        }
        DayTimeCalendarService.prototype.getConfig = function (config) {
            var _config = Object.assign(Object.assign(Object.assign({}, this.DEFAULT_CONFIG), this.timeSelectService.getConfig(config)), this.dayCalendarService.getConfig(config));
            moment$3.locale(config.locale);
            return _config;
        };
        DayTimeCalendarService.prototype.updateDay = function (current, day, config) {
            var time = current ? current : moment$3();
            var updated = moment$3(day.format(DAY_FORMAT) + time.format(TIME_FORMAT), COMBINED_FORMAT);
            if (config.min) {
                var min = config.min;
                updated = min.isAfter(updated) ? min : updated;
            }
            if (config.max) {
                var max = config.max;
                updated = max.isBefore(updated) ? max : updated;
            }
            return updated;
        };
        DayTimeCalendarService.prototype.updateTime = function (current, time) {
            var day = current ? current : moment$3();
            return moment$3(day.format(DAY_FORMAT) + time.format(TIME_FORMAT), COMBINED_FORMAT);
        };
        return DayTimeCalendarService;
    }());
    DayTimeCalendarService.decorators = [
        { type: i0.Injectable }
    ];
    DayTimeCalendarService.ctorParameters = function () { return [
        { type: UtilsService },
        { type: DayCalendarService },
        { type: TimeSelectService }
    ]; };

    var moment$4 = momentNs__namespace;
    var DatePickerService = /** @class */ (function () {
        function DatePickerService(utilsService, timeSelectService, daytimeCalendarService) {
            this.utilsService = utilsService;
            this.timeSelectService = timeSelectService;
            this.daytimeCalendarService = daytimeCalendarService;
            this.onPickerClosed = new i0.EventEmitter();
            this.defaultConfig = {
                closeOnSelect: true,
                closeOnSelectDelay: 100,
                closeOnEnter: true,
                format: 'DD-MM-YYYY',
                openOnFocus: true,
                openOnClick: true,
                onOpenDelay: 0,
                disableKeypress: false,
                showNearMonthDays: true,
                showWeekNumbers: false,
                enableMonthSelector: true,
                showGoToCurrent: true,
                locale: moment$4.locale(),
                hideOnOutsideClick: true
            };
        }
        // todo:: add unit tests
        DatePickerService.prototype.getConfig = function (config, mode) {
            if (mode === void 0) { mode = 'daytime'; }
            var _config = Object.assign(Object.assign(Object.assign({}, this.defaultConfig), { format: this.getDefaultFormatByMode(mode) }), this.utilsService.clearUndefined(config));
            this.utilsService.convertPropsToMoment(_config, _config.format, ['min', 'max']);
            if (config && config.allowMultiSelect && config.closeOnSelect === undefined) {
                _config.closeOnSelect = false;
            }
            moment$4.locale(_config.locale);
            return _config;
        };
        DatePickerService.prototype.getDayConfigService = function (pickerConfig) {
            return {
                min: pickerConfig.min,
                max: pickerConfig.max,
                isDayDisabledCallback: pickerConfig.isDayDisabledCallback,
                weekDayFormat: pickerConfig.weekDayFormat,
                weekDayFormatter: pickerConfig.weekDayFormatter,
                showNearMonthDays: pickerConfig.showNearMonthDays,
                showWeekNumbers: pickerConfig.showWeekNumbers,
                firstDayOfWeek: pickerConfig.firstDayOfWeek,
                format: pickerConfig.format,
                allowMultiSelect: pickerConfig.allowMultiSelect,
                monthFormat: pickerConfig.monthFormat,
                monthFormatter: pickerConfig.monthFormatter,
                enableMonthSelector: pickerConfig.enableMonthSelector,
                yearFormat: pickerConfig.yearFormat,
                yearFormatter: pickerConfig.yearFormatter,
                dayBtnFormat: pickerConfig.dayBtnFormat,
                dayBtnFormatter: pickerConfig.dayBtnFormatter,
                dayBtnCssClassCallback: pickerConfig.dayBtnCssClassCallback,
                monthBtnFormat: pickerConfig.monthBtnFormat,
                monthBtnFormatter: pickerConfig.monthBtnFormatter,
                monthBtnCssClassCallback: pickerConfig.monthBtnCssClassCallback,
                isMonthDisabledCallback: pickerConfig.isMonthDisabledCallback,
                multipleYearsNavigateBy: pickerConfig.multipleYearsNavigateBy,
                showMultipleYearsNavigation: pickerConfig.showMultipleYearsNavigation,
                locale: pickerConfig.locale,
                returnedValueType: pickerConfig.returnedValueType,
                showGoToCurrent: pickerConfig.showGoToCurrent,
                unSelectOnClick: pickerConfig.unSelectOnClick,
                numOfMonthRows: pickerConfig.numOfMonthRows
            };
        };
        DatePickerService.prototype.getDayTimeConfigService = function (pickerConfig) {
            return this.daytimeCalendarService.getConfig(pickerConfig);
        };
        DatePickerService.prototype.getTimeConfigService = function (pickerConfig) {
            return this.timeSelectService.getConfig(pickerConfig);
        };
        DatePickerService.prototype.pickerClosed = function () {
            this.onPickerClosed.emit();
        };
        // todo:: add unit tests
        DatePickerService.prototype.isValidInputDateValue = function (value, config) {
            var _this = this;
            value = value ? value : '';
            var datesStrArr = this.utilsService.datesStringToStringArray(value);
            return datesStrArr.every(function (date) { return _this.utilsService.isDateValid(date, config.format); });
        };
        // todo:: add unit tests
        DatePickerService.prototype.convertInputValueToMomentArray = function (value, config) {
            value = value ? value : '';
            var datesStrArr = this.utilsService.datesStringToStringArray(value);
            return this.utilsService.convertToMomentArray(datesStrArr, config);
        };
        DatePickerService.prototype.getDefaultFormatByMode = function (mode) {
            switch (mode) {
                case 'day':
                    return 'DD-MM-YYYY';
                case 'daytime':
                    return 'DD-MM-YYYY HH:mm:ss';
                case 'time':
                    return 'HH:mm:ss';
                case 'month':
                    return 'MMM, YYYY';
            }
        };
        return DatePickerService;
    }());
    DatePickerService.decorators = [
        { type: i0.Injectable }
    ];
    DatePickerService.ctorParameters = function () { return [
        { type: UtilsService },
        { type: TimeSelectService },
        { type: DayTimeCalendarService }
    ]; };

    var DatePickerComponent = /** @class */ (function () {
        function DatePickerComponent(dayPickerService, domHelper, elemRef, renderer, utilsService, cd) {
            this.dayPickerService = dayPickerService;
            this.domHelper = domHelper;
            this.elemRef = elemRef;
            this.renderer = renderer;
            this.utilsService = utilsService;
            this.cd = cd;
            this.isInitialized = false;
            this.mode = 'day';
            this.placeholder = '';
            this.disabled = false;
            this.open = new i0.EventEmitter();
            this.close = new i0.EventEmitter();
            this.onChange = new i0.EventEmitter();
            this.onGoToCurrent = new i0.EventEmitter();
            this.onLeftNav = new i0.EventEmitter();
            this.onRightNav = new i0.EventEmitter();
            this.onSelect = new i0.EventEmitter();
            this.hideStateHelper = false;
            this.isFocusedTrigger = false;
            this.handleInnerElementClickUnlisteners = [];
            this.globalListenersUnlisteners = [];
            this.api = {
                open: this.showCalendars.bind(this),
                close: this.hideCalendar.bind(this),
                moveCalendarTo: this.moveCalendarTo.bind(this)
            };
            this.selectEvent = exports.SelectEvent;
            this._areCalendarsShown = false;
            this._selected = [];
        }
        Object.defineProperty(DatePickerComponent.prototype, "openOnFocus", {
            get: function () {
                return this.componentConfig.openOnFocus;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatePickerComponent.prototype, "openOnClick", {
            get: function () {
                return this.componentConfig.openOnClick;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatePickerComponent.prototype, "areCalendarsShown", {
            get: function () {
                return this._areCalendarsShown;
            },
            set: function (value) {
                if (value) {
                    this.startGlobalListeners();
                    this.domHelper.appendElementToPosition({
                        container: this.appendToElement,
                        element: this.calendarWrapper,
                        anchor: this.inputElementContainer,
                        dimElem: this.popupElem,
                        drops: this.componentConfig.drops,
                        opens: this.componentConfig.opens
                    });
                }
                else {
                    this.stopGlobalListeners();
                    this.dayPickerService.pickerClosed();
                }
                this._areCalendarsShown = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatePickerComponent.prototype, "selected", {
            get: function () {
                return this._selected;
            },
            set: function (selected) {
                this._selected = selected;
                this.inputElementValue = this.utilsService
                    .convertFromMomentArray(this.componentConfig.format, selected, exports.ECalendarValue.StringArr)
                    .join(' | ');
                var val = this.processOnChangeCallback(selected);
                this.onChangeCallback(val, false);
                this.onChange.emit(val);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatePickerComponent.prototype, "currentDateView", {
            get: function () {
                return this._currentDateView;
            },
            set: function (date) {
                this._currentDateView = date;
                if (this.dayCalendarRef) {
                    this.dayCalendarRef.moveCalendarTo(date);
                }
                if (this.monthCalendarRef) {
                    this.monthCalendarRef.moveCalendarTo(date);
                }
                if (this.dayTimeCalendarRef) {
                    this.dayTimeCalendarRef.moveCalendarTo(date);
                }
            },
            enumerable: false,
            configurable: true
        });
        DatePickerComponent.prototype.onClick = function () {
            if (!this.openOnClick) {
                return;
            }
            if (!this.isFocusedTrigger && !this.disabled) {
                this.hideStateHelper = true;
                if (!this.areCalendarsShown) {
                    this.showCalendars();
                }
            }
        };
        DatePickerComponent.prototype.onBodyClick = function () {
            if (this.componentConfig.hideOnOutsideClick) {
                if (!this.hideStateHelper && this.areCalendarsShown) {
                    this.hideCalendar();
                }
                this.hideStateHelper = false;
            }
        };
        DatePickerComponent.prototype.onScroll = function () {
            if (this.areCalendarsShown) {
                this.domHelper.setElementPosition({
                    container: this.appendToElement,
                    element: this.calendarWrapper,
                    anchor: this.inputElementContainer,
                    dimElem: this.popupElem,
                    drops: this.componentConfig.drops,
                    opens: this.componentConfig.opens
                });
            }
        };
        DatePickerComponent.prototype.writeValue = function (value) {
            this.inputValue = value;
            if (value || value === '') {
                this.selected = this.utilsService
                    .convertToMomentArray(value, this.componentConfig);
                this.init();
            }
            else {
                this.selected = [];
            }
            this.cd.markForCheck();
        };
        DatePickerComponent.prototype.registerOnChange = function (fn) {
            this.onChangeCallback = fn;
        };
        DatePickerComponent.prototype.onChangeCallback = function (_, changedByInput) {
        };
        DatePickerComponent.prototype.registerOnTouched = function (fn) {
            this.onTouchedCallback = fn;
        };
        DatePickerComponent.prototype.onTouchedCallback = function () {
        };
        DatePickerComponent.prototype.validate = function (formControl) {
            return this.validateFn(formControl.value);
        };
        DatePickerComponent.prototype.processOnChangeCallback = function (selected) {
            if (typeof selected === 'string') {
                return selected;
            }
            else {
                return this.utilsService.convertFromMomentArray(this.componentConfig.format, selected, this.componentConfig.returnedValueType || this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect));
            }
        };
        DatePickerComponent.prototype.initValidators = function () {
            this.validateFn = this.utilsService.createValidator({
                minDate: this.minDate,
                maxDate: this.maxDate,
                minTime: this.minTime,
                maxTime: this.maxTime
            }, this.componentConfig.format, this.mode);
            this.onChangeCallback(this.processOnChangeCallback(this.selected), false);
        };
        DatePickerComponent.prototype.ngOnInit = function () {
            this.isInitialized = true;
            this.init();
        };
        DatePickerComponent.prototype.ngOnChanges = function (changes) {
            if (this.isInitialized) {
                this.init();
            }
        };
        DatePickerComponent.prototype.ngAfterViewInit = function () {
            this.setElementPositionInDom();
        };
        DatePickerComponent.prototype.setDisabledState = function (isDisabled) {
            this.disabled = isDisabled;
            this.cd.markForCheck();
        };
        DatePickerComponent.prototype.setElementPositionInDom = function () {
            this.calendarWrapper = this.calendarContainer.nativeElement;
            this.setInputElementContainer();
            this.popupElem = this.elemRef.nativeElement.querySelector('.dp-popup');
            this.handleInnerElementClick(this.popupElem);
            var appendTo = this.componentConfig.appendTo;
            if (appendTo) {
                if (typeof appendTo === 'string') {
                    this.appendToElement = document.querySelector(appendTo);
                }
                else {
                    this.appendToElement = appendTo;
                }
            }
            else {
                this.appendToElement = this.elemRef.nativeElement;
            }
            this.appendToElement.appendChild(this.calendarWrapper);
        };
        DatePickerComponent.prototype.setInputElementContainer = function () {
            this.inputElementContainer = this.utilsService.getNativeElement(this.componentConfig.inputElementContainer)
                || this.elemRef.nativeElement.querySelector('.dp-input-container')
                || document.body;
        };
        DatePickerComponent.prototype.handleInnerElementClick = function (element) {
            var _this = this;
            this.handleInnerElementClickUnlisteners.push(this.renderer.listen(element, 'click', function () {
                _this.hideStateHelper = true;
            }));
        };
        DatePickerComponent.prototype.init = function () {
            this.componentConfig = this.dayPickerService.getConfig(this.config, this.mode);
            this.currentDateView = this.displayDate
                ? this.utilsService.convertToMoment(this.displayDate, this.componentConfig.format).clone()
                : this.utilsService
                    .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min);
            this.dayCalendarConfig = this.dayPickerService.getDayConfigService(this.componentConfig);
            this.dayTimeCalendarConfig = this.dayPickerService.getDayTimeConfigService(this.componentConfig);
            this.timeSelectConfig = this.dayPickerService.getTimeConfigService(this.componentConfig);
            this.initValidators();
        };
        DatePickerComponent.prototype.inputFocused = function () {
            var _this = this;
            if (!this.openOnFocus) {
                return;
            }
            clearTimeout(this.onOpenDelayTimeoutHandler);
            this.isFocusedTrigger = true;
            this.onOpenDelayTimeoutHandler = setTimeout(function () {
                if (!_this.areCalendarsShown) {
                    _this.showCalendars();
                }
                _this.hideStateHelper = false;
                _this.isFocusedTrigger = false;
                _this.cd.markForCheck();
            }, this.componentConfig.onOpenDelay);
        };
        DatePickerComponent.prototype.inputBlurred = function () {
            clearTimeout(this.onOpenDelayTimeoutHandler);
            this.onTouchedCallback();
        };
        DatePickerComponent.prototype.showCalendars = function () {
            this.hideStateHelper = true;
            this.areCalendarsShown = true;
            if (this.timeSelectRef) {
                this.timeSelectRef.api.triggerChange();
            }
            this.open.emit();
            this.cd.markForCheck();
        };
        DatePickerComponent.prototype.hideCalendar = function () {
            this.areCalendarsShown = false;
            if (this.dayCalendarRef) {
                this.dayCalendarRef.api.toggleCalendarMode(exports.ECalendarMode.Day);
            }
            this.close.emit();
            this.cd.markForCheck();
        };
        DatePickerComponent.prototype.onViewDateChange = function (value) {
            var strVal = value ? this.utilsService.convertToString(value, this.componentConfig.format) : '';
            if (this.dayPickerService.isValidInputDateValue(strVal, this.componentConfig)) {
                this.selected = this.dayPickerService.convertInputValueToMomentArray(strVal, this.componentConfig);
                this.currentDateView = this.selected.length
                    ? this.utilsService.getDefaultDisplayDate(null, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min)
                    : this.currentDateView;
                this.onSelect.emit({
                    date: strVal,
                    type: exports.SelectEvent.INPUT,
                    granularity: null
                });
            }
            else {
                this._selected = this.utilsService
                    .getValidMomentArray(strVal, this.componentConfig.format);
                this.onChangeCallback(this.processOnChangeCallback(strVal), true);
            }
        };
        DatePickerComponent.prototype.dateSelected = function (date, granularity, type, ignoreClose) {
            this.selected = this.utilsService
                .updateSelected(this.componentConfig.allowMultiSelect, this.selected, date, granularity);
            if (!ignoreClose) {
                this.onDateClick();
            }
            this.onSelect.emit({
                date: date.date,
                granularity: granularity,
                type: type
            });
        };
        DatePickerComponent.prototype.onDateClick = function () {
            if (this.componentConfig.closeOnSelect) {
                setTimeout(this.hideCalendar.bind(this), this.componentConfig.closeOnSelectDelay);
            }
        };
        DatePickerComponent.prototype.onKeyPress = function (event) {
            switch (event.keyCode) {
                case (9):
                case (27):
                    this.hideCalendar();
                    break;
            }
        };
        DatePickerComponent.prototype.moveCalendarTo = function (date) {
            var momentDate = this.utilsService.convertToMoment(date, this.componentConfig.format);
            this.currentDateView = momentDate;
        };
        DatePickerComponent.prototype.onLeftNavClick = function (change) {
            this.onLeftNav.emit(change);
        };
        DatePickerComponent.prototype.onRightNavClick = function (change) {
            this.onRightNav.emit(change);
        };
        DatePickerComponent.prototype.startGlobalListeners = function () {
            var _this = this;
            this.globalListenersUnlisteners.push(this.renderer.listen(document, 'keydown', function (e) {
                _this.onKeyPress(e);
            }), this.renderer.listen(document, 'scroll', function () {
                _this.onScroll();
            }), this.renderer.listen(document, 'click', function () {
                _this.onBodyClick();
            }));
        };
        DatePickerComponent.prototype.stopGlobalListeners = function () {
            this.globalListenersUnlisteners.forEach(function (ul) { return ul(); });
            this.globalListenersUnlisteners = [];
        };
        DatePickerComponent.prototype.ngOnDestroy = function () {
            this.handleInnerElementClickUnlisteners.forEach(function (ul) { return ul(); });
            if (this.appendToElement) {
                this.appendToElement.removeChild(this.calendarWrapper);
            }
        };
        return DatePickerComponent;
    }());
    DatePickerComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'dp-date-picker',
                    template: "<div [ngClass]=\"{'dp-open': areCalendarsShown}\">\n  <div [attr.data-hidden]=\"componentConfig.hideInputContainer\"\n       [hidden]=\"componentConfig.hideInputContainer\"\n       class=\"dp-input-container\">\n    <input (blur)=\"inputBlurred()\"\n           (focus)=\"inputFocused()\"\n           (keydown.enter)=\"componentConfig.closeOnEnter && hideCalendar()\"\n           (ngModelChange)=\"onViewDateChange($event)\"\n           [disabled]=\"disabled\"\n           [ngModel]=\"inputElementValue\"\n           [placeholder]=\"placeholder\"\n           [readonly]=\"componentConfig.disableKeypress\"\n           class=\"dp-picker-input\"\n           type=\"text\"/>\n  </div>\n  <div #container>\n    <div [attr.data-hidden]=\"!_areCalendarsShown\"\n         [hidden]=\"!_areCalendarsShown\"\n         [ngSwitch]=\"mode\"\n         class=\"dp-popup {{theme}}\">\n      <dp-day-calendar #dayCalendar\n                       (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                       (onLeftNav)=\"onLeftNavClick($event)\"\n                       (onRightNav)=\"onRightNavClick($event)\"\n                       (onSelect)=\"dateSelected($event, 'day', selectEvent.SELECTION, false)\"\n                       *ngSwitchCase=\"'day'\"\n                       [config]=\"dayCalendarConfig\"\n                       [displayDate]=\"displayDate\"\n                       [ngModel]=\"_selected\"\n                       [theme]=\"theme\">\n      </dp-day-calendar>\n\n      <dp-month-calendar #monthCalendar\n                         (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                         (onLeftNav)=\"onLeftNavClick($event)\"\n                         (onRightNav)=\"onRightNavClick($event)\"\n                         (onSelect)=\"dateSelected($event, 'month', selectEvent.SELECTION, false)\"\n                         *ngSwitchCase=\"'month'\"\n                         [config]=\"dayCalendarConfig\"\n                         [displayDate]=\"displayDate\"\n                         [ngModel]=\"_selected\"\n                         [theme]=\"theme\">\n      </dp-month-calendar>\n\n      <dp-time-select #timeSelect\n                      (onChange)=\"dateSelected($event, 'second', selectEvent.SELECTION, true)\"\n                      *ngSwitchCase=\"'time'\"\n                      [config]=\"timeSelectConfig\"\n                      [ngModel]=\"_selected && _selected[0]\"\n                      [theme]=\"theme\">\n      </dp-time-select>\n\n      <dp-day-time-calendar #daytimeCalendar\n                            (onChange)=\"dateSelected($event, 'second', selectEvent.SELECTION, true)\"\n                            (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                            (onLeftNav)=\"onLeftNavClick($event)\"\n                            (onRightNav)=\"onRightNavClick($event)\"\n                            *ngSwitchCase=\"'daytime'\"\n                            [config]=\"dayTimeCalendarConfig\"\n                            [displayDate]=\"displayDate\"\n                            [ngModel]=\"_selected && _selected[0]\"\n                            [theme]=\"theme\">\n      </dp-day-time-calendar>\n    </div>\n  </div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.None,
                    changeDetection: i0.ChangeDetectionStrategy.OnPush,
                    providers: [
                        DatePickerService,
                        DayTimeCalendarService,
                        DayCalendarService,
                        TimeSelectService,
                        {
                            provide: forms.NG_VALUE_ACCESSOR,
                            useExisting: i0.forwardRef(function () { return DatePickerComponent; }),
                            multi: true
                        },
                        {
                            provide: forms.NG_VALIDATORS,
                            useExisting: i0.forwardRef(function () { return DatePickerComponent; }),
                            multi: true
                        }
                    ],
                    styles: [""]
                },] }
    ];
    DatePickerComponent.ctorParameters = function () { return [
        { type: DatePickerService },
        { type: DomHelper },
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: UtilsService },
        { type: i0.ChangeDetectorRef }
    ]; };
    DatePickerComponent.propDecorators = {
        config: [{ type: i0.Input }],
        mode: [{ type: i0.Input }],
        placeholder: [{ type: i0.Input }],
        disabled: [{ type: i0.Input }],
        displayDate: [{ type: i0.Input }],
        theme: [{ type: i0.HostBinding, args: ['class',] }, { type: i0.Input }],
        minDate: [{ type: i0.Input }],
        maxDate: [{ type: i0.Input }],
        minTime: [{ type: i0.Input }],
        maxTime: [{ type: i0.Input }],
        open: [{ type: i0.Output }],
        close: [{ type: i0.Output }],
        onChange: [{ type: i0.Output }],
        onGoToCurrent: [{ type: i0.Output }],
        onLeftNav: [{ type: i0.Output }],
        onRightNav: [{ type: i0.Output }],
        onSelect: [{ type: i0.Output }],
        calendarContainer: [{ type: i0.ViewChild, args: ['container',] }],
        dayCalendarRef: [{ type: i0.ViewChild, args: ['dayCalendar',] }],
        monthCalendarRef: [{ type: i0.ViewChild, args: ['monthCalendar',] }],
        dayTimeCalendarRef: [{ type: i0.ViewChild, args: ['daytimeCalendar',] }],
        timeSelectRef: [{ type: i0.ViewChild, args: ['timeSelect',] }],
        onClick: [{ type: i0.HostListener, args: ['click',] }],
        onScroll: [{ type: i0.HostListener, args: ['window:resize',] }]
    };

    var DatePickerDirectiveService = /** @class */ (function () {
        function DatePickerDirectiveService(utilsService) {
            this.utilsService = utilsService;
        }
        DatePickerDirectiveService.prototype.convertToHTMLElement = function (attachTo, baseElement) {
            if (typeof attachTo === 'string') {
                return this.utilsService.closestParent(baseElement, attachTo);
            }
            else if (attachTo) {
                return attachTo.nativeElement;
            }
            return undefined;
        };
        DatePickerDirectiveService.prototype.getConfig = function (config, baseElement, attachTo) {
            if (config === void 0) { config = {}; }
            var _config = Object.assign({}, config);
            _config.hideInputContainer = true;
            var native;
            if (config.inputElementContainer) {
                native = this.utilsService.getNativeElement(config.inputElementContainer);
            }
            else {
                native = baseElement ? baseElement.nativeElement : null;
            }
            if (native) {
                _config.inputElementContainer = attachTo
                    ? this.convertToHTMLElement(attachTo, native)
                    : native;
            }
            return _config;
        };
        return DatePickerDirectiveService;
    }());
    DatePickerDirectiveService.decorators = [
        { type: i0.Injectable }
    ];
    DatePickerDirectiveService.ctorParameters = function () { return [
        { type: UtilsService }
    ]; };

    var DatePickerDirective = /** @class */ (function () {
        function DatePickerDirective(viewContainerRef, elemRef, componentFactoryResolver, service, formControl, utilsService) {
            this.viewContainerRef = viewContainerRef;
            this.elemRef = elemRef;
            this.componentFactoryResolver = componentFactoryResolver;
            this.service = service;
            this.formControl = formControl;
            this.utilsService = utilsService;
            this.open = new i0.EventEmitter();
            this.close = new i0.EventEmitter();
            this.onChange = new i0.EventEmitter();
            this.onGoToCurrent = new i0.EventEmitter();
            this.onLeftNav = new i0.EventEmitter();
            this.onRightNav = new i0.EventEmitter();
            this.onSelect = new i0.EventEmitter();
            this._mode = 'day';
        }
        Object.defineProperty(DatePickerDirective.prototype, "config", {
            get: function () {
                return this._config;
            },
            set: function (config) {
                this._config = this.service.getConfig(config, this.viewContainerRef.element, this.attachTo);
                this.updateDatepickerConfig();
                this.markForCheck();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatePickerDirective.prototype, "attachTo", {
            get: function () {
                return this._attachTo;
            },
            set: function (attachTo) {
                this._attachTo = attachTo;
                this._config = this.service.getConfig(this.config, this.viewContainerRef.element, this.attachTo);
                this.updateDatepickerConfig();
                this.markForCheck();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatePickerDirective.prototype, "theme", {
            get: function () {
                return this._theme;
            },
            set: function (theme) {
                this._theme = theme;
                if (this.datePicker) {
                    this.datePicker.theme = theme;
                }
                this.markForCheck();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatePickerDirective.prototype, "mode", {
            get: function () {
                return this._mode;
            },
            set: function (mode) {
                this._mode = mode;
                if (this.datePicker) {
                    this.datePicker.mode = mode;
                }
                this.markForCheck();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatePickerDirective.prototype, "minDate", {
            get: function () {
                return this._minDate;
            },
            set: function (minDate) {
                this._minDate = minDate;
                if (this.datePicker) {
                    this.datePicker.minDate = minDate;
                    this.datePicker.ngOnInit();
                }
                this.markForCheck();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatePickerDirective.prototype, "maxDate", {
            get: function () {
                return this._maxDate;
            },
            set: function (maxDate) {
                this._maxDate = maxDate;
                if (this.datePicker) {
                    this.datePicker.maxDate = maxDate;
                    this.datePicker.ngOnInit();
                }
                this.markForCheck();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatePickerDirective.prototype, "minTime", {
            get: function () {
                return this._minTime;
            },
            set: function (minTime) {
                this._minTime = minTime;
                if (this.datePicker) {
                    this.datePicker.minTime = minTime;
                    this.datePicker.ngOnInit();
                }
                this.markForCheck();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatePickerDirective.prototype, "maxTime", {
            get: function () {
                return this._maxTime;
            },
            set: function (maxTime) {
                this._maxTime = maxTime;
                if (this.datePicker) {
                    this.datePicker.maxTime = maxTime;
                    this.datePicker.ngOnInit();
                }
                this.markForCheck();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatePickerDirective.prototype, "displayDate", {
            get: function () {
                return this._displayDate;
            },
            set: function (displayDate) {
                this._displayDate = displayDate;
                this.updateDatepickerConfig();
                this.markForCheck();
            },
            enumerable: false,
            configurable: true
        });
        DatePickerDirective.prototype.ngOnInit = function () {
            this.datePicker = this.createDatePicker();
            this.api = this.datePicker.api;
            this.updateDatepickerConfig();
            this.attachModelToDatePicker();
            this.datePicker.theme = this.theme;
        };
        DatePickerDirective.prototype.createDatePicker = function () {
            var factory = this.componentFactoryResolver.resolveComponentFactory(DatePickerComponent);
            return this.viewContainerRef.createComponent(factory).instance;
        };
        DatePickerDirective.prototype.attachModelToDatePicker = function () {
            var _this = this;
            if (!this.formControl) {
                return;
            }
            this.datePicker.onViewDateChange(this.formControl.value);
            this.formControl.valueChanges.subscribe(function (value) {
                if (value !== _this.datePicker.inputElementValue) {
                    var strVal = _this.utilsService.convertToString(value, _this.datePicker.componentConfig.format);
                    _this.datePicker.onViewDateChange(strVal);
                }
            });
            var setup = true;
            this.datePicker.registerOnChange(function (value, changedByInput) {
                if (value) {
                    var isMultiselectEmpty = setup && Array.isArray(value) && !value.length;
                    if (!isMultiselectEmpty && !changedByInput) {
                        _this.formControl.control.setValue(_this.datePicker.inputElementValue);
                    }
                }
                var errors = _this.datePicker.validateFn(value);
                if (!setup) {
                    _this.formControl.control.markAsDirty({
                        onlySelf: true
                    });
                }
                else {
                    setup = false;
                }
                if (errors) {
                    if (errors.hasOwnProperty('format')) {
                        var given = errors['format'].given;
                        _this.datePicker.inputElementValue = given;
                        if (!changedByInput) {
                            _this.formControl.control.setValue(given);
                        }
                    }
                    _this.formControl.control.setErrors(errors);
                }
            });
        };
        DatePickerDirective.prototype.onClick = function () {
            this.datePicker.onClick();
        };
        DatePickerDirective.prototype.onFocus = function () {
            this.datePicker.inputFocused();
        };
        DatePickerDirective.prototype.onEnter = function () {
            if (this.datePicker.componentConfig.closeOnEnter) {
                this.datePicker.hideCalendar();
            }
        };
        DatePickerDirective.prototype.markForCheck = function () {
            if (this.datePicker) {
                this.datePicker.cd.markForCheck();
            }
        };
        DatePickerDirective.prototype.updateDatepickerConfig = function () {
            if (this.datePicker) {
                this.datePicker.minDate = this.minDate;
                this.datePicker.maxDate = this.maxDate;
                this.datePicker.minTime = this.minTime;
                this.datePicker.maxTime = this.maxTime;
                this.datePicker.mode = this.mode || 'day';
                this.datePicker.displayDate = this.displayDate;
                this.datePicker.config = this.config;
                this.datePicker.open = this.open;
                this.datePicker.close = this.close;
                this.datePicker.onChange = this.onChange;
                this.datePicker.onGoToCurrent = this.onGoToCurrent;
                this.datePicker.onLeftNav = this.onLeftNav;
                this.datePicker.onRightNav = this.onRightNav;
                this.datePicker.onSelect = this.onSelect;
                this.datePicker.init();
                if (this.datePicker.componentConfig.disableKeypress) {
                    this.elemRef.nativeElement.setAttribute('readonly', true);
                }
                else {
                    this.elemRef.nativeElement.removeAttribute('readonly');
                }
            }
        };
        return DatePickerDirective;
    }());
    DatePickerDirective.decorators = [
        { type: i0.Directive, args: [{
                    exportAs: 'dpDayPicker',
                    providers: [DatePickerDirectiveService],
                    selector: '[dpDayPicker]'
                },] }
    ];
    DatePickerDirective.ctorParameters = function () { return [
        { type: i0.ViewContainerRef },
        { type: i0.ElementRef },
        { type: i0.ComponentFactoryResolver },
        { type: DatePickerDirectiveService },
        { type: forms.NgControl, decorators: [{ type: i0.Optional }] },
        { type: UtilsService }
    ]; };
    DatePickerDirective.propDecorators = {
        open: [{ type: i0.Output }],
        close: [{ type: i0.Output }],
        onChange: [{ type: i0.Output }],
        onGoToCurrent: [{ type: i0.Output }],
        onLeftNav: [{ type: i0.Output }],
        onRightNav: [{ type: i0.Output }],
        onSelect: [{ type: i0.Output }],
        config: [{ type: i0.Input, args: ['dpDayPicker',] }],
        attachTo: [{ type: i0.Input }],
        theme: [{ type: i0.Input }],
        mode: [{ type: i0.Input }],
        minDate: [{ type: i0.Input }],
        maxDate: [{ type: i0.Input }],
        minTime: [{ type: i0.Input }],
        maxTime: [{ type: i0.Input }],
        displayDate: [{ type: i0.Input }],
        onClick: [{ type: i0.HostListener, args: ['click',] }],
        onFocus: [{ type: i0.HostListener, args: ['focus',] }],
        onEnter: [{ type: i0.HostListener, args: ['keydown.enter',] }]
    };

    var moment$5 = momentNs__namespace;
    var DayCalendarComponent = /** @class */ (function () {
        function DayCalendarComponent(dayCalendarService, utilsService, cd) {
            this.dayCalendarService = dayCalendarService;
            this.utilsService = utilsService;
            this.cd = cd;
            this.onSelect = new i0.EventEmitter();
            this.onMonthSelect = new i0.EventEmitter();
            this.onNavHeaderBtnClick = new i0.EventEmitter();
            this.onGoToCurrent = new i0.EventEmitter();
            this.onLeftNav = new i0.EventEmitter();
            this.onRightNav = new i0.EventEmitter();
            this.CalendarMode = exports.ECalendarMode;
            this.isInited = false;
            this.currentCalendarMode = exports.ECalendarMode.Day;
            this._shouldShowCurrent = true;
            this.api = {
                moveCalendarsBy: this.moveCalendarsBy.bind(this),
                moveCalendarTo: this.moveCalendarTo.bind(this),
                toggleCalendarMode: this.toggleCalendarMode.bind(this)
            };
        }
        Object.defineProperty(DayCalendarComponent.prototype, "selected", {
            get: function () {
                return this._selected;
            },
            set: function (selected) {
                this._selected = selected;
                this.onChangeCallback(this.processOnChangeCallback(selected));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DayCalendarComponent.prototype, "currentDateView", {
            get: function () {
                return this._currentDateView;
            },
            set: function (current) {
                this._currentDateView = current.clone();
                this.weeks = this.dayCalendarService
                    .generateMonthArray(this.componentConfig, this._currentDateView, this.selected);
                this.navLabel = this.dayCalendarService.getHeaderLabel(this.componentConfig, this._currentDateView);
                this.showLeftNav = this.dayCalendarService.shouldShowLeft(this.componentConfig.min, this.currentDateView);
                this.showRightNav = this.dayCalendarService.shouldShowRight(this.componentConfig.max, this.currentDateView);
            },
            enumerable: false,
            configurable: true
        });
        ;
        DayCalendarComponent.prototype.ngOnInit = function () {
            this.isInited = true;
            this.init();
            this.initValidators();
        };
        DayCalendarComponent.prototype.init = function () {
            this.componentConfig = this.dayCalendarService.getConfig(this.config);
            this.selected = this.selected || [];
            this.currentDateView = this.displayDate
                ? this.utilsService.convertToMoment(this.displayDate, this.componentConfig.format).clone()
                : this.utilsService
                    .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min);
            this.weekdays = this.dayCalendarService
                .generateWeekdays(this.componentConfig.firstDayOfWeek);
            this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
            this.monthCalendarConfig = this.dayCalendarService.getMonthCalendarConfig(this.componentConfig);
            this._shouldShowCurrent = this.shouldShowCurrent();
        };
        DayCalendarComponent.prototype.ngOnChanges = function (changes) {
            if (this.isInited) {
                var minDate = changes.minDate, maxDate = changes.maxDate, config = changes.config;
                this.handleConfigChange(config);
                this.init();
                if (minDate || maxDate) {
                    this.initValidators();
                }
            }
        };
        DayCalendarComponent.prototype.writeValue = function (value) {
            this.inputValue = value;
            if (value) {
                this.selected = this.utilsService
                    .convertToMomentArray(value, this.componentConfig);
                this.inputValueType = this.utilsService
                    .getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
            }
            else {
                this.selected = [];
            }
            this.weeks = this.dayCalendarService
                .generateMonthArray(this.componentConfig, this.currentDateView, this.selected);
            this.cd.markForCheck();
        };
        DayCalendarComponent.prototype.registerOnChange = function (fn) {
            this.onChangeCallback = fn;
        };
        DayCalendarComponent.prototype.onChangeCallback = function (_) {
        };
        DayCalendarComponent.prototype.registerOnTouched = function (fn) {
        };
        DayCalendarComponent.prototype.validate = function (formControl) {
            if (this.minDate || this.maxDate) {
                return this.validateFn(formControl.value);
            }
            else {
                return function () { return null; };
            }
        };
        DayCalendarComponent.prototype.processOnChangeCallback = function (value) {
            return this.utilsService.convertFromMomentArray(this.componentConfig.format, value, this.componentConfig.returnedValueType || this.inputValueType);
        };
        DayCalendarComponent.prototype.initValidators = function () {
            this.validateFn = this.utilsService.createValidator({ minDate: this.minDate, maxDate: this.maxDate }, this.componentConfig.format, 'day');
            this.onChangeCallback(this.processOnChangeCallback(this.selected));
        };
        DayCalendarComponent.prototype.dayClicked = function (day) {
            if (day.selected && !this.componentConfig.unSelectOnClick) {
                return;
            }
            this.selected = this.utilsService
                .updateSelected(this.componentConfig.allowMultiSelect, this.selected, day);
            this.weeks = this.dayCalendarService
                .generateMonthArray(this.componentConfig, this.currentDateView, this.selected);
            this.onSelect.emit(day);
        };
        DayCalendarComponent.prototype.getDayBtnText = function (day) {
            return this.dayCalendarService.getDayBtnText(this.componentConfig, day.date);
        };
        DayCalendarComponent.prototype.getDayBtnCssClass = function (day) {
            var cssClasses = {
                'dp-selected': day.selected,
                'dp-current-month': day.currentMonth,
                'dp-prev-month': day.prevMonth,
                'dp-next-month': day.nextMonth,
                'dp-current-day': day.currentDay
            };
            var customCssClass = this.dayCalendarService.getDayBtnCssClass(this.componentConfig, day.date);
            if (customCssClass) {
                cssClasses[customCssClass] = true;
            }
            return cssClasses;
        };
        DayCalendarComponent.prototype.onLeftNavClick = function () {
            var from = this.currentDateView.clone();
            this.moveCalendarsBy(this.currentDateView, -1, 'month');
            var to = this.currentDateView.clone();
            this.onLeftNav.emit({ from: from, to: to });
        };
        DayCalendarComponent.prototype.onRightNavClick = function () {
            var from = this.currentDateView.clone();
            this.moveCalendarsBy(this.currentDateView, 1, 'month');
            var to = this.currentDateView.clone();
            this.onRightNav.emit({ from: from, to: to });
        };
        DayCalendarComponent.prototype.onMonthCalendarLeftClick = function (change) {
            this.onLeftNav.emit(change);
        };
        DayCalendarComponent.prototype.onMonthCalendarRightClick = function (change) {
            this.onRightNav.emit(change);
        };
        DayCalendarComponent.prototype.onMonthCalendarSecondaryLeftClick = function (change) {
            this.onRightNav.emit(change);
        };
        DayCalendarComponent.prototype.onMonthCalendarSecondaryRightClick = function (change) {
            this.onLeftNav.emit(change);
        };
        DayCalendarComponent.prototype.getWeekdayName = function (weekday) {
            if (this.componentConfig.weekDayFormatter) {
                return this.componentConfig.weekDayFormatter(weekday.day());
            }
            return weekday.format(this.componentConfig.weekDayFormat);
        };
        DayCalendarComponent.prototype.toggleCalendarMode = function (mode) {
            if (this.currentCalendarMode !== mode) {
                this.currentCalendarMode = mode;
                this.onNavHeaderBtnClick.emit(mode);
            }
            this.cd.markForCheck();
        };
        DayCalendarComponent.prototype.monthSelected = function (month) {
            this.currentDateView = month.date.clone();
            this.currentCalendarMode = exports.ECalendarMode.Day;
            this.onMonthSelect.emit(month);
        };
        DayCalendarComponent.prototype.moveCalendarsBy = function (current, amount, granularity) {
            if (granularity === void 0) { granularity = 'month'; }
            this.currentDateView = current.clone().add(amount, granularity);
            this.cd.markForCheck();
        };
        DayCalendarComponent.prototype.moveCalendarTo = function (to) {
            if (to) {
                this.currentDateView = this.utilsService.convertToMoment(to, this.componentConfig.format);
            }
            this.cd.markForCheck();
        };
        DayCalendarComponent.prototype.shouldShowCurrent = function () {
            return this.utilsService.shouldShowCurrent(this.componentConfig.showGoToCurrent, 'day', this.componentConfig.min, this.componentConfig.max);
        };
        DayCalendarComponent.prototype.goToCurrent = function () {
            this.currentDateView = moment$5();
            this.onGoToCurrent.emit();
        };
        DayCalendarComponent.prototype.handleConfigChange = function (config) {
            if (config) {
                var prevConf = this.dayCalendarService.getConfig(config.previousValue);
                var currentConf_1 = this.dayCalendarService.getConfig(config.currentValue);
                if (this.utilsService.shouldResetCurrentView(prevConf, currentConf_1)) {
                    this._currentDateView = null;
                }
                if (prevConf.locale !== currentConf_1.locale) {
                    if (this.currentDateView) {
                        this.currentDateView.locale(currentConf_1.locale);
                    }
                    this.selected.forEach(function (m) { return m.locale(currentConf_1.locale); });
                }
            }
        };
        return DayCalendarComponent;
    }());
    DayCalendarComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'dp-day-calendar',
                    template: "<div *ngIf=\"currentCalendarMode ===  CalendarMode.Day\" class=\"dp-day-calendar-container\">\n  <dp-calendar-nav\n      (onGoToCurrent)=\"goToCurrent()\"\n      (onLabelClick)=\"toggleCalendarMode(CalendarMode.Month)\"\n      (onLeftNav)=\"onLeftNavClick()\"\n      (onRightNav)=\"onRightNavClick()\"\n      [isLabelClickable]=\"componentConfig.enableMonthSelector\"\n      [label]=\"navLabel\"\n      [showGoToCurrent]=\"_shouldShowCurrent\"\n      [showLeftNav]=\"showLeftNav\"\n      [showRightNav]=\"showRightNav\"\n      [theme]=\"theme\">\n  </dp-calendar-nav>\n\n  <div [ngClass]=\"{'dp-hide-near-month': !componentConfig.showNearMonthDays}\"\n       class=\"dp-calendar-wrapper\">\n    <div class=\"dp-weekdays\">\n      <span *ngFor=\"let weekday of weekdays\"\n            [innerText]=\"getWeekdayName(weekday)\"\n            class=\"dp-calendar-weekday\">\n      </span>\n    </div>\n    <div *ngFor=\"let week of weeks\" class=\"dp-calendar-week\">\n      <span *ngIf=\"componentConfig.showWeekNumbers\"\n            [innerText]=\"week[0].date.isoWeek()\"\n            class=\"dp-week-number\">\n      </span>\n      <button (click)=\"dayClicked(day)\"\n              *ngFor=\"let day of week\"\n              [attr.data-date]=\"day.date.format(componentConfig.format)\"\n              [disabled]=\"day.disabled\"\n              [innerText]=\"getDayBtnText(day)\"\n              [ngClass]=\"getDayBtnCssClass(day)\"\n              class=\"dp-calendar-day\"\n              type=\"button\">\n      </button>\n    </div>\n  </div>\n</div>\n\n<dp-month-calendar\n    (onLeftNav)=\"onMonthCalendarLeftClick($event)\"\n    (onLeftSecondaryNav)=\"onMonthCalendarSecondaryLeftClick($event)\"\n    (onNavHeaderBtnClick)=\"toggleCalendarMode(CalendarMode.Day)\"\n    (onRightNav)=\"onMonthCalendarRightClick($event)\"\n    (onRightSecondaryNav)=\"onMonthCalendarSecondaryRightClick($event)\"\n    (onSelect)=\"monthSelected($event)\"\n    *ngIf=\"currentCalendarMode ===  CalendarMode.Month\"\n    [config]=\"monthCalendarConfig\"\n    [displayDate]=\"_currentDateView\"\n    [ngModel]=\"_selected\"\n    [theme]=\"theme\">\n</dp-month-calendar>\n",
                    encapsulation: i0.ViewEncapsulation.None,
                    changeDetection: i0.ChangeDetectionStrategy.OnPush,
                    providers: [
                        DayCalendarService,
                        {
                            provide: forms.NG_VALUE_ACCESSOR,
                            useExisting: i0.forwardRef(function () { return DayCalendarComponent; }),
                            multi: true
                        },
                        {
                            provide: forms.NG_VALIDATORS,
                            useExisting: i0.forwardRef(function () { return DayCalendarComponent; }),
                            multi: true
                        }
                    ],
                    styles: [""]
                },] }
    ];
    DayCalendarComponent.ctorParameters = function () { return [
        { type: DayCalendarService },
        { type: UtilsService },
        { type: i0.ChangeDetectorRef }
    ]; };
    DayCalendarComponent.propDecorators = {
        config: [{ type: i0.Input }],
        displayDate: [{ type: i0.Input }],
        minDate: [{ type: i0.Input }],
        maxDate: [{ type: i0.Input }],
        theme: [{ type: i0.HostBinding, args: ['class',] }, { type: i0.Input }],
        onSelect: [{ type: i0.Output }],
        onMonthSelect: [{ type: i0.Output }],
        onNavHeaderBtnClick: [{ type: i0.Output }],
        onGoToCurrent: [{ type: i0.Output }],
        onLeftNav: [{ type: i0.Output }],
        onRightNav: [{ type: i0.Output }]
    };

    var moment$6 = momentNs__namespace;
    var MonthCalendarService = /** @class */ (function () {
        function MonthCalendarService(utilsService) {
            this.utilsService = utilsService;
            this.DEFAULT_CONFIG = {
                allowMultiSelect: false,
                yearFormat: 'YYYY',
                format: 'MM-YYYY',
                isNavHeaderBtnClickable: false,
                monthBtnFormat: 'MMM',
                locale: moment$6.locale(),
                multipleYearsNavigateBy: 10,
                showMultipleYearsNavigation: false,
                unSelectOnClick: true,
                numOfMonthRows: 3
            };
        }
        MonthCalendarService.prototype.getConfig = function (config) {
            var _config = Object.assign(Object.assign({}, this.DEFAULT_CONFIG), this.utilsService.clearUndefined(config));
            this.validateConfig(_config);
            this.utilsService.convertPropsToMoment(_config, _config.format, ['min', 'max']);
            moment$6.locale(_config.locale);
            return _config;
        };
        MonthCalendarService.prototype.generateYear = function (config, year, selected) {
            var _this = this;
            if (selected === void 0) { selected = null; }
            var index = year.clone().startOf('year');
            return this.utilsService.createArray(config.numOfMonthRows).map(function () {
                return _this.utilsService.createArray(12 / config.numOfMonthRows).map(function () {
                    var date = index.clone();
                    var month = {
                        date: date,
                        selected: !!selected.find(function (s) { return index.isSame(s, 'month'); }),
                        currentMonth: index.isSame(moment$6(), 'month'),
                        disabled: _this.isMonthDisabled(date, config),
                        text: _this.getMonthBtnText(config, date)
                    };
                    index.add(1, 'month');
                    return month;
                });
            });
        };
        MonthCalendarService.prototype.isMonthDisabled = function (date, config) {
            if (config.isMonthDisabledCallback) {
                return config.isMonthDisabledCallback(date);
            }
            if (config.min && date.isBefore(config.min, 'month')) {
                return true;
            }
            return !!(config.max && date.isAfter(config.max, 'month'));
        };
        MonthCalendarService.prototype.shouldShowLeft = function (min, currentMonthView) {
            return min ? min.isBefore(currentMonthView, 'year') : true;
        };
        MonthCalendarService.prototype.shouldShowRight = function (max, currentMonthView) {
            return max ? max.isAfter(currentMonthView, 'year') : true;
        };
        MonthCalendarService.prototype.getHeaderLabel = function (config, year) {
            if (config.yearFormatter) {
                return config.yearFormatter(year);
            }
            return year.format(config.yearFormat);
        };
        MonthCalendarService.prototype.getMonthBtnText = function (config, month) {
            if (config.monthBtnFormatter) {
                return config.monthBtnFormatter(month);
            }
            return month.format(config.monthBtnFormat);
        };
        MonthCalendarService.prototype.getMonthBtnCssClass = function (config, month) {
            if (config.monthBtnCssClassCallback) {
                return config.monthBtnCssClassCallback(month);
            }
            return '';
        };
        MonthCalendarService.prototype.validateConfig = function (config) {
            if (config.numOfMonthRows < 1 || config.numOfMonthRows > 12 || !Number.isInteger(12 / config.numOfMonthRows)) {
                throw new Error('numOfMonthRows has to be between 1 - 12 and divide 12 to integer');
            }
        };
        return MonthCalendarService;
    }());
    MonthCalendarService.decorators = [
        { type: i0.Injectable }
    ];
    MonthCalendarService.ctorParameters = function () { return [
        { type: UtilsService }
    ]; };

    var moment$7 = momentNs__namespace;
    var MonthCalendarComponent = /** @class */ (function () {
        function MonthCalendarComponent(monthCalendarService, utilsService, cd) {
            this.monthCalendarService = monthCalendarService;
            this.utilsService = utilsService;
            this.cd = cd;
            this.onSelect = new i0.EventEmitter();
            this.onNavHeaderBtnClick = new i0.EventEmitter();
            this.onGoToCurrent = new i0.EventEmitter();
            this.onLeftNav = new i0.EventEmitter();
            this.onRightNav = new i0.EventEmitter();
            this.onLeftSecondaryNav = new i0.EventEmitter();
            this.onRightSecondaryNav = new i0.EventEmitter();
            this.isInited = false;
            this._shouldShowCurrent = true;
            this.api = {
                toggleCalendar: this.toggleCalendarMode.bind(this),
                moveCalendarTo: this.moveCalendarTo.bind(this)
            };
        }
        Object.defineProperty(MonthCalendarComponent.prototype, "selected", {
            get: function () {
                return this._selected;
            },
            set: function (selected) {
                this._selected = selected;
                this.onChangeCallback(this.processOnChangeCallback(selected));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MonthCalendarComponent.prototype, "currentDateView", {
            get: function () {
                return this._currentDateView;
            },
            set: function (current) {
                this._currentDateView = current.clone();
                this.yearMonths = this.monthCalendarService
                    .generateYear(this.componentConfig, this._currentDateView, this.selected);
                this.navLabel = this.monthCalendarService.getHeaderLabel(this.componentConfig, this.currentDateView);
                this.showLeftNav = this.monthCalendarService.shouldShowLeft(this.componentConfig.min, this._currentDateView);
                this.showRightNav = this.monthCalendarService.shouldShowRight(this.componentConfig.max, this.currentDateView);
                this.showSecondaryLeftNav = this.componentConfig.showMultipleYearsNavigation && this.showLeftNav;
                this.showSecondaryRightNav = this.componentConfig.showMultipleYearsNavigation && this.showRightNav;
            },
            enumerable: false,
            configurable: true
        });
        MonthCalendarComponent.prototype.ngOnInit = function () {
            this.isInited = true;
            this.init();
            this.initValidators();
        };
        MonthCalendarComponent.prototype.ngOnChanges = function (changes) {
            if (this.isInited) {
                var minDate = changes.minDate, maxDate = changes.maxDate, config = changes.config;
                this.handleConfigChange(config);
                this.init();
                if (minDate || maxDate) {
                    this.initValidators();
                }
            }
        };
        MonthCalendarComponent.prototype.init = function () {
            this.componentConfig = this.monthCalendarService.getConfig(this.config);
            this.selected = this.selected || [];
            this.currentDateView = this.displayDate
                ? this.displayDate
                : this.utilsService
                    .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min);
            this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
            this._shouldShowCurrent = this.shouldShowCurrent();
        };
        MonthCalendarComponent.prototype.writeValue = function (value) {
            this.inputValue = value;
            if (value) {
                this.selected = this.utilsService
                    .convertToMomentArray(value, this.componentConfig);
                this.yearMonths = this.monthCalendarService
                    .generateYear(this.componentConfig, this.currentDateView, this.selected);
                this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
            }
            else {
                this.selected = [];
                this.yearMonths = this.monthCalendarService
                    .generateYear(this.componentConfig, this.currentDateView, this.selected);
            }
            this.cd.markForCheck();
        };
        MonthCalendarComponent.prototype.registerOnChange = function (fn) {
            this.onChangeCallback = fn;
        };
        MonthCalendarComponent.prototype.onChangeCallback = function (_) {
        };
        MonthCalendarComponent.prototype.registerOnTouched = function (fn) {
        };
        MonthCalendarComponent.prototype.validate = function (formControl) {
            if (this.minDate || this.maxDate) {
                return this.validateFn(formControl.value);
            }
            else {
                return function () { return null; };
            }
        };
        MonthCalendarComponent.prototype.processOnChangeCallback = function (value) {
            return this.utilsService.convertFromMomentArray(this.componentConfig.format, value, this.componentConfig.returnedValueType || this.inputValueType);
        };
        MonthCalendarComponent.prototype.initValidators = function () {
            this.validateFn = this.validateFn = this.utilsService.createValidator({ minDate: this.minDate, maxDate: this.maxDate }, this.componentConfig.format, 'month');
            this.onChangeCallback(this.processOnChangeCallback(this.selected));
        };
        MonthCalendarComponent.prototype.monthClicked = function (month) {
            if (month.selected && !this.componentConfig.unSelectOnClick) {
                return;
            }
            this.selected = this.utilsService
                .updateSelected(this.componentConfig.allowMultiSelect, this.selected, month, 'month');
            this.yearMonths = this.monthCalendarService
                .generateYear(this.componentConfig, this.currentDateView, this.selected);
            this.onSelect.emit(month);
        };
        MonthCalendarComponent.prototype.onLeftNavClick = function () {
            var from = this.currentDateView.clone();
            this.currentDateView = this.currentDateView.clone().subtract(1, 'year');
            var to = this.currentDateView.clone();
            this.yearMonths = this.monthCalendarService.generateYear(this.componentConfig, this.currentDateView, this.selected);
            this.onLeftNav.emit({ from: from, to: to });
        };
        MonthCalendarComponent.prototype.onLeftSecondaryNavClick = function () {
            var navigateBy = this.componentConfig.multipleYearsNavigateBy;
            var isOutsideRange = this.componentConfig.min &&
                this.currentDateView.year() - this.componentConfig.min.year() < navigateBy;
            if (isOutsideRange) {
                navigateBy = this.currentDateView.year() - this.componentConfig.min.year();
            }
            var from = this.currentDateView.clone();
            this.currentDateView = this.currentDateView.clone().subtract(navigateBy, 'year');
            var to = this.currentDateView.clone();
            this.onLeftSecondaryNav.emit({ from: from, to: to });
        };
        MonthCalendarComponent.prototype.onRightNavClick = function () {
            var from = this.currentDateView.clone();
            this.currentDateView = this.currentDateView.clone().add(1, 'year');
            var to = this.currentDateView.clone();
            this.onRightNav.emit({ from: from, to: to });
        };
        MonthCalendarComponent.prototype.onRightSecondaryNavClick = function () {
            var navigateBy = this.componentConfig.multipleYearsNavigateBy;
            var isOutsideRange = this.componentConfig.max &&
                this.componentConfig.max.year() - this.currentDateView.year() < navigateBy;
            if (isOutsideRange) {
                navigateBy = this.componentConfig.max.year() - this.currentDateView.year();
            }
            var from = this.currentDateView.clone();
            this.currentDateView = this.currentDateView.clone().add(navigateBy, 'year');
            var to = this.currentDateView.clone();
            this.onRightSecondaryNav.emit({ from: from, to: to });
        };
        MonthCalendarComponent.prototype.toggleCalendarMode = function () {
            this.onNavHeaderBtnClick.emit();
        };
        MonthCalendarComponent.prototype.getMonthBtnCssClass = function (month) {
            var cssClass = {
                'dp-selected': month.selected,
                'dp-current-month': month.currentMonth
            };
            var customCssClass = this.monthCalendarService.getMonthBtnCssClass(this.componentConfig, month.date);
            if (customCssClass) {
                cssClass[customCssClass] = true;
            }
            return cssClass;
        };
        MonthCalendarComponent.prototype.shouldShowCurrent = function () {
            return this.utilsService.shouldShowCurrent(this.componentConfig.showGoToCurrent, 'month', this.componentConfig.min, this.componentConfig.max);
        };
        MonthCalendarComponent.prototype.goToCurrent = function () {
            this.currentDateView = moment$7();
            this.onGoToCurrent.emit();
        };
        MonthCalendarComponent.prototype.moveCalendarTo = function (to) {
            if (to) {
                this.currentDateView = this.utilsService.convertToMoment(to, this.componentConfig.format);
                this.cd.markForCheck();
            }
        };
        MonthCalendarComponent.prototype.handleConfigChange = function (config) {
            if (config) {
                var prevConf = this.monthCalendarService.getConfig(config.previousValue);
                var currentConf_1 = this.monthCalendarService.getConfig(config.currentValue);
                if (this.utilsService.shouldResetCurrentView(prevConf, currentConf_1)) {
                    this._currentDateView = null;
                }
                if (prevConf.locale !== currentConf_1.locale) {
                    if (this.currentDateView) {
                        this.currentDateView.locale(currentConf_1.locale);
                    }
                    (this.selected || []).forEach(function (m) { return m.locale(currentConf_1.locale); });
                }
            }
        };
        return MonthCalendarComponent;
    }());
    MonthCalendarComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'dp-month-calendar',
                    template: "<div class=\"dp-month-calendar-container\">\n  <dp-calendar-nav\n      (onGoToCurrent)=\"goToCurrent()\"\n      (onLabelClick)=\"toggleCalendarMode()\"\n      (onLeftNav)=\"onLeftNavClick()\"\n      (onLeftSecondaryNav)=\"onLeftSecondaryNavClick()\"\n      (onRightNav)=\"onRightNavClick()\"\n      (onRightSecondaryNav)=\"onRightSecondaryNavClick()\"\n      [isLabelClickable]=\"componentConfig.isNavHeaderBtnClickable\"\n      [label]=\"navLabel\"\n      [showGoToCurrent]=\"shouldShowCurrent()\"\n      [showLeftNav]=\"showLeftNav\"\n      [showLeftSecondaryNav]=\"showSecondaryLeftNav\"\n      [showRightNav]=\"showRightNav\"\n      [showRightSecondaryNav]=\"showSecondaryRightNav\"\n      [theme]=\"theme\">\n  </dp-calendar-nav>\n\n  <div class=\"dp-calendar-wrapper\">\n    <div *ngFor=\"let monthRow of yearMonths\" class=\"dp-months-row\">\n      <button (click)=\"monthClicked(month)\"\n              *ngFor=\"let month of monthRow\"\n              [attr.data-date]=\"month.date.format(componentConfig.format)\"\n              [disabled]=\"month.disabled\"\n              [innerText]=\"month.text\"\n              [ngClass]=\"getMonthBtnCssClass(month)\"\n              class=\"dp-calendar-month\"\n              type=\"button\">\n      </button>\n    </div>\n  </div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.None,
                    changeDetection: i0.ChangeDetectionStrategy.OnPush,
                    providers: [
                        MonthCalendarService,
                        {
                            provide: forms.NG_VALUE_ACCESSOR,
                            useExisting: i0.forwardRef(function () { return MonthCalendarComponent; }),
                            multi: true
                        },
                        {
                            provide: forms.NG_VALIDATORS,
                            useExisting: i0.forwardRef(function () { return MonthCalendarComponent; }),
                            multi: true
                        }
                    ],
                    styles: [""]
                },] }
    ];
    MonthCalendarComponent.ctorParameters = function () { return [
        { type: MonthCalendarService },
        { type: UtilsService },
        { type: i0.ChangeDetectorRef }
    ]; };
    MonthCalendarComponent.propDecorators = {
        config: [{ type: i0.Input }],
        displayDate: [{ type: i0.Input }],
        minDate: [{ type: i0.Input }],
        maxDate: [{ type: i0.Input }],
        theme: [{ type: i0.HostBinding, args: ['class',] }, { type: i0.Input }],
        onSelect: [{ type: i0.Output }],
        onNavHeaderBtnClick: [{ type: i0.Output }],
        onGoToCurrent: [{ type: i0.Output }],
        onLeftNav: [{ type: i0.Output }],
        onRightNav: [{ type: i0.Output }],
        onLeftSecondaryNav: [{ type: i0.Output }],
        onRightSecondaryNav: [{ type: i0.Output }]
    };

    var moment$8 = momentNs__namespace;
    var TimeSelectComponent = /** @class */ (function () {
        function TimeSelectComponent(timeSelectService, utilsService, cd) {
            this.timeSelectService = timeSelectService;
            this.utilsService = utilsService;
            this.cd = cd;
            this.onChange = new i0.EventEmitter();
            this.isInited = false;
            this.api = {
                triggerChange: this.emitChange.bind(this)
            };
        }
        Object.defineProperty(TimeSelectComponent.prototype, "selected", {
            get: function () {
                return this._selected;
            },
            set: function (selected) {
                this._selected = selected;
                this.calculateTimeParts(this.selected);
                this.showDecHour = this.timeSelectService.shouldShowDecrease(this.componentConfig, this._selected, 'hour');
                this.showDecMinute = this.timeSelectService.shouldShowDecrease(this.componentConfig, this._selected, 'minute');
                this.showDecSecond = this.timeSelectService.shouldShowDecrease(this.componentConfig, this._selected, 'second');
                this.showIncHour = this.timeSelectService.shouldShowIncrease(this.componentConfig, this._selected, 'hour');
                this.showIncMinute = this.timeSelectService.shouldShowIncrease(this.componentConfig, this._selected, 'minute');
                this.showIncSecond = this.timeSelectService.shouldShowIncrease(this.componentConfig, this._selected, 'second');
                this.showToggleMeridiem = this.timeSelectService.shouldShowToggleMeridiem(this.componentConfig, this._selected);
                this.onChangeCallback(this.processOnChangeCallback(selected));
            },
            enumerable: false,
            configurable: true
        });
        TimeSelectComponent.prototype.ngOnInit = function () {
            this.isInited = true;
            this.init();
            this.initValidators();
        };
        TimeSelectComponent.prototype.init = function () {
            this.componentConfig = this.timeSelectService.getConfig(this.config);
            this.selected = this.selected || moment$8();
            this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
        };
        TimeSelectComponent.prototype.ngOnChanges = function (changes) {
            if (this.isInited) {
                var minDate = changes.minDate, maxDate = changes.maxDate, minTime = changes.minTime, maxTime = changes.maxTime;
                this.init();
                if (minDate || maxDate || minTime || maxTime) {
                    this.initValidators();
                }
                this.handleConfigChange(changes.config);
            }
        };
        TimeSelectComponent.prototype.writeValue = function (value) {
            this.inputValue = value;
            if (value) {
                var momentValue = this.utilsService
                    .convertToMomentArray(value, {
                    allowMultiSelect: false,
                    format: this.timeSelectService.getTimeFormat(this.componentConfig)
                })[0];
                if (momentValue.isValid()) {
                    this.selected = momentValue;
                    this.inputValueType = this.utilsService
                        .getInputType(this.inputValue, false);
                }
            }
            this.cd.markForCheck();
        };
        TimeSelectComponent.prototype.registerOnChange = function (fn) {
            this.onChangeCallback = fn;
        };
        TimeSelectComponent.prototype.onChangeCallback = function (_) {
        };
        TimeSelectComponent.prototype.registerOnTouched = function (fn) {
        };
        TimeSelectComponent.prototype.validate = function (formControl) {
            if (this.minDate || this.maxDate || this.minTime || this.maxTime) {
                return this.validateFn(formControl.value);
            }
            else {
                return function () { return null; };
            }
        };
        TimeSelectComponent.prototype.processOnChangeCallback = function (value) {
            return this.utilsService.convertFromMomentArray(this.timeSelectService.getTimeFormat(this.componentConfig), [value], this.componentConfig.returnedValueType || this.inputValueType);
        };
        TimeSelectComponent.prototype.initValidators = function () {
            this.validateFn = this.utilsService.createValidator({
                minDate: this.minDate,
                maxDate: this.maxDate,
                minTime: this.minTime,
                maxTime: this.maxTime
            }, undefined, 'day');
            this.onChangeCallback(this.processOnChangeCallback(this.selected));
        };
        TimeSelectComponent.prototype.decrease = function (unit) {
            this.selected = this.timeSelectService.decrease(this.componentConfig, this.selected, unit);
            this.emitChange();
        };
        TimeSelectComponent.prototype.increase = function (unit) {
            this.selected = this.timeSelectService.increase(this.componentConfig, this.selected, unit);
            this.emitChange();
        };
        TimeSelectComponent.prototype.toggleMeridiem = function () {
            this.selected = this.timeSelectService.toggleMeridiem(this.selected);
            this.emitChange();
        };
        TimeSelectComponent.prototype.emitChange = function () {
            this.onChange.emit({ date: this.selected, selected: false });
            this.cd.markForCheck();
        };
        TimeSelectComponent.prototype.calculateTimeParts = function (time) {
            this.hours = this.timeSelectService.getHours(this.componentConfig, time);
            this.minutes = this.timeSelectService.getMinutes(this.componentConfig, time);
            this.seconds = this.timeSelectService.getSeconds(this.componentConfig, time);
            this.meridiem = this.timeSelectService.getMeridiem(this.componentConfig, time);
        };
        TimeSelectComponent.prototype.handleConfigChange = function (config) {
            if (config) {
                var prevConf = this.timeSelectService.getConfig(config.previousValue);
                var currentConf = this.timeSelectService.getConfig(config.currentValue);
                if (prevConf.locale !== currentConf.locale) {
                    this.selected = this.selected.clone().locale(currentConf.locale);
                }
            }
        };
        return TimeSelectComponent;
    }());
    TimeSelectComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'dp-time-select',
                    template: "<ul class=\"dp-time-select-controls\">\n  <li class=\"dp-time-select-control dp-time-select-control-hours\">\n    <button (click)=\"increase('hour')\"\n            [disabled]=\"!showIncHour\"\n            class=\"dp-time-select-control-up\"\n            type=\"button\">\n    </button>\n    <span [innerText]=\"hours\"\n          class=\"dp-time-select-display-hours\">\n    </span>\n    <button (click)=\"decrease('hour')\"\n            [disabled]=\"!showDecHour\"\n            class=\"dp-time-select-control-down\"\n            type=\"button\">\n    </button>\n  </li>\n  <li [innerText]=\"componentConfig.timeSeparator\"\n      class=\"dp-time-select-control dp-time-select-separator\">\n  </li>\n  <li class=\"dp-time-select-control dp-time-select-control-minutes\">\n    <button (click)=\"increase('minute')\"\n            [disabled]=\"!showIncMinute\"\n            class=\"dp-time-select-control-up\"\n            type=\"button\"></button>\n    <span [innerText]=\"minutes\"\n          class=\"dp-time-select-display-minutes\">\n    </span>\n    <button (click)=\"decrease('minute')\"\n            [disabled]=\"!showDecMinute\" class=\"dp-time-select-control-down\"\n            type=\"button\">\n    </button>\n  </li>\n  <ng-container *ngIf=\"componentConfig.showSeconds\">\n    <li [innerText]=\"componentConfig.timeSeparator\"\n        class=\"dp-time-select-control dp-time-select-separator\">\n    </li>\n    <li class=\"dp-time-select-control dp-time-select-control-seconds\">\n      <button (click)=\"increase('second')\"\n              [disabled]=\"!showIncSecond\"\n              class=\"dp-time-select-control-up\"\n              type=\"button\"></button>\n      <span [innerText]=\"seconds\"\n            class=\"dp-time-select-display-seconds\">\n      </span>\n      <button (click)=\"decrease('second')\"\n              [disabled]=\"!showDecSecond\"\n              class=\"dp-time-select-control-down\"\n              type=\"button\">\n      </button>\n    </li>\n  </ng-container>\n  <li *ngIf=\"!componentConfig.showTwentyFourHours\" class=\"dp-time-select-control dp-time-select-control-meridiem\">\n    <button (click)=\"toggleMeridiem()\"\n            [disabled]=\"!showToggleMeridiem\"\n            class=\"dp-time-select-control-up\"\n            type=\"button\">\n    </button>\n    <span [innerText]=\"meridiem\"\n          class=\"dp-time-select-display-meridiem\">\n    </span>\n    <button (click)=\"toggleMeridiem()\"\n            [disabled]=\"!showToggleMeridiem\"\n            class=\"dp-time-select-control-down\"\n            type=\"button\">\n    </button>\n  </li>\n</ul>\n",
                    encapsulation: i0.ViewEncapsulation.None,
                    changeDetection: i0.ChangeDetectionStrategy.OnPush,
                    providers: [
                        TimeSelectService,
                        {
                            provide: forms.NG_VALUE_ACCESSOR,
                            useExisting: i0.forwardRef(function () { return TimeSelectComponent; }),
                            multi: true
                        },
                        {
                            provide: forms.NG_VALIDATORS,
                            useExisting: i0.forwardRef(function () { return TimeSelectComponent; }),
                            multi: true
                        }
                    ],
                    styles: [""]
                },] }
    ];
    TimeSelectComponent.ctorParameters = function () { return [
        { type: TimeSelectService },
        { type: UtilsService },
        { type: i0.ChangeDetectorRef }
    ]; };
    TimeSelectComponent.propDecorators = {
        config: [{ type: i0.Input }],
        displayDate: [{ type: i0.Input }],
        minDate: [{ type: i0.Input }],
        maxDate: [{ type: i0.Input }],
        minTime: [{ type: i0.Input }],
        maxTime: [{ type: i0.Input }],
        theme: [{ type: i0.HostBinding, args: ['class',] }, { type: i0.Input }],
        onChange: [{ type: i0.Output }]
    };

    var CalendarNavComponent = /** @class */ (function () {
        function CalendarNavComponent() {
            this.isLabelClickable = false;
            this.showLeftNav = true;
            this.showLeftSecondaryNav = false;
            this.showRightNav = true;
            this.showRightSecondaryNav = false;
            this.leftNavDisabled = false;
            this.leftSecondaryNavDisabled = false;
            this.rightNavDisabled = false;
            this.rightSecondaryNavDisabled = false;
            this.showGoToCurrent = true;
            this.onLeftNav = new i0.EventEmitter();
            this.onLeftSecondaryNav = new i0.EventEmitter();
            this.onRightNav = new i0.EventEmitter();
            this.onRightSecondaryNav = new i0.EventEmitter();
            this.onLabelClick = new i0.EventEmitter();
            this.onGoToCurrent = new i0.EventEmitter();
        }
        CalendarNavComponent.prototype.leftNavClicked = function () {
            this.onLeftNav.emit();
        };
        CalendarNavComponent.prototype.leftSecondaryNavClicked = function () {
            this.onLeftSecondaryNav.emit();
        };
        CalendarNavComponent.prototype.rightNavClicked = function () {
            this.onRightNav.emit();
        };
        CalendarNavComponent.prototype.rightSecondaryNavClicked = function () {
            this.onRightSecondaryNav.emit();
        };
        CalendarNavComponent.prototype.labelClicked = function () {
            this.onLabelClick.emit();
        };
        return CalendarNavComponent;
    }());
    CalendarNavComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'dp-calendar-nav',
                    template: "<div class=\"dp-calendar-nav-container\">\n  <div class=\"dp-nav-header\">\n    <span [attr.data-hidden]=\"isLabelClickable\"\n          [hidden]=\"isLabelClickable\"\n          [innerText]=\"label\">\n    </span>\n    <button (click)=\"labelClicked()\"\n            [attr.data-hidden]=\"!isLabelClickable\"\n            [hidden]=\"!isLabelClickable\"\n            [innerText]=\"label\"\n            class=\"dp-nav-header-btn\"\n            type=\"button\">\n    </button>\n  </div>\n\n  <div class=\"dp-nav-btns-container\">\n    <div class=\"dp-calendar-nav-container-left\">\n      <button (click)=\"leftSecondaryNavClicked()\"\n              *ngIf=\"showLeftSecondaryNav\"\n              [disabled]=\"leftSecondaryNavDisabled\"\n              class=\"dp-calendar-secondary-nav-left\"\n              type=\"button\">\n      </button>\n      <button (click)=\"leftNavClicked()\"\n              [attr.data-hidden]=\"!showLeftNav\"\n              [disabled]=\"leftNavDisabled\"\n              [hidden]=\"!showLeftNav\"\n              class=\"dp-calendar-nav-left\"\n              type=\"button\">\n      </button>\n    </div>\n    <button (click)=\"onGoToCurrent.emit()\"\n            *ngIf=\"showGoToCurrent\"\n            class=\"dp-current-location-btn\"\n            type=\"button\">\n    </button>\n    <div class=\"dp-calendar-nav-container-right\">\n      <button (click)=\"rightNavClicked()\"\n              [attr.data-hidden]=\"!showRightNav\"\n              [disabled]=\"rightNavDisabled\"\n              [hidden]=\"!showRightNav\"\n              class=\"dp-calendar-nav-right\"\n              type=\"button\">\n      </button>\n      <button (click)=\"rightSecondaryNavClicked()\"\n              *ngIf=\"showRightSecondaryNav\"\n              [disabled]=\"rightSecondaryNavDisabled\"\n              class=\"dp-calendar-secondary-nav-right\"\n              type=\"button\">\n      </button>\n    </div>\n  </div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.None,
                    changeDetection: i0.ChangeDetectionStrategy.OnPush,
                    styles: [""]
                },] }
    ];
    CalendarNavComponent.propDecorators = {
        label: [{ type: i0.Input }],
        isLabelClickable: [{ type: i0.Input }],
        showLeftNav: [{ type: i0.Input }],
        showLeftSecondaryNav: [{ type: i0.Input }],
        showRightNav: [{ type: i0.Input }],
        showRightSecondaryNav: [{ type: i0.Input }],
        leftNavDisabled: [{ type: i0.Input }],
        leftSecondaryNavDisabled: [{ type: i0.Input }],
        rightNavDisabled: [{ type: i0.Input }],
        rightSecondaryNavDisabled: [{ type: i0.Input }],
        showGoToCurrent: [{ type: i0.Input }],
        theme: [{ type: i0.HostBinding, args: ['class',] }, { type: i0.Input }],
        onLeftNav: [{ type: i0.Output }],
        onLeftSecondaryNav: [{ type: i0.Output }],
        onRightNav: [{ type: i0.Output }],
        onRightSecondaryNav: [{ type: i0.Output }],
        onLabelClick: [{ type: i0.Output }],
        onGoToCurrent: [{ type: i0.Output }]
    };

    var DayTimeCalendarComponent = /** @class */ (function () {
        function DayTimeCalendarComponent(dayTimeCalendarService, utilsService, cd) {
            this.dayTimeCalendarService = dayTimeCalendarService;
            this.utilsService = utilsService;
            this.cd = cd;
            this.onChange = new i0.EventEmitter();
            this.onGoToCurrent = new i0.EventEmitter();
            this.onLeftNav = new i0.EventEmitter();
            this.onRightNav = new i0.EventEmitter();
            this.isInited = false;
            this.api = {
                moveCalendarTo: this.moveCalendarTo.bind(this)
            };
        }
        Object.defineProperty(DayTimeCalendarComponent.prototype, "selected", {
            get: function () {
                return this._selected;
            },
            set: function (selected) {
                this._selected = selected;
                this.onChangeCallback(this.processOnChangeCallback(selected));
            },
            enumerable: false,
            configurable: true
        });
        ;
        DayTimeCalendarComponent.prototype.ngOnInit = function () {
            this.isInited = true;
            this.init();
            this.initValidators();
        };
        DayTimeCalendarComponent.prototype.init = function () {
            this.componentConfig = this.dayTimeCalendarService.getConfig(this.config);
            this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
        };
        DayTimeCalendarComponent.prototype.ngOnChanges = function (changes) {
            if (this.isInited) {
                var minDate = changes.minDate, maxDate = changes.maxDate;
                this.init();
                if (minDate || maxDate) {
                    this.initValidators();
                }
            }
        };
        DayTimeCalendarComponent.prototype.writeValue = function (value) {
            this.inputValue = value;
            if (value) {
                this.selected = this.utilsService
                    .convertToMomentArray(value, {
                    format: this.componentConfig.format,
                    allowMultiSelect: false
                })[0];
                this.inputValueType = this.utilsService
                    .getInputType(this.inputValue, false);
            }
            else {
                this.selected = null;
            }
            this.cd.markForCheck();
        };
        DayTimeCalendarComponent.prototype.registerOnChange = function (fn) {
            this.onChangeCallback = fn;
        };
        DayTimeCalendarComponent.prototype.onChangeCallback = function (_) {
        };
        DayTimeCalendarComponent.prototype.registerOnTouched = function (fn) {
        };
        DayTimeCalendarComponent.prototype.validate = function (formControl) {
            if (this.minDate || this.maxDate) {
                return this.validateFn(formControl.value);
            }
            else {
                return function () { return null; };
            }
        };
        DayTimeCalendarComponent.prototype.processOnChangeCallback = function (value) {
            return this.utilsService.convertFromMomentArray(this.componentConfig.format, [value], this.componentConfig.returnedValueType || this.inputValueType);
        };
        DayTimeCalendarComponent.prototype.initValidators = function () {
            this.validateFn = this.utilsService.createValidator({
                minDate: this.minDate,
                maxDate: this.maxDate
            }, undefined, 'daytime');
            this.onChangeCallback(this.processOnChangeCallback(this.selected));
        };
        DayTimeCalendarComponent.prototype.dateSelected = function (day) {
            this.selected = this.dayTimeCalendarService.updateDay(this.selected, day.date, this.config);
            this.emitChange();
        };
        DayTimeCalendarComponent.prototype.timeChange = function (time) {
            this.selected = this.dayTimeCalendarService.updateTime(this.selected, time.date);
            this.emitChange();
        };
        DayTimeCalendarComponent.prototype.emitChange = function () {
            this.onChange.emit({ date: this.selected, selected: false });
        };
        DayTimeCalendarComponent.prototype.moveCalendarTo = function (to) {
            if (to) {
                this.dayCalendarRef.moveCalendarTo(to);
            }
        };
        DayTimeCalendarComponent.prototype.onLeftNavClick = function (change) {
            this.onLeftNav.emit(change);
        };
        DayTimeCalendarComponent.prototype.onRightNavClick = function (change) {
            this.onRightNav.emit(change);
        };
        return DayTimeCalendarComponent;
    }());
    DayTimeCalendarComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'dp-day-time-calendar',
                    template: "<dp-day-calendar #dayCalendar\n                 (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                 (onLeftNav)=\"onLeftNavClick($event)\"\n                 (onRightNav)=\"onRightNavClick($event)\"\n                 (onSelect)=\"dateSelected($event)\"\n                 [config]=\"componentConfig\"\n                 [displayDate]=\"displayDate\"\n                 [ngModel]=\"_selected\"\n                 [theme]=\"theme\">\n</dp-day-calendar>\n<dp-time-select #timeSelect\n                (onChange)=\"timeChange($event)\"\n                [config]=\"componentConfig\"\n                [ngModel]=\"_selected\"\n                [theme]=\"theme\">\n</dp-time-select>\n",
                    changeDetection: i0.ChangeDetectionStrategy.OnPush,
                    encapsulation: i0.ViewEncapsulation.None,
                    providers: [
                        DayTimeCalendarService,
                        DayCalendarService,
                        TimeSelectService,
                        {
                            provide: forms.NG_VALUE_ACCESSOR,
                            useExisting: i0.forwardRef(function () { return DayTimeCalendarComponent; }),
                            multi: true
                        },
                        {
                            provide: forms.NG_VALIDATORS,
                            useExisting: i0.forwardRef(function () { return DayTimeCalendarComponent; }),
                            multi: true
                        }
                    ],
                    styles: [""]
                },] }
    ];
    DayTimeCalendarComponent.ctorParameters = function () { return [
        { type: DayTimeCalendarService },
        { type: UtilsService },
        { type: i0.ChangeDetectorRef }
    ]; };
    DayTimeCalendarComponent.propDecorators = {
        config: [{ type: i0.Input }],
        displayDate: [{ type: i0.Input }],
        minDate: [{ type: i0.Input }],
        maxDate: [{ type: i0.Input }],
        theme: [{ type: i0.HostBinding, args: ['class',] }, { type: i0.Input }],
        onChange: [{ type: i0.Output }],
        onGoToCurrent: [{ type: i0.Output }],
        onLeftNav: [{ type: i0.Output }],
        onRightNav: [{ type: i0.Output }],
        dayCalendarRef: [{ type: i0.ViewChild, args: ['dayCalendar',] }]
    };

    var DpDatePickerModule = /** @class */ (function () {
        function DpDatePickerModule() {
        }
        return DpDatePickerModule;
    }());
    DpDatePickerModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: [
                        DatePickerComponent,
                        DatePickerDirective,
                        DayCalendarComponent,
                        MonthCalendarComponent,
                        CalendarNavComponent,
                        TimeSelectComponent,
                        DayTimeCalendarComponent
                    ],
                    entryComponents: [
                        DatePickerComponent
                    ],
                    imports: [
                        common.CommonModule,
                        forms.FormsModule
                    ],
                    exports: [
                        DatePickerComponent,
                        DatePickerDirective,
                        MonthCalendarComponent,
                        DayCalendarComponent,
                        TimeSelectComponent,
                        DayTimeCalendarComponent
                    ]
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.DatePickerComponent = DatePickerComponent;
    exports.DatePickerDirective = DatePickerDirective;
    exports.DayCalendarComponent = DayCalendarComponent;
    exports.DayTimeCalendarComponent = DayTimeCalendarComponent;
    exports.DpDatePickerModule = DpDatePickerModule;
    exports.MonthCalendarComponent = MonthCalendarComponent;
    exports.TimeSelectComponent = TimeSelectComponent;
    exports.ɵa = DatePickerService;
    exports.ɵb = UtilsService;
    exports.ɵc = TimeSelectService;
    exports.ɵd = DayTimeCalendarService;
    exports.ɵe = DayCalendarService;
    exports.ɵf = DomHelper;
    exports.ɵg = DatePickerDirectiveService;
    exports.ɵh = MonthCalendarService;
    exports.ɵi = CalendarNavComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ng2-date-picker.umd.js.map
