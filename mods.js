modClasses = [
// Mod_Tone_ToneBurst by RE3CON converted/rewritten to java from python mod by IK8JHL mod_change_Tone_1750Hz.py !!! DO Pay propper credits !!!      
class Mod_ToneBurst extends FirmwareMod {
        constructor() {
            super("Repeater Tone Burst (by RE3CON)", "Changes the Tone by PTT and Side F2 Key, used to open HAM Repeaters and NOAA Channels. The default is 1750 Hz. To open NOAA Ton-Squelch set 1050 Hz. Other not so common repeater tone pulse freq are 1000Hz, 1450Hz, 1750Hz, 2100Hz", 0);
            this.inputTone = addInputField(this.modSpecificDiv, "Enter a new Tone Burst frequency (Hz)", "1050");
                    }
        apply(firmwareData) {
            const offset = 0x29cc   
            const tone = (this.inputTone.value);
            if (tone <= 0xffff) {
                // Create an 8-byte buffer with the specified values
                const buffer = new ArrayBuffer(8);
                const dataView = new DataView(buffer);
                // Set tone at their respective offsets
                dataView.setUint32(0, tone, true); // true indicates little-endian byte order
                // Convert the buffer to a Uint8Array
                const toneHex = new Uint8Array(buffer);
                // Replace the 8-byte section at the offset with the new buffer
                firmwareData = replaceSection(firmwareData, toneHex, offset);
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`ERROR in ${this.name}: Unexpected data, already patched or wrong firmware?`);
            }
            return firmwareData;
        }
    }
    ,
// Mod_Tone_ToneBurst by RE3CON converted/rewritten to java from python mod by IK8JHL mod_change_Tone_1750Hz.py !!! DO Pay propper credits !!!
 class Mod_5tonetest extends FirmwareMod {
        constructor() {
            super("5-tone ZVEI2 (Experimental)", "To send a selective 5-tone ZVEI2 instead of DTMF 123A1", 0);
            this.inputTone1 = addInputField(this.modSpecificDiv, "Tone 1 frequency (Hz)", "1270");
            this.inputTone2 = addInputField(this.modSpecificDiv, "Tone 3 frequency (Hz)", "1060");
            this.inputTone3 = addInputField(this.modSpecificDiv, "Tone 9 frequency (Hz)", "2200");
            this.inputToneA = addInputField(this.modSpecificDiv, "Tone 2 frequency (Hz)", "1160");
                      }
        apply(firmwareData) {
            const offset = 0xa4e0;
            const tone1 = Math.trunc(parseInt(this.inputTone1.value) * 10.32444);
            const tone2 = Math.trunc(parseInt(this.inputTone2.value) * 10.32444);
            const tone3 = Math.trunc(parseInt(this.inputTone3.value) * 10.32444);
            const toneA = Math.trunc(parseInt(this.inputToneA.value) * 10.32444);
            const buffer = new ArrayBuffer(28);
            const dataView = new DataView(buffer);
                dataView.setUint32(0, tone1, true); // true indicates little-endian byte order
                dataView.setUint32(8, tone2, true);
                dataView.setUint32(12, tone3, true);
                dataView.setUint32(24, toneA, true);
                // Convert the buffer to a Uint8Array
                const tonesHex = new Uint8Array(buffer);
                firmwareData = replaceSection(firmwareData, hexString("00"), 0xa4dc);
                firmwareData = replaceSection(firmwareData, hexString("00"), 0xa4dd);
                firmwareData = replaceSection(firmwareData, tonesHex, offset);
                firmwareData = replaceSection(firmwareData, hexString("00"), 0xa4e4);
                firmwareData = replaceSection(firmwareData, hexString("00"), 0xa4e5);
                firmwareData = replaceSection(firmwareData, hexString("00"), 0xa4f0);
                firmwareData = replaceSection(firmwareData, hexString("00"), 0xa4f1);
                firmwareData = replaceSection(firmwareData, hexString("00"), 0xa4f4);
                firmwareData = replaceSection(firmwareData, hexString("00"), 0xa4f5);
                log(`Success: ${this.name} applied.`);
            /*}
            else {
                log(`ERROR in ${this.name}: Unexpected data, already patched or wrong firmware?`);
            }*/
            return firmwareData;
        }
    }
    ,
