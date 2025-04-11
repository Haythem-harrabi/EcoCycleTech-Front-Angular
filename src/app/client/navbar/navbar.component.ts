import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {





  SetActive(event: MouseEvent){
    const element = event.target as HTMLElement;
    const parentElement = element.closest('.nav-element') as HTMLElement;
    const dropdownelement = parentElement.querySelector('.dropdown-menu') as HTMLElement;
    
    console.log(parentElement);
    
    console.log(dropdownelement);
    if (parentElement.classList.contains('active')){
      parentElement.classList.remove('active')
      dropdownelement.classList.add('hidden')
      
    }
    else {
    // Remove active class from all side-elements and sub-side-elements
    document.querySelectorAll('.active').forEach((el) => {
      el.classList.remove('active');
    });
    
    document.querySelectorAll('.dropdown-menu').forEach((dl) => {
       dl.classList.add('hidden');
    });

    // Add active class to the clicked element
    if (parentElement) {
      parentElement.classList.add('active');
      dropdownelement.classList.remove('hidden');
      dropdownelement.classList.add('scalein');
    }

    
  }
  }


// handle clicks outside the dropdowns
  @HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const clickedInsideNav = target.closest('.nav-element');
  const clickedInsideDropdown = target.closest('.dropdown-menu');

  if (!clickedInsideNav && !clickedInsideDropdown) {
    document.querySelectorAll('.dropdown-menu').forEach((el) => {
      el.classList.add('hidden');
    });

    document.querySelectorAll('.nav-element.active').forEach((el) => {
      el.classList.remove('active');
    });
  }
}
}
