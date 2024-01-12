import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsServiceService {

  constructor() { }
  
  space(event:any){
    if(event.target.selectionStart===0 && event.code=== "Space"){
      event.preventDefault();
    }
  }

numberOnly(event:any){  
    const regexpNumber = /[0-9]/;
    let inputCharacter = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !regexpNumber.test(inputCharacter)) {
      event.preventDefault();
    }
  }



}