/* DO PAY PROPPER CREDITS! CODE TX RX on all Bands 18-1300 diffs by RE3CON, CODE Disable TX Lock by RE3CON */      
  class Mod_TXRXOnAllBands extends FirmwareMod {
        constructor() {
            super("TX and RX from 18-1300MHz (Tunas1337 diffs by RECON)", "Allows recieve (RX) and transmit (TX) on the frequency range from 18 MHz - 1300 MHz. This TX Mod includes the following Mods: Disable TX Lock, Enhance RX Frequency Range. The harmonic wave radiation can be stronger than on the input frequency and cause severe interference!", 0);
        }
        apply(firmwareData) {
            const offset1 = 0x180E;  //diffs by RE3CON taken from Tunas1337 18-1300 Mod
            const offset2 = 0xe078;  //diffs by RE3CON taken from Tunas1337 18-1300 Mod
            const offset3 = 0xe0a8;  //diffs by RE3CON taken from Tunas1337 18-1300 Mod
            const offset4 = 0x150b;  //diffs by RE3CON taken from Tunas1337 18-1300 Mod
            const oldData1 = hexString("cf2a");  //TX lock //
            const oldData2 = hexString("80cba4"); // lower rx-limit 50 lock, I do know u cant say these are numbers rather to be functions like push mov etc.. than not beeing bin numbers
            const oldData3 = hexString("00879303"); // upper rx-limit 600 lock
            const oldData4 = hexString("00404b4c00008793037c"); // full TX range @ 0x150c: 40xxxx00xxxxxx0x7c
            const newData1 = hexString("5de0"); //unlock TX 50-600 by R3CON //
            const newData2 = hexString("40771b"); //set lower rx freq to 18 by R3CON
            const newData3 = hexString("80a4bf07"); //set upper rx freq to 1300 by R3CON 
            const newData4 = hexString("0040771b0080a4bf077c"); // TX full range by R3CON
            if (compareSection(firmwareData, oldData1, offset1) && compareSection(firmwareData, oldData2, offset2) && compareSection(firmwareData, oldData3, offset3) && compareSection(firmwareData, oldData4, offset4)) {
                firmwareData = replaceSection(firmwareData, newData1, offset1);
                firmwareData = replaceSection(firmwareData, newData2, offset2);
                firmwareData = replaceSection(firmwareData, newData3, offset3);
                firmwareData = replaceSection(firmwareData, newData4, offset4);
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`ERROR in ${this.name}: Unexpected data, already patched or wrong firmware?`);
            }

            return firmwareData;
        }
    }
    ,  //add 500k steps @0xe0d2: 0xC4 0x09 changed to 0x50 0xC3  
   class Mod_add500Ksteps extends FirmwareMod {
        constructor() {
            super("Add 500kHz Steps (Experimental)", "Switch the freq in 0,5 MHz Steps. Usefull >999MHz to reach above the GHz range quickly", 0);//Diffs by RE3CON, taken from Tunas1337
        }
        apply(firmwareData) {
            const offset = 0xe0d2;
            const oldData = hexString("c409");
            const newData = hexString("50c3");
            if (compareSection(firmwareData, oldData, offset)) {
                firmwareData = replaceSection(firmwareData, newData, offset);
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`ERROR in ${this.name}: Unexpected data, already patched or wrong firmware?`);
            }
            return firmwareData;
        }
    }
    ,//just a quick edit... EOT credits by RE3CON
  class Mod_CustomTXRange extends FirmwareMod {
        constructor() {
            super("Custom TX Freq Range (allow/lock)", "You can either block a range of frequencies or allow a specific freq range from 18-1300 MHz. It can be used to do the same as 'Enable TX everywhere except Air Band', or it could also be used to make the radio only TX on PMR466. The preset values below are set to block Air Band and allow everything else.", 0);
            this.selectBlock = addRadioButton(this.modSpecificDiv, "The frequency range below will be blocked, everything else will be allowed. ", "selectBlock", "selectTXRange");
            this.selectAllow = addRadioButton(this.modSpecificDiv, "The frequency range below will be allowed, everything else will be blocked. ", "selectAllow", "selectTXRange");
            this.selectBlock.checked = true;
            this.lowFreq = addInputField(this.modSpecificDiv, "Lower Limit (Hz)", "118000000");
            this.highFreq = addInputField(this.modSpecificDiv, "Upper Limit (Hz)", "136000000");
        }
        apply(firmwareData) {//catch all and replace var at this offset 0x1804
            const offset = 0x1804;
            let shellcode;
            if (this.selectBlock.checked) {
                shellcode = hexString("f0b5014649690968054a914205d3054a914202d20020c04301e00020ffe7f0bd1111111122222222");
            } else if (this.selectAllow.checked) {
                shellcode = hexString("F0B5014649690968054A914204D3054A914201D2002002E00020C043FFE7F0BD1111111122222222");
            }
            const dataView = new DataView(shellcode.buffer);
            const lowFreq = Math.floor(this.lowFreq.value / 10);
            const highFreq = Math.floor(this.highFreq.value / 10);
            dataView.setUint32(32, lowFreq, true);
            dataView.setUint32(36, highFreq, true);
            firmwareData = replaceSection(firmwareData, shellcode, offset);
            log(`Success: ${this.name} applied.`);
            return firmwareData;
        }
    }
    ,      
   class Mod_ChangeRXLimits extends FirmwareMod {
        constructor() {
            super("Custom RX Limits (Experimental)", "Allows receive in the specified frequency range.", 0);
            this.inputMinTX = addInputField(this.modSpecificDiv, "Specify a new value for the minimum frequency in the range 18-1300 MHz:", "40");
            this.inputMaxTX = addInputField(this.modSpecificDiv, "Specify a new value for the minimum frequency in the range 18-1300 MHz:", "990");
         //   this.selectRX = addRadioButton(this.modSpecificDiv, "RX", "selectSbar", "selectApp");
         //   this.selectRXTX = addRadioButton(this.modSpecificDiv, "RX + TX", "selectSbar", "selectApp");
            //this.hidden = true;
        }
        apply(firmwareData) {
            const offsetlow = 0xe078;
            const offsethi = 0xe0a8;
            const txStart = parseInt(this.inputMinTX.value) * 100000;
            const txStop = parseInt(this.inputMaxTX.value) * 100000;
            if ((txStart <= txStop) && (txStart >= 100000) && (txStart <= 130000000) && (txStop >= 100000) && (txStop <= 130000000)) {
                const buffer = new ArrayBuffer(8);
                const dataView = new DataView(buffer);
                dataView.setUint32(0, txStart, true);
                const txHex = new Uint8Array(buffer);
                firmwareData = replaceSection(firmwareData, txHex, offsetlow);
                dataView.setUint32(0, txStop, true);
                firmwareData = replaceSection(firmwareData, txHex, offsethi);
           //     if (this.selectRX.checked) {}
            //    else if (this.selectRXTX.checked) {
              //  firmwareData = replaceSection(firmwareData, hexString("1868"), 0x180e);}//43CC
                //else
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`Error in ${this.name}: Incorrect data! The frequencies must be greater than 18 MHz and less than 1300 MHz, the maximum greater than or equal to the minimum. `);
            }
            return firmwareData;
        }
    }
    ,     /*       
    class Mod_ChangeTXLimits extends FirmwareMod {  // Mod_ChangeTXLimits written by @RE3CON  
        constructor() {
            super("Extend TX Limits (Experimental)", "Allows transmission on the specified frequency range.", 0);
            this.inputMinTX = addInputField(this.modSpecificDiv, "Specify a new value for the minimum frequency in the range 18-1300 MHz:", "50");
            this.inputMaxTX = addInputField(this.modSpecificDiv, "Specify a new value for the maximum frequency in the range 18-1300 MHz:", "890");
            //this.inputMinTX.disabled = true;
            //this.inputMaxTX.disabled = true; // Change TX Limits mod by RE3CON  
     //better solution generate from hexstring the xx bits these are the diffs from full TX range @ 0x150c: 40xxxx00xxxxxx0x7c
        }
            apply(firmwareData) {
            const offsetlow = 0x150c;
            const offsethi = 0x1510;        
            const txStart = parseInt(this.inputMinTX.value) * 100000;
            const txStop = parseInt(this.inputMaxTX.value) * 100000;
            if ((txStart <= txStop) && (txStart >= 1800000) && (txStart <= 130000000) && (txStop >= 1800000) && (txStop <= 130000000)) {
                const buffer = new ArrayBuffer(8);
                const dataView = new DataView(buffer);
                dataView.setUint32(0, txStart, true);
              //  dataView.setUint32(4, txStop, true);
                const txHex = new Uint8Array(buffer);
                firmwareData = replaceSection(firmwareData, txHex, offsetlow);
                dataView.setUint32(0, txStop, true);
                firmwareData = replaceSection(firmwareData, txHex, offsethi);
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`Error in ${this.name}: Incorrect data! The frequencies must be greater than 18 MHz and less than 1300 MHz, the maximum greater than or equal to the minimum.`);
            }
            return firmwareData;
        }
    }
    ,   */  
    class Mod_DisableTXlock extends FirmwareMod {
        constructor() {
            super("Disable TX Lock from 50-600 MHz", "Enables transmitting on frequencies from 50 MHz to 600 MHz. The harmonic wave radiation can be stronger than on the input frequency and cause severe interference!", 0);
        }
        apply(firmwareData) {
            const offset = 0x180e;
            const oldData = hexString("cf2a");
            const newData = hexString("5de0");
            if (compareSection(firmwareData, oldData, offset)) {
                firmwareData = replaceSection(firmwareData, newData, offset);
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`ERROR in ${this.name}: Unexpected data, already patched or wrong firmware?`);
            }
            return firmwareData;
        }
    }
    ,//just a quick edit... from tx-lock on all freq. EOT credits by RE3CON
   class Mod_EnableTXEverywhereButAirBand extends FirmwareMod {
        constructor() {
            super("Enable TX everywhere except Air Band", "Allows transmitting on all frequencies except air band (118 - 137 MHz).", 0);
            this.hidden = true;
        }
        apply(firmwareData) {
            const offset = 0x1804;
            const newData = hexString("f0b5014649690968054a914205d3054a914202d20020c04301e00020ffe7f0bdc00db400a00bd100");
            firmwareData = replaceSection(firmwareData, newData, offset);
            log(`Success: ${this.name} applied.`);
            return firmwareData;
        }
    }
    , 
   class Mod_DisableTX extends FirmwareMod {
        constructor() {
            super("Disable TX completely", "Prevents transmitting on all frequencies, making the radio purely a receiver.", 0);
        }
        apply(firmwareData) {
            const offset = 0x180e;
            const oldData = hexString("cf2a");
            const newData = hexString("f0bd");
            if (compareSection(firmwareData, oldData, offset)) {
                firmwareData = replaceSection(firmwareData, newData, offset);
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`ERROR in ${this.name}: Unexpected data, already patched or wrong firmware?`);
            }
            return firmwareData;
        }
    }
    , 
  class Mod_FrequencyRangeAdvanced extends FirmwareMod {
        constructor() {
            super("Custom Frequency Ranges all Bands (1-7)", "Changes the frequency range limits.", 0);
            this.selectSimple = addRadioButton(this.modSpecificDiv, "Simple Mode: Extend Band 1 down to 18 MHz and Band 7 up to 1300 MHz. This is the maximum frequency range of the chip. ", "selectSimpleMode", "selectFrequencyRange");
            this.selectCustom = addRadioButton(this.modSpecificDiv, "Custom Mode: Manually edit the frequency ranges. ", "selectCustomMode", "selectFrequencyRange");
            this.selectSimple.checked = true;
            const customModeDiv = document.createElement("div");
            customModeDiv.classList.add("d-none", "mt-2");
            const explanation = document.createElement("p");
            explanation.innerText = "Frequency Band Ranges Customization. Make sure they are in the correct order and don't overlap. The maximum range is 18 MHz to 1300 MHz, and there is a gap from 630 - 840 MHz, where the chip cannot receive or transmit due to a hardware limitation.";
            customModeDiv.appendChild(explanation);
            this.band1L = addInputField(customModeDiv, "Band 1 Lower Limit (Hz)", "50000000");
            this.band1U = addInputField(customModeDiv, "Band 1 Upper Limit (Hz)", "107999990");
            this.band2L = addInputField(customModeDiv, "Band 2 Lower Limit (Hz)", "108000000");
            this.band2U = addInputField(customModeDiv, "Band 2 Upper Limit (Hz)", "135999900");
            this.band3L = addInputField(customModeDiv, "Band 3 Lower Limit (Hz)", "136000000");
            this.band3U = addInputField(customModeDiv, "Band 3 Upper Limit (Hz)", "173999900");
            this.band4L = addInputField(customModeDiv, "Band 4 Lower Limit (Hz)", "174000000");
            this.band4U = addInputField(customModeDiv, "Band 4 Upper Limit (Hz)", "349999900");
            this.band5L = addInputField(customModeDiv, "Band 5 Lower Limit (Hz)", "350000000");
            this.band5U = addInputField(customModeDiv, "Band 5 Upper Limit (Hz)", "399999900");
            this.band6L = addInputField(customModeDiv, "Band 6 Lower Limit (Hz)", "400000000");
            this.band6U = addInputField(customModeDiv, "Band 6 Upper Limit (Hz)", "469999900");
            this.band7L = addInputField(customModeDiv, "Band 7 Lower Limit (Hz)", "470000000");
            this.band7U = addInputField(customModeDiv, "Band 7 Upper Limit (Hz)", "1300000000");
            this.modSpecificDiv.appendChild(customModeDiv);
            this.selectCustom.parentElement.parentElement.addEventListener("change", () => {
                customModeDiv.classList.toggle("d-none", !this.selectCustom.checked);
            });
        }
        apply(firmwareData) {
            if (this.selectSimple.checked) {
                firmwareData = replaceSection(firmwareData, hexString("40771b0080cba4000085cf00c0800901c00e1602005a6202c029cd0280f77300f684cf00b6800901b60e1602f6596202b629cd0280a4bf07"), 0xE074);
            }
            else if (this.selectCustom.checked) {
                const lowerFreqs = [
                    Math.trunc(parseInt(this.band1L.value) * 0.1),
                    Math.trunc(parseInt(this.band2L.value) * 0.1),
                    Math.trunc(parseInt(this.band3L.value) * 0.1),
                    Math.trunc(parseInt(this.band4L.value) * 0.1),
                    Math.trunc(parseInt(this.band5L.value) * 0.1),
                    Math.trunc(parseInt(this.band6L.value) * 0.1),
                    Math.trunc(parseInt(this.band7L.value) * 0.1)
                ];
                const higherFreqs = [
                    Math.trunc(parseInt(this.band1U.value) * 0.1),
                    Math.trunc(parseInt(this.band2U.value) * 0.1),
                    Math.trunc(parseInt(this.band3U.value) * 0.1),
                    Math.trunc(parseInt(this.band4U.value) * 0.1),
                    Math.trunc(parseInt(this.band5U.value) * 0.1),
                    Math.trunc(parseInt(this.band6U.value) * 0.1),
                    Math.trunc(parseInt(this.band7U.value) * 0.1)
                ];
                const buffer = new ArrayBuffer(4 * 7 * 2); // uint32, 7 bands, upper and lower limit
                const dataView = new DataView(buffer);
                for (let i = 0; i < lowerFreqs.length; i++) {
                    dataView.setUint32(i * 4, lowerFreqs[i], true);
                    dataView.setUint32(i * 4 + 28, higherFreqs[i], true); // upper limit table starts right after lower limit table
                }
                const freqsHex = new Uint8Array(buffer);
                console.log(freqsHex);
                console.log(uint8ArrayToHexString(freqsHex));
                firmwareData = replaceSection(firmwareData, freqsHex, 0xE074);
            }
            log(`Success: ${this.name} applied.`);
            return firmwareData;
        }
    }
    ,      
    class Mod_FrequencyRangeSimple extends FirmwareMod {
        constructor() {
            super("Enhance RX Frequency Range", "Changes the lower limit of Band 1 to 18 MHz and the upper limit of Band 7 to 1300 MHz for RX. TX ranges are not affected. ", 0);
        }
        apply(firmwareData) {
            const offset = 0xe074;
            const oldData = hexString("404b4c0080cba4000085cf00c0800901c00e1602005a6202c029cd0280f77300f684cf00b6800901b60e1602f6596202b629cd0200879303");
            const newData = hexString("40771b0080cba4000085cf00c0800901c00e1602005a6202c029cd0280f77300f684cf00b6800901b60e1602f6596202b629cd0280a4bf07");
            if (compareSection(firmwareData, oldData, offset)) {
                firmwareData = replaceSection(firmwareData, newData, offset);
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`ERROR in ${this.name}: Unexpected data, already patched or wrong firmware?`);
            }
            return firmwareData;
        }
    }
    ,
    class Mod_AMOnAllBands extends FirmwareMod {
        constructor() {
            super("AM RX on all Bands", "For some reason, the original firmware only allows the AM setting to work on band 2. This mod allows AM reception to work on any band.", 0);
        }
        apply(firmwareData) {
            const offset1 = 0x6232;
            const offset2 = 0x6246;
            const offset3 = 0x624c;
            const oldData1 = hexString("0b");
            const oldData2 = hexString("01");
            const oldData3 = hexString("b07b");
            const newData1 = hexString("0e");
            const newData2 = hexString("04");
            const newData3 = hexString("01e0");
            if (compareSection(firmwareData, oldData1, offset1) && compareSection(firmwareData, oldData2, offset2) && compareSection(firmwareData, oldData3, offset3)) {
                firmwareData = replaceSection(firmwareData, newData1, offset1);
                firmwareData = replaceSection(firmwareData, newData2, offset2);
                firmwareData = replaceSection(firmwareData, newData3, offset3);
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`ERROR in ${this.name}: Unexpected data, already patched or wrong firmware?`);
            }
            return firmwareData;
        }
    }
    ,
    class Mod_BatteryIcon extends FirmwareMod {
        constructor() {
            super("Battery icon", "Changes the battery icon to a modern look.", 0);
        }
        apply(firmwareData) {
            const offset = 0xD348 + 134;
            const oldData = hexString("3e227f4141414141414141414141414163003e227f415d5d4141414141414141414163003e227f415d5d415d5d4141414141414163003e227f415d5d415d5d415d5d4141414163003e227f415d5d415d5d415d5d415d5d4163");
            const newData = hexString("3e2263414141414141414141414141417f003e2263414141414141414141415d5d4163003e2263414141414141415d5d415d5d417f003e2263414141415d5d415d5d415d5d417f003e2263415d5d415d5d415d5d415d5d417f");
            if (compareSection(firmwareData, oldData, offset)) {
                firmwareData = replaceSection(firmwareData, newData, offset);
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`ERROR in ${this.name}: Unexpected data, already patched or wrong firmware?`);
            }
            return firmwareData;
        }
    }
    ,
    class Mod_ChangeContrast extends FirmwareMod {
        constructor() {
            super("LCD Contrast", "Changes LCD contrast to any value from 0 to 63 (higher is darker). The default value is 31", 0);

            this.contrastValue = addInputField(this.modSpecificDiv, "Enter a new contrast value from 0-63:", "31");
        }
        apply(firmwareData) {
            const minValue = 0;
            const maxValue = 63;
            const inputValue = parseInt(this.contrastValue.value);
            if (!isNaN(inputValue) && inputValue >= minValue && inputValue <= maxValue) {
                const newData = new Uint8Array([inputValue]);
                firmwareData = replaceSection(firmwareData, newData, 0xb7b0);
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`ERROR in ${this.name}: Contrast value must be a number from 0-63!`);
            }
            return firmwareData;
        }
    }
    ,
  class Mod_FontBigDigits extends FirmwareMod {
        constructor() {
            super("Modified font (large numbers)", "Changes the font to one of the selected ones: ", 0);
            this.selectVCR = addRadioButton(this.modSpecificDiv, "VCR Font, replace the smaller bold digits with bigger thinner fonts.", "selectVCRBigDigits", "selectFontBigDigits");
            this.selectFuturistic = addRadioButton(this.modSpecificDiv, "Futuristic Font (by DO7OO), replaces bold and small digits in a futuristic look.", "selectFuturisticBigDigits", "selectFontBigDigits");
            this.selectTerminus = addRadioButton(this.modSpecificDiv, "Terminus font by @mbg, large modern fonts.", "selectTerminusBigDigits", "selectFontBigDigits");
            this.selectTerminus.checked = true;
        }
        apply(firmwareData) {
            const offsetBigDigits = 0xd502;

            if (this.selectVCR.checked) {
//                const bigDigits = hexString("0000F8FC0686C6E6F676FCF80000001F3F7767636160703F1F0000000000181CFEFE00000000000000000060607F7F60600000000000181C8686868686C6FC780000007E7F6361616161616060000000181C0606868686C6FC7800000018387060616161733F1E00000080C0E070381CFEFE00000000000707060606067F7F06060000007E7E6666666666E6C68600000018387060606060703F1F000000F8FC8686868686861C180000001F3F7161616161733F1E000000060606060686C6E67E3E000000000000007F7F0100000000000078FCC686868686C6FC780000001E3F7361616161733F1E00000078FCC68686868686FCF800000018387161616161713F1F000000008080808080808080000000000001010101010101010000");
                const bigDigits = hexString("0000F8FC0E0686C6E66EFCF80000001F3F7667636160703F1F0000000000181CFEFE00000000000000000060607F7F60600000000000181C8E86868686CEFC780000007E7F6361616161616060000000181C0E06868686CEFC7800000018387060616161733F1E00000080C0E070381CFEFE00000000000707060606067F7F06060000007E7E6666666666E6C68600000018387060606060703F1F000000F8FC8E868686868E1C180000001F3F7161616161733F1E000000060606060686C6E67E3E000000000000007F7F0100000000000078FCCE86868686CEFC780000001E3F7361616161733F1E00000078FCCE868686868EFCF800000018387161616161713F1F000000008080808080808080000000000001010101010101010000");
                firmwareData = replaceSection(firmwareData, bigDigits, offsetBigDigits);
            }
            else if (this.selectFuturistic.checked) {
                const bigDigits = hexString("00FEFF01010101018181FFFF00007F7F40404040407F7F7F7F000000000000008080FFFF0000000000000000007F7F7F7F00000000018181818181818181FFFE00007F7F7F7F404040404040400000818181818181818181FFFE0000404040404040407F7F7F7F00007FFF80808080808080FFFF0000000000000000007F7F7F7F0000FEFF8181818181818181810000404040404040407F7F7F7F0000FEFF81818181818181818100007F7F7F7F40404040407F7F0000010101010101018181FFFE0000000000000000007F7F7F7F0000FEFF81818181818181FFFF00007F7F40404040407F7F7F7F0000FEFF81818181818181FFFF0000000000000000007F7F7F7F000000808080808080808080000000000303030303030303030000");
                firmwareData = replaceSection(firmwareData, bigDigits, offsetBigDigits);
            }
            else if (this.selectTerminus.checked) {
                const bigDigits = hexString("0000FCFEFE0686C6E6FEFEFC0000003F7F7F676361607F7F3F0000000000181CFEFEFE000000000000000060607F7F7F6060000000001C1E1E06060686FEFE7C0000006070787C6E67636160600000000C0E0E86868686FEFE7C000000307070616161617F7F3E00000080C0E070381C0EFEFEFE0000000F0F0F0C0C0C0C7F7F7F000000FEFEFEC6C6C6C6C6C686000000307070606060607F7F3F000000F8FCFEC6C6C6C6C6C6800000003F7F7F606060607F7F3F0000000E0E0E060686E6FE7E1E000000000000007C7F7F0300000000007CFEFE86868686FEFE7C0000003F7F7F616161617F7F3F000000FCFEFE06060606FEFEFC000000016363636363637F3F1F000000008080808080808080000000000001010101010101010000");
                firmwareData = replaceSection(firmwareData, bigDigits, offsetBigDigits);
            }
            log(`Success: ${this.name} applied.`);
            return firmwareData;
        }
    }
    ,  
    class Mod_FontSmallDigits extends FirmwareMod {
        constructor() {
            super("Modified font (small numbers)", "Changes the font to one of the selected ones: ", 0);
            this.selectFuturistic = addRadioButton(this.modSpecificDiv, "Futuristic font (by DO7OO)", "selectFuturisticSmallDigits", "selectFontSmallDigits");
            this.selectTerminus = addRadioButton(this.modSpecificDiv, "Terminus font by @mbg", "selectTerminusSmallDigits", "selectFontSmallDigits");
            this.selectTerminus.checked = true;
        }
        apply(firmwareData) {
            const offsetSmallDigits = 0xd620;
            if (this.selectFuturistic.checked) {
                const smallDigits = hexString("007E414141797F00000000787F000079794949494E0049494949797E0007080808787F004E4949497979007E79494949790001010101797E007E494949797F000E090909797F0008080808080000000000000000");
                firmwareData = replaceSection(firmwareData, smallDigits, offsetSmallDigits);
            }
            else if (this.selectTerminus.checked) {
                const smallDigits = hexString("00003E5149453E000000427F400000004661514946000022414949360000181412117F0000274545453900003E45454538000001016119070000364949493600000E5151513E0008080808080000000000000000");
                firmwareData = replaceSection(firmwareData, smallDigits, offsetSmallDigits);
            }
            log(`Success: ${this.name} applied.`);
            return firmwareData;
        }
    }
    ,
