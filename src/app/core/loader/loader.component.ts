import {  Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModelService } from '@core/web-core';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  @Input() id: string;
  @ViewChild('loaderModal') public loaderModal: ModalDirective;

  private letterIndex = 0;
  // private dotIndex = 0;
  private isAnimating = true;
  private pauseDuration = 500;
  text = '';

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
    this.text = alert.text;
    this.loaderModal.show(); 
    setTimeout(() => {
      this.animateTextAndDots();
    }, 100);       
  } 
  close(){
    this.loaderModal.hide();
  }

  

  private animateTextAndDots(): void {
    const textElement = document.getElementById('loading-text');
    const text = textElement?.textContent || '';
    const delay = 100; // Delay in milliseconds between letters

    if (textElement) {
      textElement.textContent = ''; // Clear the original text

      const addLetter = () => {
        if (this.isAnimating) {
          if (this.letterIndex < text.length) {
            textElement.textContent += text[this.letterIndex++];
            // this.animateDots();
            setTimeout(addLetter, delay);
          } else {
            this.letterIndex = 0;
            this.isAnimating = false; // Stop the text animation
            setTimeout(() => {
              this.isAnimating = true; // Restart the text animation
              this.animateTextAndDots(); // Restart the animation
            }, this.pauseDuration); // Wait before restarting
          }
        }
      }

      addLetter(); // Start the animation
    }
  }

  // private animateDots(): void {
  //   const dots = [
  //     document.getElementById('dot1'),
  //     document.getElementById('dot2'),
  //     document.getElementById('dot3')
  //   ];

  //   dots.forEach((dot, index) => {
  //     if (dot) {
  //       dot.style.opacity = (index === this.dotIndex) ? '1' : '0.3';
  //     }
  //   });

  //   this.dotIndex = (this.dotIndex + 1) % dots.length; // Move to the next dot
  // }

}
