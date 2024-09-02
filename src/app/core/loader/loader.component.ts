import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModelService } from '@core/web-core';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, AfterViewInit {
  @Input() id: string;
  @ViewChild('loaderModal') public loaderModal: ModalDirective;

  private letterIndex = 0;
  private dotIndex = 0;

  constructor(
    private modalService:ModelService
  ) { }
  ngOnInit(): void {
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);
  }
  showModal(alert){ 
    this.loaderModal.show();
  } 
  close(){
    this.loaderModal.hide();
  }

  ngAfterViewInit(): void {
    this.animateTextAndDots();
  }

  private animateTextAndDots(): void {
    const textElement = document.getElementById('loading-text');
    const text = textElement?.textContent || '';
    const delay = 100; // delay in milliseconds between letters

    if (textElement) {
      textElement.textContent = ''; // clear the original text

      const addLetter = () => {
        if (this.letterIndex < text.length) {
          textElement.textContent += text[this.letterIndex++];
        } else {
          this.letterIndex = 0;
          textElement.textContent = ''; // Clear text to restart animation
        }
        this.animateDots();
        setTimeout(addLetter, delay);
      }

      addLetter(); // start the animation
    }
  }

  private animateDots(): void {
    const dots = [
      document.getElementById('dot1'),
      document.getElementById('dot2'),
      document.getElementById('dot3')
    ];

    dots.forEach((dot, index) => {
      if (dot) {
        dot.style.opacity = (index === this.dotIndex) ? '1' : '0.3';
      }
    });

    this.dotIndex = (this.dotIndex + 1) % dots.length; // Move to the next dot
  }

}