class Mod_FontLetters extends FirmwareMod {
        constructor() {
            super("Modified font (letters)", "Changes the font to one of the selected ones: ", 0);
            this.selectTunas1337 = addRadioButton(this.modSpecificDiv, "Font by Tunas1337", "selectTunas1337Letters", "selectFontLetters");
            this.selectTerminus = addRadioButton(this.modSpecificDiv, "Terminus font by @mbg", "selectTerminusLetters", "selectFontLetters");
            this.selectTerminus.checked = true;
        }
        apply(firmwareData) {
            const offsetLetters = 0xd66d;
            if (this.selectTunas1337.checked) {
                const letters = hexString("00000000000000000000000000000000000000FCFC0000000000000D0D00000000007C00007C0C0000000000000000000020E03820F8200000010F0109070100000070C88E88100000040C08380907007088887800C0B00000040200070808000080FCC43C000000000708090B0607000000063E000000000000000000000000000000E0100C0000000000071820000000000418F0000000000060300F00000000404080F0404000000002010003000000808080F0808000000000000700000000000000000000000000004C3C0800000080808080808000000000000000000000000000000000000000000C0C00000000000000C03804000000380601000000E018C8C808F0000007081111180F0000001008F8000000001010101F10100000001008080818F00000101814121110000010080808D830000008101111120E000000C0E010F8000000060504041F04000000F8C8C8C808000008101010180F0000E010C8C8C808000007091010100F0000080808C8E818000000001C070000000000F8080808F000000E111111110E0000F018080818F0000001131212190F0000000060600000000000000C0C00000000000060600000000000004C3C0800000000C020201008000000000101020400002020202020200000010101010101000008103020C0C000000402020100000000000C84C42C18000000000D0C000000E01008888890E0000F1023242422070000C03818E00000001C030202030F1000F8F88888887000001F1F1010100F0600E030080808180000070C101010180800F80808081870C0001F101010180E030000F8888888880000001F10101010000000F8888888880800001F000000000000E03008080818000007081010111F0000F880808080F800001F000000001F000000000808F8080000000010101F1000000008080808F8000008181010180F0000F8F880C0301800001F1F0101030C100000F8000000000000001F101010101000F8788000E0F800001F000303001F0000F818E08000F800001F0000030C1F0000E01808081870C00007181010180E0300F8F8080808F060001F1F010101000000E01808081870C00007181030504E4300F8F8080808F000001F1F01030718000020F888880810000008181011110F0400080808F8080808000000001F00000000F800000000F8000007181010180F000038E000008078080000031E1807000000F80080C00000F8001F1807011E1F01000830C08070180000100C0301061800000018608000C03800000000011F000000080808C868180000181C1311101010000000F8080808000000007F40404000000038C000000000000000010638400000080808F8000000004040407F0000000000807030C00000000001000000010000000000000000000040404040404040000000081000000000000000000000000000404040408000000C121212121F0000F8804040408000001F081010100F02000080404040400000070810101010000080C0404080F800000F181010081F000000804040408000000F0A1212121302004040E0F84848000000001F1F0000000000C04040C04040006997949492D16000F880404040C000001F000000001F0000004040D8D80000000000001F1F0000000000404040D8D8000000808080FF3F00F8F80000804000001F1F020304181000000008F8000000000000001F10100000C0404080404080001F00001F00001F0000C080404040C000001F000000001F0080C04040408000000F181010100F0200C080404040800000FF081010100F020080C0404040C000000F18101008FF000000C0804040400000001F01000000000080C040404000000008111212120C00004040F0404040000000000F1010101000C000000000C000000F181010081F0000C000000000C0000000031C18060100C0800000800000C0001F1807031C1C030040C0000080400000100807070D100000C000000000C0400080834C300E01000040404040C0C000001018161311100000000000F8080800000002037D40400000000000FC00000000000000FF00000000080808F8000000004040407F0000000000808000008000000100000101010000");
                firmwareData = replaceSection(firmwareData, letters, offsetLetters);
            }
            else if (this.selectTerminus.checked) {
                const letters = hexString("00000000000000000000000000000000000000F8F80000000000001B1B000000001E3E00003E1E00000000000000000040F0F040F0F04000041F1F041F1F0400E0F0101C1C30200008191171711F0E006060000080C06000180C06030118180000B0F8C878B080000F1F10110F1F100000203E1E0000000000000000000000000000E0F0180800000000070F1810000000000818F0E00000000010180F070000000040C080C040000001050703070501000000C0C0000000000101070701010000000000000000000000203C1C00000000000000000000000101010101010100000000000000000000000018180000000000000080C06000180C060301000000F0F80888C8F8F0000F1F1311101F0F00002030F8F80000000010101F1F1010003038080888F87000181C1613111010003038888888F870000C1C1010101F0F000080C06030F8F80003030202021F1F00F8F888888888080008181010101F0F00E0F09888888800000F1F1010101F0F0008080808C8F8380000001C1F0300000070F8888888F870000F1F1010101F0F00F0F8080808F8F00000111111190F070000000060600000000000000C0C00000000000060600000000000101C0C000000000080C060301000000103060C1810008080808080808000040404040404040000103060C08000000010180C060301007078080888F870000000001B1B000000E0F0109090F0E0000F1F101717170300F0F8080808F8F0001F1F0101011F1F00F8F8888888F870001F1F1010101F0F00F0F80808083830000F1F1010101C0C00F8F8080818F0E0001F1F1010180F0700F8F88888880808001F1F101010101000F8F88888880808001F1F000000000000F0F80808083830000F1F1011111F0F00F8F8808080F8F8001F1F0000001F1F00000008F8F80800000000101F1F10000000000008F8F808000C1C10101F0F0000F8F8C060301808001F1F03060C181000F8F80000000000001F1F101010101000F8F830E030F8F8001F1F0000001F1F00F8F8C08000F8F8001F1F0001031F1F00F0F8080808F8F0000F1F1010101F0F00F8F8080808F8F0001F1F010101010000F0F8080808F8F0000F1F1018183F2F00F8F8080808F8F0001F1F03070D19100070F88888889810000C1C1010101F0F00000808F8F80808000000001F1F000000F8F8000000F8F8000F1F1010101F0F00F8F8000000F8F80000071F181F070000F8F8000000F8F8001F1F0C070C1F1F001878E080E0781800181E0701071E18000078F88080F878000000001F1F00000008080888C87838001C1E1311101010000000F8F80808000000001F1F1010000070E0C0800000000000000103070E1C0000000808F8F80000000010101F1F000010180C060C1810000000000000000000000000000000000040404040404040400000060E0800000000000000000000000040404040C080000E1F1111111F1F00F8F8404040C080001F1F1010101F0F0080C0404040C080000F1F10101018080080C0404040F8F8000F1F1010101F1F0080C0404040C080000F1F1212121303004040F0F84848080000001F1F0000000080C0404040C0C0000F9F909090FF7F00F8F8404040C080001F1F0000001F1F00000040D8D80000000000101F1F1000000000000040D8D8000060E08080FF7F00F8F8000080C040001F1F02070D181000000008F8F80000000000101F1F100000C0C040C040C080001F1F001F001F1F00C0C0404040C080001F1F0000001F1F0080C0404040C080000F1F1010101F0F00C0C0404040C08000FFFF1010101F0F0080C0404040C0C0000F1F101010FFFF00C0C0C040404040001F1F00000000000080C040404040400011131212121E0C004040F8F84040000000000F1F10101000C0C0000000C0C0000F1F1010101F1F00C0C0000000C0C00001071E181E070100C0C0000000C0C0000F1F101F101F0F00C0C0000000C0C000181D0702071D1800C0C0000000C0C0000F9F909090FF7F0040404040C0C04000181C161311101000000080F0780808000000000F1F10100000000078780000000000001F1F00000000080878F08000000010101F0F00000010180818101808000000000000000000");
                firmwareData = replaceSection(firmwareData, letters, offsetLetters);
            }
            log(`Success: ${this.name} applied.`);
            return firmwareData;
        }
    }
    ,             
    class Mod_FreqCopyTimeout extends FirmwareMod {
        constructor() {
            super("Disable Freq Copy Timeout", "Prevents freq copy and CTCSS decoder from timeout with \"SCAN FAIL\", allowing both functions to run indefinitely until a signal is found.", 0);
        }
        apply(firmwareData) {
            const offset = 0x4bbc;
            const oldData = hexString("521c");
            const newData = hexString("00bf");
            if (compareSection(firmwareData, oldData, offset)) {
                firmwareData = replaceSection(firmwareData, newData, offset);
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`ERROR in ${this.name}: Unexpected data, already patched or wrong firmware?`);
            }
            return firmwareData;
        }
    }
    ,
     class Mod_AirCopy extends FirmwareMod {
        constructor() {
            super("AIR COPY", "Change the AIR COPY Freq to transfer/receive wireless the radio settings with stored memory channels from one radio to another over the air. The default is 410,025 MHz. Enter this feature by press F2 [Flashlight] + PTT together while switching power on.", 0);
            this.inputFreq1 = addInputField(this.modSpecificDiv, "Frequency Air Copy (Hz)", "433600000");
        }
        apply(firmwareData) {
            const offset = 0x5568;
            const freq = Math.trunc(parseInt(this.inputFreq1.value) * 0.1);
            if (freq <= 0x04a67102 ) {
                // Create an 8-byte buffer with the specified values
                const buffer = new ArrayBuffer(4);
                const dataView = new DataView(buffer);                
                dataView.setUint32(0, freq, true);
                // Convert the buffer to a Uint8Array
                const freqHex = new Uint8Array(buffer);
                // Replace the 8-byte section at the offset with the new buffer
                firmwareData = replaceSection(firmwareData, freqHex, offset);
                //firmwareData = replaceSection(firmwareData, hexString("96"), 0xae9a);
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`ERROR in ${this.name}: Unexpected data, already patched or wrong firmware?`);
            }
            return firmwareData;
        }
    }
    ,    
    class Mod_CustomFm_radio extends FirmwareMod {
        constructor() {
            super("FM Radio Band:", "Change the FM Radio Frequenzy Range. FM Default range is 76-108MHz", "0");
            this.select6476mhz = addRadioButton(this.modSpecificDiv, "FM Radio 64 - 76 MHz", "select6476mhz", "selectFm_radio");
            this.select87108mhz = addRadioButton(this.modSpecificDiv, "FM Radio 86.4 - 108 MHz", "select87108mhz", "selectFm_radio");
            this.select88108mhz = addRadioButton(this.modSpecificDiv, "FM Radio 88 - 108 MHz", "select88108mhz", "selectFm_radio");
            this.select87108mhz.checked = true;
        }
        apply(firmwareData) {
            if (this.select6476mhz.checked) {
                const Reg05 = hexString("df0a0000");
                const MOVSR0 = hexString("5020c000");
                const MOVSR1 = hexString("5f21");
                firmwareData = replaceSection(firmwareData, MOVSR0, 0xa2f4);
                firmwareData = replaceSection(firmwareData, Reg05, 0xa274);
                firmwareData = replaceSection(firmwareData, MOVSR0, 0x6452);
                firmwareData = replaceSection(firmwareData, MOVSR1, 0x6456);
                log(`Sucesso: ${this.name} aplicado.`);
             }
            if (this.select87108mhz.checked) {
                const Reg05 = hexString("5f0a0000");
                const MOVSR0 = hexString("6c20c000");
                firmwareData = replaceSection(firmwareData, Reg05, 0xa274);
                firmwareData = replaceSection(firmwareData, MOVSR0, 0x6452);
                log(`Sucesso: ${this.name} aplicado.`);
             }
            else if (this.select88108mhz.checked) {
                const Reg05 = hexString("5f0a0000");
                const MOVSR0 = hexString("6e20c000");
                firmwareData = replaceSection(firmwareData, Reg05, 0xa274);
                firmwareData = replaceSection(firmwareData, MOVSR0, 0x6452);
                log(`Sucesso: ${this.name} aplicado.`);
            }
         return firmwareData;
        }
    }
    ,    
    class Mod_BacklightDuration extends FirmwareMod {
        constructor() {
            super("Backlight Duration", "Sets a multiplier for the backlight duration.", 0);
            this.select1 = addRadioButton(this.modSpecificDiv, "1x - up to 5s backlight (default value)", "select1", "selectBacklightDuration");
            this.select2 = addRadioButton(this.modSpecificDiv, "2x - up to 10s backlight", "select2", "selectBacklightDuration");
            this.select4 = addRadioButton(this.modSpecificDiv, "4x - up to 20s backlight", "select4", "selectBacklightDuration");
            this.select8 = addRadioButton(this.modSpecificDiv, "8x - up to 40s backlight", "select8", "selectBacklightDuration");
            this.select2.checked = true;
        }
        apply(firmwareData) {
            const offset = 0x5976;
            const buffer = new ArrayBuffer(4);
            const dataView = new DataView(buffer);
            if (this.select1.checked) {
                dataView.setUint32(0, 64, true);
            }
            else if (this.select2.checked) {
                dataView.setUint32(0, 128, true);
            }
            else if (this.select4.checked) {
                dataView.setUint32(0, 192, true);
            }
            else if (this.select8.checked) {
                dataView.setUint32(0, 256, true);
            }
            const newData = new Uint8Array(buffer);
            firmwareData = replaceSection(firmwareData, newData, offset);
            log(`Success: ${this.name} applied.`);
            return firmwareData;
        }
    }
    ,
  /*  class Mod_ABR extends FirmwareMod {//just testing...
        constructor() {
            super("ABR Backlight Time-Out Duration", "Multiplies the LCD Backlight time ABR Menu settings by value (exept off) 1/2/3/4/5 seconds x 2 or x 4. A value of 5 is 10 seconds or 20 seconds: ", 0);

            this.selectDouble = addRadioButton(this.modSpecificDiv, "Doubles the Backlight Time-On duration ABR settings 1 - 5 sec. x2.", "selectDouble", "selectABR");
            this.selectQuadro = addRadioButton(this.modSpecificDiv, "Quadrubles the Backlight Time-On duration ABR settings 1 - 5 sec. x4.", "selectQuadro", "selectABR");
            this.selectDouble.checked = true;
        }
        apply(firmwareData) {
            if (this.selectDouble.checked) {
                const twiceABR = hexString("80");
                firmwareData = replaceSection(firmwareData, twiceABR, 0x5976);
            }
            else if (this.selectQuadro.checked) {
               // const twiceABR = hexString("80");
                const quadABR = hexString("c0");
              //  firmwareData = replaceSection(firmwareData, twiceABR, 0x5976);
                firmwareData = replaceSection(firmwareData, quadABR, 0x5976);
            }
            log(`Success: ${this.name} applied.`);
            return firmwareData;
        }
    }
    ,
    class Mod_BacklightDuration extends FirmwareMod {
        constructor() {
            super("ABR Backlight Time-Out Duration (Experimental)", "Multiplies the LCD Backlight time ABR Menu settings by value (exept off) 1/2/3/4/5 seconds x 2 or x 4. A value of 5 is 10 seconds or 20 seconds: ", 0);

           // this.select1 = addRadioButton(this.modSpecificDiv, "1x - up to 5s backlight (default value)", "select1", "selectBacklightDuration");
            this.select2 = addRadioButton(this.modSpecificDiv, "2x - up to 10s LCD backlight", "select2", "selectBacklightDuration");
            this.select4 = addRadioButton(this.modSpecificDiv, "4x - up to 20s LCD backlight", "select4", "selectBacklightDuration");
            this.select8 = addRadioButton(this.modSpecificDiv, "8x - up to 40s LCD backlight", "select8", "selectBacklightDuration");
         //   this.select40 = addRadioButton(this.modSpecificDiv, "10x - up to 60s LCD backlight", "select10", "selectBacklightDuration"); //joking martz
            
            this.select2.checked = true;
        }
        apply(firmwareData) {
            const offset = 0x5976;
            const buffer = new ArrayBuffer(4);
            const dataView = new DataView(buffer);
           // if (this.select1.checked) {
           //     dataView.setUint32(0, 64, true);//is 1x default but hey rather enhance the max possible selectable valie in menu from 5 to 10 as in piotr and annemonic mods, combined with freq steps patch!!!
            }
            if (this.select2.checked) {
                dataView.setUint32(0, 128, true);
            }
            else if (this.select4.checked) {
                dataView.setUint32(0, 192, true);
            }
            else if (this.select8.checked) {
                dataView.setUint32(0, 256, true);
            }
           // else if (this.select10.checked) {
           //     dataView.setUint32(0, 256, true);    //kidding Martz
              //  const triABR = hexString("a0");//a0 = 40 segundos
               // firmwareData = replaceSection(firmwareData, triABR, 0x5976);
           // }

            const newData = new Uint8Array(buffer);
            firmwareData = replaceSection(firmwareData, newData, offset);
            log(`Success: ${this.name} applied.`);
            return firmwareData;
        }
    }
    , */   
    class Mod_SkipBootscreen extends FirmwareMod {
        constructor() {
            super("Fast Power-ON", "Skips the bootscreen and goes instantly to the LCD main screen by power on.", 0);
        }

        apply(firmwareData) {
            const offset = 0xd1e6;
            const oldData = hexString("fcf7a9fc");
            const newData = hexString("00bf00bff8f7b9fb00f002f8");
            if (compareSection(firmwareData, oldData, offset)) {
                firmwareData = replaceSection(firmwareData, newData, offset);
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`ERROR in ${this.name}: Unexpected data, already patched or wrong firmware?`);
            }

            return firmwareData;
        }
    }
    ,
    class Mod_MenuStrings extends FirmwareMod {
        constructor() {
            super("Menu Names strings", "Changes text in the settings menu. The displayed JSON contains every string with offset, description and size. Only edit the \"string\". Do not insert more capital letters and characters as allowed by the fixed \"size\" value!", 0);
            const strings = [{ "offset": 56470, "description": "squelch", "size": 6, "string": "SQLCH" }, { "offset": 56477, "description": "step", "size": 6, "string": "STEP" }, { "offset": 56484, "description": "txpower", "size": 6, "string": "TXPWR" }, { "offset": 56491, "description": "r dcs", "size": 6, "string": "R_DCS" },
            { "offset": 56498, "description": "r ctcs", "size": 6, "string": "R_CTCS" }, { "offset": 56505, "description": "t dcs", "size": 6, "string": "T_DCS" }, { "offset": 56512, "description": "t ctcs", "size": 6, "string": "T_CTCS" }, { "offset": 56519, "description": "tx shift direction", "size": 6, "string": "SHFT-D" },
            { "offset": 56526, "description": "tx shift offset", "size": 6, "string": "OFFSET" }, { "offset": 56533, "description": "wide/narrow", "size": 6, "string": "BNDWDH" }, { "offset": 56540, "description": "scramble", "size": 6, "string": "SCRMBL" }, { "offset": 56547, "description": "busy channel ptt lock", "size": 6, "string": "BUSYLK" },
            { "offset": 56554, "description": "save channel", "size": 6, "string": "MEM-CH" }, { "offset": 56561, "description": "battery saver", "size": 6, "string": "BATSVR" }, { "offset": 56568, "description": "voice activated mode", "size": 6, "string": "VOXPTT" },
            { "offset": 56575, "description": "backlight timeout", "size": 6, "string": "BKLGHT" }, { "offset": 56582, "description": "dual watch", "size": 6, "string": "DUALRX" }, { "offset": 56589, "description": "cross band mode", "size": 6, "string": "CROSSB" }, { "offset": 56596, "description": "key beep", "size": 6, "string": "BEEP" },
            { "offset": 56603, "description": "tx timeout", "size": 6, "string": "TXTIME" }, { "offset": 56610, "description": "voice prompt", "size": 6, "string": "VOICE" }, { "offset": 56617, "description": "scan mode", "size": 6, "string": "SCANMD" }, { "offset": 56624, "description": "channel display mode", "size": 6, "string": "CHDISP" },
            { "offset": 56631, "description": "auto keypad lock", "size": 6, "string": "AUTOLK" }, { "offset": 56638, "description": "ch in scan list 1", "size": 6, "string": "S-ADD1" }, { "offset": 56645, "description": "ch in scan list 2", "size": 6, "string": "S-ADD2" }, { "offset": 56652, "description": "tail tone elimination", "size": 6, "string": "STE" },
            { "offset": 56659, "description": "repeater tail tone elimination", "size": 6, "string": "RP-STE" }, { "offset": 56666, "description": "mic sensitivity", "size": 6, "string": "MIC" }, { "offset": 56673, "description": "one key call channel", "size": 6, "string": "1-CALL" },
            { "offset": 56680, "description": "active scan list", "size": 6, "string": "S-LIST" }, { "offset": 56687, "description": "browse scan list 1", "size": 6, "string": "SLIST1" }, { "offset": 56694, "description": "browse scan list 2", "size": 6, "string": "SLIST2" }, { "offset": 56701, "description": "alarm mode", "size": 6, "string": "AL-MOD" },
            { "offset": 56708, "description": "dtmf radio id", "size": 6, "string": "ANI-ID" }, { "offset": 56715, "description": "dtmf upcode", "size": 6, "string": "UPCODE" }, { "offset": 56722, "description": "dtmf downcode", "size": 6, "string": "DWCODE" }, { "offset": 56729, "description": "dtmf using keypad while ptt", "size": 6, "string": "D-ST" },
            { "offset": 56736, "description": "dtmf response mode", "size": 6, "string": "D-RSP" }, { "offset": 56743, "description": "dtmf hold time", "size": 6, "string": "D-HOLD" }, { "offset": 56750, "description": "dtmf pre-load time", "size": 6, "string": "D-PRE" },
            { "offset": 56757, "description": "dtmf transmit id on ptt", "size": 6, "string": "PTT-ID" }, { "offset": 56764, "description": "dtmf only listen to contacts", "size": 6, "string": "D-DCD" }, { "offset": 56771, "description": "dtmf list/call contacts", "size": 6, "string": "D-LIST" },
            { "offset": 56778, "description": "power on screen", "size": 6, "string": "PONMSG" }, { "offset": 56785, "description": "end of talk tone", "size": 6, "string": "ROGER" }, { "offset": 56792, "description": "battery voltage", "size": 6, "string": "VOLT" }, { "offset": 56799, "description": "enable AM reception on AM bands", "size": 6, "string": "AM" },
            { "offset": 56806, "description": "enable NOAA scan", "size": 6, "string": "NOAA_S" }, { "offset": 56813, "description": "delete channel", "size": 6, "string": "DEL-CH" }, { "offset": 56820, "description": "reset radio", "size": 6, "string": "RESET" }, { "offset": 56827, "description": "enable tx on 350mhz band", "size": 6, "string": "350TX" },
            { "offset": 56834, "description": "limit to local ham frequencies", "size": 6, "string": "F-LOCK" }, { "offset": 56841, "description": "enable tx on 200mhz band", "size": 6, "string": "200TX" }, { "offset": 56848, "description": "enable tx on 500mhz band", "size": 6, "string": "500TX" },
            { "offset": 56855, "description": "enable 350mhz band", "size": 6, "string": "350EN" }, { "offset": 56862, "description": "enable scrambler option", "size": 6, "string": "SCRAMB" }, { "offset": 56869, "description": "battery saver: off", "size": 3, "string": "OFF" }, { "offset": 56873, "description": "battery saver: 1:1", "size": 3, "string": "1:1" },
            { "offset": 56877, "description": "battery saver: 1:2", "size": 3, "string": "1:2" }, { "offset": 56881, "description": "battery saver: 1:3", "size": 3, "string": "1:3" }, { "offset": 56885, "description": "battery saver: 1:4", "size": 3, "string": "1:4" }, { "offset": 56889, "description": "tx power: low", "size": 4, "string": "LOW" },
            { "offset": 56894, "description": "tx power: mid", "size": 4, "string": "MID" }, { "offset": 56899, "description": "tx power: high", "size": 4, "string": "HIGH" }, { "offset": 56904, "description": "bandwidth: wide", "size": 6, "string": "WIDE" }, { "offset": 56911, "description": "bandwidth: narrow", "size": 6, "string": "NARROW" },
            { "offset": 56918, "description": "multiple options 1: off", "size": 6, "string": "OFF" }, { "offset": 56925, "description": "multiple options 1: chan a", "size": 6, "string": "CHAN_A" }, { "offset": 56932, "description": "multiple options 1: chan b", "size": 6, "string": "CHAN_B" },
            { "offset": 56939, "description": "multiple options 2: off", "size": 3, "string": "OFF" }, { "offset": 56943, "description": "multiple options 2: on", "size": 3, "string": "ON" }, { "offset": 56947, "description": "voice prompt: off", "size": 3, "string": "OFF" }, { "offset": 56951, "description": "voice prompt: chinese", "size": 3, "string": "CHN" },
            { "offset": 56955, "description": "voice prompt: english", "size": 3, "string": "ENG" }, { "offset": 56959, "description": "dtmf ptt id: off", "size": 4, "string": "OFF" }, { "offset": 56964, "description": "dtmf ptt id: upcode on ptt", "size": 4, "string": "BOT" },
            { "offset": 56969, "description": "dtmf ptt id: downcode after ptt", "size": 4, "string": "EOT" }, { "offset": 56974, "description": "dtmf ptt id: both", "size": 4, "string": "BOTH" }, { "offset": 56979, "description": "scan mode: continue after 5s", "size": 2, "string": "TO" },
            { "offset": 56982, "description": "scan mode: stay while signal", "size": 2, "string": "CO" }, { "offset": 56985, "description": "scan mode: stop on signal", "size": 2, "string": "SE" }, { "offset": 56988, "description": "channel display mode: freq", "size": 4, "string": "FREQ" },
            { "offset": 56993, "description": "channel display mode: chan", "size": 4, "string": "CHAN" }, { "offset": 56998, "description": "channel display mode: name", "size": 4, "string": "NAME" }, { "offset": 57003, "description": "tx shift direction: off", "size": 4, "string": "OFF" },
            { "offset": 57007, "description": "tx shift direction: +", "size": 4, "string": "+" }, { "offset": 57011, "description": "tx shift direction: -", "size": 4, "string": "-" }, { "offset": 57015, "description": "alarm mode: local", "size": 4, "string": "SITE" }, { "offset": 57020, "description": "alarm mode: local + remote", "size": 4, "string": "TONE" },
            { "offset": 57025, "description": "power on screen: full", "size": 4, "string": "FULL" }, { "offset": 57030, "description": "power on screen: custom message", "size": 4, "string": "MSG" }, { "offset": 57035, "description": "power on screen: batt voltage", "size": 4, "string": "VOLT" },
            { "offset": 57040, "description": "reset: keep channel parameters", "size": 3, "string": "VFO" }, { "offset": 57044, "description": "reset: reset everything", "size": 3, "string": "ALL" }, { "offset": 57048, "description": "dtmf response: nothing", "size": 5, "string": "NULL" },
            { "offset": 57054, "description": "dtmf response: local ring", "size": 5, "string": "RING" }, { "offset": 57060, "description": "dtmf response: auto call back", "size": 5, "string": "REPLY" }, { "offset": 57066, "description": "dtmf response: ring and call", "size": 5, "string": "BOTH" },
            { "offset": 57072, "description": "end of talk tone: off", "size": 5, "string": "OFF" }, { "offset": 57078, "description": "end of talk tone: classic beep", "size": 5, "string": "ROGER" }, { "offset": 57084, "description": "end of talk tone: MDC ID sound", "size": 5, "string": "MDC" },
            { "offset": 57090, "description": "f lock: none", "size": 3, "string": "OFF" }, { "offset": 57094, "description": "f lock: region FCC", "size": 3, "string": "FCC" }, { "offset": 57098, "description": "f lock: region Europe", "size": 3, "string": "CE" }, { "offset": 57102, "description": "f lock: region GB", "size": 3, "string": "GB" },
            { "offset": 57106, "description": "f lock: 430 band", "size": 3, "string": "430" }, { "offset": 57110, "description": "f lock: 438 band", "size": 3, "string": "438" }];
            this.menuStringsTextarea = document.createElement("textarea");
            this.menuStringsTextarea.classList.add("w-100", "form-control");
            this.menuStringsTextarea.placeholder = "There should be JSON here, reload the page to get it back!";
            this.menuStringsTextarea.value = JSON.stringify(strings, null, 2);
            this.modSpecificDiv.appendChild(this.menuStringsTextarea);
        }
        apply(firmwareData) {
            const jsonData = JSON.parse(this.menuStringsTextarea.value);
            const encoder = new TextEncoder();
            jsonData.forEach(({ offset, size, string }) => {
                const encodedString = encoder.encode(string);
                const padding = new Uint8Array(size - encodedString.length);
                const paddedString = new Uint8Array(encodedString.length + padding.length);
                paddedString.set(encodedString);
                paddedString.set(padding, encodedString.length);
                firmwareData = replaceSection(firmwareData, paddedString, offset);
            });
            log(`Success: ${this.name} applied.`);
            return firmwareData;
        }
    }
    ,
    class Mod_MicGain extends FirmwareMod {
        constructor() {
            super("Increase Mic sensitivity Gain", "makes the microphone more sensitive. You can hold it more far away to speak but background sound will be also louder. It does not gain the maximum mic volume. You can still fine tune the mic gain in the menu but it will always increase the sensitivity as without this mod.", 0);
        }
        apply(firmwareData) {
            const offset = 0xa8e4;
            const offset2 = 0x1c94;
            const oldData = hexString("40e90000");
            const newData = hexString("4fe90000");
            if (compareSection(firmwareData, oldData, offset) && compareSection(firmwareData, oldData, offset2)) {
                firmwareData = replaceSection(firmwareData, newData, offset);
                firmwareData = replaceSection(firmwareData, newData, offset2);
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`ERROR in ${this.name}: Unexpected data, already patched or wrong firmware?`);
            }
            return firmwareData;
        }
    }
    ,
    class Mod_NegativeDisplay extends FirmwareMod {
        constructor() {
            super("Negative Display", "Inverts the LCD display apperiance. White fonts on black bachground.", 0);
        }
        apply(firmwareData) {
            const offset = 0xb798;
            const oldData = hexString("a6");
            const newData = hexString("a7");
            if (compareSection(firmwareData, oldData, offset)) {
                firmwareData = replaceSection(firmwareData, newData, offset);
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`ERROR in ${this.name}: Unexpected data, already patched or wrong firmware?`);
            }
            return firmwareData;
        }
    }
    ,
    class Mod_RogerBeep extends FirmwareMod {
        constructor() {
            super("Roger Beep", "Changes the sound of the two Roger Beep tones. Tone 1 plays for 150ms and tone 2 for 80ms. The defaults in this mod are similar to the Mototrbo beep. The maximum is 6347 Hz. To open NOAA Ton-Squelch set 1050 Hz as Ton 1", 0);
            this.inputTone1 = addInputField(this.modSpecificDiv, "Tone 1 frequency (Hz)", "1540");
            this.inputTone2 = addInputField(this.modSpecificDiv, "Tone 2 frequency (Hz)", "1310");
        }
        apply(firmwareData) {
            const offset = 0xaed0;
            const tone1 = Math.trunc(parseInt(this.inputTone1.value) * 10.32444);
            const tone2 = Math.trunc(parseInt(this.inputTone2.value) * 10.32444);
            if (tone1 <= 0xFFFF && tone2 <= 0xFFFF) {
                // Create an 8-byte buffer with the specified values
                const buffer = new ArrayBuffer(8);
                const dataView = new DataView(buffer);
                // Set tone1 and tone2 at their respective offsets
                dataView.setUint32(0, tone1, true); // true indicates little-endian byte order
                dataView.setUint32(4, tone2, true);
                // Convert the buffer to a Uint8Array
                const tonesHex = new Uint8Array(buffer);
                // Replace the 8-byte section at the offset with the new buffer
                firmwareData = replaceSection(firmwareData, tonesHex, offset);
                firmwareData = replaceSection(firmwareData, hexString("96"), 0xae9a);
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`ERROR in ${this.name}: Unexpected data, already patched or wrong firmware?`);
            }

            return firmwareData;
        }
    }
    ,
    class Mod_APP extends FirmwareMod {
        constructor() {
            super("Apps", "Adds applications to the firmware. Some apps are started with the flashlight button. Due to very limited space available, you can only select one app:", "up to 2770");
            this.selectSbar = addRadioButton(this.modSpecificDiv, "RSSI, S-Meter and battery voltage readout on the main screen. By @piotr022, v78.", "selectSbar", "selectApp");
            this.selectGraph = addRadioButton(this.modSpecificDiv, "RSSI and RSSI Graph on the main screen. By @piotr022, v78.", "selectGraph", "selectApp");
            this.selectSpectr = addRadioButton(this.modSpecificDiv, "Spectrum analyzer. Starts with the flashlight button. Up / down (hold) - change the center frequency, 8/2 - zoom in / out, 1/7 - increase / decrease resolution, PTT / EXIT - exit. After exiting, open the menu to refresh the screen. By @piotr022, v78.", "selectSpectr", "selectApp");
            this.selectSpectrM = addRadioButton(this.modSpecificDiv, "Advanced spectrum analyzer. Starts with the flashlight button. Before starting, either turn off the noise reduction (SQL to 0) or turn on the monitoring mode. Up / down - frequency change, 1/7 - sensitivity (measurement time), 2/8 - frequency step, 9/3 - zoom in / out, * / F (hold) - noise reduction level, 5 - backlight, 0 - ignore frequency, EXIT - exit. After exiting, open the menu to refresh the screen. By @fagci, v66.", "selectSpectrM", "selectApp");
            this.selectMessenger = addRadioButton(this.modSpecificDiv, "Text messenger (digital transmission). Starts with the flashlight button. Use the number keys in T9 style for typing a message, MENU - send, EXIT - clear message or exit if message is empty. To confirm a letter (if you need to reuse the same number key), press *. By @piotr022, v78.", "selectMessenger", "selectApp");
            this.selectPong = addRadioButton(this.modSpecificDiv, "Pong game (first ever mod app). Starts after boot. By @piotr022, v78.", "selectPong", "selectApp");
            this.selectSbar.checked = true;
        }
        apply(firmwareData) {
            const dataSbar = hexString("10B5064C2378002B07D1054B002B02D0044800E000BF0123237010BDB813002000000000C0000000044B10B5002B03D00349044800E000BF10BDC04600000000BC130020C000000000207047D308DB015918E0239B00994207D807231A40063B93404068425C134343547047406840187047002070470A00303A0300D0B2092805D900202D2901D15868463070470720424358688018F9E708207047072070470020704770477047837D0248002B00D10148704726ED000033ED000008B4024B9C46083808BC6047C9E500000A2903D10123827D534083757047000008B4024B9C46083808BC6047EDE50000E02210B500214068920000F07EFB10BD002310B50180074A494209B214780133DBB2A14201DB837010BD01320D2BF5D10133F8E778ED000010B5F1F745FD10BDF8B5C3680400591CC160C72959D932232F4DFF33EB5C0122FF3B58425841237C93430343100023742A4B1B689843C3002948285C042580002840034327480068400A8243AA401C201343227C00258243134323744B0709D123681868A84205D02100036808315B68984705006668002E1FD0E368DB071CD4237C1B0711D4FCF7F5FC227EC7B297420BD061694868FF2A18D1002804D03A00036808319B68984727762100336830001B68083198470543EDB2AB0701D5FCF799FFEB0701D5FCF7D1FFF8BD0028EBD003680831DB68E6E704070020001006401A0300000008064073B52F4C2378002B05D100F0B1FA00F0BFFA012323702B4B1B68DB074AD52A4C237C012B46D13F20FCF704F9C021030089010B408B4203D001433F20FCF7CAFB0C20FCF7F7F8C30734D502200021FCF7C1FB0220FCF7EEF8C3042BD504265F20FCF7E8F80190A068002809D0237B628A023B9A4204DA801801A9022200F0ACFA638A013E02339BB2F6B26382002EE6D1257BAB420ED30B202674FCF7CBF802002068002806D06368002B03D0D2062900D20F98470548FFF733FFFDF7D7FD73BD1C14002000100640F0130020D4130020F8B5040040680D0000281FD003685B68984707002068218903689B6898470600606829000368DB6898470200002E05D039003000002F0BD000F066FA606829000368DB68984723891B1823810020F8BD00F063FAF2E770B506000D0000242800F1F7B0FC844206DA295D30000134FFF7C7FFE4B2F3E770BDF0B50C00002187B017000190072204A81E00039100F045FA002C04DA2D210198FFF7B2FF6442194B0093002319000822D21A974219DC009A126A94460022A44503DC60460132241AF9E7302084469444654603A8C554002A02D0002900D11900009A0133043A0092E1E703AB002901D130221A70002E02D00921C91B891B01985918FFF7ACFF07B0F0BDC04688ED0000F0B50C0087B00DA909781600E3180CAA0500127805910193802B01DD802301936B461B790393B3180293382B01DD382302936B4637001B7A0493049B9F4210D228683A00036821005B689847039B2868591E03683A005B68C9B201379847FFB2EBE72700039B9F4210D228683900036832005B689847049B28685A1E036839005B68D2B201379847FFB2EBE7059B002B13D0019B0134E4B2013B9C420DDA771C029BFFB2013B9F42F3DA28683A00036821005B6898470137F2E707B0F0BD00001823F0B50A7A04000E0085B01A4268D10B681B68002B08D0824B01201A0066321278002A2FD005B0F0BDC3685A1CC2605B07F1D07C4B1A6801235209934343750C20FBF7ABFF7949830702D4637D002B01D000230B700B78754A0A2B05D8377A01203D00054007423DD01178002938D1012470481470802200F06BF9337A23422FD10220CFE75F331B780120002BCAD1694B1D88FA239B009D4200D9674D14220021674800F055F94D23664C02222900200023814C3BFFF7FBFE02226021624800F047F958230022290020002381563BFFF7EEFE05225D495D4800F031F90120A1E700209FE701330B701570A37D2900002B63D1637D002B59D06F20FBF74EFF7F2318402B001D2801D91E3803B20D20584380112382A07480220021454800F018F91023E65EC0234A4A5B001381002E03DD20211000FFF77FFE0323002231004448FFF7B5FE637D002B41D00F224249424800F0F5F81323414A1178013BC943DBB211700132002BF7D1A37C1C1C0D2B00D90D24E4B2AC4283D02B1C062D00D906230820002605211F22A842764169430133DBB2D21A403100932E480423D2B2C9B201960135FFF7CBFEEDB2E3E76720FBF7F4FE4008C1B2A03909B203A8FFF74BFD2000032203A9103000F0B9F8A3E703AE032230002349A77C00F0B1F8A37D002B0AD0204B3380AC231A4AFF33310010001381FFF74BFEB7E708221748092F07D91A4900F09CF83023273773703770EAE7174900F094F82023303737707370E2E7C0468406002000100640B5130020B41300208408002006040020E7030000D1060020A0130020D9060020AED40000EB0600208C13002062D40000A7080020A508002042ED0000353900009DD30000B5D30000104900230800104A083013605360137453820E4A28319160D360938293750C4910600C4A4A600C494A600C4A0C4953601160D360111D1374FF339160526113767047C046B8ED0000F0130020041400208C130020ACED0000A0130020D4130020B4ED0000044B054A0548834202D202CA02C3FAE77047C0468C1300200CEE0000B613002070B500260C4D0D4C641BA410A64209D1002600F08BF80A4D0A4C641BA410A64205D170BDB300EB5898470136EEE7B300EB5898470136F2E700EE000000EE000000EE000008EE0000002310B59A4200D110BDCC5CC4540133F8E703008218934200D1704719700133F9E7532D6D65747220202020353900532D6D65747220206E6F726D616C00202000000000000000000000000069E500006DE500008DE500000DE60000000000000000000093E5000097E50000B9E50000BDE500008D87817B756F69635D53493F35000000010000000A00000064000000E803000010270000A086010040420F008096980000E1F50568ED000020D60000041400200000000000000000C1E50000C5E90000C5E50000C7E50000C9E50000EDE50000F8FFFFFF00000000DDE50000FDE50000F8B5C046F8BC08BC9E467047F8B5C046F8BC08BC9E46704749E5000039EC000021E5000098130020000000000000000050ED000004070020AC130020000000000000000050ED00008406002001FF");
            const dataGraph = hexString("10B5064C2378002B07D1054B002B02D0044800E000BF0123237010BD9413002000000000C0000000044B10B5002B03D00349044800E000BF10BDC0460000000098130020C0000000002243088B4274D303098B425FD3030A8B4244D3030B8B4228D3030C8B420DD3FF22090212BA030C8B4202D31212090265D0030B8B4219D300E0090AC30B8B4201D3CB03C01A5241830B8B4201D38B03C01A5241430B8B4201D34B03C01A5241030B8B4201D30B03C01A5241C30A8B4201D3CB02C01A5241830A8B4201D38B02C01A5241430A8B4201D34B02C01A5241030A8B4201D30B02C01A5241CDD2C3098B4201D3CB01C01A524183098B4201D38B01C01A524143098B4201D34B01C01A524103098B4201D30B01C01A5241C3088B4201D3CB00C01A524183088B4201D38B00C01A524143088B4201D34B00C01A5241411A00D20146524110467047FFE701B5002000F006F802BDC0460029F7D076E770477047C04600207047D308DB015918E0239B00994207D807231A40063B93404068425C134343547047406840187047002070470A00303A0300D0B2092805D900202D2901D15868463070470720424358688018F9E70820704707207047E02210B500214068920000F060F910BD10B5F1F7F3FC10BDF8B5040040680D0000281FD003685B68984707002068218903689B6898470600606829000368DB6898470200002E05D039003000002F0BD000F034F9606829000368DB68984723891B1823810020F8BD00F031F9F2E70000F0B5594B8BB00393584B05AC0593584B002663606B469E84564B574D1B6803AF079708967D60DB0729D50C20FCF7F4F85249830700D50E700B78514A142B04D83220FF30285CFF281BD11478002C16D1012378681370813080222100FF3000F0FEF860222100474800F0F9F8464B1C703223FF33EB5CFF2B01D0FCF739FF0BB0F0BD01330B70002313706A468133FF3301AD93843D4905222800089400F0D6F86720FCF7B9F84008C0B20028E7D0A02826D920236030C4B22B7064212000FFF7AFFE30300A2168702000FFF7A9FE0A21C0B2FFF72BFF3031A97020000A21FFF725FF00263031E9702800F1F7C5FC86420CDAA95D07A80136FFF756FFF6B2F3E760246442241A2D23E4B2D5E71E4E3378203B5F2B01D92023337007235C431C4135781849201C4A19E4B2203A9C4200D9181CC0B21B1AFF201841C34313707B2D08D800232A0018001F3A8A18D0540133042BFBD178686022A130FF30013500F075F8357089E7C046C4E90000DCE9000020D6000000100640040700208C1300208D130020B013002010140020B6E9000010B50D4C2378002B05D100F023F800F031F801232370094B19684A1C1A60084B4B4308498B4203D8C82A01D9FFF720FFFDF746FD10BDC0461C14002090130020EFEEEEEE11111111014B5A1C5A60704714140020044B054A0548834202D202CA02C3FAE77047C0468C13002010EA00009413002070B500260C4D0D4C641BA410A64209D1002600F045F80A4D0A4C641BA410A64205D170BDB300EB5898470136EEE7B300EB5898470136F2E704EA000004EA000004EA00000CEA0000002310B59A4200D110BDCC5CC4540133F8E703008218934200D1704719700133F9E7673030300000000000000000000081E6000085E60000A5E60000D9E600000000000000000000ABE60000AFE60000D1E60000D5E60000F8B5C046F8BC08BC9E467047F8B5C046F8BC08BC9E46704749E5000021E9000021E50000FF01000001000000");
            const dataSpectr = hexString("10B5064C2378002B07D1054B002B02D0044800E000BF0123237010BD9013002000000000C0000000044B10B5002B03D00349044800E000BF10BDC0460000000094130020C000000007207047082070470A00303A0300D0B2092805D900202D2901D15868463070470720424358688018F9E700207047406840187047D308DB015918E0239B00994207D807231A40063B93404068425C13434354704700207047F8B5154C05006069002820D0036829005B68984707002069218B03689B6898470600606929000368DB6898470200002E05D039003000002F0BD000F02BFA606929000368DB689847238B1B1823830020F8BD00F017FAF2E7AC130020E02210B500214068920000F00DFA10BD7FB500210400072202A8019100F004FA002C03DA2D20FFF7BDFF644200231A00134D01A800212E6AA64202DCA41B0131FAE70E0030361E54002902D0002A00D11A000133043D072BECD1002A01D129330370002485182800F1F79CFD844205DA285D0134FFF796FFE4B2F4E77FBDC04668EA000010B50400010C3920FCF72AFCA1B23820FCF726FC00213020FCF722FC30200249FCF71EFC10BDC046F1BF0000F0B5974C0023250087B04C3502932B78002B05D100F07CF900F08AF901232B70904A0B990023914206D9531C0C9AFF339A429B415B42DBB28B490A68501C0860C82A3BD9002B39D10121884D2B680B4234D0082213420DD0200093432D3001702B60834B053A1A70FCF7C0FC23002B33187004E023002D331B78002BF4D12B68217F9B0604D523002B331B780D2B19D1230000222D331A7000290FD1E022012392007448237700F067F9FCF75FFF606AFFF790FF4720218DFCF7BCFBFDF706FE07B0F0BD23002D331B78002BE4D0002912D03920FCF7DEF805003820FCF7DAF82D0480B2054347206562FCF7D3F8002120854720FCF79EFB0022210022772B310878236A01380B2800D9A7E000F0C0F89A8CA6A6A6A69F92A6A60689636A564A9B1863620024E022250000215148920000F022F901941F23E7B21C4201D07F2F02D1FF224D4B1A552300454A106A4343DB090093002C0AD0517F0223002902D113002C331B78190021408B420FD14308506AC01A009BC018FFF72CFFC8208000FEF758FC6720FCF785F84008C5B2FA236B43DB11143B5BB21E1C302B00DD3026330600D50026392376B29E1B372E06DC2B4B39001869F2B203685B68984701363A2EF3D1019B264E9D4208D9336A726A5B08D31A009A02979B18039301950134802CA8D1264D07222900264800F0CCF80023706A3383FFF7B3FE306A3483FFF7AFFE562303983383FFF7AAFE0298194BFD3007222900C01800F0B6F8FCF7A6FE4CE7636A184A7BE701226277174A9B18236277E7012215496277994292410A409B1AF5E72C342378013323706AE72C342378002B00D165E7013BF6E7627761E7AC130020B9B000008C13002000100640B30300200407002010270000040800205FD3000052070020F0D8FFFF204E000002B4714649084900095C49008E4402BC7047C0460E4B0F481A0045329A640E4A18625A600D4A1800110044329A600C4A2C31DA6001229A839A851A00196000212A3008321B61198301705A617047C046AC130020A08601000407002068EA000020D6000010B5F1F787FB002010BDC04602488546FFF7F6FFFEE7000088130020044B054A0548834202D202CA02C3FAE77047C0468C130020E0EA00009013002070B500260C4D0D4C641BA410A64209D1002600F055F80A4D0A4C641BA410A64205D170BDB300EB5898470136EEE7B300EB5898470136F2E7D4EA0000D4EA0000D4EA0000DCEA000003008218934200D1704719700133F9E7002310B59A4200D110BDCC5CC4540133F8E70000010000000A00000064000000E803000010270000A086010040420F008096980000E1F5050000000000000000BDE500009DE5000097E500001DE60000000000000000000093E5000071E500006DE5000069E50000F8B5C046F8BC08BC9E467047F8B5C046F8BC08BC9E46704749E5000071E9000021E5000001000000");
            const dataSpectrM = hexString("88130020D5000000D9000000DB00000000000000000000000000000000000000000000000000000000000000DD0000000000000000000000DF00000099C30000E3000000E5000000E7000000E9000000EB000000ED000000EF000000F1000000F3000000F5000000F7000000F9000000FB000000FD000000FF00000001010000030100000501000007010000090100000B0100000D0100000F01000011010000130100001501000017010000190100001B0100001D0100001F0100002101000010B5064C2378002B07D1054B002B02D0044800E000BF0123237010BD8C13002000000000C0000000044B10B5002B03D00349044800E000BF10BDC0460000000090130020C000000007207047082070470A00303A0300D0B2092805D900202D2901D15868463070470720424358688018F9E700207047406840187047D308DB015918E0239B00994207D807231A40063B93404068425C1343435470470020704710B53020FCF76CF9012401003020A143FCF736FC3020FCF763F90100A14330202143FCF72DFC0B4B03211A00AE33AC3210881A78002391425B419840FEF720FD6720FCF74DF9C005C00DFF2800D9FF20C0B210BDB413002010B50400010C3920FCF70EFCA1B23820FCF70AFC3020FCF737F9040000213020FCF702FC21003020FCF7FEFB10BDF0B5002789B004000D0016003900072206A80393059700F0E8FB0822944636483B0005AF0022016AA14202DC641A0132FAE73032DA5562460133D21AD2B204389542EFD90922961B751BEDB27B1918000293F1F732FDC3B21F000193002F4AD0039B264CBB420FD1230025009833A03518682988036801319B6889B29847402303702B8802332B801E4B186800282DD0019A029B9B187A429E5C036831005B6898472300983305001868A034036821889B689847134B0400186831000368DB6898470200002C05D029002000002D0FD000F093FB0A4C310023009C331868A0340368DB68984723881B182380013FB5E700F07BFBEEE709B0F0BD14EF0000B413002050140020E02210B500214068920000F06BFB10BDF0B5C04C85B0237A002B05D100F02EFB00F03CFB01232372BB4D2B68DA0768D5BA4ABB4C1778002F3AD10822134260D093432B60B74B053A39201A70FCF782F806003820FCF77EF823003604B433064347201E60FCF776F82300B83318804320FCF770F82300BA33390018804720FCF739FB230003223800AE331B7801269A427841C0B2FCF7D2F8230085331F7023003900C13306201E70FBF76EFF9B4B1E7026002700B0363378B1373B70FCF7F6FBC0B230700D2820D19748FFF799FFFCF7ADFE2300B4331868FFF7F8FE2300B83319884720FCF706FB2300BA3319884320FCF700FB01210620FBF746FF0023C0342370FDF743FD05B0F0BDFF2800D1FEE03B7898426FD122008D321378FF2B0BD10F2878D800F048FADF6AAB8577DA777CBAA477BFCD77E5EE0133137023008D331B78102BECD8220023008532AF3312781B789A4200D3F5E000210620FBF714FF10232A6826009A4323002A60B4331B68AE36009333786D4D9B00EB1800995B6D221DCB1A47200021D367FCF7B3FA2A003378703259008A5A7E350292EA5C8023002613413700DBB203930196039B5C4DB34200D054E12A0000232900C132843113700A780132D2B20A70290085310978B94202D30F2A00D8E0E02A00843213702B0085331F702B00009A88331A60019B86352B70D2E0FF2BA0D191E72200FA21AC32138849018B4205D2643313802300FF228C331A702300853300221A7092E72200C821AC32138849008B42F3D9643BECE72600AE363378052B15D8013303220020DBB29A424041C0B23370FBF7F6FF2300FF2221008C331A703278334B92009B185B6DBC310B6023000122C133D1E72600AE363378002BF6D0013BDFE72200BC3213682A495B182A498B4200DD0B0027498B4200DA0B001360BCE72200BC3213682549EFE72300BC331B68002BDBD02200B432116821485B188142D4D81360D2E72300BC3319680029CDD02200B43213681A488342C7D85B1AF0E74023184A11684B40D8E72300FF2286331B78E25491E72200AF32137801335A201370FEF7EFFA88E72200AF321378013BF5E723008D3382E7A81300200010064074140020B4130020B30300204414002014EF000010270000400D0300F0D8FFFF7FA4BF070008064006200121FBF71EFE10232A6813432B60230088331868231DDA6F824208D0D867FFF7B2FD2300B83347201988FCF7C0F91026FCF799FAFF2868D0230086331E78FFF776FD2300853318702300A055AF331B78834200D9DDE68048FFF72FFEB02238217F4B7F4C920099547F4F210022003800AE31097886327E30415C127878258A407A49D2B25118CB180221494280268818304209D1CE17881970402E00864030001E78284030431870013101330329EDD10026F3B2009323003A00AE331B787E32D35C32001A41A55CFF2D53D10136802EEFD123002200AF338C3212781B789B1A2A22934260DD13000026D31ADDB23700F31CBB425CD0230098331868F9B203682A005B6898470137F2E7013E4020F6B2FEF743FA002E8BD18EE7FCF724FA2B00C1331B78FF2816D0002B00D1A0E60435E86FFFF728FDFFF7FAFC2070B84203D90700EB6F01960093464B8C331A78824206D9187004E0002BE9D12378FF2BE6D1404B02990433DA6F01365218F6B2DA67013478E623008C331B78ED1A2A2D0FDD2A252A235D1BEDB2230098331868EAB2036800995B68013598472B2DF4D195E7EB43DB171D40ECE7D943C9170B409BE70436802E9BD125000023A0352B8023000222AC331100188826000123FFF7F2FC6923AE362B803378234A9B00D3180322586D110002234000FFF7E4FC20002A2388302B80062202210068273BFFF7DAFCC0239B002B8033782700164A9B00D3180422B437586D3B681100181A0123FFF7C9FC124B104A2B803378BC349B00D3180422586D3B681100C0180123FFF7BAFCCD2303229B00110020682B800223FFF7B1FCFCF748FCB1E5C0464414002004070020B413002014EF00007E0200006203000002B4714649084900095C49008E4402BC7047C0461D4B10B51D4C5A1C5A6000218022200000F082F82300002284331A80230086331A70230088331A602300FF218C3319802300134994331960124B2100180090312C3008602000983001602100A0310A8022004433A432136023000B49A833196023000A49AC33196023009C331A60084BBC34236010BDC046A8130020B41300200407002014EF000020D60000200305328038010010B5F1F731F9002010BDC04602488546FFF7F6FFFEE7000088130020044B054A0548834202D202CA02C3FAE77047C0468C130020C0EF00008C13002070B500260C4D0D4C641BA410A64209D1002600F06FF80A4D0A4C641BA410A64205D170BDB300EB5898470136EEE7B300EB5898470136F2E7B4EF0000B4EF0000B4EF0000BCEF000003008218934200D1704719700133F9E7002310B59A4200D110BDCC5CC4540133F8E70000010000000A00000064000000E803000010270000A086010040420F008096980000E1F50500000000000000007DE600005DE6000057E600000DE80000000000000000000053E6000031E600002DE6000029E60000400600008813000010270000204E0000409C00008038010000710200640038017102E204C409C409C40902020202020100000000F8B5C046F8BC08BC9E467047F8B5C046F8BC08BC9E46704709E60000D9ED0000E1E50000");
            const dataMessenger = hexString("10B5064C2378002B07D1054B002B02D0044800E000BF0123237010BD8C13002000000000C0000000044B10B5002B03D00349044800E000BF10BDC0460000000090130020C000000003000222A233FF321A800023A43003707047406840187047D308DB015918E0239B00994207D807231A40063B93404068425C13434354704700207047E02210B500214068920000F0E7FA10BDF0B5B94C8DB0237D002B05D100F0AAFA00F0B8FA01232375B44D2B68DB0749D5237C012B46D13F20FCF7C0F9C021030089010B408B4203D001433F20FCF786FC0C20FCF7B3F9C30734D502200021FCF77DFC0220FCF7AAF9C3042BD504275F20FCF7A4F90490A068002809D0237B628A023B9A4204DA801804A9022200F0AEFA638A013F02339BB2FFB26382002FE6D1267BB3420ED30B202774FCF787F902002068002806D06368002B03D0D2063100D20F984701212B680B4200D1D3E00822134200D1BBE08A489343A23001702B60884B053A1A70FCF715FDC3B20293844B94331D78029BAB420ED0FF2D08D0804B90331C680A2D00D0B9E00223A33423707B4B029A94331A70794E3300A2331B78002B00D199E03300E0220021A03376489200197000F052FA330003259E331C78E4000A347F2C07DC33000833D86FEAB20368E1B25B68984701350E2DF2D100240826674B694998331A6804A8FDF7EAFF230021008022019404A80096FAF714F85F4D032342352F7880222C700121604801940096FAF708F82F70052301948022012128000096F9F7FFFF1A34544D22000835E86F002103685B689847E86F2200036801347E215B68E4B29847382CEDD100244B4D21000835E86F1A2203685B689847E86F21000368013437225B68E4B298477F2CEDD1424BA4331A78632A0BD801321A700123019307330093802200214048063BF9F7C8FF394E3500A3352F78012F00D1A7E0022F23D1334B5A7D002A00D0B2E001325A750123019307330093802200213448063BF9F7AEFF11E02C4BA2331B78002B00D045E7294BA0331978002908D101221A70E0222748920000F0B5F9FCF70FFFFDF7BDFD0DB0F0BD0D2D06D123009E331B78002B09D1A2343EE70F2D05D101239834E2795340E37137E726009836F379002B0BD0092D09D8B37930355A1CB2713268D5543268B379002108E0002D08D19C342580B3793268591CB1712021D1541BE70D2D07D1B379002B01D0013BDBB23268B371E8E70E2D15D19C3425800CE7C046A813002000100640C0130020B30300200407002016EC0000F21300201AEC000028EC000023009E331F78336803933379AB421DD1002F01D0013FFFB27079214B01306833C0B2595D707100F0C9F81D4ACBB2E9005118C9180B7E7A1CB271039A9834D3550022A3792168CA542571D3E600237371134BEA009B181B7EEDE7124C124B26606360124BA3604823237300236382FBF7F3FDFBF783FE042327742B706BE700245C75F3F7C9F9FBF7E7FD3000FBF796FE21000120FBF71EFF01232B703EE7C046A4EB0000A813002069E50000F2130020002243088B4274D303098B425FD3030A8B4244D3030B8B4228D3030C8B420DD3FF22090212BA030C8B4202D31212090265D0030B8B4219D300E0090AC30B8B4201D3CB03C01A5241830B8B4201D38B03C01A5241430B8B4201D34B03C01A5241030B8B4201D30B03C01A5241C30A8B4201D3CB02C01A5241830A8B4201D38B02C01A5241430A8B4201D34B02C01A5241030A8B4201D30B02C01A5241CDD2C3098B4201D3CB01C01A524183098B4201D38B01C01A524143098B4201D34B01C01A524103098B4201D30B01C01A5241C3088B4201D3CB00C01A524183088B4201D38B00C01A524143088B4201D34B00C01A5241411A00D20146524110467047FFE701B5002000F006F802BDC0460029F7D076E770477047C0460022174B17481A605A601A745A82164B191DC867154916480831D96719000831C867190088310A6019008C310A801900180090310B60FF219430017018009830036018009C3002601A000120A03210701A004018A232A433108019707047C046A813002004070020C0130020A4EB00003C14002010B5F1F7E9FA002010BDC04602488546FFF7F6FFFEE7000088130020044B054A0548834202D202CA02C3FAE77047C0468C1300205CEC00008C13002070B500260C4D0D4C641BA410A64209D1002600F075F80A4D0A4C641BA410A64205D170BDB300EB5898470136EEE7B300EB5898470136F2E750EC000050EC000050EC000058EC000003008218934200D1704719700133F9E7002310B59A4200D110BDCC5CC4540133F8E700000000000000000000A1E5000081E500007BE50000A5E5000020000000000000002E2C27213F2F23246162634142430000646566444546000067686947484900006A6B6C4A4B4C00006D6E6F4D4E4F0000707172735051525374757654555600007778797A5758595A010806060606060806083E25730020203E3E205258203C3C2020200020203E3E205458203C3C202020000000F8B5C046F8BC08BC9E467047F8B5C046F8BC08BC9E46704749E5000089EA000021E50000");
            const dataPong = hexString("10B5064C2378002B07D1054B002B02D0044800E000BF0123237010BD9013002000000000C0000000044B10B5002B03D00349044800E000BF10BDC0460000000094130020C0000000002243088B4274D303098B425FD3030A8B4244D3030B8B4228D3030C8B420DD3FF22090212BA030C8B4202D31212090265D0030B8B4219D300E0090AC30B8B4201D3CB03C01A5241830B8B4201D38B03C01A5241430B8B4201D34B03C01A5241030B8B4201D30B03C01A5241C30A8B4201D3CB02C01A5241830A8B4201D38B02C01A5241430A8B4201D34B02C01A5241030A8B4201D30B02C01A5241CDD2C3098B4201D3CB01C01A524183098B4201D38B01C01A524143098B4201D34B01C01A524103098B4201D30B01C01A5241C3088B4201D3CB00C01A524183088B4201D38B00C01A524143088B4201D34B00C01A5241411A00D20146524110467047FFE701B5002000F006F802BDC0460029F7D076E770477047C04600207047D308DB015918E0239B00994207D807231A40063B93404068425C134343547047406840187047002070470A00303A0300D0B2092805D900202D2901D15868463070470720424358688018F9E70820704707207047E02210B500214068920000F0BCF910BD10B5F1F7F3FC10BDF0B50C0087B00DA909781600E3180CAA0500127805910193802B01DD802301936B461B790393B3180293382B01DD382302936B4637001B7A0493049B9F4210D228683A00036821005B689847039B2868591E03683A005B68C9B201379847FFB2EBE72700039B9F4210D228683900036832005B689847049B28685A1E036839005B68D2B201379847FFB2EBE7059B002B13D0019B0134E4B2013B9C420DDA771C029BFFB2013B9F42F3DA28683A00036821005B6898470137F2E707B0F0BDF8B5040040680D0000281FD003685B68984707002068218903689B6898470600606829000368DB6898470200002E05D039003000002F0BD000F031F9606829000368DB68984723891B1823810020F8BD00F02EF9F2E7F0B5060042363378040087B0002B00D183E0FFF75FFF484B0593FCF74BFC05000D2801D10023337064212800FFF79AFE05AE30300A2130702800FFF793FE0A21FFF716FF3031280071700A21FFF710FFEDB23031A36AB1700B2D4DD1002B01DD013BA362E369606B226AC118A36BA56A9A18E1612262002907DCAA4212DBE66BAE19B2420EDC40426063E06A814202DB606B40426063002A02DD206B824201DB5B42A363636A260001270393072310363000D2B2C9B200930197FFF717FF6B46197B1423EAB2009330000E3B0197FFF70DFF220000230832238362611C0005AD2800F1F76BFC84420FDA295D30000134FFF75BFFE4B2F2E70C2DB3D1226BE16B521A9A42AEDD0133ABE70C4A136801331360DB0503D4FCF78DFE07B0F0BDE0200023074C800019190A680433D2430A608342F8D1EFE7C04630303000AC1300200407002010B50C4C2378002B05D100F047F800F055F80123237008490A68531C0B60D20704D4C82B02D90548FFF748FFFDF710FD10BDC046F41300208C130020B01300202020114B114A40215A60114A18621A60104AE2209A60104AD961DA6000225A611A835A6216329A626A32DA6219637F3A2C39D9631B61991C5A639A6340014233C8871A707047C046B01300200407002078EA000090EA000020D60000044B054A0548834202D202CA02C3FAE77047C0468C130020C4EA00009013002070B500260C4D0D4C641BA410A64209D1002600F043F80A4D0A4C641BA410A64205D170BDB300EB5898470136EEE7B300EB5898470136F2E7B8EA0000B8EA0000B8EA0000C0EA0000002310B59A4200D110BDCC5CC4540133F8E703008218934200D1704719700133F9E70000000000000000000081E6000085E60000A5E60000D9E600000000000000000000ABE60000AFE60000D1E60000D5E60000F8B5C046F8BC08BC9E467047F8B5C046F8BC08BC9E46704749E5000089E9000021E5000001000000");
            if (this.selectSbar.checked) {
                firmwareData = replaceSection(firmwareData, hexString("45E6000002000000030000000400000005000000060000000700000008000000090000000A0000000B0000000C0000000D0000000E0000002DE7"), 0x0004);
                firmwareData = replaceSection(firmwareData, dataSbar, firmwareData.length);
                log(`Success: ${this.name} applied: RSSI-Sbar.`);
            }
            else if (this.selectGraph.checked) {
                firmwareData = replaceSection(firmwareData, hexString("E9E6000002000000030000000400000005000000060000000700000008000000090000000A0000000B0000000C0000000D0000000E000000D9E8"), 0x0004);
                firmwareData = replaceSection(firmwareData, dataGraph, firmwareData.length);
                log(`Success: ${this.name} applied: RSSI-Graph.`);
            }
            else if (this.selectSpectr.checked) {
                firmwareData = replaceSection(firmwareData, hexString("CDE9000002000000030000000400000005000000060000000700000008000000090000000A0000000B0000000C0000000D0000000E000000CDE6"), 0x0004);
                firmwareData = replaceSection(firmwareData, dataSpectr, firmwareData.length);

                log(`Success: ${this.name} applied: Spectrum (piotr022).`);
            }
            else if (this.selectSpectrM.checked) {
                firmwareData = replaceSection(firmwareData, hexString("79EE000002000000030000000400000005000000060000000700000008000000090000000A0000000B0000000C0000000D0000000E0000001DE8"), 0x0004);
                firmwareData = replaceSection(firmwareData, dataSpectrM, firmwareData.length);

                log(`Success: ${this.name} applied: Advanced Spectrum (fagci).`);
            }
            else if (this.selectMessenger.checked) {
                firmwareData = replaceSection(firmwareData, hexString("09EB000002000000030000000400000005000000060000000700000008000000090000000A0000000B0000000C0000000D0000000E000000B5E5"), 0x0004);
                firmwareData = replaceSection(firmwareData, dataMessenger, firmwareData.length);

                log(`Success: ${this.name} applied: Messenger.`);
            }
            else if (this.selectPong.checked) {
                firmwareData = replaceSection(firmwareData, hexString("E9E6000002000000030000000400000005000000060000000700000008000000090000000A0000000B0000000C0000000D0000000E00000049E9"), 0x0004);
                firmwareData = replaceSection(firmwareData, dataPong, firmwareData.length);
                log(`Success: ${this.name} applied: Pong.`);
            }
            return firmwareData;
        }
    }
    , 
    class Mod_CustomBootscreen extends FirmwareMod {
        constructor() {
            super("Custom Bootscreen", "Changes the bootscreen of the radio to an image, displayed for 2 seconds on startup. The PONMSG setting in the menu is ignored, custom bootscreen is always shown. Images are automatically compressed by removing blank space on top and bottom. Make a narrow banner if you need to save space. ", "up to 1024");
            this.selectTrollface = addRadioButton(this.modSpecificDiv, "Troll Face (933 Bytes)", "selectTrollface", "selectBootscreen");
            this.selectQ = addRadioButton(this.modSpecificDiv, "Quansheng Q Logo (929 Bytes)", "selectQ", "selectBootscreen");
            this.selectUVMOD = addRadioButton(this.modSpecificDiv, "UVMOD Banner (214 Bytes)", "selectUVMOD", "selectBootscreen");
            this.selectNOKIA = addRadioButton(this.modSpecificDiv, "NOKIA Logo (507 Bytes)", "selectNOKIA", "selectBootscreen");
            this.selectCustomFile = addRadioButton(this.modSpecificDiv, "Custom image (will be converted and compressed automatically, ideal size 128x64)", "selectCustom", "selectBootscreen");
            this.selectTrollface.checked = true;
            const fileInputDiv = document.createElement("div");
            fileInputDiv.classList.add("custom-file", "mt-2", "d-none");
            this.customFileInput = document.createElement("input");
            this.customFileInput.className = "custom-file-input";
            this.customFileInput.type = "file";
            this.customFileInput.accept = "image/bmp,image/jpeg,image/png";
            this.customFileLabel = document.createElement("label");
            this.customFileLabel.className = "custom-file-label";
            this.customFileLabel.innerText = "Choose image file";
            this.customFileLabel.for = "customFileInput";
            fileInputDiv.appendChild(this.customFileInput);
            fileInputDiv.appendChild(this.customFileLabel);
            this.canvas = document.createElement("canvas");
            this.canvas.classList.add("mt-3", "mr-3", "border", "shadow-sm");
            this.canvas.width = 128;
            this.canvas.height = 64;
            this.canvas2 = this.canvas.cloneNode();
            fileInputDiv.appendChild(this.canvas);
            fileInputDiv.appendChild(this.canvas2);
            this.modSpecificDiv.appendChild(fileInputDiv);
            this.selectCustomFile.parentElement.parentElement.addEventListener("change", () => {
                fileInputDiv.classList.toggle("d-none", !this.selectCustomFile.checked);
            });
            this.customImageData = new Uint8Array(1024);
            this.customFileInput.onchange = () => {
                const file = this.customFileInput.files[0];
                this.customFileLabel.textContent = file.name;
                const reader = new FileReader();
                reader.onload = () => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = this.canvas;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, 128, 64);
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                        function getPixel(x, y) {
                            const index = y * 128 + x;
                            const i = index * 4;
                            return imageData[i] + imageData[i + 1] + imageData[i + 2] > 128 * 3 ? 0 : 1;
                        }
                        // run canvas content through getPixel and output to canvas2
                        const canvas2 = this.canvas2;
                        const ctx2 = canvas2.getContext('2d');
                        const imageData2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
                        for (let y = 0; y < 64; y++) {
                            for (let x = 0; x < 128; x++) {
                                const index = y * 128 + x;
                                const i = index * 4;
                                const pixel = !getPixel(x, y);
                                imageData2.data[i] = pixel * 255;
                                imageData2.data[i + 1] = pixel * 255;
                                imageData2.data[i + 2] = pixel * 255;
                                imageData2.data[i + 3] = 255;
                            }
                        }
                        ctx2.putImageData(imageData2, 0, 0);
                        const outputArray = new Uint8Array(1024);
                        // getPixel(i) outputs the pixel value for any x y coordinate. 0 = black, 1 = white.
                        // the outputArray is 1024 bytes, where each byte is 8 pixels IN VERTICAL ORDER.
                        let i = 0;
                        for (let y = 0; y < 64; y += 8) {
                            for (let x = 0; x < 128; x++) {
                                let byte = 0;
                                for (let i = 0; i < 8; i++) {
                                    byte |= getPixel(x, y + i) << i;
                                }
                                outputArray[i++] = byte;
                            }
                        }
                        this.customImageData.set(outputArray);
                    };
                    img.src = reader.result;
                };
                reader.readAsDataURL(file);
            };
        }
        apply(firmwareData) {
            let imageData = null;
            // images have to be 1024 bytes exactly, where each byte is 8 pixels. 128x64 pixels = 1024 bytes
            // this mod optimizes the image data by removing empty lines from top and bottom. leave lots of empty space on top and bottom for the smallest size. 
            if (this.selectTrollface.checked) {
                imageData = hexString("00000000000000000000000000000000000000000000000000000000000000000000008080c040602020b0b090909818383838282c2c2c2cacac8c8c0c1c1c545454541414148484242404440c8c0c0c0c0c0c08183070e08000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080c0fc06030101000000110800040000000000000414000000000000000000000800808080c0c0c2c2c2c0c1c5808a0405081204000000000000030f3ce08000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f0f89c26132984d4c4c44040c08084060785850d0f0f0f0e0efcfc18080000000000000e1f3319190c0c0c0707377767c7c58d8f8ec0ca6064743030901414363666c383060c8c1870c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000073fffc02228400080f07efec08383030321001038183c764383818080000020303030346404647c1880888880c0c860606070b0f018180c0c86c6e2fb7e0c0c0800391f80400f80e07f0e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003ffe00000fffffff3f8ffe3c3e3fedec6c6c4ccccfcfccdcdccc4c4fcfec6c6c6c2c3c3e3e3fff9f1707838381c1c0e7fffc7c373390d07030000000000c071180e0603010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0ff000000000f3f777fdfc7dfffe7879fffe787070f3fff070707070783ff8383818181c1c0c0c77f78303018980c4e0703a1804000a080c06030381c06030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ff870000001020404004888090918101010101018181818101010101014141111111212108101484c8ca606534321a19090c0406020301010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000103060c1810303020206060606060606020202030303010101818080c0c0c0c0c040606020301010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
            }
            else if (this.selectQ.checked) {
                imageData = hexString("0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008080c0c0c0e0e0c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008080c0e0f0f0f8fcfefefeffffff7f7f3f3f1f1f1f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080c0f0f8fcfeffffffff7f3f1f0f0f0703030180c0c0e0f0f0f8f8f8fcf880000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080e0f8feffffffffff3f1f0703010080c0e0f0f8fcfeffff7f7f3f1f1f0f0707070301818080c0c0c0c0c0e0c0e0c0e0c0c0c0808000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000081e3f3f3f3f3f3f0f0300000000f0fcfeffffffff3f1f0703010080c0e0f0f8fcfcfeff7f3f3f3f1f1f1f1f1f1f1f3f7ffffffffffffffffcf000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080f0fcffffffffffffff07010000000000000000000080c0e0f8ffffffffff7f3f0f01000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001f3f7ffffffffffffffffefefcfcfcfcfcfefeffffffff9f9f8f870303000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010101030103030307070f0f0f1f1f1f1f1f0f07030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
            }
            else if (this.selectUVMOD.checked) {
                imageData = hexString("000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000FFFFFF000000000000FFFFFF00000000FFFFFF000000000000FFFFFF00000000FFFFFF7CF8F0F87CFFFFFF00000000FCFEFF0F070707070FFFFEFC00000000FFFFFF07070707070FFFFEFC00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003F7FFFF0E0E0E0E0F0FF7F3F000000000F1F3F7CF8F0F0F87C3F1F0F00000000FFFFFF0001010100FFFFFF000000003F7FFFF0E0E0E0E0F0FF7F3F00000000FFFFFFE0E0E0E0E0F0FF7F3F0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
            }
            else if (this.selectNOKIA.checked) {
                imageData = hexString("0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008080808080808080808000000000000000000000008080808080800000000000008080808080808080808080808080808080000000000000808080808080000000000000000000008080808080808080000080808080808000000000000000000000000080808080808080000000000000000000000000000000000000000000ffffffffffff0f1f3ffffffefcf8e0c08000000000ffffffffffff0000fcfeffffffff0f0f0f0f0f0f0f0f0f0f0f0f0f0ffffffffefc0000ffffffffffff8080c0e0f0f8fc7c7e3f1f0f0f07030101000000ffffffffffff0000000000000080e0f8fcffff7f1f0f3f7ffffffcf8e08000000000000000000000000000000000ffffffffffff000000000103070f1f3ffffffefcf8ffffffffffff00003f7ffffffffff0f0f0f0f0f0f0f0f0f0f0f0f0f0ffffff7f3f0000ffffffffffff00010303070f1f3f7f7efcf8f8f0e0c0c0800000ffffffffffff000080e0f8fcffffff3f3f3f3d3c3c3c3c3c3d3f3f3ffffffffcf8e080000000000000000000000001010101010100000000000000000000000101010101010101010100000000000001010101010101010101010101010101010000000000000101010101010000000000000000000000010101010101010100010101010101000101010101010100000000000000000000000000000001010101010101000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
            }
            else if (this.selectCustomFile.checked) {
                imageData = this.customImageData;
            }
            if (imageData.length !== 1024) throw new Error("Image data must be exactly 1024 bytes.");
            // this uses the shellcode from custom_bootscreen_narrow
            let shellcode = hexString("30B5002206490748F6F72AFB064A07490748F6F713FB01F0ADFD01F06FFD30BD0004000084060020CCCCCCCCBBBBBBBBAAAAAAAA");
            // remove empty lines from top
            let offsetLines = 0;
            for (let i = 0; i < 64; i++) {
                if (imageData.slice(i * 16, i * 16 + 16).every(pixel => pixel === 0)) {
                    offsetLines++;
                } else {
                    break;
                }
            }
            imageData = imageData.slice(offsetLines * 16);
            // truncate all zero bytes from the end of the image data
            let endIndex = imageData.length;
            while (endIndex > 0 && imageData[endIndex - 1] === 0) {
                endIndex--;
            }
            imageData = imageData.subarray(0, endIndex);
            // now we can patch the shellcode with the right values
            const shellcodeDataView = new DataView(shellcode.buffer);
            shellcodeDataView.setUint32(1 * -4 + shellcode.length, 0x20000684 + offsetLines * 16, true); // set destination address inside displaybuffer shifted by the amount of removed empty lines
            shellcodeDataView.setUint32(2 * -4 + shellcode.length, firmwareData.length, true); // set source address to the end of the firmware where the image will be stored
            shellcodeDataView.setUint32(3 * -4 + shellcode.length, imageData.length, true); // set length of the image data

            firmwareData = replaceSection(firmwareData, shellcode, 0x9b3c);
            firmwareData = replaceSection(firmwareData, hexString("0001"), 0xd1f0); // patch bootscreen duration to 2 seconds
            firmwareData = replaceSection(firmwareData, imageData, firmwareData.length);
            log(`Success: ${this.name} applied using ${imageData.length} bytes of extra space.`);
            return firmwareData;
        }
    }
    ,
    class Mod_RSSI extends FirmwareMod {
        constructor() {
            super("RSSI (Experimemtal)", "Adds a battery voltage readout in the status bar. Replaces the signal strength meter with a numerical RSSI readout and adds another optional element: You can choose to either have an S-Meter with bargraph (signal strength in 6dB increments) or an RSSI graph showing RSSI over time.", "2250 or 1424");
            this.selectSbar = addRadioButton(this.modSpecificDiv, "Select S-Meter, uses 2250 Bytes of additional Flash", "selectSbar", "selectRSSI");
            this.selectGraph = addRadioButton(this.modSpecificDiv, "Select RSSI Graph, uses 1424 Bytes of additional Flash CURRENTLY BROKEN", "selectGraph", "selectRSSI");
            this.selectSbar.checked = true;
            this.selectGraph.disabled = true; // currently broken, doesnt boot and python variant of the mod doesnt seem to do anything
        }
        apply(firmwareData) {
            firmwareData = replaceSection(firmwareData, hexString("e7e50000"), 0x0004); // replace reset handler
            firmwareData = replaceSection(firmwareData, hexString("1de70000"), 0x003c); // replace systick handler
            firmwareData = replaceSection(firmwareData, hexString("02e0"), 0x14bc); // remove old signal strength meter
            // sbar size 2242 + 8 = 2250
            const dataSbar = hexString("10b5064c2378002b07d1054b002b02d0044800e000bf0123237010bda813002000000000c0000000044b10b5002b03d00349044800e000bf10bdc04600000000ac130020c00000000023c25c0133002afbd1581e704700207047d308db015918e0239b00994207d807231a40063b93404068425c134343547047406840187047002070470a00303a0300d0b2092805d900202d2901d15868463070470720424358688018f9e708207047072070470020704770477047e02210b500214068920000f095fb10bd10b5d523984710bd0000f8b5c36804005a1cc260c72a4cd9294b002519780123ff3948424841217c9943014304202174244909688b432349db000978890001400b43217c083081430b432374530709d123681868a84205d02100036808315b68984705006668002e1bd0e368db0718d4164b9847217ec7b28f420ad063695868ff2917d1002803d0390003689b68984727762100336830001b68083198470543edb2ab0701d5094b9847eb0701d5084b9847f8bd0028ebd00368db68e7e735080020001006401e0a0020b9b0000039b60000b1b60000f7b5040004265f20144fb8470190a068002809d0237b628a023b9a4204da801801a9022200f00cfb638a013e02339bb2f6b26382002ee6d1257bab420dd30b202674b84702002068002806d06368002b03d0d2062900d20f9847f7bd61a9000070b51a4c2378002b05d100f0b5fa00f0c3fa01232370164b1b68db071fd5154d2b7c012b1bd13f20134ca047c021030089010b408b4203d00143104b3f2098470c20a047c3070ad502200c4b002198470220a047c30402d52800fff7a1ff0848fff738ff074b984770bdc0462414002000100640e813002061a9000001af0000cc13002099c30000f8b5040040680d0000281fd003685b68984707002068218903689b6898470600606829000368db6898470200002e05d039003000002f0bd000f08efa606829000368db68984723891b1823810020f8bd00f08bfaf2e770b506000d0000242800fff7b0fe844206d2295d30000134fff7c7ffe4b2f3e770bdf0b50c00002187b017000190072204a81e00039100f06dfa002c04da2d210198fff7b2ff6442194b0093002319000822d21a974219dc009a126a94460022a44503dc60460132241af9e7302084469444654603a8c554002a02d0002900d11900009a0133043a0092e1e703ab002901d130221a70002e02d00921c91b891b01985918fff7acff07b0f0bdc04664ed0000f0b50c0087b00da909781600e3180caa0500127805910193802b01dd802301936b461b790393b3180293382b01dd382302936b4637001b7a0493049b9f4210d228683a00036821005b689847039b2868591e03683a005b68c9b201379847ffb2ebe72700039b9f4210d228683900036832005b689847049b28685a1e036839005b68d2b201379847ffb2ebe7059b002b13d0019b0134e4b2013b9c420dda771c029bffb2013b9f42f3da28683a00036821005b6898470137f2e707b0f0bd0000f0b50b7a04000d0087b01b0700d511e10b681b68002b06d0874b01201b78002b34d007b0f0bd83685a1c82605b07f3d0824b834e1a6801235209934343740c20b047b4467f49830702d4627c002a01d000220a700a787c480a2a06d82f7a01263b003340029337423ed00178002900d0e0e00124754b04708022186800f091f92b7a234200d0d5e00220cae7704b01201b78002bc5d16f4b1d88fa239b009d4200d96d4d142200216c4800f07af94d236b4c02222900200023814c3bfff7f8fe02226021674800f06cf958230022290020002381563bfff7ebfe05226249634800f056f901209ce7029b01320a700370627c002a5ed06f20e0473f220d2382435343a2819b11514fa37380220021386800f047f90c23e65ec023554d5b002b81002e03dd20212800fff786fe0323002231002800fff7bcfe637c002b53d03e680f2230004b49233000f022f93300343621331a78d2431a700133b342f9d1a37b1c1c0d2b00d90d24e4b2029b9c428bd06b46029a1b7a062a00d90623052102980133dbb2009300271f2341430820009a029e9a1a3b00b0427f41403104332800d2b2c9b20197fff7cbfe029b0133dbb20293dae76720e0474008c0b20200a023a03a181a2c49029b12b20d780133dbb2a84203da01310d2bf7d1013391b2090a227361738fe7a37b05ae032230002349039300f0cdf83868039b08222330092b0fd91f4900f0c4f830237370039b27333370ac23ff33310028002b81fff737fe9de7184900f0b4f8039b3033337020237370eee70020f4e6ea0600200010064061a90000a5130020a413002020140020e306002006040020e7030000d106002098130020d9060020aed40000eb0600208c13002062d4000054ed00001eed00009dd30000b5d30000164b1749174a19605a60174b174a18481a60184a5a60184a506011600022174917484a600a600a744a821649083008608a600a8214494b6014494b60144b15495a601960da60191d1a74ff3299605b611a76114b114a1a607047c046c41300202ced0000040700201814002044ed00008406002020d6000010140020e81300208ced0000fc1300208c13002098130020cc13002088ed00002014002084080020044b054a0548834202d202ca02c3fae77047c0468c130020c8ed0000a613002070b500260c4d0d4c641ba410a64209d1002600f06df80a4d0a4c641ba410a64205d170bdb300eb5898470136eee7b300eb5898470136f2e7bced0000bced0000bced0000c4ed0000002310b59a4200d110bdcc5cc4540133f8e703008218934200d1704719700133f9e7202000000000000000000000000077e500007be500009be50000d7e500000000000000000000a1e50000a5e50000c7e50000cbe500008d87817b756f69635d53493f35000000010000000a00000064000000e803000010270000a086010040420f008096980000e1f505fc1300200000000000000000cfe500006de90000d3e50000d5e50000f8b5c046f8bc08bc9e467047f8b5c046f8bc08bc9e46704749e50000f5eb000021e50000c4130020000000000000000010140020000000000000000001ff");
            // graph size 1416 + 8 = 1424
            const dataGraph = hexString("10b5064c2378002b07d1054b002b02d0044800e000bf0123237010bd9413002000000000c0000000044b10b5002b03d00349044800e000bf10bdc0460000000098130020c00000000023c25c0133002afbd1581e70470000002243088b4274d303098b425fd3030a8b4244d3030b8b4228d3030c8b420dd3ff22090212ba030c8b4202d31212090265d0030b8b4219d300e0090ac30b8b4201d3cb03c01a5241830b8b4201d38b03c01a5241430b8b4201d34b03c01a5241030b8b4201d30b03c01a5241c30a8b4201d3cb02c01a5241830a8b4201d38b02c01a5241430a8b4201d34b02c01a5241030a8b4201d30b02c01a5241cdd2c3098b4201d3cb01c01a524183098b4201d38b01c01a524143098b4201d34b01c01a524103098b4201d30b01c01a5241c3088b4201d3cb00c01a524183088b4201d38b00c01a524143088b4201d34b00c01a5241411a00d20146524110467047ffe701b5002000f006f802bdc0460029f7d076e770477047c04600207047d308db015918e0239b00994207d807231a40063b93404068425c134343547047406840187047002070470a00303a0300d0b2092805d900202d2901d15868463070470720424358688018f9e70820704707207047e02210b500214068920000f064f910bd10b5d523984710bdf8b5040040680d0000281fd003685b68984707002068218903689b6898470600606829000368db6898470200002e05d039003000002f0bd000f038f9606829000368db68984723891b1823810020f8bd00f035f9f2e70000f0b5594b8bb003934b680025069303ab07936b469d84554b0c68554a1b6805af0600049405920895db0729d50c20736998475049830700d50d700b784e4a142b04d83220ff30205cff281bd11578002d16d1012304981370813080222900ff3000f001f960222900444800f0fcf8444b1d703223ff33e35cff2b01d0b36998470bb0f0bd01330b70002313706a468133ff3301ad93843b4905222800089700f0d9f86720736998474008c0b20028e7d0a02826d920236030c4b22b7064212000fff7aefe30300a2168702000fff7a8fe0a21c0b2fff72aff3031a97020000a21fff724ff00273031e9702800fff790fe87420cd2e95d07a80137fff755ffffb2f3e760246442241a2d23e4b2d5e71c4f3b78203b5f2b01d920233b7007235c431c413d781549221c4819e4b220389c4200d91a1cd2b29a1aff231341db4303707b2d08d800232a0018001f3a8a18d0540133042bfbd104986022a130ff30013500f078f83d7089e7dce9000000100640f4e900008c1300208d130020b013002010140020cee9000010b50e4c2378002b05d100f02bf800f039f8012323700a4b19684a1c1a60094b4b4309498b4205d8c82a03d907490848fff722ff074b984710bdc0461c14002090130020efeeeeee1111111104ea00001cea000099c30000014b5a1c5a60704714140020044b054a0548834202d202ca02c3fae77047c0468c130020a0ea00009413002070b500260c4d0d4c641ba410a64209d1002600f081f80a4d0a4c641ba410a64205d170bdb300eb5898470136eee7b300eb5898470136f2e794ea000094ea000094ea00009cea0000002310b59a4200d110bdcc5cc4540133f8e703008218934200d1704719700133f9e7673030300000000000000000000091e6000095e60000b5e60000e9e600000000000000000000bbe60000bfe60000e1e60000e5e600000407002020d6000048d30000b303002084060020060400204d870000edd0000001d1000045be000001af000061a9000039b60000b9b00000e9c600000d8700004d8600007da6000019a50000cda7000029010000bdaa0000d5aa0000d91c00003da6000095a70000b1b60000119c0000d500000099c30000f8b5c046f8bc08bc9e467047f8b5c046f8bc08bc9e46704749e5000039e9000021e50000ff01000001000000");
            if (this.selectSbar.checked) {
                firmwareData = replaceSection(firmwareData, dataSbar, firmwareData.length);
                log(`Success: ${this.name} S-Meter applied.`);
            }
            else if (this.selectGraph.checked) {
                firmwareData = replaceSection(firmwareData, dataGraph, firmwareData.length);
                log(`Success: ${this.name} Graph applied.`);
            }
            return firmwareData;
        }
    }
    ,
    class Mod_EnableSWDPort extends FirmwareMod {
        constructor() {
            super("Enable SWD Port", "Allows via (SWD) Serial Wire Debug. Requires to solder 2-pin wire on the radios mainboard. Alternative to JTAG using the same protocol. ", 0);
        }
        apply(firmwareData) {
            const offset1 = 0xb924;
            const offset2 = 0xb9b2;
            const oldData1 = hexString("c860");
            const oldData2 = hexString("4860");
            const newData = hexString("00bf");
            if (compareSection(firmwareData, oldData1, offset1) && compareSection(firmwareData, oldData2, offset2)) {
                firmwareData = replaceSection(firmwareData, newData, offset1);
                firmwareData = replaceSection(firmwareData, newData, offset2);
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`ERROR in ${this.name}: Unexpected data, already patched or wrong firmware?`);
            }

            return firmwareData;
        }
    }
    ,
    class Mod_FrequencySteps extends FirmwareMod {
        constructor() {
            super("Frequency Steps", "Changes the frequency steps.", 0);
            this.inputStep1 = addInputField(this.modSpecificDiv, "Frequency Step 1 (Hz)", "2500");
            this.inputStep2 = addInputField(this.modSpecificDiv, "Frequency Step 2 (Hz)", "5000");
            this.inputStep3 = addInputField(this.modSpecificDiv, "Frequency Step 3 (Hz)", "6250");
            this.inputStep4 = addInputField(this.modSpecificDiv, "Frequency Step 4 (Hz)", "10000");
            this.inputStep5 = addInputField(this.modSpecificDiv, "Frequency Step 5 (Hz)", "12500");
            this.inputStep6 = addInputField(this.modSpecificDiv, "Frequency Step 6 (Hz)", "25000");
            this.inputStep7 = addInputField(this.modSpecificDiv, "Frequency Step 7 (Hz) (only available on band 2)", "8330");
        }
        apply(firmwareData) {
            const offset = 0xE0C8;
            const steps = [
                Math.trunc(parseInt(this.inputStep1.value) * 0.1),
                Math.trunc(parseInt(this.inputStep2.value) * 0.1),
                Math.trunc(parseInt(this.inputStep3.value) * 0.1),
                Math.trunc(parseInt(this.inputStep4.value) * 0.1),
                Math.trunc(parseInt(this.inputStep5.value) * 0.1),
                Math.trunc(parseInt(this.inputStep6.value) * 0.1),
                Math.trunc(parseInt(this.inputStep7.value) * 0.1),
            ];
            // Create an 8-byte buffer with the specified values
            const buffer = new ArrayBuffer(14);
            const dataView = new DataView(buffer);
            // Set each step at their respective offsets
            for (let i = 0; i < steps.length; i++) {
                dataView.setUint16(i * 2, steps[i], true); // true indicates little-endian byte order
            }
            // Convert the buffer to a Uint8Array
            const stepsHex = new Uint8Array(buffer);
            // Replace the 14-byte section at the offset with the new buffer
            firmwareData = replaceSection(firmwareData, stepsHex, offset);
            log(`Success: ${this.name} applied.`);
            return firmwareData;
        }
    }
    ,
    class Mod_NOAAFrequencies extends FirmwareMod {
        constructor() {
            super("NOAA Frequencies", "The NOAA scan feature is unique because it can scan in the background, all the time and stop only if a 1050 Hz Ton received to demute the speaker. However most people dont need the weather alerts or dont have NOAA in their country. This mod lets you change the frequencies so you can use the NOAA scan function for something else. The values below are pre-set to the first 10 PMR446 channels. A 1050 Hz Ton >150ms can be send with the Rogger Beep mod or Repeater Ton mod", 0);
            this.inputFreq1 = addInputField(this.modSpecificDiv,   "Frequency 1 (Hz)", "446006250");
            this.inputFreq2 = addInputField(this.modSpecificDiv,   "Frequency 2 (Hz)", "446018750");
            this.inputFreq3 = addInputField(this.modSpecificDiv,   "Frequency 3 (Hz)", "446031250");
            this.inputFreq4 = addInputField(this.modSpecificDiv,   "Frequency 4 (Hz)", "446043750");
            this.inputFreq5 = addInputField(this.modSpecificDiv,   "Frequency 5 (Hz)", "446056250");
            this.inputFreq6 = addInputField(this.modSpecificDiv,   "Frequency 6 (Hz)", "446068750");
            this.inputFreq7 = addInputField(this.modSpecificDiv,   "Frequency 7 (Hz)", "446081250");
            this.inputFreq8 = addInputField(this.modSpecificDiv,   "Frequency 8 (Hz)", "446093750");
            this.inputFreq9 = addInputField(this.modSpecificDiv,   "Frequency 9 (Hz)", "446106250");
            this.inputFreq10 = addInputField(this.modSpecificDiv,  "Frequency 10 (Hz)", "446118750");
        }
        apply(firmwareData) {
            const offset = 0xE0D8;
            const freqs = [
                Math.trunc(parseInt(this.inputFreq1.value) * 0.1),
                Math.trunc(parseInt(this.inputFreq2.value) * 0.1),
                Math.trunc(parseInt(this.inputFreq3.value) * 0.1),
                Math.trunc(parseInt(this.inputFreq4.value) * 0.1),
                Math.trunc(parseInt(this.inputFreq5.value) * 0.1),
                Math.trunc(parseInt(this.inputFreq6.value) * 0.1),
                Math.trunc(parseInt(this.inputFreq7.value) * 0.1),
                Math.trunc(parseInt(this.inputFreq8.value) * 0.1),
                Math.trunc(parseInt(this.inputFreq9.value) * 0.1),
                Math.trunc(parseInt(this.inputFreq10.value) * 0.1)
            ];
            // Create an 8-byte buffer with the specified values
            const buffer = new ArrayBuffer(40);
            const dataView = new DataView(buffer);
            // Set each step at their respective offsets
            for (let i = 0; i < freqs.length; i++) {
                dataView.setUint32(i * 4, freqs[i], true); // true indicates little-endian byte order
            }
            // Convert the buffer to a Uint8Array
            const freqsHex = new Uint8Array(buffer);
            // Replace the 14-byte section at the offset with the new buffer
            firmwareData = replaceSection(firmwareData, freqsHex, offset);
            log(`Success: ${this.name} applied.`);
            return firmwareData;
        }
    }
    ,
]
