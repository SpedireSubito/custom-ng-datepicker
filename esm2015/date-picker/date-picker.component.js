import { DomHelper } from '../common/services/dom-appender/dom-appender.service';
import { UtilsService } from '../common/services/utils/utils.service';
import { ECalendarMode } from '../common/types/calendar-mode-enum';
import { ECalendarValue } from '../common/types/calendar-value-enum';
import { DayCalendarService } from '../day-calendar/day-calendar.service';
import { DayTimeCalendarService } from '../day-time-calendar/day-time-calendar.service';
import { TimeSelectService } from '../time-select/time-select.service';
import { DatePickerService } from './date-picker.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Input, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectEvent } from '../common/types/selection-event.enum';
export class DatePickerComponent {
    constructor(dayPickerService, domHelper, elemRef, renderer, utilsService, cd) {
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
        this.open = new EventEmitter();
        this.close = new EventEmitter();
        this.onChange = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.onSelect = new EventEmitter();
        this.hideStateHelper = false;
        this.isFocusedTrigger = false;
        this.handleInnerElementClickUnlisteners = [];
        this.globalListenersUnlisteners = [];
        this.api = {
            open: this.showCalendars.bind(this),
            close: this.hideCalendar.bind(this),
            moveCalendarTo: this.moveCalendarTo.bind(this)
        };
        this.selectEvent = SelectEvent;
        this._areCalendarsShown = false;
        this._selected = [];
    }
    get openOnFocus() {
        return this.componentConfig.openOnFocus;
    }
    get openOnClick() {
        return this.componentConfig.openOnClick;
    }
    get areCalendarsShown() {
        return this._areCalendarsShown;
    }
    set areCalendarsShown(value) {
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
    }
    get selected() {
        return this._selected;
    }
    set selected(selected) {
        this._selected = selected;
        this.inputElementValue = this.utilsService
            .convertFromMomentArray(this.componentConfig.format, selected, ECalendarValue.StringArr)
            .join(' | ');
        const val = this.processOnChangeCallback(selected);
        this.onChangeCallback(val, false);
        this.onChange.emit(val);
    }
    get currentDateView() {
        return this._currentDateView;
    }
    set currentDateView(date) {
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
    }
    onClick() {
        if (!this.openOnClick) {
            return;
        }
        if (!this.isFocusedTrigger && !this.disabled) {
            this.hideStateHelper = true;
            if (!this.areCalendarsShown) {
                this.showCalendars();
            }
        }
    }
    onBodyClick() {
        if (this.componentConfig.hideOnOutsideClick) {
            if (!this.hideStateHelper && this.areCalendarsShown) {
                this.hideCalendar();
            }
            this.hideStateHelper = false;
        }
    }
    onScroll() {
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
    }
    writeValue(value) {
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
    }
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    onChangeCallback(_, changedByInput) {
    }
    registerOnTouched(fn) {
        this.onTouchedCallback = fn;
    }
    onTouchedCallback() {
    }
    validate(formControl) {
        return this.validateFn(formControl.value);
    }
    processOnChangeCallback(selected) {
        if (typeof selected === 'string') {
            return selected;
        }
        else {
            return this.utilsService.convertFromMomentArray(this.componentConfig.format, selected, this.componentConfig.returnedValueType || this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect));
        }
    }
    initValidators() {
        this.validateFn = this.utilsService.createValidator({
            minDate: this.minDate,
            maxDate: this.maxDate,
            minTime: this.minTime,
            maxTime: this.maxTime
        }, this.componentConfig.format, this.mode);
        this.onChangeCallback(this.processOnChangeCallback(this.selected), false);
    }
    ngOnInit() {
        this.isInitialized = true;
        this.init();
    }
    ngOnChanges(changes) {
        if (this.isInitialized) {
            this.init();
        }
    }
    ngAfterViewInit() {
        this.setElementPositionInDom();
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this.cd.markForCheck();
    }
    setElementPositionInDom() {
        this.calendarWrapper = this.calendarContainer.nativeElement;
        this.setInputElementContainer();
        this.popupElem = this.elemRef.nativeElement.querySelector('.dp-popup');
        this.handleInnerElementClick(this.popupElem);
        const { appendTo } = this.componentConfig;
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
    }
    setInputElementContainer() {
        this.inputElementContainer = this.utilsService.getNativeElement(this.componentConfig.inputElementContainer)
            || this.elemRef.nativeElement.querySelector('.dp-input-container')
            || document.body;
    }
    handleInnerElementClick(element) {
        this.handleInnerElementClickUnlisteners.push(this.renderer.listen(element, 'click', () => {
            this.hideStateHelper = true;
        }));
    }
    init() {
        this.componentConfig = this.dayPickerService.getConfig(this.config, this.mode);
        this.currentDateView = this.displayDate
            ? this.utilsService.convertToMoment(this.displayDate, this.componentConfig.format).clone()
            : this.utilsService
                .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min);
        this.dayCalendarConfig = this.dayPickerService.getDayConfigService(this.componentConfig);
        this.dayTimeCalendarConfig = this.dayPickerService.getDayTimeConfigService(this.componentConfig);
        this.timeSelectConfig = this.dayPickerService.getTimeConfigService(this.componentConfig);
        this.initValidators();
    }
    inputFocused() {
        if (!this.openOnFocus) {
            return;
        }
        clearTimeout(this.onOpenDelayTimeoutHandler);
        this.isFocusedTrigger = true;
        this.onOpenDelayTimeoutHandler = setTimeout(() => {
            if (!this.areCalendarsShown) {
                this.showCalendars();
            }
            this.hideStateHelper = false;
            this.isFocusedTrigger = false;
            this.cd.markForCheck();
        }, this.componentConfig.onOpenDelay);
    }
    inputBlurred() {
        clearTimeout(this.onOpenDelayTimeoutHandler);
        this.onTouchedCallback();
    }
    showCalendars() {
        this.hideStateHelper = true;
        this.areCalendarsShown = true;
        if (this.timeSelectRef) {
            this.timeSelectRef.api.triggerChange();
        }
        this.open.emit();
        this.cd.markForCheck();
    }
    hideCalendar() {
        this.areCalendarsShown = false;
        if (this.dayCalendarRef) {
            this.dayCalendarRef.api.toggleCalendarMode(ECalendarMode.Day);
        }
        this.close.emit();
        this.cd.markForCheck();
    }
    onViewDateChange(value) {
        const strVal = value ? this.utilsService.convertToString(value, this.componentConfig.format) : '';
        if (this.dayPickerService.isValidInputDateValue(strVal, this.componentConfig)) {
            this.selected = this.dayPickerService.convertInputValueToMomentArray(strVal, this.componentConfig);
            this.currentDateView = this.selected.length
                ? this.utilsService.getDefaultDisplayDate(null, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min)
                : this.currentDateView;
            this.onSelect.emit({
                date: strVal,
                type: SelectEvent.INPUT,
                granularity: null
            });
        }
        else {
            this._selected = this.utilsService
                .getValidMomentArray(strVal, this.componentConfig.format);
            this.onChangeCallback(this.processOnChangeCallback(strVal), true);
        }
    }
    dateSelected(date, granularity, type, ignoreClose) {
        this.selected = this.utilsService
            .updateSelected(this.componentConfig.allowMultiSelect, this.selected, date, granularity);
        if (!ignoreClose) {
            this.onDateClick();
        }
        this.onSelect.emit({
            date: date.date,
            granularity,
            type
        });
    }
    onDateClick() {
        if (this.componentConfig.closeOnSelect) {
            setTimeout(this.hideCalendar.bind(this), this.componentConfig.closeOnSelectDelay);
        }
    }
    onKeyPress(event) {
        switch (event.keyCode) {
            case (9):
            case (27):
                this.hideCalendar();
                break;
        }
    }
    moveCalendarTo(date) {
        const momentDate = this.utilsService.convertToMoment(date, this.componentConfig.format);
        this.currentDateView = momentDate;
    }
    onLeftNavClick(change) {
        this.onLeftNav.emit(change);
    }
    onRightNavClick(change) {
        this.onRightNav.emit(change);
    }
    startGlobalListeners() {
        this.globalListenersUnlisteners.push(this.renderer.listen(document, 'keydown', (e) => {
            this.onKeyPress(e);
        }), this.renderer.listen(document, 'scroll', () => {
            this.onScroll();
        }), this.renderer.listen(document, 'click', () => {
            this.onBodyClick();
        }));
    }
    stopGlobalListeners() {
        this.globalListenersUnlisteners.forEach((ul) => ul());
        this.globalListenersUnlisteners = [];
    }
    ngOnDestroy() {
        this.handleInnerElementClickUnlisteners.forEach(ul => ul());
        if (this.appendToElement) {
            this.appendToElement.removeChild(this.calendarWrapper);
        }
    }
}
DatePickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'dp-date-picker',
                template: "<div [ngClass]=\"{'dp-open': areCalendarsShown}\">\n  <div [attr.data-hidden]=\"componentConfig.hideInputContainer\"\n       [hidden]=\"componentConfig.hideInputContainer\"\n       class=\"dp-input-container\">\n    <input (blur)=\"inputBlurred()\"\n           (focus)=\"inputFocused()\"\n           (keydown.enter)=\"componentConfig.closeOnEnter && hideCalendar()\"\n           (ngModelChange)=\"onViewDateChange($event)\"\n           [disabled]=\"disabled\"\n           [ngModel]=\"inputElementValue\"\n           [placeholder]=\"placeholder\"\n           [readonly]=\"componentConfig.disableKeypress\"\n           class=\"dp-picker-input\"\n           type=\"text\"/>\n  </div>\n  <div #container>\n    <div [attr.data-hidden]=\"!_areCalendarsShown\"\n         [hidden]=\"!_areCalendarsShown\"\n         [ngSwitch]=\"mode\"\n         class=\"dp-popup {{theme}}\">\n      <dp-day-calendar #dayCalendar\n                       (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                       (onLeftNav)=\"onLeftNavClick($event)\"\n                       (onRightNav)=\"onRightNavClick($event)\"\n                       (onSelect)=\"dateSelected($event, 'day', selectEvent.SELECTION, false)\"\n                       *ngSwitchCase=\"'day'\"\n                       [config]=\"dayCalendarConfig\"\n                       [displayDate]=\"displayDate\"\n                       [ngModel]=\"_selected\"\n                       [theme]=\"theme\">\n      </dp-day-calendar>\n\n      <dp-month-calendar #monthCalendar\n                         (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                         (onLeftNav)=\"onLeftNavClick($event)\"\n                         (onRightNav)=\"onRightNavClick($event)\"\n                         (onSelect)=\"dateSelected($event, 'month', selectEvent.SELECTION, false)\"\n                         *ngSwitchCase=\"'month'\"\n                         [config]=\"dayCalendarConfig\"\n                         [displayDate]=\"displayDate\"\n                         [ngModel]=\"_selected\"\n                         [theme]=\"theme\">\n      </dp-month-calendar>\n\n      <dp-time-select #timeSelect\n                      (onChange)=\"dateSelected($event, 'second', selectEvent.SELECTION, true)\"\n                      *ngSwitchCase=\"'time'\"\n                      [config]=\"timeSelectConfig\"\n                      [ngModel]=\"_selected && _selected[0]\"\n                      [theme]=\"theme\">\n      </dp-time-select>\n\n      <dp-day-time-calendar #daytimeCalendar\n                            (onChange)=\"dateSelected($event, 'second', selectEvent.SELECTION, true)\"\n                            (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                            (onLeftNav)=\"onLeftNavClick($event)\"\n                            (onRightNav)=\"onRightNavClick($event)\"\n                            *ngSwitchCase=\"'daytime'\"\n                            [config]=\"dayTimeCalendarConfig\"\n                            [displayDate]=\"displayDate\"\n                            [ngModel]=\"_selected && _selected[0]\"\n                            [theme]=\"theme\">\n      </dp-day-time-calendar>\n    </div>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [
                    DatePickerService,
                    DayTimeCalendarService,
                    DayCalendarService,
                    TimeSelectService,
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => DatePickerComponent),
                        multi: true
                    },
                    {
                        provide: NG_VALIDATORS,
                        useExisting: forwardRef(() => DatePickerComponent),
                        multi: true
                    }
                ],
                styles: [""]
            },] }
];
DatePickerComponent.ctorParameters = () => [
    { type: DatePickerService },
    { type: DomHelper },
    { type: ElementRef },
    { type: Renderer2 },
    { type: UtilsService },
    { type: ChangeDetectorRef }
];
DatePickerComponent.propDecorators = {
    config: [{ type: Input }],
    mode: [{ type: Input }],
    placeholder: [{ type: Input }],
    disabled: [{ type: Input }],
    displayDate: [{ type: Input }],
    theme: [{ type: HostBinding, args: ['class',] }, { type: Input }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    minTime: [{ type: Input }],
    maxTime: [{ type: Input }],
    open: [{ type: Output }],
    close: [{ type: Output }],
    onChange: [{ type: Output }],
    onGoToCurrent: [{ type: Output }],
    onLeftNav: [{ type: Output }],
    onRightNav: [{ type: Output }],
    onSelect: [{ type: Output }],
    calendarContainer: [{ type: ViewChild, args: ['container',] }],
    dayCalendarRef: [{ type: ViewChild, args: ['dayCalendar',] }],
    monthCalendarRef: [{ type: ViewChild, args: ['monthCalendar',] }],
    dayTimeCalendarRef: [{ type: ViewChild, args: ['daytimeCalendar',] }],
    timeSelectRef: [{ type: ViewChild, args: ['timeSelect',] }],
    onClick: [{ type: HostListener, args: ['click',] }],
    onScroll: [{ type: HostListener, args: ['window:resize',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3NyYy9saWIvIiwic291cmNlcyI6WyJkYXRlLXBpY2tlci9kYXRlLXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHNEQUFzRCxDQUFDO0FBQy9FLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUVwRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFFakUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBSW5FLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBRXhFLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLGdEQUFnRCxDQUFDO0FBR3RGLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBR3JFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3hELE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBQ1gsWUFBWSxFQUNaLEtBQUssRUFJTCxNQUFNLEVBQ04sU0FBUyxFQUVULFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUdMLGFBQWEsRUFDYixpQkFBaUIsRUFHbEIsTUFBTSxnQkFBZ0IsQ0FBQztBQU14QixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUEwQmpFLE1BQU0sT0FBTyxtQkFBbUI7SUFxRDlCLFlBQTZCLGdCQUFtQyxFQUNuQyxTQUFvQixFQUNwQixPQUFtQixFQUNuQixRQUFtQixFQUNuQixZQUEwQixFQUMzQixFQUFxQjtRQUxwQixxQkFBZ0IsR0FBaEIsZ0JB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bEIsaUJBQWlCOzs7cUJBZ0VoQixLQUFLO21CQUNMLEtBQUs7MEJBQ0wsS0FBSzt1QkFDTCxLQUFLOzBCQUNMLEtBQUs7b0JBQ0wsV0FBVyxTQUFDLE9BQU8sY0FBRyxLQUFLO3NCQUMzQixLQUFLO3NCQUNMLEtBQUs7c0JBQ0wsS0FBSztzQkFDTCxLQUFLO21CQUNMLE1BQU07b0JBQ04sTUFBTTt1QkFDTixNQUFNOzRCQUNOLE1BQU07d0JBQ04sTUFBTTt5QkFDTixNQUFNO3VCQUNOLE1BQU07Z0NBQ04sU0FBUyxTQUFDLFdBQVc7NkJBQ3JCLFNBQVMsU0FBQyxhQUFhOytCQUN2QixTQUFTLFNBQUMsZUFBZTtpQ0FDekIsU0FBUyxTQUFDLGlCQUFpQjs0QkFDM0IsU0FBUyxTQUFDLFlBQVk7c0JBdUd0QixZQUFZLFNBQUMsT0FBTzt1QkF3QnBCLFlBQVksU0FBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJRGF0ZX0gZnJvbSAnLi4vY29tbW9uL21vZGVscy9kYXRlLm1vZGVsJztcbmltcG9ydCB7RG9tSGVscGVyfSBmcm9tICcuLi9jb21tb24vc2VydmljZXMvZG9tLWFwcGVuZGVyL2RvbS1hcHBlbmRlci5zZXJ2aWNlJztcbmltcG9ydCB7VXRpbHNTZXJ2aWNlfSBmcm9tICcuLi9jb21tb24vc2VydmljZXMvdXRpbHMvdXRpbHMuc2VydmljZSc7XG5pbXBvcnQge0NhbGVuZGFyTW9kZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL2NhbGVuZGFyLW1vZGUnO1xuaW1wb3J0IHtFQ2FsZW5kYXJNb2RlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItbW9kZS1lbnVtJztcbmltcG9ydCB7Q2FsZW5kYXJWYWx1ZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL2NhbGVuZGFyLXZhbHVlJztcbmltcG9ydCB7RUNhbGVuZGFyVmFsdWV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci12YWx1ZS1lbnVtJztcbmltcG9ydCB7U2luZ2xlQ2FsZW5kYXJWYWx1ZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL3NpbmdsZS1jYWxlbmRhci12YWx1ZSc7XG5pbXBvcnQge0lEYXlDYWxlbmRhckNvbmZpZ30gZnJvbSAnLi4vZGF5LWNhbGVuZGFyL2RheS1jYWxlbmRhci1jb25maWcubW9kZWwnO1xuaW1wb3J0IHtEYXlDYWxlbmRhckNvbXBvbmVudH0gZnJvbSAnLi4vZGF5LWNhbGVuZGFyL2RheS1jYWxlbmRhci5jb21wb25lbnQnO1xuaW1wb3J0IHtEYXlDYWxlbmRhclNlcnZpY2V9IGZyb20gJy4uL2RheS1jYWxlbmRhci9kYXktY2FsZW5kYXIuc2VydmljZSc7XG5pbXBvcnQge0lEYXlUaW1lQ2FsZW5kYXJDb25maWd9IGZyb20gJy4uL2RheS10aW1lLWNhbGVuZGFyL2RheS10aW1lLWNhbGVuZGFyLWNvbmZpZy5tb2RlbCc7XG5pbXBvcnQge0RheVRpbWVDYWxlbmRhclNlcnZpY2V9IGZyb20gJy4uL2RheS10aW1lLWNhbGVuZGFyL2RheS10aW1lLWNhbGVuZGFyLnNlcnZpY2UnO1xuaW1wb3J0IHtJVGltZVNlbGVjdENvbmZpZ30gZnJvbSAnLi4vdGltZS1zZWxlY3QvdGltZS1zZWxlY3QtY29uZmlnLm1vZGVsJztcbmltcG9ydCB7VGltZVNlbGVjdENvbXBvbmVudH0gZnJvbSAnLi4vdGltZS1zZWxlY3QvdGltZS1zZWxlY3QuY29tcG9uZW50JztcbmltcG9ydCB7VGltZVNlbGVjdFNlcnZpY2V9IGZyb20gJy4uL3RpbWUtc2VsZWN0L3RpbWUtc2VsZWN0LnNlcnZpY2UnO1xuaW1wb3J0IHtJRGF0ZVBpY2tlckNvbmZpZywgSURhdGVQaWNrZXJDb25maWdJbnRlcm5hbH0gZnJvbSAnLi9kYXRlLXBpY2tlci1jb25maWcubW9kZWwnO1xuaW1wb3J0IHtJRHBEYXlQaWNrZXJBcGl9IGZyb20gJy4vZGF0ZS1waWNrZXIuYXBpJztcbmltcG9ydCB7RGF0ZVBpY2tlclNlcnZpY2V9IGZyb20gJy4vZGF0ZS1waWNrZXIuc2VydmljZSc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0QmluZGluZyxcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgRm9ybUNvbnRyb2wsXG4gIE5HX1ZBTElEQVRPUlMsXG4gIE5HX1ZBTFVFX0FDQ0VTU09SLFxuICBWYWxpZGF0aW9uRXJyb3JzLFxuICBWYWxpZGF0b3Jcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtNb21lbnQsIHVuaXRPZlRpbWV9IGZyb20gJ21vbWVudCc7XG5pbXBvcnQge0RhdGVWYWxpZGF0b3J9IGZyb20gJy4uL2NvbW1vbi90eXBlcy92YWxpZGF0b3IudHlwZSc7XG5pbXBvcnQge01vbnRoQ2FsZW5kYXJDb21wb25lbnR9IGZyb20gJy4uL21vbnRoLWNhbGVuZGFyL21vbnRoLWNhbGVuZGFyLmNvbXBvbmVudCc7XG5pbXBvcnQge0RheVRpbWVDYWxlbmRhckNvbXBvbmVudH0gZnJvbSAnLi4vZGF5LXRpbWUtY2FsZW5kYXIvZGF5LXRpbWUtY2FsZW5kYXIuY29tcG9uZW50JztcbmltcG9ydCB7SU5hdkV2ZW50fSBmcm9tICcuLi9jb21tb24vbW9kZWxzL25hdmlnYXRpb24tZXZlbnQubW9kZWwnO1xuaW1wb3J0IHtTZWxlY3RFdmVudH0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL3NlbGVjdGlvbi1ldmVudC5lbnVtJztcbmltcG9ydCB7SVNlbGVjdGlvbkV2ZW50fSBmcm9tICcuLi9jb21tb24vdHlwZXMvc2VsZWN0aW9uLWV2ZW50Lm1vZGVsJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZHAtZGF0ZS1waWNrZXInLFxuICB0ZW1wbGF0ZVVybDogJ2RhdGUtcGlja2VyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RhdGUtcGlja2VyLmNvbXBvbmVudC5sZXNzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcm92aWRlcnM6IFtcbiAgICBEYXRlUGlja2VyU2VydmljZSxcbiAgICBEYXlUaW1lQ2FsZW5kYXJTZXJ2aWNlLFxuICAgIERheUNhbGVuZGFyU2VydmljZSxcbiAgICBUaW1lU2VsZWN0U2VydmljZSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERhdGVQaWNrZXJDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBEYXRlUGlja2VyQ29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIERhdGVQaWNrZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9uSW5pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZhbGlkYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT25EZXN0cm95IHtcblxuICBpc0luaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIGNvbmZpZzogSURhdGVQaWNrZXJDb25maWc7XG4gIEBJbnB1dCgpIG1vZGU6IENhbGVuZGFyTW9kZSA9ICdkYXknO1xuICBASW5wdXQoKSBwbGFjZWhvbGRlcjogc3RyaW5nID0gJyc7XG4gIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIGRpc3BsYXlEYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlO1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzJykgQElucHV0KCkgdGhlbWU6IHN0cmluZztcbiAgQElucHV0KCkgbWluRGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcbiAgQElucHV0KCkgbWF4RGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcbiAgQElucHV0KCkgbWluVGltZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcbiAgQElucHV0KCkgbWF4VGltZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcbiAgQE91dHB1dCgpIG9wZW4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gIEBPdXRwdXQoKSBjbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgQE91dHB1dCgpIG9uQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxDYWxlbmRhclZhbHVlPigpO1xuICBAT3V0cHV0KCkgb25Hb1RvQ3VycmVudDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25MZWZ0TmF2OiBFdmVudEVtaXR0ZXI8SU5hdkV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uUmlnaHROYXY6IEV2ZW50RW1pdHRlcjxJTmF2RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25TZWxlY3Q6IEV2ZW50RW1pdHRlcjxJU2VsZWN0aW9uRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAVmlld0NoaWxkKCdjb250YWluZXInKSBjYWxlbmRhckNvbnRhaW5lcjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnZGF5Q2FsZW5kYXInKSBkYXlDYWxlbmRhclJlZjogRGF5Q2FsZW5kYXJDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ21vbnRoQ2FsZW5kYXInKSBtb250aENhbGVuZGFyUmVmOiBNb250aENhbGVuZGFyQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdkYXl0aW1lQ2FsZW5kYXInKSBkYXlUaW1lQ2FsZW5kYXJSZWY6IERheVRpbWVDYWxlbmRhckNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgndGltZVNlbGVjdCcpIHRpbWVTZWxlY3RSZWY6IFRpbWVTZWxlY3RDb21wb25lbnQ7XG4gIGNvbXBvbmVudENvbmZpZzogSURhdGVQaWNrZXJDb25maWdJbnRlcm5hbDtcbiAgZGF5Q2FsZW5kYXJDb25maWc6IElEYXlDYWxlbmRhckNvbmZpZztcbiAgZGF5VGltZUNhbGVuZGFyQ29uZmlnOiBJRGF5VGltZUNhbGVuZGFyQ29uZmlnO1xuICB0aW1lU2VsZWN0Q29uZmlnOiBJVGltZVNlbGVjdENvbmZpZztcbiAgaGlkZVN0YXRlSGVscGVyOiBib29sZWFuID0gZmFsc2U7XG4gIGlucHV0VmFsdWU6IENhbGVuZGFyVmFsdWU7XG4gIGlzRm9jdXNlZFRyaWdnZXI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgaW5wdXRFbGVtZW50VmFsdWU6IHN0cmluZztcbiAgY2FsZW5kYXJXcmFwcGVyOiBIVE1MRWxlbWVudDtcbiAgYXBwZW5kVG9FbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgaW5wdXRFbGVtZW50Q29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgcG9wdXBFbGVtOiBIVE1MRWxlbWVudDtcbiAgaGFuZGxlSW5uZXJFbGVtZW50Q2xpY2tVbmxpc3RlbmVyczogRnVuY3Rpb25bXSA9IFtdO1xuICBnbG9iYWxMaXN0ZW5lcnNVbmxpc3RlbmVyczogRnVuY3Rpb25bXSA9IFtdO1xuICB2YWxpZGF0ZUZuOiBEYXRlVmFsaWRhdG9yO1xuICBhcGk6IElEcERheVBpY2tlckFwaSA9IHtcbiAgICBvcGVuOiB0aGlzLnNob3dDYWxlbmRhcnMuYmluZCh0aGlzKSxcbiAgICBjbG9zZTogdGhpcy5oaWRlQ2FsZW5kYXIuYmluZCh0aGlzKSxcbiAgICBtb3ZlQ2FsZW5kYXJUbzogdGhpcy5tb3ZlQ2FsZW5kYXJUby5iaW5kKHRoaXMpXG4gIH07XG4gIHNlbGVjdEV2ZW50ID0gU2VsZWN0RXZlbnQ7XG4gIHByaXZhdGUgb25PcGVuRGVsYXlUaW1lb3V0SGFuZGxlcjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGRheVBpY2tlclNlcnZpY2U6IERhdGVQaWNrZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGRvbUhlbHBlcjogRG9tSGVscGVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGVsZW1SZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSB1dGlsc1NlcnZpY2U6IFV0aWxzU2VydmljZSxcbiAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICB9XG5cbiAgZ2V0IG9wZW5PbkZvY3VzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbXBvbmVudENvbmZpZy5vcGVuT25Gb2N1cztcbiAgfVxuXG4gIGdldCBvcGVuT25DbGljaygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb21wb25lbnRDb25maWcub3Blbk9uQ2xpY2s7XG4gIH1cblxuICBfYXJlQ2FsZW5kYXJzU2hvd246IGJvb2xlYW4gPSBmYWxzZTtcblxuICBnZXQgYXJlQ2FsZW5kYXJzU2hvd24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FyZUNhbGVuZGFyc1Nob3duO1xuICB9XG5cbiAgc2V0IGFyZUNhbGVuZGFyc1Nob3duKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnN0YXJ0R2xvYmFsTGlzdGVuZXJzKCk7XG4gICAgICB0aGlzLmRvbUhlbHBlci5hcHBlbmRFbGVtZW50VG9Qb3NpdGlvbih7XG4gICAgICAgIGNvbnRhaW5lcjogdGhpcy5hcHBlbmRUb0VsZW1lbnQsXG4gICAgICAgIGVsZW1lbnQ6IHRoaXMuY2FsZW5kYXJXcmFwcGVyLFxuICAgICAgICBhbmNob3I6IHRoaXMuaW5wdXRFbGVtZW50Q29udGFpbmVyLFxuICAgICAgICBkaW1FbGVtOiB0aGlzLnBvcHVwRWxlbSxcbiAgICAgICAgZHJvcHM6IHRoaXMuY29tcG9uZW50Q29uZmlnLmRyb3BzLFxuICAgICAgICBvcGVuczogdGhpcy5jb21wb25lbnRDb25maWcub3BlbnNcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0b3BHbG9iYWxMaXN0ZW5lcnMoKTtcbiAgICAgIHRoaXMuZGF5UGlja2VyU2VydmljZS5waWNrZXJDbG9zZWQoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9hcmVDYWxlbmRhcnNTaG93biA9IHZhbHVlO1xuICB9XG5cbiAgX3NlbGVjdGVkOiBNb21lbnRbXSA9IFtdO1xuXG4gIGdldCBzZWxlY3RlZCgpOiBNb21lbnRbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xuICB9XG5cbiAgc2V0IHNlbGVjdGVkKHNlbGVjdGVkOiBNb21lbnRbXSkge1xuICAgIHRoaXMuX3NlbGVjdGVkID0gc2VsZWN0ZWQ7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnRWYWx1ZSA9ICg8c3RyaW5nW10+dGhpcy51dGlsc1NlcnZpY2VcbiAgICAgIC5jb252ZXJ0RnJvbU1vbWVudEFycmF5KHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCwgc2VsZWN0ZWQsIEVDYWxlbmRhclZhbHVlLlN0cmluZ0FycikpXG4gICAgICAuam9pbignIHwgJyk7XG4gICAgY29uc3QgdmFsID0gdGhpcy5wcm9jZXNzT25DaGFuZ2VDYWxsYmFjayhzZWxlY3RlZCk7XG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHZhbCwgZmFsc2UpO1xuICAgIHRoaXMub25DaGFuZ2UuZW1pdCh2YWwpO1xuICB9XG5cbiAgX2N1cnJlbnREYXRlVmlldzogTW9tZW50O1xuXG4gIGdldCBjdXJyZW50RGF0ZVZpZXcoKTogTW9tZW50IHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudERhdGVWaWV3O1xuICB9XG5cbiAgc2V0IGN1cnJlbnREYXRlVmlldyhkYXRlOiBNb21lbnQpIHtcbiAgICB0aGlzLl9jdXJyZW50RGF0ZVZpZXcgPSBkYXRlO1xuXG4gICAgaWYgKHRoaXMuZGF5Q2FsZW5kYXJSZWYpIHtcbiAgICAgIHRoaXMuZGF5Q2FsZW5kYXJSZWYubW92ZUNhbGVuZGFyVG8oZGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubW9udGhDYWxlbmRhclJlZikge1xuICAgICAgdGhpcy5tb250aENhbGVuZGFyUmVmLm1vdmVDYWxlbmRhclRvKGRhdGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRheVRpbWVDYWxlbmRhclJlZikge1xuICAgICAgdGhpcy5kYXlUaW1lQ2FsZW5kYXJSZWYubW92ZUNhbGVuZGFyVG8oZGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snKVxuICBvbkNsaWNrKCkge1xuICAgIGlmICghdGhpcy5vcGVuT25DbGljaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5pc0ZvY3VzZWRUcmlnZ2VyICYmICF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLmhpZGVTdGF0ZUhlbHBlciA9IHRydWU7XG4gICAgICBpZiAoIXRoaXMuYXJlQ2FsZW5kYXJzU2hvd24pIHtcbiAgICAgICAgdGhpcy5zaG93Q2FsZW5kYXJzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25Cb2R5Q2xpY2soKSB7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50Q29uZmlnLmhpZGVPbk91dHNpZGVDbGljaykge1xuICAgICAgaWYgKCF0aGlzLmhpZGVTdGF0ZUhlbHBlciAmJiB0aGlzLmFyZUNhbGVuZGFyc1Nob3duKSB7XG4gICAgICAgIHRoaXMuaGlkZUNhbGVuZGFyKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGlkZVN0YXRlSGVscGVyID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpXG4gIG9uU2Nyb2xsKCkge1xuICAgIGlmICh0aGlzLmFyZUNhbGVuZGFyc1Nob3duKSB7XG4gICAgICB0aGlzLmRvbUhlbHBlci5zZXRFbGVtZW50UG9zaXRpb24oe1xuICAgICAgICBjb250YWluZXI6IHRoaXMuYXBwZW5kVG9FbGVtZW50LFxuICAgICAgICBlbGVtZW50OiB0aGlzLmNhbGVuZGFyV3JhcHBlcixcbiAgICAgICAgYW5jaG9yOiB0aGlzLmlucHV0RWxlbWVudENvbnRhaW5lcixcbiAgICAgICAgZGltRWxlbTogdGhpcy5wb3B1cEVsZW0sXG4gICAgICAgIGRyb3BzOiB0aGlzLmNvbXBvbmVudENvbmZpZy5kcm9wcyxcbiAgICAgICAgb3BlbnM6IHRoaXMuY29tcG9uZW50Q29uZmlnLm9wZW5zXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBDYWxlbmRhclZhbHVlKTogdm9pZCB7XG4gICAgdGhpcy5pbnB1dFZhbHVlID0gdmFsdWU7XG5cbiAgICBpZiAodmFsdWUgfHwgdmFsdWUgPT09ICcnKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgLmNvbnZlcnRUb01vbWVudEFycmF5KHZhbHVlLCB0aGlzLmNvbXBvbmVudENvbmZpZyk7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RlZCA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sgPSBmbjtcbiAgfVxuXG4gIG9uQ2hhbmdlQ2FsbGJhY2soXzogYW55LCBjaGFuZ2VkQnlJbnB1dDogYm9vbGVhbikge1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkQ2FsbGJhY2sgPSBmbjtcbiAgfVxuXG4gIG9uVG91Y2hlZENhbGxiYWNrKCkge1xuICB9XG5cbiAgdmFsaWRhdGUoZm9ybUNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgcmV0dXJuIHRoaXMudmFsaWRhdGVGbihmb3JtQ29udHJvbC52YWx1ZSk7XG4gIH1cblxuICBwcm9jZXNzT25DaGFuZ2VDYWxsYmFjayhzZWxlY3RlZDogTW9tZW50W10gfCBzdHJpbmcpOiBDYWxlbmRhclZhbHVlIHtcbiAgICBpZiAodHlwZW9mIHNlbGVjdGVkID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHNlbGVjdGVkO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy51dGlsc1NlcnZpY2UuY29udmVydEZyb21Nb21lbnRBcnJheShcbiAgICAgICAgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0LFxuICAgICAgICBzZWxlY3RlZCxcbiAgICAgICAgdGhpcy5jb21wb25lbnRDb25maWcucmV0dXJuZWRWYWx1ZVR5cGUgfHwgdGhpcy51dGlsc1NlcnZpY2UuZ2V0SW5wdXRUeXBlKHRoaXMuaW5wdXRWYWx1ZSwgdGhpcy5jb21wb25lbnRDb25maWcuYWxsb3dNdWx0aVNlbGVjdClcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgaW5pdFZhbGlkYXRvcnMoKTogdm9pZCB7XG4gICAgdGhpcy52YWxpZGF0ZUZuID0gdGhpcy51dGlsc1NlcnZpY2UuY3JlYXRlVmFsaWRhdG9yKFxuICAgICAge1xuICAgICAgICBtaW5EYXRlOiB0aGlzLm1pbkRhdGUsXG4gICAgICAgIG1heERhdGU6IHRoaXMubWF4RGF0ZSxcbiAgICAgICAgbWluVGltZTogdGhpcy5taW5UaW1lLFxuICAgICAgICBtYXhUaW1lOiB0aGlzLm1heFRpbWVcbiAgICAgIH0sIHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCwgdGhpcy5tb2RlKTtcblxuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnByb2Nlc3NPbkNoYW5nZUNhbGxiYWNrKHRoaXMuc2VsZWN0ZWQpLCBmYWxzZSk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnNldEVsZW1lbnRQb3NpdGlvbkluRG9tKCk7XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgc2V0RWxlbWVudFBvc2l0aW9uSW5Eb20oKTogdm9pZCB7XG4gICAgdGhpcy5jYWxlbmRhcldyYXBwZXIgPSA8SFRNTEVsZW1lbnQ+dGhpcy5jYWxlbmRhckNvbnRhaW5lci5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuc2V0SW5wdXRFbGVtZW50Q29udGFpbmVyKCk7XG4gICAgdGhpcy5wb3B1cEVsZW0gPSB0aGlzLmVsZW1SZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZHAtcG9wdXAnKTtcbiAgICB0aGlzLmhhbmRsZUlubmVyRWxlbWVudENsaWNrKHRoaXMucG9wdXBFbGVtKTtcblxuICAgIGNvbnN0IHthcHBlbmRUb30gPSB0aGlzLmNvbXBvbmVudENvbmZpZztcbiAgICBpZiAoYXBwZW5kVG8pIHtcbiAgICAgIGlmICh0eXBlb2YgYXBwZW5kVG8gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kVG9FbGVtZW50ID0gPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoPHN0cmluZz5hcHBlbmRUbyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFwcGVuZFRvRWxlbWVudCA9IDxIVE1MRWxlbWVudD5hcHBlbmRUbztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hcHBlbmRUb0VsZW1lbnQgPSB0aGlzLmVsZW1SZWYubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICB0aGlzLmFwcGVuZFRvRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNhbGVuZGFyV3JhcHBlcik7XG4gIH1cblxuICBzZXRJbnB1dEVsZW1lbnRDb250YWluZXIoKSB7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnRDb250YWluZXIgPSB0aGlzLnV0aWxzU2VydmljZS5nZXROYXRpdmVFbGVtZW50KHRoaXMuY29tcG9uZW50Q29uZmlnLmlucHV0RWxlbWVudENvbnRhaW5lcilcbiAgICAgIHx8IHRoaXMuZWxlbVJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcC1pbnB1dC1jb250YWluZXInKVxuICAgICAgfHwgZG9jdW1lbnQuYm9keTtcbiAgfVxuXG4gIGhhbmRsZUlubmVyRWxlbWVudENsaWNrKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5oYW5kbGVJbm5lckVsZW1lbnRDbGlja1VubGlzdGVuZXJzLnB1c2goXG4gICAgICB0aGlzLnJlbmRlcmVyLmxpc3RlbihlbGVtZW50LCAnY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuaGlkZVN0YXRlSGVscGVyID0gdHJ1ZTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5jb21wb25lbnRDb25maWcgPSB0aGlzLmRheVBpY2tlclNlcnZpY2UuZ2V0Q29uZmlnKHRoaXMuY29uZmlnLCB0aGlzLm1vZGUpO1xuICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gdGhpcy5kaXNwbGF5RGF0ZVxuICAgICAgPyB0aGlzLnV0aWxzU2VydmljZS5jb252ZXJ0VG9Nb21lbnQodGhpcy5kaXNwbGF5RGF0ZSwgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0KS5jbG9uZSgpXG4gICAgICA6IHRoaXMudXRpbHNTZXJ2aWNlXG4gICAgICAgIC5nZXREZWZhdWx0RGlzcGxheURhdGUoXG4gICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcsXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZCxcbiAgICAgICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5hbGxvd011bHRpU2VsZWN0LFxuICAgICAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLm1pblxuICAgICAgICApO1xuICAgIHRoaXMuZGF5Q2FsZW5kYXJDb25maWcgPSB0aGlzLmRheVBpY2tlclNlcnZpY2UuZ2V0RGF5Q29uZmlnU2VydmljZSh0aGlzLmNvbXBvbmVudENvbmZpZyk7XG4gICAgdGhpcy5kYXlUaW1lQ2FsZW5kYXJDb25maWcgPSB0aGlzLmRheVBpY2tlclNlcnZpY2UuZ2V0RGF5VGltZUNvbmZpZ1NlcnZpY2UodGhpcy5jb21wb25lbnRDb25maWcpO1xuICAgIHRoaXMudGltZVNlbGVjdENvbmZpZyA9IHRoaXMuZGF5UGlja2VyU2VydmljZS5nZXRUaW1lQ29uZmlnU2VydmljZSh0aGlzLmNvbXBvbmVudENvbmZpZyk7XG4gICAgdGhpcy5pbml0VmFsaWRhdG9ycygpO1xuICB9XG5cbiAgaW5wdXRGb2N1c2VkKCkge1xuICAgIGlmICghdGhpcy5vcGVuT25Gb2N1cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNsZWFyVGltZW91dCh0aGlzLm9uT3BlbkRlbGF5VGltZW91dEhhbmRsZXIpO1xuICAgIHRoaXMuaXNGb2N1c2VkVHJpZ2dlciA9IHRydWU7XG4gICAgdGhpcy5vbk9wZW5EZWxheVRpbWVvdXRIYW5kbGVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuYXJlQ2FsZW5kYXJzU2hvd24pIHtcbiAgICAgICAgdGhpcy5zaG93Q2FsZW5kYXJzKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGlkZVN0YXRlSGVscGVyID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuaXNGb2N1c2VkVHJpZ2dlciA9IGZhbHNlO1xuICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9LCB0aGlzLmNvbXBvbmVudENvbmZpZy5vbk9wZW5EZWxheSk7XG4gIH1cblxuICBpbnB1dEJsdXJyZWQoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMub25PcGVuRGVsYXlUaW1lb3V0SGFuZGxlcik7XG4gICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjaygpO1xuICB9XG5cbiAgc2hvd0NhbGVuZGFycygpIHtcbiAgICB0aGlzLmhpZGVTdGF0ZUhlbHBlciA9IHRydWU7XG4gICAgdGhpcy5hcmVDYWxlbmRhcnNTaG93biA9IHRydWU7XG5cbiAgICBpZiAodGhpcy50aW1lU2VsZWN0UmVmKSB7XG4gICAgICB0aGlzLnRpbWVTZWxlY3RSZWYuYXBpLnRyaWdnZXJDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLm9wZW4uZW1pdCgpO1xuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBoaWRlQ2FsZW5kYXIoKSB7XG4gICAgdGhpcy5hcmVDYWxlbmRhcnNTaG93biA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuZGF5Q2FsZW5kYXJSZWYpIHtcbiAgICAgIHRoaXMuZGF5Q2FsZW5kYXJSZWYuYXBpLnRvZ2dsZUNhbGVuZGFyTW9kZShFQ2FsZW5kYXJNb2RlLkRheSk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZS5lbWl0KCk7XG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIG9uVmlld0RhdGVDaGFuZ2UodmFsdWU6IENhbGVuZGFyVmFsdWUpIHtcbiAgICBjb25zdCBzdHJWYWwgPSB2YWx1ZSA/IHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRUb1N0cmluZyh2YWx1ZSwgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0KSA6ICcnO1xuICAgIGlmICh0aGlzLmRheVBpY2tlclNlcnZpY2UuaXNWYWxpZElucHV0RGF0ZVZhbHVlKHN0clZhbCwgdGhpcy5jb21wb25lbnRDb25maWcpKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5kYXlQaWNrZXJTZXJ2aWNlLmNvbnZlcnRJbnB1dFZhbHVlVG9Nb21lbnRBcnJheShzdHJWYWwsIHRoaXMuY29tcG9uZW50Q29uZmlnKTtcbiAgICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gdGhpcy5zZWxlY3RlZC5sZW5ndGhcbiAgICAgICAgPyB0aGlzLnV0aWxzU2VydmljZS5nZXREZWZhdWx0RGlzcGxheURhdGUoXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkLFxuICAgICAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLmFsbG93TXVsdGlTZWxlY3QsXG4gICAgICAgICAgdGhpcy5jb21wb25lbnRDb25maWcubWluXG4gICAgICAgIClcbiAgICAgICAgOiB0aGlzLmN1cnJlbnREYXRlVmlldztcblxuICAgICAgdGhpcy5vblNlbGVjdC5lbWl0KHtcbiAgICAgICAgZGF0ZTogc3RyVmFsLFxuICAgICAgICB0eXBlOiBTZWxlY3RFdmVudC5JTlBVVCxcbiAgICAgICAgZ3JhbnVsYXJpdHk6IG51bGxcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gdGhpcy51dGlsc1NlcnZpY2VcbiAgICAgICAgLmdldFZhbGlkTW9tZW50QXJyYXkoc3RyVmFsLCB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQpO1xuICAgICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMucHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2soc3RyVmFsKSwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgZGF0ZVNlbGVjdGVkKGRhdGU6IElEYXRlLCBncmFudWxhcml0eTogdW5pdE9mVGltZS5CYXNlLCB0eXBlOiBTZWxlY3RFdmVudCwgaWdub3JlQ2xvc2U/OiBib29sZWFuKSB7XG4gICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMudXRpbHNTZXJ2aWNlXG4gICAgICAudXBkYXRlU2VsZWN0ZWQodGhpcy5jb21wb25lbnRDb25maWcuYWxsb3dNdWx0aVNlbGVjdCwgdGhpcy5zZWxlY3RlZCwgZGF0ZSwgZ3JhbnVsYXJpdHkpO1xuICAgIGlmICghaWdub3JlQ2xvc2UpIHtcbiAgICAgIHRoaXMub25EYXRlQ2xpY2soKTtcbiAgICB9XG5cbiAgICB0aGlzLm9uU2VsZWN0LmVtaXQoe1xuICAgICAgZGF0ZTogZGF0ZS5kYXRlLFxuICAgICAgZ3JhbnVsYXJpdHksXG4gICAgICB0eXBlXG4gICAgfSk7XG4gIH1cblxuICBvbkRhdGVDbGljaygpIHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRDb25maWcuY2xvc2VPblNlbGVjdCkge1xuICAgICAgc2V0VGltZW91dCh0aGlzLmhpZGVDYWxlbmRhci5iaW5kKHRoaXMpLCB0aGlzLmNvbXBvbmVudENvbmZpZy5jbG9zZU9uU2VsZWN0RGVsYXkpO1xuICAgIH1cbiAgfVxuXG4gIG9uS2V5UHJlc3MoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgKDkpOlxuICAgICAgY2FzZSAoMjcpOlxuICAgICAgICB0aGlzLmhpZGVDYWxlbmRhcigpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBtb3ZlQ2FsZW5kYXJUbyhkYXRlOiBTaW5nbGVDYWxlbmRhclZhbHVlKSB7XG4gICAgY29uc3QgbW9tZW50RGF0ZSA9IHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRUb01vbWVudChkYXRlLCB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQpO1xuICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gbW9tZW50RGF0ZTtcbiAgfVxuXG4gIG9uTGVmdE5hdkNsaWNrKGNoYW5nZTogSU5hdkV2ZW50KSB7XG4gICAgdGhpcy5vbkxlZnROYXYuZW1pdChjaGFuZ2UpO1xuICB9XG5cbiAgb25SaWdodE5hdkNsaWNrKGNoYW5nZTogSU5hdkV2ZW50KSB7XG4gICAgdGhpcy5vblJpZ2h0TmF2LmVtaXQoY2hhbmdlKTtcbiAgfVxuXG4gIHN0YXJ0R2xvYmFsTGlzdGVuZXJzKCkge1xuICAgIHRoaXMuZ2xvYmFsTGlzdGVuZXJzVW5saXN0ZW5lcnMucHVzaChcbiAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGRvY3VtZW50LCAna2V5ZG93bicsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMub25LZXlQcmVzcyhlKTtcbiAgICAgIH0pLFxuICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oZG9jdW1lbnQsICdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMub25TY3JvbGwoKTtcbiAgICAgIH0pLFxuICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oZG9jdW1lbnQsICdjbGljaycsICgpID0+IHtcbiAgICAgICAgdGhpcy5vbkJvZHlDbGljaygpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgc3RvcEdsb2JhbExpc3RlbmVycygpIHtcbiAgICB0aGlzLmdsb2JhbExpc3RlbmVyc1VubGlzdGVuZXJzLmZvckVhY2goKHVsKSA9PiB1bCgpKTtcbiAgICB0aGlzLmdsb2JhbExpc3RlbmVyc1VubGlzdGVuZXJzID0gW107XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmhhbmRsZUlubmVyRWxlbWVudENsaWNrVW5saXN0ZW5lcnMuZm9yRWFjaCh1bCA9PiB1bCgpKTtcblxuICAgIGlmICh0aGlzLmFwcGVuZFRvRWxlbWVudCkge1xuICAgICAgdGhpcy5hcHBlbmRUb0VsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5jYWxlbmRhcldyYXBwZXIpO1xuICAgIH1cbiAgfVxufVxuIl19