import { Directive, HostBinding, OnInit, ElementRef, HostListener, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})

export class DropdownDirective implements OnInit {
  @HostBinding('class.open') isOpen = false;

  constructor() {}

  ngOnInit() {}

  @HostListener('click') mouseclick(eventData: Event) {
    this.isOpen = !this.isOpen;
  }
}

