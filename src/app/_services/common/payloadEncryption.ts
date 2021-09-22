import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';

@Injectable({ providedIn: 'root' })
export class PayloadEcryption {

    generateRandomCharacters(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    encryptPayload(data) {
        const prefix = this.generateRandomCharacters(3);
        const suffix = this.generateRandomCharacters(5);
        const encodedPayload = escape(btoa(JSON.stringify(data)));
        const encodedUrl = prefix + unescape(encodedPayload) + suffix;
        return { 'encryption_key': encodedUrl };
    };
};
