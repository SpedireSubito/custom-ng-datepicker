import { Injectable } from '@angular/core';
import * as momentNs from 'moment';
import { UtilsService } from '../common/services/utils/utils.service';
const moment = momentNs;
export class MonthCalendarService {
    constructor(utilsService) {
        this.utilsService = utilsService;
        this.DEFAULT_CONFIG = {
            allowMultiSelect: false,
            yearFormat: 'YYYY',
            format: 'MM-YYYY',
            isNavHeaderBtnClickable: false,
            monthBtnFormat: 'MMM',
            locale: moment.locale(),
            multipleYearsNavigateBy: 10,
            showMultipleYearsNavigation: false,
            unSelectOnClick: true,
            numOfMonthRows: 3
        };
    }
    getConfig(config) {
        const _config = Object.assign(Object.assign({}, this.DEFAULT_CONFIG), this.utilsService.clearUndefined(config));
        this.validateConfig(_config);
        this.utilsService.convertPropsToMoment(_config, _config.format, ['min', 'max']);
        moment.locale(_config.locale);
        return _config;
    }
    generateYear(config, year, selected = null) {
        const index = year.clone().startOf('year');
        return this.utilsService.createArray(config.numOfMonthRows).map(() => {
            return this.utilsService.createArray(12 / config.numOfMonthRows).map(() => {
                const date = index.clone();
                const month = {
                    date,
                    selected: !!selected.find(s => index.isSame(s, 'month')),
                    currentMonth: index.isSame(moment(), 'month'),
                    disabled: this.isMonthDisabled(date, config),
                    text: this.getMonthBtnText(config, date)
                };
                index.add(1, 'month');
                return month;
            });
        });
    }
    isMonthDisabled(date, config) {
        if (config.isMonthDisabledCallback) {
            return config.isMonthDisabledCallback(date);
        }
        if (config.min && date.isBefore(config.min, 'month')) {
            return true;
        }
        return !!(config.max && date.isAfter(config.max, 'month'));
    }
    shouldShowLeft(min, currentMonthView) {
        return min ? min.isBefore(currentMonthView, 'year') : true;
    }
    shouldShowRight(max, currentMonthView) {
        return max ? max.isAfter(currentMonthView, 'year') : true;
    }
    getHeaderLabel(config, year) {
        if (config.yearFormatter) {
            return config.yearFormatter(year);
        }
        return year.format(config.yearFormat);
    }
    getMonthBtnText(config, month) {
        if (config.monthBtnFormatter) {
            return config.monthBtnFormatter(month);
        }
        return month.format(config.monthBtnFormat);
    }
    getMonthBtnCssClass(config, month) {
        if (config.monthBtnCssClassCallback) {
            return config.monthBtnCssClassCallback(month);
        }
        return '';
    }
    validateConfig(config) {
        if (config.numOfMonthRows < 1 || config.numOfMonthRows > 12 || !Number.isInteger(12 / config.numOfMonthRows)) {
            throw new Error('numOfMonthRows has to be between 1 - 12 and divide 12 to integer');
        }
    }
}
MonthCalendarService.decorators = [
    { type: Injectable }
];
MonthCalendarService.ctorParameters = () => [
    { type: UtilsService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9udGgtY2FsZW5kYXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbGliLyIsInNvdXJjZXMiOlsibW9udGgtY2FsZW5kYXIvbW9udGgtY2FsZW5kYXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sS0FBSyxRQUFRLE1BQU0sUUFBUSxDQUFDO0FBRW5DLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUlwRSxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUM7QUFHeEIsTUFBTSxPQUFPLG9CQUFvQjtJQWMvQixZQUFvQixZQUEwQjtRQUExQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQWJyQyxtQkFBYyxHQUFpQztZQUN0RCxnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLFVBQVUsRUFBRSxNQUFNO1lBQ2xCLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLHVCQUF1QixFQUFFLEtBQUs7WUFDOUIsY0FBYyxFQUFFLEtBQUs7WUFDckIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDdkIsdUJBQXVCLEVBQUUsRUFBRTtZQUMzQiwyQkFBMkIsRUFBRSxLQUFLO1lBQ2xDLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLGNBQWMsRUFBRSxDQUFDO1NBQ2xCLENBQUM7SUFHRixDQUFDO0lBRUQsU0FBUyxDQUFDLE1BQTRCO1FBQ3BDLE1BQU0sT0FBTyxHQUFHLGdDQUNYLElBQUksQ0FBQyxjQUFjLEdBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUM1QyxDQUFDO1FBRUYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU3QixJQUFJLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FB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LEtBQUssQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsbUJBQW1CLENBQUMsTUFBNEIsRUFBRSxLQUFhO1FBQzdELElBQUksTUFBTSxDQUFDLHdCQUF3QixFQUFFO1lBQ25DLE9BQU8sTUFBTSxDQUFDLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9DO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRU8sY0FBYyxDQUFDLE1BQW9DO1FBQ3pELElBQUksTUFBTSxDQUFDLGNBQWMsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLGNBQWMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDNUcsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO1NBQ3JGO0lBQ0gsQ0FBQzs7O1lBckdGLFVBQVU7OztZQU5ILFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0ICogYXMgbW9tZW50TnMgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7TW9tZW50fSBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtVdGlsc1NlcnZpY2V9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy91dGlscy91dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7SU1vbnRofSBmcm9tICcuL21vbnRoLm1vZGVsJztcbmltcG9ydCB7SU1vbnRoQ2FsZW5kYXJDb25maWcsIElNb250aENhbGVuZGFyQ29uZmlnSW50ZXJuYWx9IGZyb20gJy4vbW9udGgtY2FsZW5kYXItY29uZmlnJztcblxuY29uc3QgbW9tZW50ID0gbW9tZW50TnM7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNb250aENhbGVuZGFyU2VydmljZSB7XG4gIHJlYWRvbmx5IERFRkFVTFRfQ09ORklHOiBJTW9udGhDYWxlbmRhckNvbmZpZ0ludGVybmFsID0ge1xuICAgIGFsbG93TXVsdGlTZWxlY3Q6IGZhbHNlLFxuICAgIHllYXJGb3JtYXQ6ICdZWVlZJyxcbiAgICBmb3JtYXQ6ICdNTS1ZWVlZJyxcbiAgICBpc05hdkhlYWRlckJ0bkNsaWNrYWJsZTogZmFsc2UsXG4gICAgbW9udGhCdG5Gb3JtYXQ6ICdNTU0nLFxuICAgIGxvY2FsZTogbW9tZW50LmxvY2FsZSgpLFxuICAgIG11bHRpcGxlWWVhcnNOYXZpZ2F0ZUJ5OiAxMCxcbiAgICBzaG93TXVsdGlwbGVZZWFyc05hdmlnYXRpb246IGZhbHNlLFxuICAgIHVuU2VsZWN0T25DbGljazogdHJ1ZSxcbiAgICBudW1PZk1vbnRoUm93czogM1xuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgdXRpbHNTZXJ2aWNlOiBVdGlsc1NlcnZpY2UpIHtcbiAgfVxuXG4gIGdldENvbmZpZyhjb25maWc6IElNb250aENhbGVuZGFyQ29uZmlnKTogSU1vbnRoQ2FsZW5kYXJDb25maWdJbnRlcm5hbCB7XG4gICAgY29uc3QgX2NvbmZpZyA9IDxJTW9udGhDYWxlbmRhckNvbmZpZ0ludGVybmFsPntcbiAgICAgIC4uLnRoaXMuREVGQVVMVF9DT05GSUcsXG4gICAgICAuLi50aGlzLnV0aWxzU2VydmljZS5jbGVhclVuZGVmaW5lZChjb25maWcpXG4gICAgfTtcblxuICAgIHRoaXMudmFsaWRhdGVDb25maWcoX2NvbmZpZyk7XG5cbiAgICB0aGlzLnV0aWxzU2VydmljZS5jb252ZXJ0UHJvcHNUb01vbWVudChfY29uZmlnLCBfY29uZmlnLmZvcm1hdCwgWydtaW4nLCAnbWF4J10pO1xuICAgIG1vbWVudC5sb2NhbGUoX2NvbmZpZy5sb2NhbGUpO1xuXG4gICAgcmV0dXJuIF9jb25maWc7XG4gIH1cblxuICBnZW5lcmF0ZVllYXIoY29uZmlnOiBJTW9udGhDYWxlbmRhckNvbmZpZywgeWVhcjogTW9tZW50LCBzZWxlY3RlZDogTW9tZW50W10gPSBudWxsKTogSU1vbnRoW11bXSB7XG4gICAgY29uc3QgaW5kZXggPSB5ZWFyLmNsb25lKCkuc3RhcnRPZigneWVhcicpO1xuXG4gICAgcmV0dXJuIHRoaXMudXRpbHNTZXJ2aWNlLmNyZWF0ZUFycmF5KGNvbmZpZy5udW1PZk1vbnRoUm93cykubWFwKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnV0aWxzU2VydmljZS5jcmVhdGVBcnJheSgxMiAvIGNvbmZpZy5udW1PZk1vbnRoUm93cykubWFwKCgpID0+IHtcbiAgICAgICAgY29uc3QgZGF0ZSA9IGluZGV4LmNsb25lKCk7XG4gICAgICAgIGNvbnN0IG1vbnRoID0ge1xuICAgICAgICAgIGRhdGUsXG4gICAgICAgICAgc2VsZWN0ZWQ6ICEhc2VsZWN0ZWQuZmluZChzID0+IGluZGV4LmlzU2FtZShzLCAnbW9udGgnKSksXG4gICAgICAgICAgY3VycmVudE1vbnRoOiBpbmRleC5pc1NhbWUobW9tZW50KCksICdtb250aCcpLFxuICAgICAgICAgIGRpc2FibGVkOiB0aGlzLmlzTW9udGhEaXNhYmxlZChkYXRlLCBjb25maWcpLFxuICAgICAgICAgIHRleHQ6IHRoaXMuZ2V0TW9udGhCdG5UZXh0KGNvbmZpZywgZGF0ZSlcbiAgICAgICAgfTtcblxuICAgICAgICBpbmRleC5hZGQoMSwgJ21vbnRoJyk7XG5cbiAgICAgICAgcmV0dXJuIG1vbnRoO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBpc01vbnRoRGlzYWJsZWQoZGF0ZTogTW9tZW50LCBjb25maWc6IElNb250aENhbGVuZGFyQ29uZmlnKSB7XG4gICAgaWYgKGNvbmZpZy5pc01vbnRoRGlzYWJsZWRDYWxsYmFjaykge1xuICAgICAgcmV0dXJuIGNvbmZpZy5pc01vbnRoRGlzYWJsZWRDYWxsYmFjayhkYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLm1pbiAmJiBkYXRlLmlzQmVmb3JlKGNvbmZpZy5taW4sICdtb250aCcpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gISEoY29uZmlnLm1heCAmJiBkYXRlLmlzQWZ0ZXIoY29uZmlnLm1heCwgJ21vbnRoJykpO1xuICB9XG5cbiAgc2hvdWxkU2hvd0xlZnQobWluOiBNb21lbnQsIGN1cnJlbnRNb250aFZpZXc6IE1vbWVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBtaW4gPyBtaW4uaXNCZWZvcmUoY3VycmVudE1vbnRoVmlldywgJ3llYXInKSA6IHRydWU7XG4gIH1cblxuICBzaG91bGRTaG93UmlnaHQobWF4OiBNb21lbnQsIGN1cnJlbnRNb250aFZpZXc6IE1vbWVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBtYXggPyBtYXguaXNBZnRlcihjdXJyZW50TW9udGhWaWV3LCAneWVhcicpIDogdHJ1ZTtcbiAgfVxuXG4gIGdldEhlYWRlckxhYmVsKGNvbmZpZzogSU1vbnRoQ2FsZW5kYXJDb25maWcsIHllYXI6IE1vbWVudCk6IHN0cmluZyB7XG4gICAgaWYgKGNvbmZpZy55ZWFyRm9ybWF0dGVyKSB7XG4gICAgICByZXR1cm4gY29uZmlnLnllYXJGb3JtYXR0ZXIoeWVhcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHllYXIuZm9ybWF0KGNvbmZpZy55ZWFyRm9ybWF0KTtcbiAgfVxuXG4gIGdldE1vbnRoQnRuVGV4dChjb25maWc6IElNb250aENhbGVuZGFyQ29uZmlnLCBtb250aDogTW9tZW50KTogc3RyaW5nIHtcbiAgICBpZiAoY29uZmlnLm1vbnRoQnRuRm9ybWF0dGVyKSB7XG4gICAgICByZXR1cm4gY29uZmlnLm1vbnRoQnRuRm9ybWF0dGVyKG1vbnRoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbW9udGguZm9ybWF0KGNvbmZpZy5tb250aEJ0bkZvcm1hdCk7XG4gIH1cblxuICBnZXRNb250aEJ0bkNzc0NsYXNzKGNvbmZpZzogSU1vbnRoQ2FsZW5kYXJDb25maWcsIG1vbnRoOiBNb21lbnQpOiBzdHJpbmcge1xuICAgIGlmIChjb25maWcubW9udGhCdG5Dc3NDbGFzc0NhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gY29uZmlnLm1vbnRoQnRuQ3NzQ2xhc3NDYWxsYmFjayhtb250aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZUNvbmZpZyhjb25maWc6IElNb250aENhbGVuZGFyQ29uZmlnSW50ZXJuYWwpOiB2b2lkIHtcbiAgICBpZiAoY29uZmlnLm51bU9mTW9udGhSb3dzIDwgMSB8fCBjb25maWcubnVtT2ZNb250aFJvd3MgPiAxMiB8fCAhTnVtYmVyLmlzSW50ZWdlcigxMiAvIGNvbmZpZy5udW1PZk1vbnRoUm93cykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbnVtT2ZNb250aFJvd3MgaGFzIHRvIGJlIGJldHdlZW4gMSAtIDEyIGFuZCBkaXZpZGUgMTIgdG8gaW50ZWdlcicpO1xuICAgIH1cbiAgfVxufVxuIl19