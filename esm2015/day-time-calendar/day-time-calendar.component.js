import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UtilsService } from '../common/services/utils/utils.service';
import { DayCalendarService } from '../day-calendar/day-calendar.service';
import { TimeSelectService } from '../time-select/time-select.service';
import { DayTimeCalendarService } from './day-time-calendar.service';
export class DayTimeCalendarComponent {
    constructor(dayTimeCalendarService, utilsService, cd) {
        this.dayTimeCalendarService = dayTimeCalendarService;
        this.utilsService = utilsService;
        this.cd = cd;
        this.onChange = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.isInited = false;
        this.api = {
            moveCalendarTo: this.moveCalendarTo.bind(this)
        };
    }
    get selected() {
        return this._selected;
    }
    set selected(selected) {
        this._selected = selected;
        this.onChangeCallback(this.processOnChangeCallback(selected));
    }
    ;
    ngOnInit() {
        this.isInited = true;
        this.init();
        this.initValidators();
    }
    init() {
        this.componentConfig = this.dayTimeCalendarService.getConfig(this.config);
        this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
    }
    ngOnChanges(changes) {
        if (this.isInited) {
            const { minDate, maxDate } = changes;
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
        return this.utilsService.convertFromMomentArray(this.componentConfig.format, [value], this.componentConfig.returnedValueType || this.inputValueType);
    }
    initValidators() {
        this.validateFn = this.utilsService.createValidator({
            minDate: this.minDate,
            maxDate: this.maxDate
        }, undefined, 'daytime');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    }
    dateSelected(day) {
        this.selected = this.dayTimeCalendarService.updateDay(this.selected, day.date, this.config);
        this.emitChange();
    }
    timeChange(time) {
        this.selected = this.dayTimeCalendarService.updateTime(this.selected, time.date);
        this.emitChange();
    }
    emitChange() {
        this.onChange.emit({ date: this.selected, selected: false });
    }
    moveCalendarTo(to) {
        if (to) {
            this.dayCalendarRef.moveCalendarTo(to);
        }
    }
    onLeftNavClick(change) {
        this.onLeftNav.emit(change);
    }
    onRightNavClick(change) {
        this.onRightNav.emit(change);
    }
}
DayTimeCalendarComponent.decorators = [
    { type: Component, args: [{
                selector: 'dp-day-time-calendar',
                template: "<dp-day-calendar #dayCalendar\n                 (onGoToCurrent)=\"onGoToCurrent.emit()\"\n                 (onLeftNav)=\"onLeftNavClick($event)\"\n                 (onRightNav)=\"onRightNavClick($event)\"\n                 (onSelect)=\"dateSelected($event)\"\n                 [config]=\"componentConfig\"\n                 [displayDate]=\"displayDate\"\n                 [ngModel]=\"_selected\"\n                 [theme]=\"theme\">\n</dp-day-calendar>\n<dp-time-select #timeSelect\n                (onChange)=\"timeChange($event)\"\n                [config]=\"componentConfig\"\n                [ngModel]=\"_selected\"\n                [theme]=\"theme\">\n</dp-time-select>\n",
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                providers: [
                    DayTimeCalendarService,
                    DayCalendarService,
                    TimeSelectService,
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => DayTimeCalendarComponent),
                        multi: true
                    },
                    {
                        provide: NG_VALIDATORS,
                        useExisting: forwardRef(() => DayTimeCalendarComponent),
                        multi: true
                    }
                ],
                styles: [""]
            },] }
];
DayTimeCalendarComponent.ctorParameters = () => [
    { type: DayTimeCalendarService },
    { type: UtilsService },
    { type: ChangeDetectorRef }
];
DayTimeCalendarComponent.propDecorators = {
    config: [{ type: Input }],
    displayDate: [{ type: Input }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    theme: [{ type: HostBinding, args: ['class',] }, { type: Input }],
    onChange: [{ type: Output }],
    onGoToCurrent: [{ type: Output }],
    onLeftNav: [{ type: Output }],
    onRightNav: [{ type: Output }],
    dayCalendarRef: [{ type: ViewChild, args: ['dayCalendar',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5LXRpbWUtY2FsZW5kYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3NyYy9saWIvIiwic291cmNlcyI6WyJkYXktdGltZS1jYWxlbmRhci9kYXktdGltZS1jYWxlbmRhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsV0FBVyxFQUNYLEtBQUssRUFHTCxNQUFNLEVBRU4sU0FBUyxFQUNULGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBR0wsYUFBYSxFQUNiLGlCQUFpQixFQUdsQixNQUFNLGdCQUFnQixDQUFDO0FBR3hCLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUVwRSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUN4RSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUVyRSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQTJCbkUsTUFBTSxPQUFPLHdCQUF3QjtJQXFCbkMsWUFBbUIsc0JBQThDLEVBQzlDLFlBQTBCLEVBQzFCLEVBQXFCO1FBRnJCLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUFDOUMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFoQjlCLGFBQVEsR0FBd0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNuRCxrQkFBYSxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3ZELGNBQVMsR0FBNEIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN4RCxlQUFVLEdBQTRCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFbkUsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUsxQixRQUFHLEdBQUc7WUFDSixjQUFj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QUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUM7OztZQWxLRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtnQkFDaEMsZ3JCQUErQztnQkFFL0MsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxTQUFTLEVBQUU7b0JBQ1Qsc0JBQXNCO29CQUN0QixrQkFBa0I7b0JBQ2xCLGlCQUFpQjtvQkFDakI7d0JBQ0UsT0FBTyxFQUFFLGlCQUFpQjt3QkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQzt3QkFDdkQsS0FBSyxFQUFFLElBQUk7cUJBQ1o7b0JBQ0Q7d0JBQ0UsT0FBTyxFQUFFLGFBQWE7d0JBQ3RCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsd0JBQXdCLENBQUM7d0JBQ3ZELEtBQUssRUFBRSxJQUFJO3FCQUNaO2lCQUNGOzthQUNGOzs7WUExQk8sc0JBQXNCO1lBTHRCLFlBQVk7WUF2QmxCLGlCQUFpQjs7O3FCQXlEaEIsS0FBSzswQkFDTCxLQUFLO3NCQUNMLEtBQUs7c0JBQ0wsS0FBSztvQkFDTCxXQUFXLFNBQUMsT0FBTyxjQUFHLEtBQUs7dUJBQzNCLE1BQU07NEJBQ04sTUFBTTt3QkFDTixNQUFNO3lCQUNOLE1BQU07NkJBQ04sU0FBUyxTQUFDLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0VDYWxlbmRhclZhbHVlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItdmFsdWUtZW51bSc7XG5pbXBvcnQge1NpbmdsZUNhbGVuZGFyVmFsdWV9IGZyb20gJy4uL2NvbW1vbi90eXBlcy9zaW5nbGUtY2FsZW5kYXItdmFsdWUnO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIEZvcm1Db250cm9sLFxuICBOR19WQUxJREFUT1JTLFxuICBOR19WQUxVRV9BQ0NFU1NPUixcbiAgVmFsaWRhdGlvbkVycm9ycyxcbiAgVmFsaWRhdG9yXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7TW9tZW50fSBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtDYWxlbmRhclZhbHVlfSBmcm9tICcuLi9jb21tb24vdHlwZXMvY2FsZW5kYXItdmFsdWUnO1xuaW1wb3J0IHtVdGlsc1NlcnZpY2V9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy91dGlscy91dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7SURhdGV9IGZyb20gJy4uL2NvbW1vbi9tb2RlbHMvZGF0ZS5tb2RlbCc7XG5pbXBvcnQge0RheUNhbGVuZGFyU2VydmljZX0gZnJvbSAnLi4vZGF5LWNhbGVuZGFyL2RheS1jYWxlbmRhci5zZXJ2aWNlJztcbmltcG9ydCB7VGltZVNlbGVjdFNlcnZpY2V9IGZyb20gJy4uL3RpbWUtc2VsZWN0L3RpbWUtc2VsZWN0LnNlcnZpY2UnO1xuaW1wb3J0IHtJRGF5VGltZUNhbGVuZGFyQ29uZmlnfSBmcm9tICcuL2RheS10aW1lLWNhbGVuZGFyLWNvbmZpZy5tb2RlbCc7XG5pbXBvcnQge0RheVRpbWVDYWxlbmRhclNlcnZpY2V9IGZyb20gJy4vZGF5LXRpbWUtY2FsZW5kYXIuc2VydmljZSc7XG5pbXBvcnQge0RhdGVWYWxpZGF0b3J9IGZyb20gJy4uL2NvbW1vbi90eXBlcy92YWxpZGF0b3IudHlwZSc7XG5pbXBvcnQge0RheUNhbGVuZGFyQ29tcG9uZW50fSBmcm9tICcuLi9kYXktY2FsZW5kYXIvZGF5LWNhbGVuZGFyLmNvbXBvbmVudCc7XG5pbXBvcnQge0lOYXZFdmVudH0gZnJvbSAnLi4vY29tbW9uL21vZGVscy9uYXZpZ2F0aW9uLWV2ZW50Lm1vZGVsJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZHAtZGF5LXRpbWUtY2FsZW5kYXInLFxuICB0ZW1wbGF0ZVVybDogJ2RheS10aW1lLWNhbGVuZGFyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RheS10aW1lLWNhbGVuZGFyLmNvbXBvbmVudC5sZXNzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcm92aWRlcnM6IFtcbiAgICBEYXlUaW1lQ2FsZW5kYXJTZXJ2aWNlLFxuICAgIERheUNhbGVuZGFyU2VydmljZSxcbiAgICBUaW1lU2VsZWN0U2VydmljZSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERheVRpbWVDYWxlbmRhckNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERheVRpbWVDYWxlbmRhckNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBEYXlUaW1lQ2FsZW5kYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQ29udHJvbFZhbHVlQWNjZXNzb3IsIFZhbGlkYXRvciB7XG5cbiAgQElucHV0KCkgY29uZmlnOiBJRGF5VGltZUNhbGVuZGFyQ29uZmlnO1xuICBASW5wdXQoKSBkaXNwbGF5RGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcbiAgQElucHV0KCkgbWluRGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcbiAgQElucHV0KCkgbWF4RGF0ZTogU2luZ2xlQ2FsZW5kYXJWYWx1ZTtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpIEBJbnB1dCgpIHRoZW1lOiBzdHJpbmc7XG4gIEBPdXRwdXQoKSBvbkNoYW5nZTogRXZlbnRFbWl0dGVyPElEYXRlPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uR29Ub0N1cnJlbnQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uTGVmdE5hdjogRXZlbnRFbWl0dGVyPElOYXZFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvblJpZ2h0TmF2OiBFdmVudEVtaXR0ZXI8SU5hdkV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQFZpZXdDaGlsZCgnZGF5Q2FsZW5kYXInKSBkYXlDYWxlbmRhclJlZjogRGF5Q2FsZW5kYXJDb21wb25lbnQ7XG4gIGlzSW5pdGVkOiBib29sZWFuID0gZmFsc2U7XG4gIGNvbXBvbmVudENvbmZpZzogSURheVRpbWVDYWxlbmRhckNvbmZpZztcbiAgaW5wdXRWYWx1ZTogQ2FsZW5kYXJWYWx1ZTtcbiAgaW5wdXRWYWx1ZVR5cGU6IEVDYWxlbmRhclZhbHVlO1xuICB2YWxpZGF0ZUZuOiBEYXRlVmFsaWRhdG9yO1xuICBhcGkgPSB7XG4gICAgbW92ZUNhbGVuZGFyVG86IHRoaXMubW92ZUNhbGVuZGFyVG8uYmluZCh0aGlzKVxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkYXlUaW1lQ2FsZW5kYXJTZXJ2aWNlOiBEYXlUaW1lQ2FsZW5kYXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwdWJsaWMgdXRpbHNTZXJ2aWNlOiBVdGlsc1NlcnZpY2UsXG4gICAgICAgICAgICAgIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgfVxuXG4gIF9zZWxlY3RlZDogTW9tZW50O1xuXG4gIGdldCBzZWxlY3RlZCgpOiBNb21lbnQge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgfVxuXG4gIHNldCBzZWxlY3RlZChzZWxlY3RlZDogTW9tZW50KSB7XG4gICAgdGhpcy5fc2VsZWN0ZWQgPSBzZWxlY3RlZDtcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodGhpcy5wcm9jZXNzT25DaGFuZ2VDYWxsYmFjayhzZWxlY3RlZCkpO1xuICB9XG4gIDtcblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmlzSW5pdGVkID0gdHJ1ZTtcbiAgICB0aGlzLmluaXQoKTtcbiAgICB0aGlzLmluaXRWYWxpZGF0b3JzKCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuY29tcG9uZW50Q29uZmlnID0gdGhpcy5kYXlUaW1lQ2FsZW5kYXJTZXJ2aWNlLmdldENvbmZpZyh0aGlzLmNvbmZpZyk7XG4gICAgdGhpcy5pbnB1dFZhbHVlVHlwZSA9IHRoaXMudXRpbHNTZXJ2aWNlLmdldElucHV0VHlwZSh0aGlzLmlucHV0VmFsdWUsIGZhbHNlKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAodGhpcy5pc0luaXRlZCkge1xuICAgICAgY29uc3Qge21pbkRhdGUsIG1heERhdGV9ID0gY2hhbmdlcztcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgICBpZiAobWluRGF0ZSB8fCBtYXhEYXRlKSB7XG4gICAgICAgIHRoaXMuaW5pdFZhbGlkYXRvcnMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBDYWxlbmRhclZhbHVlKTogdm9pZCB7XG4gICAgdGhpcy5pbnB1dFZhbHVlID0gdmFsdWU7XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLnV0aWxzU2VydmljZVxuICAgICAgICAuY29udmVydFRvTW9tZW50QXJyYXkodmFsdWUsIHtcbiAgICAgICAgICBmb3JtYXQ6IHRoaXMuY29tcG9uZW50Q29uZmlnLmZvcm1hdCxcbiAgICAgICAgICBhbGxvd011bHRpU2VsZWN0OiBmYWxzZVxuICAgICAgICB9KVswXTtcbiAgICAgIHRoaXMuaW5wdXRWYWx1ZVR5cGUgPSB0aGlzLnV0aWxzU2VydmljZVxuICAgICAgICAuZ2V0SW5wdXRUeXBlKHRoaXMuaW5wdXRWYWx1ZSwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrID0gZm47XG4gIH1cblxuICBvbkNoYW5nZUNhbGxiYWNrKF86IGFueSkge1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICB9XG5cbiAgdmFsaWRhdGUoZm9ybUNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IGFueSB7XG4gICAgaWYgKHRoaXMubWluRGF0ZSB8fCB0aGlzLm1heERhdGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlRm4oZm9ybUNvbnRyb2wudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKCkgPT4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcm9jZXNzT25DaGFuZ2VDYWxsYmFjayh2YWx1ZTogTW9tZW50KTogQ2FsZW5kYXJWYWx1ZSB7XG4gICAgcmV0dXJuIHRoaXMudXRpbHNTZXJ2aWNlLmNvbnZlcnRGcm9tTW9tZW50QXJyYXkoXG4gICAgICB0aGlzLmNvbXBvbmVudENvbmZpZy5mb3JtYXQsXG4gICAgICBbdmFsdWVdLFxuICAgICAgdGhpcy5jb21wb25lbnRDb25maWcucmV0dXJuZWRWYWx1ZVR5cGUgfHwgdGhpcy5pbnB1dFZhbHVlVHlwZVxuICAgICk7XG4gIH1cblxuICBpbml0VmFsaWRhdG9ycygpIHtcbiAgICB0aGlzLnZhbGlkYXRlRm4gPSB0aGlzLnV0aWxzU2VydmljZS5jcmVhdGVWYWxpZGF0b3IoXG4gICAgICB7XG4gICAgICAgIG1pbkRhdGU6IHRoaXMubWluRGF0ZSxcbiAgICAgICAgbWF4RGF0ZTogdGhpcy5tYXhEYXRlXG4gICAgICB9LCB1bmRlZmluZWQsICdkYXl0aW1lJyk7XG5cbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodGhpcy5wcm9jZXNzT25DaGFuZ2VDYWxsYmFjayh0aGlzLnNlbGVjdGVkKSk7XG4gIH1cblxuICBkYXRlU2VsZWN0ZWQoZGF5OiBJRGF0ZSkge1xuICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLmRheVRpbWVDYWxlbmRhclNlcnZpY2UudXBkYXRlRGF5KHRoaXMuc2VsZWN0ZWQsIGRheS5kYXRlLCB0aGlzLmNvbmZpZyk7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICB0aW1lQ2hhbmdlKHRpbWU6IElEYXRlKSB7XG4gICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMuZGF5VGltZUNhbGVuZGFyU2VydmljZS51cGRhdGVUaW1lKHRoaXMuc2VsZWN0ZWQsIHRpbWUuZGF0ZSk7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBlbWl0Q2hhbmdlKCkge1xuICAgIHRoaXMub25DaGFuZ2UuZW1pdCh7ZGF0ZTogdGhpcy5zZWxlY3RlZCwgc2VsZWN0ZWQ6IGZhbHNlfSk7XG4gIH1cblxuICBtb3ZlQ2FsZW5kYXJUbyh0bzogU2luZ2xlQ2FsZW5kYXJWYWx1ZSkge1xuICAgIGlmICh0bykge1xuICAgICAgdGhpcy5kYXlDYWxlbmRhclJlZi5tb3ZlQ2FsZW5kYXJUbyh0byk7XG4gICAgfVxuICB9XG5cbiAgb25MZWZ0TmF2Q2xpY2soY2hhbmdlOiBJTmF2RXZlbnQpIHtcbiAgICB0aGlzLm9uTGVmdE5hdi5lbWl0KGNoYW5nZSk7XG4gIH1cblxuICBvblJpZ2h0TmF2Q2xpY2soY2hhbmdlOiBJTmF2RXZlbnQpIHtcbiAgICB0aGlzLm9uUmlnaHROYXYuZW1pdChjaGFuZ2UpO1xuICB9XG59XG4iXX0=