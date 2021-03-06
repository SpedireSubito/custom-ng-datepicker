import { ECalendarValue } from '../common/types/calendar-value-enum';
import { ChangeDetectorRef, EventEmitter, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { IMonth } from './month.model';
import { MonthCalendarService } from './month-calendar.service';
import { Moment } from 'moment';
import { IMonthCalendarConfig, IMonthCalendarConfigInternal } from './month-calendar-config';
import { ControlValueAccessor, FormControl, ValidationErrors, Validator } from '@angular/forms';
import { CalendarValue } from '../common/types/calendar-value';
import { UtilsService } from '../common/services/utils/utils.service';
import { DateValidator } from '../common/types/validator.type';
import { SingleCalendarValue } from '../common/types/single-calendar-value';
import { INavEvent } from '../common/models/navigation-event.model';
export declare class MonthCalendarComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {
    readonly monthCalendarService: MonthCalendarService;
    readonly utilsService: UtilsService;
    readonly cd: ChangeDetectorRef;
    config: IMonthCalendarConfig;
    displayDate: Moment;
    minDate: Moment;
    maxDate: Moment;
    theme: string;
    onSelect: EventEmitter<IMonth>;
    onNavHeaderBtnClick: EventEmitter<null>;
    onGoToCurrent: EventEmitter<void>;
    onLeftNav: EventEmitter<INavEvent>;
    onRightNav: EventEmitter<INavEvent>;
    onLeftSecondaryNav: EventEmitter<INavEvent>;
    onRightSecondaryNav: EventEmitter<INavEvent>;
    isInited: boolean;
    componentConfig: IMonthCalendarConfigInternal;
    yearMonths: IMonth[][];
    inputValue: CalendarValue;
    inputValueType: ECalendarValue;
    validateFn: DateValidator;
    _shouldShowCurrent: boolean;
    navLabel: string;
    showLeftNav: boolean;
    showRightNav: boolean;
    showSecondaryLeftNav: boolean;
    showSecondaryRightNav: boolean;
    api: {
        toggleCalendar: any;
        moveCalendarTo: any;
    };
    constructor(monthCalendarService: MonthCalendarService, utilsService: UtilsService, cd: ChangeDetectorRef);
    _selected: Moment[];
    get selected(): Moment[];
    set selected(selected: Moment[]);
    _currentDateView: Moment;
    get currentDateView(): Moment;
    set currentDateView(current: Moment);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    init(): void;
    writeValue(value: CalendarValue): void;
    registerOnChange(fn: any): void;
    onChangeCallback(_: any): void;
    registerOnTouched(fn: any): void;
    validate(formControl: FormControl): ValidationErrors | any;
    processOnChangeCallback(value: Moment[]): CalendarValue;
    initValidators(): void;
    monthClicked(month: IMonth): void;
    onLeftNavClick(): void;
    onLeftSecondaryNavClick(): void;
    onRightNavClick(): void;
    onRightSecondaryNavClick(): void;
    toggleCalendarMode(): void;
    getMonthBtnCssClass(month: IMonth): {
        [klass: string]: boolean;
    };
    shouldShowCurrent(): boolean;
    goToCurrent(): void;
    moveCalendarTo(to: SingleCalendarValue): void;
    handleConfigChange(config: SimpleChange): void;
}
