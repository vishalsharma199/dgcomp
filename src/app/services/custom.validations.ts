import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidatorFn } from "@angular/forms";

export function email  (control: UntypedFormControl) {
    if (!control.value) { return null; }
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(control.value)) {
        return null;
    } else {
        return { "email": true };
    }
}

export function website  (control: UntypedFormControl) {
    if (!control.value) { return null; }
    if (/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test(control.value)) {
        return null;
    } else {
        return { "website": true };
    }
}

export function businessEmail  (control: UntypedFormControl) {
    if (!control.value) { return null; }
    if (/^[a-zA-Z0-9._%+-]+@(?!gmail.com)(?!yahoo.com)(?!hotmail.com)(?!yahoo.co.in)(?!aol.com)(?!live.com)(?!outlook.com)[a-zA-Z0-9_-]+.[a-zA-Z0-9-.]{2,61}$/.test(control.value)) {
        return null;
    } else {
        return { "businessEmail": true };
    }
}

export function websiteUrl  (control: UntypedFormControl) {
    if (!control.value) { return null; }
    if (/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test(control.value)) {
        return null;
    } else {
        return { "websiteUrl": true };
    }
}

export function noWhitespace(control: UntypedFormControl) {
    if (!control.value) { return null; }
    // if (/^([a-zA-Z0-9!|@#$&%*(){}\/-_`.+,/\"]+\s)*([a-zA-Z0-9!|@#$&%(){}*\/-_`.+,/\"]+)$/.test(control.value)) {
    if (/^\S*$/.test(control.value)) {
        return null;
    } else {
        return { "noWhitespace": true };
    }
}

export function noExtraWhiteSpace(control: UntypedFormControl) {
    if (!control.value) { return null; }
    // if (/^([a-zA-Z0-9!|@#$&%*(){}\/-_`.+,/\"]+\s)*([a-zA-Z0-9!|@#$&%(){}*\/-_`.+,/\"]+)$/.test(control.value)) {
    if (/^[^\s]+(\s+[^\s]+)*$/.test(control.value)) {
        return null;
    } else {
        return { "noextrawhitespace": true };
    }
}

export function onlyCharacters(control: UntypedFormControl) {
    if (!control.value) { return null; }
    if (/^([ a-zA-Z]*)$/.test(control.value)) {
        return null;
    } else {
        return { "onlycharacters": true };
    }
}

export function password(control: UntypedFormControl) {
    if (!control.value) { return null; }
    if (/(?=^.{8,25}$)(?=(?:.*?\\d){2})(?=.*[a-zA-Z]{2})(?=(?:.*?[!@#$%^&*?_~-]){2})(?!.*\\s)[0-9a-zA-Z!@#$%^&*?_~-]*/.test(control.value)) {
        return null;
    } else {
        return { "password": true };
    }
}



export function passwordValidator(control: UntypedFormControl) {
    if (!control.value) { return null; }
    if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(control.value)) {
        return null;
    } else {
        return { "passwordValidator": true };
    }
}

export function ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: UntypedFormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

export function percentage  (control: UntypedFormControl) {
    if (!control.value) { return null; }
    if ((/(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/g).test(control.value)) {
        return null;
    } else {
        return { "percentage": true };
    }
}

export function phone(control: UntypedFormControl) {
    if (!control.value) { return null; }
    if ((/^(?!0+$)(?:\(?\+\d{1,3}\)?[- ]?|0)?\d{10}$/g).test(control.value)) {
        return null;
    } else {
        return { "phone": true };
    }
}

export function noSpecialCharAllow(control: UntypedFormControl){
    if (!control.value) { return null; }
    if (!(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g).test(control.value)) {
        return null;
    } else {
        return { "noSpecialCharAllow": true };
    }
}

export function regNumber(control: UntypedFormControl){
    if (!control.value) { return null; }
    if ((/^[ A-Za-z0-9_@/|#+:?-]*$/).test(control.value)) {
        return null;
    } else {
        return { "regNumber": true };
    }
}

export function numberOnly(control: UntypedFormControl){
    if (!control.value) { return null; }
    if (!(/[0-9]/).test(control.value)) {
        return null;
    } else {
        return { "numberOnly": true };
    }
}

export function phoneNumberOnly(control: UntypedFormControl){
    if (!control.value) { return null; }
    if ((/^[0-9]+$/).test(control.value)) {
        return null;
    } else {
        return { "phoneNumberOnly": true };
    }
}

