import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'trim',
    pure: false
})
    
export class TrimPipe implements PipeTransform {
    transform(value: string): any { 
    return value.trim()
    }
    
}