import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HeaderService {
    headermenuChanged = new EventEmitter<string>();
    private activeMenu = 'recipes';

    getActiveMenu() {
        return this.activeMenu.slice();
    }

    changeNavMenu(menu: string) {
        this.activeMenu = menu;
        this.headermenuChanged.emit(this.activeMenu);
    }
}
