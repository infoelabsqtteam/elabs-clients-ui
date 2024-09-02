import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements AfterViewInit {

  private letterIndex = 0;
  private dotIndex = 0;

  constructor() { }

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
