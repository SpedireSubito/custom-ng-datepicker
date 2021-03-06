import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation } from '@angular/core';
export class CalendarNavComponent {
    constructor() {
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
        this.onLeftNav = new EventEmitter();
        this.onLeftSecondaryNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.onRightSecondaryNav = new EventEmitter();
        this.onLabelClick = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
    }
    leftNavClicked() {
        this.onLeftNav.emit();
    }
    leftSecondaryNavClicked() {
        this.onLeftSecondaryNav.emit();
    }
    rightNavClicked() {
        this.onRightNav.emit();
    }
    rightSecondaryNavClicked() {
        this.onRightSecondaryNav.emit();
    }
    labelClicked() {
        this.onLabelClick.emit();
    }
}
CalendarNavComponent.decorators = [
    { type: Component, args: [{
                selector: 'dp-calendar-nav',
                template: "<div class=\"dp-calendar-nav-container\">\n  <div class=\"dp-nav-header\">\n    <span [attr.data-hidden]=\"isLabelClickable\"\n          [hidden]=\"isLabelClickable\"\n          [innerText]=\"label\">\n    </span>\n    <button (click)=\"labelClicked()\"\n            [attr.data-hidden]=\"!isLabelClickable\"\n            [hidden]=\"!isLabelClickable\"\n            [innerText]=\"label\"\n            class=\"dp-nav-header-btn\"\n            type=\"button\">\n    </button>\n  </div>\n\n  <div class=\"dp-nav-btns-container\">\n    <div class=\"dp-calendar-nav-container-left\">\n      <button (click)=\"leftSecondaryNavClicked()\"\n              *ngIf=\"showLeftSecondaryNav\"\n              [disabled]=\"leftSecondaryNavDisabled\"\n              class=\"dp-calendar-secondary-nav-left\"\n              type=\"button\">\n      </button>\n      <button (click)=\"leftNavClicked()\"\n              [attr.data-hidden]=\"!showLeftNav\"\n              [disabled]=\"leftNavDisabled\"\n              [hidden]=\"!showLeftNav\"\n              class=\"dp-calendar-nav-left\"\n              type=\"button\">\n      </button>\n    </div>\n    <button (click)=\"onGoToCurrent.emit()\"\n            *ngIf=\"showGoToCurrent\"\n            class=\"dp-current-location-btn\"\n            type=\"button\">\n    </button>\n    <div class=\"dp-calendar-nav-container-right\">\n      <button (click)=\"rightNavClicked()\"\n              [attr.data-hidden]=\"!showRightNav\"\n              [disabled]=\"rightNavDisabled\"\n              [hidden]=\"!showRightNav\"\n              class=\"dp-calendar-nav-right\"\n              type=\"button\">\n      </button>\n      <button (click)=\"rightSecondaryNavClicked()\"\n              *ngIf=\"showRightSecondaryNav\"\n              [disabled]=\"rightSecondaryNavDisabled\"\n              class=\"dp-calendar-secondary-nav-right\"\n              type=\"button\">\n      </button>\n    </div>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [""]
            },] }
];
CalendarNavComponent.propDecorators = {
    label: [{ type: Input }],
    isLabelClickable: [{ type: Input }],
    showLeftNav: [{ type: Input }],
    showLeftSecondaryNav: [{ type: Input }],
    showRightNav: [{ type: Input }],
    showRightSecondaryNav: [{ type: Input }],
    leftNavDisabled: [{ type: Input }],
    leftSecondaryNavDisabled: [{ type: Input }],
    rightNavDisabled: [{ type: Input }],
    rightSecondaryNavDisabled: [{ type: Input }],
    showGoToCurrent: [{ type: Input }],
    theme: [{ type: HostBinding, args: ['class',] }, { type: Input }],
    onLeftNav: [{ type: Output }],
    onLeftSecondaryNav: [{ type: Output }],
    onRightNav: [{ type: Output }],
    onRightSecondaryNav: [{ type: Output }],
    onLabelClick: [{ type: Output }],
    onGoToCurrent: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItbmF2LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbGliLyIsInNvdXJjZXMiOlsiY2FsZW5kYXItbmF2L2NhbGVuZGFyLW5hdi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLFdBQVcsRUFDWCxLQUFLLEVBQ0wsTUFBTSxFQUNOLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQVN2QixNQUFNLE9BQU8sb0JBQW9CO0lBUGpDO1FBU1cscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBQ2xDLGdCQUFXLEdBQVksSUFBSSxDQUFDO1FBQzVCLHlCQUFvQixHQUFZLEtBQUssQ0FBQztRQUN0QyxpQkFBWSxHQUFZLElBQUksQ0FBQztRQUM3QiwwQkFBcUIsR0FBWSxLQUFLLENBQUM7UUFDdkMsb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFDakMsNkJBQXdCLEdBQVksS0FBSyxDQUFDO1FBQzFDLHFCQUFnQixHQUFZLEtBQUssQ0FBQztRQUNsQyw4QkFBeUIsR0FBWSxLQUFLLENBQUM7UUFDM0Msb0JBQWUsR0FBWSxJQUFJLENBQUM7UUFHL0IsY0FBUyxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ25ELHVCQUFrQixHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzVELGVBQVUsR0FBdUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNwRCx3QkFBbUIsR0FBdUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM3RCxpQkFBWSxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3RELGtCQUFhLEdBQXVCLElBQUksWUFBWSxFQUFFLENBQUM7SUFxQm5FLENBQUM7SUFuQkMsY0FBYztRQUNaLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELHVCQUF1QjtRQUNyQixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDakMsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCx3QkFBd0I7UUFDdEIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFRCxZQUFZO1FBQ1YsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMzQixDQUFDOzs7WUE5Q0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLHc1REFBNEM7Z0JBRTVDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7YUFDaEQ7OztvQkFFRSxLQUFLOytCQUNMLEtBQUs7MEJBQ0wsS0FBSzttQ0FDTCxLQUFLOzJCQUNMLEtBQUs7b0NBQ0wsS0FBSzs4QkFDTCxLQUFLO3VDQUNMLEtBQUs7K0JBQ0wsS0FBSzt3Q0FDTCxLQUFLOzhCQUNMLEtBQUs7b0JBQ0wsV0FBVyxTQUFDLE9BQU8sY0FBRyxLQUFLO3dCQUUzQixNQUFNO2lDQUNOLE1BQU07eUJBQ04sTUFBTTtrQ0FDTixNQUFNOzJCQUNOLE1BQU07NEJBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdEJpbmRpbmcsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkcC1jYWxlbmRhci1uYXYnLFxuICB0ZW1wbGF0ZVVybDogJy4vY2FsZW5kYXItbmF2LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vY2FsZW5kYXItbmF2LmNvbXBvbmVudC5sZXNzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyTmF2Q29tcG9uZW50IHtcbiAgQElucHV0KCkgbGFiZWw6IHN0cmluZztcbiAgQElucHV0KCkgaXNMYWJlbENsaWNrYWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBzaG93TGVmdE5hdjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIHNob3dMZWZ0U2Vjb25kYXJ5TmF2OiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIHNob3dSaWdodE5hdjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIHNob3dSaWdodFNlY29uZGFyeU5hdjogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBsZWZ0TmF2RGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgbGVmdFNlY29uZGFyeU5hdkRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIHJpZ2h0TmF2RGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgcmlnaHRTZWNvbmRhcnlOYXZEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBzaG93R29Ub0N1cnJlbnQ6IGJvb2xlYW4gPSB0cnVlO1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzJykgQElucHV0KCkgdGhlbWU6IHN0cmluZztcblxuICBAT3V0cHV0KCkgb25MZWZ0TmF2OiBFdmVudEVtaXR0ZXI8bnVsbD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvbkxlZnRTZWNvbmRhcnlOYXY6IEV2ZW50RW1pdHRlcjxudWxsPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uUmlnaHROYXY6IEV2ZW50RW1pdHRlcjxudWxsPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uUmlnaHRTZWNvbmRhcnlOYXY6IEV2ZW50RW1pdHRlcjxudWxsPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIG9uTGFiZWxDbGljazogRXZlbnRFbWl0dGVyPG51bGw+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb25Hb1RvQ3VycmVudDogRXZlbnRFbWl0dGVyPG51bGw+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGxlZnROYXZDbGlja2VkKCkge1xuICAgIHRoaXMub25MZWZ0TmF2LmVtaXQoKTtcbiAgfVxuXG4gIGxlZnRTZWNvbmRhcnlOYXZDbGlja2VkKCkge1xuICAgIHRoaXMub25MZWZ0U2Vjb25kYXJ5TmF2LmVtaXQoKTtcbiAgfVxuXG4gIHJpZ2h0TmF2Q2xpY2tlZCgpIHtcbiAgICB0aGlzLm9uUmlnaHROYXYuZW1pdCgpO1xuICB9XG5cbiAgcmlnaHRTZWNvbmRhcnlOYXZDbGlja2VkKCkge1xuICAgIHRoaXMub25SaWdodFNlY29uZGFyeU5hdi5lbWl0KCk7XG4gIH1cblxuICBsYWJlbENsaWNrZWQoKSB7XG4gICAgdGhpcy5vbkxhYmVsQ2xpY2suZW1pdCgpO1xuICB9XG59XG4iXX0=