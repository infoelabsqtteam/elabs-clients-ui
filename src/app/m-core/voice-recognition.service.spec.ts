/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VoiceRecognitionService } from './voice-recognition.service';

describe('Service: VoiceRecognition', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VoiceRecognitionService]
    });
  });

  it('should ...', inject([VoiceRecognitionService], (service: VoiceRecognitionService) => {
    expect(service).toBeTruthy();
  }));
});
