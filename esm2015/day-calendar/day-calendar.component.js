import { ECalendarMode } from '../common/types/calendar-mode-enum';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Input, Output, ViewEncapsulation } from '@angular/core';
import { DayCalendarService } from './day-calendar.service';
import * as momentNs from 'moment';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UtilsService } from '../common/services/utils/utils.service';
const moment = momentNs;
export class DayCalendarComponent {
    constructor(dayCalendarService, utilsService, cd) {
        this.dayCalendarService = dayCalendarService;
        this.utilsService = utilsService;
        this.cd = cd;
        this.onSelect = new EventEmitter();
        this.onMonthSelect = new EventEmitter();
        this.onNavHeaderBtnClick = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.CalendarMode = ECalendarMode;
        this.isInited = false;
        this.currentCalendarMode = ECalendarMode.Day;
        this._shouldShowCurrent = true;
        this.api = {
            moveCalendarsBy: this.moveCalendarsBy.bind(this),
            moveCalendarTo: this.moveCalendarTo.bind(this),
            toggleCalendarMode: this.toggleCalendarMode.bind(this)
        };
    }
    get selected() {
        return this._selected;
    }
    set selected(selected) {
        this._selected = selected;
        this.onChangeCallback(this.processOnChangeCallback(selected));
    }
    get currentDateView() {
        return this._currentDateView;
    }
    set currentDateView(current) {
        this._currentDateView = current.clone();
        this.weeks = this.dayCalendarService
            .generateMonthArray(this.componentConfig, this._currentDateView, this.selected);
        this.navLabel = this.dayCalendarService.getHeaderLabel(this.componentConfig, this._currentDateView);
        this.showLeftNav = this.dayCalendarService.shouldShowLeft(this.componentConfig.min, this.currentDateView);
        this.showRightNav = this.dayCalendarService.shouldShowRight(this.componentConfig.max, this.currentDateView);
    }
    ;
    ngOnInit() {
        this.isInited = true;
        this.init();
        this.initValidators();
    }
    init() {
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
    }
    ngOnChanges(changes) {
        if (this.isInited) {
            const { minDate, maxDate, config } = changes;
            this.handleConfigChange(config);
            this.init();
            if (minDate || maxDate) {
                this.initValidators();
            }
        }
    }
    writeValue(value) {
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
    }
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    onChangeCallback(_) {
    }
    registerOnTouched(fn) {
    }
    validate(formControl) {
        if (this.minDate || this.maxDate) {
            return this.validateFn(formControl.value);
        }
        else {
            return () => null;
        }
    }
    processOnChangeCallback(value) {
        return this.utilsService.convertFromMomentArray(this.componentConfig.format, value, this.componentConfig.returnedValueType || this.inputValueType);
    }
    initValidators() {
        this.validateFn = this.utilsService.createValidator({ minDate: this.minDate, maxDate: this.maxDate }, this.componentConfig.format, 'day');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    }
    dayClicked(day) {
        if (day.selected && !this.componentConfig.unSelectOnClick) {
            return;
        }
        this.selected = this.utilsService
            .updateSelected(this.componentConfig.allowMultiSelect, this.selected, day);
        this.weeks = this.dayCalendarService
            .generateMonthArray(this.componentConfig, this.currentDateView, this.selected);
        this.onSelect.emit(day);
    }
    getDayBtnText(day) {
        return this.dayCalendarService.getDayBtnText(this.componentConfig, day.date);
    }
    getDayBtnCssClass(day) {
        const cssClasses = {
            'dp-selected': day.selected,
            'dp-current-month': day.currentMonth,
            'dp-prev-month': day.prevMonth,
            'dp-next-month': day.nextMonth,
            'dp-current-day': day.currentDay
        };
        const customCssClass = this.dayCalendarService.getDayBtnCssClass(this.componentConfig, day.date);
        if (customCssClass) {
            cssClasses[customCssClass] = true;
        }
        return cssClasses;
    }
    onLeftNavClick() {
        const from = this.currentDateView.clone();
        this.moveCalendarsBy(this.currentDateView, -1, 'month');
        const to = this.currentDateView.clone();
        this.onLeftNav.emit({ from, to });
    }
    onRightNavClick() {
        const from = this.currentDateView.clone();
        this.moveCalendarsBy(this.currentDateView, 1, 'month');
        const to = this.currentDateView.clone();
        this.onRightNav.emit({ from, to });
    }
    onMonthCalendarLeftClick(change) {
        this.onLeftNav.emit(change);
    }
    onMonthCalendarRightClick(change) {
        this.onRightNav.emit(change);
    }
    onMonthCalendarSecondaryLeftClick(change) {
        this.onRightNav.emit(change);
    }
    onMonthCalendarSecondaryRightClick(change) {
        this.onLeftNav.emit(change);
    }
    getWeekdayName(weekday) {
        if (this.componentConfig.weekDayFormatter) {
            return this.componentConfig.weekDayFormatter(weekday.day());
        }
        return weekday.format(this.componentConfig.weekDayFormat);
    }
    toggleCalendarMode(mode) {
        if (this.currentCalendarMode !== mode) {
            this.currentCalendarMode = mode;
            this.onNavHeaderBtnClick.emit(mode);
        }
        this.cd.markForCheck();
    }
    monthSelected(month) {
        this.currentDateView = month.date.clone();
        this.currentCalendarMode = ECalendarMode.Day;
        this.onMonthSelect.emit(month);
    }
    moveCalendarsBy(current, amount, granularity = 'month') {
        this.currentDateView = current.clone().add(amount, granularity);
        this.cd.markForCheck();
    }
    moveCalendarTo(to) {
        if (to) {
            this.currentDateView = this.utilsService.convertToMoment(to, this.componentConfig.format);
        }
        this.cd.markForCheck();
    }
    shouldShowCurrent() {
        return this.utilsService.shouldShowCurrent(this.componentConfig.showGoToCurrent, 'day', this.componentConfig.min, this.componentConfig.max);
    }
    goToCurrent() {
        this.currentDateView = moment();
        this.onGoToCurrent.emit();
    }
    handleConfigChange(config) {
        if (config) {
            const prevConf = this.dayCalendarService.getConfig(config.previousValue);
            const currentConf = this.dayCalendarService.getConfig(config.currentValue);
            if (this.utilsService.shouldResetCurrentView(prevConf, currentConf)) {
                this._currentDateView = null;
            }
            if (prevConf.locale !== currentConf.locale) {
                if (this.currentDateView) {
                    this.currentDateView.locale(currentConf.locale);
                }
                this.selected.forEach(m => m.locale(currentConf.locale));
            }
        }
    }
}
DayCalendarComponent.decorators = [
    { type: Component, args: [{
                selector: 'dp-day-calendar',
                template: "<div *ngIf=\"currentCalendarMode ===  CalendarMode.Day\" class=\"dp-day-calendar-container\">\n  <dp-calendar-nav\n      (onGoToCurrent)=\"goToCurrent()\"\n      (onLabelClick)=\"toggleCalendarMode(CalendarMode.Month)\"\n      (onLeftNav)=\"onLeftNavClick()\"\n      (onRightNav)=\"onRightNavClick()\"\n      [isLabelClickable]=\"componentConfig.enableMonthSelector\"\n      [label]=\"navLabel\"\n      [showGoToCurrent]=\"_shouldShowCurrent\"\n      [showLeftNav]=\"showLeftNav\"\n      [showRightNav]=\"showRightNav\"\n      [theme]=\"theme\">\n  </dp-calendar-nav>\n\n  <div [ngClass]=\"{'dp-hide-near-month': !componentConfig.showNearMonthDays}\"\n       class=\"dp-calendar-wrapper\">\n    <div class=\"dp-weekdays\">\n      <span *ngFor=\"let weekday of weekdays\"\n            [innerText]=\"getWeekdayName(weekday)\"\n            class=\"dp-calendar-weekday\">\n      </span>\n    </div>\n    <div *ngFor=\"let week of weeks\" class=\"dp-calendar-week\">\n      <span *ngIf=\"componentConfig.showWeekNumbers\"\n            [innerText]=\"week[0].date.isoWeek()\"\n            class=\"dp-week-number\">\n      </span>\n      <button (click)=\"dayClicked(day)\"\n              *ngFor=\"let day of week\"\n              [attr.data-date]=\"day.date.format(componentConfig.format)\"\n              [disabled]=\"day.disabled\"\n              [innerText]=\"getDayBtnText(day)\"\n              [ngClass]=\"getDayBtnCssClass(day)\"\n              class=\"dp-calendar-day\"\n              type=\"button\">\n      </button>\n    </div>\n  </div>\n</div>\n\n<dp-month-calendar\n    (onLeftNav)=\"onMonthCalendarLeftClick($event)\"\n    (onLeftSecondaryNav)=\"onMonthCalendarSecondaryLeftClick($event)\"\n    (onNavHeaderBtnClick)=\"toggleCalendarMode(CalendarMode.Day)\"\n    (onRightNav)=\"onMonthCalendarRightClick($event)\"\n    (onRightSecondaryNav)=\"onMonthCalendarSecondaryRightClick($event)\"\n    (onSelect)=\"monthSelected($event)\"\n    *ngIf=\"currentCalendarMode ===  CalendarMode.Month\"\n    [config]=\"monthCalendarConfig\"\n    [displayDate]=\"_currentDateView\"\n    [ngModel]=\"_selected\"\n    [theme]=\"theme\">\n</dp-month-calendar>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [
                    DayCalendarService,
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => DayCalendarComponent),
                        multi: true
                    },
                    {
                        provide: NG_VALIDATORS,
                        useExisting: forwardRef(() => DayCalendarComponent),
                        multi: true
                    }
                ],
                styles: [""]
            },] }
];
DayCalendarComponent.ctorParameters = () => [
    { type: DayCalendarService },
    { type: UtilsService },
    { type: ChangeDetectorRef }
];
DayCalendarComponent.propDecorators = {
    config: [{ type: Input }],
    displayDate: [{ type: Input }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    theme: [{ type: HostBinding, args: ['class',] }, { type: Input }],
    onSelect: [{ type: Output }],
    onMonthSelect: [{ type: Output }],
    onNavHeaderBtnClick: [{ type: Output }],
    onGoToCurrent: [{ type: Output }],
    onLeftNav: [{ type: Output }],
    onRightNav: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5LWNhbGVuZGFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGF5LWNhbGVuZGFyL2RheS1jYWxlbmRhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQ2pFLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLFdBQVcsRUFDWCxLQUFLLEVBR0wsTUFBTSxFQUdOLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRCxPQUFPLEtBQUssUUFBUSxNQUFNLFFBQVEsQ0FBQztBQUluQyxPQUFPLEVBR0wsYUFBYSxFQUNiLGlCQUFpQixFQUdsQixNQUFNLGdCQUFnQixDQUFDO0FBRXhCLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQU1wRSxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUM7QUFzQnhCLE1BQU0sT0FBTyxvQkFBb0I7SUFpQy9CLFlBQTRCLGtCQUFzQyxFQUN0QyxZQUEwQixFQUMxQixFQUFxQjtRQUZyQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBNUJ2QyxhQUFRLEdBQXVCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDbEQsa0JBQWEsR0FBeUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN6RCx3QkFBbUIsR0FBZ0MsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN0RSxrQkFBYSxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3ZELGNBQVMsR0FBNEIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN4RCxlQUFVLEdBQTRC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LENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDakQ7Z0JBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2FBQzFEO1NBQ0Y7SUFDSCxDQUFDOzs7WUFsVEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLGtuRUFBMEM7Z0JBRTFDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsU0FBUyxFQUFFO29CQUNULGtCQUFrQjtvQkFDbEI7d0JBQ0UsT0FBTyxFQUFFLGlCQUFpQjt3QkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQzt3QkFDbkQsS0FBSyxFQUFFLElBQUk7cUJBQ1o7b0JBQ0Q7d0JBQ0UsT0FBTyxFQUFFLGFBQWE7d0JBQ3RCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUM7d0JBQ25ELEtBQUssRUFBRSxJQUFJO3FCQUNaO2lCQUNGOzthQUNGOzs7WUF6Q08sa0JBQWtCO1lBY2xCLFlBQVk7WUEzQmxCLGlCQUFpQjs7O3FCQXlEaEIsS0FBSzswQkFDTCxLQUFLO3NCQUNMLEtBQUs7c0JBQ0wsS0FBSztvQkFDTCxXQUFXLFNBQUMsT0FBTyxjQUFHLEtBQUs7dUJBQzNCLE1BQU07NEJBQ04sTUFBTTtrQ0FDTixNQUFNOzRCQUNOLE1BQU07d0JBQ04sTUFBTTt5QkFDTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtFQ2FsZW5kYXJWYWx1ZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL2NhbGVuZGFyLXZhbHVlLWVudW0nO1xuaW1wb3J0IHtTaW5nbGVDYWxlbmRhclZhbHVlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvc2luZ2xlLWNhbGVuZGFyLXZhbHVlJztcbmltcG9ydCB7RUNhbGVuZGFyTW9kZX0gZnJvbSAnLi4vY29tbW9uL3R5cGVzL2NhbGVuZGFyLW1vZGUtZW51bSc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0QmluZGluZyxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZSxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RheUNhbGVuZGFyU2VydmljZX0gZnJvbSAnLi9kYXktY2FsZW5kYXIuc2VydmljZSc7XG5pbXBvcnQgKiBhcyBtb21lbnROcyBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtNb21lbnQsIHVuaXRPZlRpbWV9IGZyb20gJ21vbWVudCc7XG5pbXBvcnQge0lEYXlDYWxlbmRhckNvbmZpZywgSURheUNhbGVuZGFyQ29uZmlnSW50ZXJuYWx9IGZyb20gJy4vZGF5LWNhbGVuZGFyLWNvbmZpZy5tb2RlbCc7XG5pbXBvcnQge0lEYXl9IGZyb20gJy4vZGF5Lm1vZGVsJztcbmltcG9ydCB7XG4gIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBGb3JtQ29udHJvbCxcbiAgTkdfVkFMSURBVE9SUyxcbiAgTkdfVkFMVUVfQUNDRVNTT1IsXG4gIFZhbGlkYXRpb25FcnJvcnMsXG4gIFZhbGlkYXRvclxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge0NhbGVuZGFyVmFsdWV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9jYWxlbmRhci12YWx1ZSc7XG5pbXBvcnQge1V0aWxzU2VydmljZX0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2VzL3V0aWxzL3V0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHtJTW9udGhDYWxlbmRhckNvbmZpZ30gZnJvbSAnLi4vbW9udGgtY2FsZW5kYXIvbW9udGgtY2FsZW5kYXItY29uZmlnJztcbmltcG9ydCB7SU1vbnRofSBmcm9tICcuLi9tb250aC1jYWxlbmRhci9tb250aC5tb2RlbCc7XG5pbXBvcnQge0RhdGVWYWxpZGF0b3J9IGZyb20gJy4uL2NvbW1vbi90eXBlcy92YWxpZGF0b3IudHlwZSc7XG5pbXBvcnQge0lOYXZFdmVudH0gZnJvbSAnLi4vY29tbW9uL21vZGVscy9uYXZpZ2F0aW9uLWV2ZW50Lm1vZGVsJztcblxuY29uc3QgbW9tZW50ID0gbW9tZW50TnM7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2RwLWRheS1jYWxlbmRhcicsXG4gIHRlbXBsYXRlVXJsOiAnZGF5LWNhbGVuZGFyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RheS1jYWxlbmRhci5jb21wb25lbnQubGVzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJvdmlkZXJzOiBbXG4gICAgRGF5Q2FsZW5kYXJTZXJ2aWNlLFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGF5Q2FsZW5kYXJDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBEYXlDYWxlbmRhckNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBEYXlDYWxlbmRhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgVmFsaWRhdG9yIHtcblxuICBASW5wdXQoKSBjb25maWc6IElEYXlDYWxlbmRhckNvbmZpZztcbiAgQElucHV0KCkgZGlzcGxheURhdGU6IFNpbmdsZUNhbGVuZGFyVmFsdWU7XG4gIEBJbnB1dCgpIG1pbkRhdGU6IE1vbWVudDtcbiAgQElucHV0KCkgbWF4RGF0ZTogTW9tZW50O1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzJykgQElucHV0KCkgdGhlbWU6IHN0cmluZztcbiAgQE91dHB1dCgpIG9uU2VsZWN0OiBFdmVudEVtaXR0ZXI8SURheT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbk1vbnRoU2VsZWN0OiBFdmVudEVtaXR0ZXI8SU1vbnRoPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uTmF2SGVhZGVyQnRuQ2xpY2s6IEV2ZW50RW1pdHRlcjxFQ2FsZW5kYXJNb2RlPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uR29Ub0N1cnJlbnQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uTGVmdE5hdjogRXZlbnRFbWl0dGVyPElOYXZFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvblJpZ2h0TmF2OiBFdmVudEVtaXR0ZXI8SU5hdkV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQ2FsZW5kYXJNb2RlID0gRUNhbGVuZGFyTW9kZTtcbiAgaXNJbml0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgY29tcG9uZW50Q29uZmlnOiBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbDtcbiAgd2Vla3M6IElEYXlbXVtdO1xuICB3ZWVrZGF5czogTW9tZW50W107XG4gIGlucHV0VmFsdWU6IENhbGVuZGFyVmFsdWU7XG4gIGlucHV0VmFsdWVUeXBlOiBFQ2FsZW5kYXJWYWx1ZTtcbiAgdmFsaWRhdGVGbjogRGF0ZVZhbGlkYXRvcjtcbiAgY3VycmVudENhbGVuZGFyTW9kZTogRUNhbGVuZGFyTW9kZSA9IEVDYWxlbmRhck1vZGUuRGF5O1xuICBtb250aENhbGVuZGFyQ29uZmlnOiBJTW9udGhDYWxlbmRhckNvbmZpZztcbiAgX3Nob3VsZFNob3dDdXJyZW50OiBib29sZWFuID0gdHJ1ZTtcbiAgbmF2TGFiZWw6IHN0cmluZztcbiAgc2hvd0xlZnROYXY6IGJvb2xlYW47XG4gIHNob3dSaWdodE5hdjogYm9vbGVhbjtcbiAgYXBpID0ge1xuICAgIG1vdmVDYWxlbmRhcnNCeTogdGhpcy5tb3ZlQ2FsZW5kYXJzQnkuYmluZCh0aGlzKSxcbiAgICBtb3ZlQ2FsZW5kYXJUbzogdGhpcy5tb3ZlQ2FsZW5kYXJUby5iaW5kKHRoaXMpLFxuICAgIHRvZ2dsZUNhbGVuZGFyTW9kZTogdGhpcy50b2dnbGVDYWxlbmRhck1vZGUuYmluZCh0aGlzKVxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBkYXlDYWxlbmRhclNlcnZpY2U6IERheUNhbGVuZGFyU2VydmljZSxcbiAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHV0aWxzU2VydmljZTogVXRpbHNTZXJ2aWNlLFxuICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gIH1cblxuICBfc2VsZWN0ZWQ6IE1vbWVudFtdO1xuXG4gIGdldCBzZWxlY3RlZCgpOiBNb21lbnRbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xuICB9XG5cbiAgc2V0IHNlbGVjdGVkKHNlbGVjdGVkOiBNb21lbnRbXSkge1xuICAgIHRoaXMuX3NlbGVjdGVkID0gc2VsZWN0ZWQ7XG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMucHJvY2Vzc09uQ2hhbmdlQ2FsbGJhY2soc2VsZWN0ZWQpKTtcbiAgfVxuXG4gIF9jdXJyZW50RGF0ZVZpZXc6IE1vbWVudDtcblxuICBnZXQgY3VycmVudERhdGVWaWV3KCk6IE1vbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnREYXRlVmlldztcbiAgfVxuXG4gIHNldCBjdXJyZW50RGF0ZVZpZXcoY3VycmVudDogTW9tZW50KSB7XG4gICAgdGhpcy5fY3VycmVudERhdGVWaWV3ID0gY3VycmVudC5jbG9uZSgpO1xuICAgIHRoaXMud2Vla3MgPSB0aGlzLmRheUNhbGVuZGFyU2VydmljZVxuICAgICAgLmdlbmVyYXRlTW9udGhBcnJheSh0aGlzLmNvbXBvbmVudENvbmZpZywgdGhpcy5fY3VycmVudERhdGVWaWV3LCB0aGlzLnNlbGVjdGVkKTtcbiAgICB0aGlzLm5hdkxhYmVsID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2UuZ2V0SGVhZGVyTGFiZWwodGhpcy5jb21wb25lbnRDb25maWcsIHRoaXMuX2N1cnJlbnREYXRlVmlldyk7XG4gICAgdGhpcy5zaG93TGVmdE5hdiA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLnNob3VsZFNob3dMZWZ0KHRoaXMuY29tcG9uZW50Q29uZmlnLm1pbiwgdGhpcy5jdXJyZW50RGF0ZVZpZXcpO1xuICAgIHRoaXMuc2hvd1JpZ2h0TmF2ID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2Uuc2hvdWxkU2hvd1JpZ2h0KHRoaXMuY29tcG9uZW50Q29uZmlnLm1heCwgdGhpcy5jdXJyZW50RGF0ZVZpZXcpO1xuICB9XG4gIDtcblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmlzSW5pdGVkID0gdHJ1ZTtcbiAgICB0aGlzLmluaXQoKTtcbiAgICB0aGlzLmluaXRWYWxpZGF0b3JzKCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuY29tcG9uZW50Q29uZmlnID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2UuZ2V0Q29uZmlnKHRoaXMuY29uZmlnKTtcbiAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZCB8fCBbXTtcbiAgICB0aGlzLmN1cnJlbnREYXRlVmlldyA9IHRoaXMuZGlzcGxheURhdGVcbiAgICAgID8gdGhpcy51dGlsc1NlcnZpY2UuY29udmVydFRvTW9tZW50KHRoaXMuZGlzcGxheURhdGUsIHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCkuY2xvbmUoKVxuICAgICAgOiB0aGlzLnV0aWxzU2VydmljZVxuICAgICAgICAuZ2V0RGVmYXVsdERpc3BsYXlEYXRlKFxuICAgICAgICAgIHRoaXMuY3VycmVudERhdGVWaWV3LFxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWQsXG4gICAgICAgICAgdGhpcy5jb21wb25lbnRDb25maWcuYWxsb3dNdWx0aVNlbGVjdCxcbiAgICAgICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5taW5cbiAgICAgICAgKTtcbiAgICB0aGlzLndlZWtkYXlzID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2VcbiAgICAgIC5nZW5lcmF0ZVdlZWtkYXlzKHRoaXMuY29tcG9uZW50Q29uZmlnLmZpcnN0RGF5T2ZXZWVrKTtcbiAgICB0aGlzLmlucHV0VmFsdWVUeXBlID0gdGhpcy51dGlsc1NlcnZpY2UuZ2V0SW5wdXRUeXBlKHRoaXMuaW5wdXRWYWx1ZSwgdGhpcy5jb21wb25lbnRDb25maWcuYWxsb3dNdWx0aVNlbGVjdCk7XG4gICAgdGhpcy5tb250aENhbGVuZGFyQ29uZmlnID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2UuZ2V0TW9udGhDYWxlbmRhckNvbmZpZyh0aGlzLmNvbXBvbmVudENvbmZpZyk7XG4gICAgdGhpcy5fc2hvdWxkU2hvd0N1cnJlbnQgPSB0aGlzLnNob3VsZFNob3dDdXJyZW50KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKHRoaXMuaXNJbml0ZWQpIHtcbiAgICAgIGNvbnN0IHttaW5EYXRlLCBtYXhEYXRlLCBjb25maWd9ID0gY2hhbmdlcztcblxuICAgICAgdGhpcy5oYW5kbGVDb25maWdDaGFuZ2UoY29uZmlnKTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgICBpZiAobWluRGF0ZSB8fCBtYXhEYXRlKSB7XG4gICAgICAgIHRoaXMuaW5pdFZhbGlkYXRvcnMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBDYWxlbmRhclZhbHVlKTogdm9pZCB7XG4gICAgdGhpcy5pbnB1dFZhbHVlID0gdmFsdWU7XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnV0aWxzU2VydmljZVxuICAgICAgICAuY29udmVydFRvTW9tZW50QXJyYXkodmFsdWUsIHRoaXMuY29tcG9uZW50Q29uZmlnKTtcbiAgICAgIHRoaXMuaW5wdXRWYWx1ZVR5cGUgPSB0aGlzLnV0aWxzU2VydmljZVxuICAgICAgICAuZ2V0SW5wdXRUeXBlKHRoaXMuaW5wdXRWYWx1ZSwgdGhpcy5jb21wb25lbnRDb25maWcuYWxsb3dNdWx0aVNlbGVjdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLndlZWtzID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2VcbiAgICAgIC5nZW5lcmF0ZU1vbnRoQXJyYXkodGhpcy5jb21wb25lbnRDb25maWcsIHRoaXMuY3VycmVudERhdGVWaWV3LCB0aGlzLnNlbGVjdGVkKTtcblxuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sgPSBmbjtcbiAgfVxuXG4gIG9uQ2hhbmdlQ2FsbGJhY2soXzogYW55KSB7XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gIH1cblxuICB2YWxpZGF0ZShmb3JtQ29udHJvbDogRm9ybUNvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgYW55IHtcbiAgICBpZiAodGhpcy5taW5EYXRlIHx8IHRoaXMubWF4RGF0ZSkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGVGbihmb3JtQ29udHJvbC52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoKSA9PiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3NPbkNoYW5nZUNhbGxiYWNrKHZhbHVlOiBNb21lbnRbXSk6IENhbGVuZGFyVmFsdWUge1xuICAgIHJldHVybiB0aGlzLnV0aWxzU2VydmljZS5jb252ZXJ0RnJvbU1vbWVudEFycmF5KFxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcuZm9ybWF0LFxuICAgICAgdmFsdWUsXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5yZXR1cm5lZFZhbHVlVHlwZSB8fCB0aGlzLmlucHV0VmFsdWVUeXBlXG4gICAgKTtcbiAgfVxuXG4gIGluaXRWYWxpZGF0b3JzKCkge1xuICAgIHRoaXMudmFsaWRhdGVGbiA9IHRoaXMudXRpbHNTZXJ2aWNlLmNyZWF0ZVZhbGlkYXRvcihcbiAgICAgIHttaW5EYXRlOiB0aGlzLm1pbkRhdGUsIG1heERhdGU6IHRoaXMubWF4RGF0ZX0sXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQsXG4gICAgICAnZGF5J1xuICAgICk7XG5cbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodGhpcy5wcm9jZXNzT25DaGFuZ2VDYWxsYmFjayh0aGlzLnNlbGVjdGVkKSk7XG4gIH1cblxuICBkYXlDbGlja2VkKGRheTogSURheSkge1xuICAgIGlmIChkYXkuc2VsZWN0ZWQgJiYgIXRoaXMuY29tcG9uZW50Q29uZmlnLnVuU2VsZWN0T25DbGljaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnV0aWxzU2VydmljZVxuICAgICAgLnVwZGF0ZVNlbGVjdGVkKHRoaXMuY29tcG9uZW50Q29uZmlnLmFsbG93TXVsdGlTZWxlY3QsIHRoaXMuc2VsZWN0ZWQsIGRheSk7XG4gICAgdGhpcy53ZWVrcyA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlXG4gICAgICAuZ2VuZXJhdGVNb250aEFycmF5KHRoaXMuY29tcG9uZW50Q29uZmlnLCB0aGlzLmN1cnJlbnREYXRlVmlldywgdGhpcy5zZWxlY3RlZCk7XG4gICAgdGhpcy5vblNlbGVjdC5lbWl0KGRheSk7XG4gIH1cblxuICBnZXREYXlCdG5UZXh0KGRheTogSURheSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLmdldERheUJ0blRleHQodGhpcy5jb21wb25lbnRDb25maWcsIGRheS5kYXRlKTtcbiAgfVxuXG4gIGdldERheUJ0bkNzc0NsYXNzKGRheTogSURheSk6IHtba2xhc3M6IHN0cmluZ106IGJvb2xlYW59IHtcbiAgICBjb25zdCBjc3NDbGFzc2VzOiB7W2tsYXNzOiBzdHJpbmddOiBib29sZWFufSA9IHtcbiAgICAgICdkcC1zZWxlY3RlZCc6IGRheS5zZWxlY3RlZCxcbiAgICAgICdkcC1jdXJyZW50LW1vbnRoJzogZGF5LmN1cnJlbnRNb250aCxcbiAgICAgICdkcC1wcmV2LW1vbnRoJzogZGF5LnByZXZNb250aCxcbiAgICAgICdkcC1uZXh0LW1vbnRoJzogZGF5Lm5leHRNb250aCxcbiAgICAgICdkcC1jdXJyZW50LWRheSc6IGRheS5jdXJyZW50RGF5XG4gICAgfTtcbiAgICBjb25zdCBjdXN0b21Dc3NDbGFzczogc3RyaW5nID0gdGhpcy5kYXlDYWxlbmRhclNlcnZpY2UuZ2V0RGF5QnRuQ3NzQ2xhc3ModGhpcy5jb21wb25lbnRDb25maWcsIGRheS5kYXRlKTtcbiAgICBpZiAoY3VzdG9tQ3NzQ2xhc3MpIHtcbiAgICAgIGNzc0NsYXNzZXNbY3VzdG9tQ3NzQ2xhc3NdID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3NzQ2xhc3NlcztcbiAgfVxuXG4gIG9uTGVmdE5hdkNsaWNrKCkge1xuICAgIGNvbnN0IGZyb20gPSB0aGlzLmN1cnJlbnREYXRlVmlldy5jbG9uZSgpO1xuICAgIHRoaXMubW92ZUNhbGVuZGFyc0J5KHRoaXMuY3VycmVudERhdGVWaWV3LCAtMSwgJ21vbnRoJyk7XG4gICAgY29uc3QgdG8gPSB0aGlzLmN1cnJlbnREYXRlVmlldy5jbG9uZSgpO1xuICAgIHRoaXMub25MZWZ0TmF2LmVtaXQoe2Zyb20sIHRvfSk7XG4gIH1cblxuICBvblJpZ2h0TmF2Q2xpY2soKSB7XG4gICAgY29uc3QgZnJvbSA9IHRoaXMuY3VycmVudERhdGVWaWV3LmNsb25lKCk7XG4gICAgdGhpcy5tb3ZlQ2FsZW5kYXJzQnkodGhpcy5jdXJyZW50RGF0ZVZpZXcsIDEsICdtb250aCcpO1xuICAgIGNvbnN0IHRvID0gdGhpcy5jdXJyZW50RGF0ZVZpZXcuY2xvbmUoKTtcbiAgICB0aGlzLm9uUmlnaHROYXYuZW1pdCh7ZnJvbSwgdG99KTtcbiAgfVxuXG4gIG9uTW9udGhDYWxlbmRhckxlZnRDbGljayhjaGFuZ2U6IElOYXZFdmVudCkge1xuICAgIHRoaXMub25MZWZ0TmF2LmVtaXQoY2hhbmdlKTtcbiAgfVxuXG4gIG9uTW9udGhDYWxlbmRhclJpZ2h0Q2xpY2soY2hhbmdlOiBJTmF2RXZlbnQpIHtcbiAgICB0aGlzLm9uUmlnaHROYXYuZW1pdChjaGFuZ2UpO1xuICB9XG5cbiAgb25Nb250aENhbGVuZGFyU2Vjb25kYXJ5TGVmdENsaWNrKGNoYW5nZTogSU5hdkV2ZW50KSB7XG4gICAgdGhpcy5vblJpZ2h0TmF2LmVtaXQoY2hhbmdlKTtcbiAgfVxuXG4gIG9uTW9udGhDYWxlbmRhclNlY29uZGFyeVJpZ2h0Q2xpY2soY2hhbmdlOiBJTmF2RXZlbnQpIHtcbiAgICB0aGlzLm9uTGVmdE5hdi5lbWl0KGNoYW5nZSk7XG4gIH1cblxuICBnZXRXZWVrZGF5TmFtZSh3ZWVrZGF5OiBNb21lbnQpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmNvbXBvbmVudENvbmZpZy53ZWVrRGF5Rm9ybWF0dGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRDb25maWcud2Vla0RheUZvcm1hdHRlcih3ZWVrZGF5LmRheSgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gd2Vla2RheS5mb3JtYXQodGhpcy5jb21wb25lbnRDb25maWcud2Vla0RheUZvcm1hdCk7XG4gIH1cblxuICB0b2dnbGVDYWxlbmRhck1vZGUobW9kZTogRUNhbGVuZGFyTW9kZSkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRDYWxlbmRhck1vZGUgIT09IG1vZGUpIHtcbiAgICAgIHRoaXMuY3VycmVudENhbGVuZGFyTW9kZSA9IG1vZGU7XG4gICAgICB0aGlzLm9uTmF2SGVhZGVyQnRuQ2xpY2suZW1pdChtb2RlKTtcbiAgICB9XG5cbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgbW9udGhTZWxlY3RlZChtb250aDogSU1vbnRoKSB7XG4gICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcgPSBtb250aC5kYXRlLmNsb25lKCk7XG4gICAgdGhpcy5jdXJyZW50Q2FsZW5kYXJNb2RlID0gRUNhbGVuZGFyTW9kZS5EYXk7XG4gICAgdGhpcy5vbk1vbnRoU2VsZWN0LmVtaXQobW9udGgpO1xuICB9XG5cbiAgbW92ZUNhbGVuZGFyc0J5KGN1cnJlbnQ6IE1vbWVudCwgYW1vdW50OiBudW1iZXIsIGdyYW51bGFyaXR5OiB1bml0T2ZUaW1lLkJhc2UgPSAnbW9udGgnKSB7XG4gICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcgPSBjdXJyZW50LmNsb25lKCkuYWRkKGFtb3VudCwgZ3JhbnVsYXJpdHkpO1xuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBtb3ZlQ2FsZW5kYXJUbyh0bzogU2luZ2xlQ2FsZW5kYXJWYWx1ZSkge1xuICAgIGlmICh0bykge1xuICAgICAgdGhpcy5jdXJyZW50RGF0ZVZpZXcgPSB0aGlzLnV0aWxzU2VydmljZS5jb252ZXJ0VG9Nb21lbnQodG8sIHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCk7XG4gICAgfVxuXG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIHNob3VsZFNob3dDdXJyZW50KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnV0aWxzU2VydmljZS5zaG91bGRTaG93Q3VycmVudChcbiAgICAgIHRoaXMuY29tcG9uZW50Q29uZmlnLnNob3dHb1RvQ3VycmVudCxcbiAgICAgICdkYXknLFxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcubWluLFxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcubWF4XG4gICAgKTtcbiAgfVxuXG4gIGdvVG9DdXJyZW50KCkge1xuICAgIHRoaXMuY3VycmVudERhdGVWaWV3ID0gbW9tZW50KCk7XG4gICAgdGhpcy5vbkdvVG9DdXJyZW50LmVtaXQoKTtcbiAgfVxuXG4gIGhhbmRsZUNvbmZpZ0NoYW5nZShjb25maWc6IFNpbXBsZUNoYW5nZSkge1xuICAgIGlmIChjb25maWcpIHtcbiAgICAgIGNvbnN0IHByZXZDb25mOiBJRGF5Q2FsZW5kYXJDb25maWdJbnRlcm5hbCA9IHRoaXMuZGF5Q2FsZW5kYXJTZXJ2aWNlLmdldENvbmZpZyhjb25maWcucHJldmlvdXNWYWx1ZSk7XG4gICAgICBjb25zdCBjdXJyZW50Q29uZjogSURheUNhbGVuZGFyQ29uZmlnSW50ZXJuYWwgPSB0aGlzLmRheUNhbGVuZGFyU2VydmljZS5nZXRDb25maWcoY29uZmlnLmN1cnJlbnRWYWx1ZSk7XG5cbiAgICAgIGlmICh0aGlzLnV0aWxzU2VydmljZS5zaG91bGRSZXNldEN1cnJlbnRWaWV3KHByZXZDb25mLCBjdXJyZW50Q29uZikpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudERhdGVWaWV3ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXZDb25mLmxvY2FsZSAhPT0gY3VycmVudENvbmYubG9jYWxlKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnREYXRlVmlldykge1xuICAgICAgICAgIHRoaXMuY3VycmVudERhdGVWaWV3LmxvY2FsZShjdXJyZW50Q29uZi5sb2NhbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZC5mb3JFYWNoKG0gPT4gbS5sb2NhbGUoY3VycmVudENvbmYubG9jYWxlKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=