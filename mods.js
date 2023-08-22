modClasses = [
class Mod_ChangeToneBrust extends FirmwareMod { //lets hope it will work. I duno Py nor JS, just modding stuff 4 people 2 help
        constructor() {
            super("Repeater Tone Burst (Experimental)", "Push Button F2 [Flashlight] + PTT at the same time together, sends a 1750Hz wakeup tone by default for repeater in the EU. To demute NOAA Channels requires a 1050 Hz Tone. Other not so common repeater tone pulse freq are 1000Hz, 1450Hz, 1750Hz, 2100Hz", 0);
            this.contrastValue = addInputField(this.modSpecificDiv, "Enter a new Tone Burst Hz value from 1000-3950:", "1750");
        }

        apply(firmwareData) {
            const minValue = 1000;
            const maxValue = 3950;
            const inputValue = parseInt(this.contrastValue.value);
//must be redone, rewritten with math instr. write from offset 0x29cc to 0x29cd !
            if (!isNaN(inputValue) && inputValue >= minValue && inputValue <= maxValue) {
                const newData = new Uint8Array([inputValue]);
                firmwareData = replaceSection(firmwareData, newData, 0x29cc);//should replace from 0x29cc-0x29cd, maybe +4
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`ERROR in ${this.name}: Repeater Tone Burst must be a Tone Freq. in Hz from 1000-3950 Hz!`);
            }
            return firmwareData;
        }
    }
    ,
class Mod_changeTone extends FirmwareMod {
        constructor() {
            super("Change Relay opening Tone burst (Experimental)", "Changes the Tone by PTT and Side F1 Key, used to open HAM Relays and NOAA Channels. The default is 1750 Hz. To open NOAA Ton-Squelch set 1050 Hz.", 0);
            this.inputTone = addInputField(this.modSpecificDiv, "Tone frequency (Hz)", "1750");
                    }

        apply(firmwareData) {
            const offset = 0x29cc;
                
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

class Mod_Beep extends FirmwareMod {
        constructor() {
            super("Beep (Code Test Exerminental)", "Repeater Ton Call", 0);
            this.inputTone = addInputField(this.modSpecificDiv, "Tone frequency (Hz)", "1050");
         //   this.inputTone2 = addInputField(this.modSpecificDiv, "Tone 2 frequency (Hz)", "1310");
        }

        apply(firmwareData) {
            const offset = 0x29cc;
            const tone = Math.trunc(parseInt(this.inputTone.value) * 10.32444);
         //   const tone2 = Math.trunc(parseInt(this.inputTone2.value) * 10.32444);

            if (tone <= 0xFFFF) {
                // Create an 8-byte buffer with the specified values
                const buffer = new ArrayBuffer(8);
                const dataView = new DataView(buffer);

                // Set tone1 and tone2 at their respective offsets
                dataView.setUint32(0, tone, true); // true indicates little-endian byte order
              //  dataView.setUint32(4, tone2, true);

                // Convert the buffer to a Uint8Array
                const tonesHex = new Uint8Array(buffer);

                // Replace the 8-byte section at the offset with the new buffer
                firmwareData = replaceSection(firmwareData, tonesHex, offset);
                //firmwareData = replaceSection(firmwareData, hexString("96"), 0x29cc+4);

                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`ERROR in ${this.name}: Unexpected data, already patched or wrong firmware?`);
            }

            return firmwareData;
        }
    }
    ,
        

        
        
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

           /* if (tone1 <= 0xFFFF && tone2 <= 0xFFFF) {*/
                // Create an 8-byte buffer with the specified values
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
            super("TX and RX from 18-1300MHz (Tunas1337 diffs by RECON)", "Allows recieve (RX) and transmit (TX) on the frequency range from 18 MHz - 1300 MHz. This TX Mod includes the following Mods: Disable TX Lock, Enhance RX Frequency Range.", 0);
        }
        apply(firmwareData) {
        //     0x150d by spm81 hey thats is already in 0x150b at the end bytes included so its redunant! greez Recon
            const offset1 = 0x180E;  //diffs by RE3CON taken from Tunas1337 18-1300 Mod
            const offset2 = 0xe078;  //diffs by RE3CON taken from Tunas1337 18-1300 Mod
            const offset3 = 0xe0a8;  //diffs by RE3CON taken from Tunas1337 18-1300 Mod
            const offset4 = 0x150b;  //diffs by RE3CON taken from Tunas1337 18-1300 Mod
            const oldData1 = hexString("cf2a");  //TX lock //
            const oldData2 = hexString("80cba4"); // lower rx-limit 50 lock, I do know u cant say these are numbers rather to be functions like push mov etc.. than not beeing numbers in bin.
            const oldData3 = hexString("00879303"); // upper rx-limit 600 lock
            const oldData4 = hexString("00404b4c00008793037c"); // full TX range @ 0x150c: 40xxxx00xxxxxx0x7c
            const newData1 = hexString("5de0"); //unlock TX 50-600 by R3CON //
         /* const newData0 = hexString("xxxx771b0080a4bf07xx"); //??? spm81 // crap it already part of 0x150b,d, see newData4. No need twice!!! */
            const newData2 = hexString("40771b"); //set lower rx freq to 18 by R3CON
            const newData3 = hexString("80a4bf07"); //set upper rx freq to 1300 by R3CON 
            const newData4 = hexString("0040771b0080a4bf077c"); // TX full range by R3CON
            if (compareSection(firmwareData, oldData1, offset1) && compareSection(firmwareData, oldData2, offset2) && compareSection(firmwareData, oldData3, offset3) && compareSection(firmwareData, oldData4, offset4)) {
             /* firmwareData = replaceSection(firmwareData, newData0, offset0); //spma81 additions// this is redunant obsolete see rem RECON */
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
            super("Add 500kHz Steps", "Switch the freq in 0,5 MHz Steps. Usefull >999MHz to reach above the GHz range quickly", 0);//Diffs by RE3CON, taken from Tunas1337
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
   class Mod_ChangeRXLimits extends FirmwareMod {
        constructor() {
            super("Custom RX Limits (Experimental)", "Allows receive in the specified frequency range.", 0);
            this.inputMinTX = addInputField(this.modSpecificDiv, "Specify a new value for the minimum frequency in the range 18-1300 MHz:", "50");
            this.inputMaxTX = addInputField(this.modSpecificDiv, "Specify a new value for the minimum frequency in the range 18-1300 MHz:", "600");
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
    ,            
    class Mod_ChangeTXLimits extends FirmwareMod {  // there's something, a lot wrong... and meed more coding skills. It must patch for TX and RX 3 or 4 longer hex strings on different locations/offsets!
        constructor() {
            super("Extend TX Limits (Experimental)", "Allows transmission on the specified frequency range.", 0);
            this.inputMinTX = addInputField(this.modSpecificDiv, "Specify a new value for the minimum frequency in the range 18-1300 MHz:", "50");
            this.inputMaxTX = addInputField(this.modSpecificDiv, "Specify a new value for the maximum frequency in the range 18-1300 MHz:", "600");
            this.inputMinTX.disabled = true;
            this.inputMaxTX.disabled = true; // need coding help to patch it on 2 different offsets/places for RX and TX combiened!!!  
                //better solution generate from hexstring the xx bits these are the diffs from full TX range @ 0x150c: 40xxxx00xxxxxx0x7c

        }

            apply(firmwareData) {
            const offset = 0x150c;
            const txStart = parseInt(this.inputMinTX.value) * 100000;
            const txStop = parseInt(this.inputMaxTX.value) * 100000;

            if ((txStart <= txStop) && (txStart >= 1800000) && (txStart <= 130000000) && (txStop >= 1800000) && (txStop <= 130000000)) {

                const buffer = new ArrayBuffer(8);
                const dataView = new DataView(buffer);

                dataView.setUint32(0, txStart, true);
                dataView.setUint32(4, txStop, true);

                const txHex = new Uint8Array(buffer);

                firmwareData = replaceSection(firmwareData, txHex, offset);
                log(`Success: ${this.name} applied.`);
            }
            else {
                log(`Error in ${this.name}: Incorrect data! The frequencies must be greater than 18 MHz and less than 1300 MHz, the maximum greater than or equal to the minimum.`);
            }

            return firmwareData;
        }
    }
    ,     
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
    /*class Mod_Font extends FirmwareMod {
        constructor() {
            super("Font", "Changes the font apperiance on LCD to one of the following custom fonts: ", 0);

            this.selectVCR = addRadioButton(this.modSpecificDiv, "VCR Font, replace the bold digits with bigger, a bit higher in size fonts.", "selectVCR", "selectFont");
            this.selectFuturistic = addRadioButton(this.modSpecificDiv, "Futuristic Font (by DO7OO), replaces bold and small digits in a futuristic look.", "selectFuturistic", "selectFont");
            this.selectVCR.checked = true;

        }

        apply(firmwareData) {
            if (this.selectVCR.checked) {
                const bigDigits = hexString("0000F8FC0686C6E6F676FCF80000001F3F7767636160703F1F0000000000181CFEFE00000000000000000060607F7F60600000000000181C8686868686C6FC780000007E7F6361616161616060000000181C0606868686C6FC7800000018387060616161733F1E00000080C0E070381CFEFE00000000000707060606067F7F06060000007E7E6666666666E6C68600000018387060606060703F1F000000F8FC8686868686861C180000001F3F7161616161733F1E000000060606060686C6E67E3E000000000000007F7F0100000000000078FCC686868686C6FC780000001E3F7361616161733F1E00000078FCC68686868686FCF800000018387161616161713F1F000000008080808080808080000000000001010101010101010000");
                firmwareData = replaceSection(firmwareData, bigDigits, 0xd502);
            }
            else if (this.selectFuturistic.checked) {
                const bigDigits = hexString("00FEFF01010101018181FFFF00007F7F40404040407F7F7F7F000000000000008080FFFF0000000000000000007F7F7F7F00000000018181818181818181FFFE00007F7F7F7F404040404040400000818181818181818181FFFE0000404040404040407F7F7F7F00007FFF80808080808080FFFF0000000000000000007F7F7F7F0000FEFF8181818181818181810000404040404040407F7F7F7F0000FEFF81818181818181818100007F7F7F7F40404040407F7F0000010101010101018181FFFE0000000000000000007F7F7F7F0000FEFF81818181818181FFFF00007F7F40404040407F7F7F7F0000FEFF81818181818181FFFF0000000000000000007F7F7F7F000000808080808080808080000000000303030303030303030000");
                const smallDigits = hexString("007E414141797F00000000787F000079794949494E0049494949797E0007080808787F004E4949497979007E79494949790001010101797E007E494949797F000E090909797F0008080808080000000000000000");
                firmwareData = replaceSection(firmwareData, bigDigits, 0xd502);
                firmwareData = replaceSection(firmwareData, smallDigits, 0xd620);
            }

            log(`Success: ${this.name} applied.`);
            return firmwareData;
        }
    }
    ,*/
     class Mod_Font extends FirmwareMod {
        constructor() {
            super("Font", "Changes the font apperiance on LCD with custom fonts: ", 0);

            this.selectVCR = addRadioButton(this.modSpecificDiv, "VCR Font, replace the smaller bold digits with bigger thinner fonts.", "selectVCR", "selectFont");
            this.selectFuturistic = addRadioButton(this.modSpecificDiv, "Futuristic Font (by DO7OO), replaces bold and small digits in a futuristic look.", "selectFuturistic", "selectFont");
            this.selectTunas1337 = addRadioButton(this.modSpecificDiv, "Font by Tunas1337, replace letters and numbers.", "selectTunas1337","selectFont");

            this.selectVCR.checked = true;

        }

        apply(firmwareData) {
            if (this.selectVCR.checked) {
                const bigDigits = hexString("0000F8FC0686C6E6F676FCF80000001F3F7767636160703F1F0000000000181CFEFE00000000000000000060607F7F60600000000000181C8686868686C6FC780000007E7F6361616161616060000000181C0606868686C6FC7800000018387060616161733F1E00000080C0E070381CFEFE00000000000707060606067F7F06060000007E7E6666666666E6C68600000018387060606060703F1F000000F8FC8686868686861C180000001F3F7161616161733F1E000000060606060686C6E67E3E000000000000007F7F0100000000000078FCC686868686C6FC780000001E3F7361616161733F1E00000078FCC68686868686FCF800000018387161616161713F1F000000008080808080808080000000000001010101010101010000");
                firmwareData = replaceSection(firmwareData, bigDigits, 0xd502);
            }
            else if (this.selectFuturistic.checked) {
                const bigDigits = hexString("00FEFF01010101018181FFFF00007F7F40404040407F7F7F7F000000000000008080FFFF0000000000000000007F7F7F7F00000000018181818181818181FFFE00007F7F7F7F404040404040400000818181818181818181FFFE0000404040404040407F7F7F7F00007FFF80808080808080FFFF0000000000000000007F7F7F7F0000FEFF8181818181818181810000404040404040407F7F7F7F0000FEFF81818181818181818100007F7F7F7F40404040407F7F0000010101010101018181FFFE0000000000000000007F7F7F7F0000FEFF81818181818181FFFF00007F7F40404040407F7F7F7F0000FEFF81818181818181FFFF0000000000000000007F7F7F7F000000808080808080808080000000000303030303030303030000");
                const smallDigits = hexString("007E414141797F00000000787F000079794949494E0049494949797E0007080808787F004E4949497979007E79494949790001010101797E007E494949797F000E090909797F0008080808080000000000000000");
                firmwareData = replaceSection(firmwareData, bigDigits, 0xd502);
                firmwareData = replaceSection(firmwareData, smallDigits, 0xd620);
            }
            else if (this.selectTunas1337.checked) {
                const letters = hexString("00000000FCFC0000000000000D0D00000000007C00007C0C0000000000000000000020E03820F8200000010F0109070100000070C88E88100000040C08380907007088887800C0B00000040200070808000080FCC43C000000000708090B0607000000063E000000000000000000000000000000E0100C0000000000071820000000000418F0000000000060300F00000000404080F0404000000002010003000000808080F0808000000000000700000000000000000000000000004C3C0800000080808080808000000000000000000000000000000000000000000C0C00000000000000C03804000000380601000000E018C8C808F0000007081111180F0000001008F8000000001010101F10100000001008080818F00000101814121110000010080808D830000008101111120E000000C0E010F8000000060504041F04000000F8C8C8C808000008101010180F0000E010C8C8C808000007091010100F0000080808C8E818000000001C070000000000F8080808F000000E111111110E0000F018080818F0000001131212190F0000000060600000000000000C0C00000000000060600000000000004C3C0800000000C020201008000000000101020400002020202020200000010101010101000008103020C0C000000402020100000000000C84C42C18000000000D0C000000E01008888890E0000F1023242422070000C03818E00000001C030202030F1000F8F88888887000001F1F1010100F0600E030080808180000070C101010180800F80808081870C0001F101010180E030000F8888888880000001F10101010000000F8888888880800001F000000000000E03008080818000007081010111F0000F880808080F800001F000000001F000000000808F8080000000010101F1000000008080808F8000008181010180F0000F8F880C0301800001F1F0101030C100000F8000000000000001F101010101000F8788000E0F800001F000303001F0000F818E08000F800001F0000030C1F0000E01808081870C00007181010180E0300F8F8080808F060001F1F010101000000E01808081870C00007181030504E4300F8F8080808F000001F1F01030718000020F888880810000008181011110F0400080808F8080808000000001F00000000F800000000F8000007181010180F000038E000008078080000031E1807000000F80080C00000F8001F1807011E1F01000830C08070180000100C0301061800000018608000C03800000000011F000000080808C868180000181C1311101010000000F8080808000000007F40404000000038C000000000000000010638400000080808F8000000004040407F0000000000807030C00000000001000000010000000000000000000040404040404040000000081000000000000000000000000000404040408000000C121212121F0000F8804040408000001F081010100F02000080404040400000070810101010000080C0404080F800000F181010081F000000804040408000000F0A1212121302004040E0F84848000000001F1F0000000000C04040C04040006997949492D16000F880404040C000001F000000001F0000004040D8D80000000000001F1F0000000000404040D8D8000000808080FF3F00F8F80000804000001F1F020304181000000008F8000000000000001F10100000C0404080404080001F00001F00001F0000C080404040C000001F000000001F0080C04040408000000F181010100F0200C080404040800000FF081010100F020080C0404040C000000F18101008FF000000C0804040400000001F01000000000080C040404000000008111212120C00004040F0404040000000000F1010101000C000000000C000000F181010081F0000C000000000C0000000031C18060100C0800000800000C0001F1807031C1C030040C0000080400000100807070D100000C000000000C0400080834C300E01000040404040C0C000001018161311100000000000F8080800000002037D40400000000000FC00000000000000FF00000000080808F8000000004040407F00000000008080000080000001000001010100");
                firmwareData = replaceSection(firmwareData, letters, 0xd67c);
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
    /*class Mod_DoubleBacklightDuration extends FirmwareMod {
        constructor() {
            super("Double Backlight Duration", "Always multiplies the backlight duration set on the radio by x2. A value of 5 results to increase the light to 10 seconds.", 0);
        }

        apply(firmwareData) {
            const offset = 0x5976;
            const oldData = hexString("40");
            const newData = hexString("80");// if you enter c0 the time is x4
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
    class Mod_ABR extends FirmwareMod {//just testing...
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
    ,*/
    class Mod_BacklightDuration extends FirmwareMod {
        constructor() {
            super("ABR Backlight Time-Out Duration (Experimental)", "Multiplies the LCD Backlight time ABR Menu settings by value (exept off) 1/2/3/4/5 seconds x 2 or x 4. A value of 5 is 10 seconds or 20 seconds: ", 0);

           /* this.select1 = addRadioButton(this.modSpecificDiv, "1x - up to 5s backlight (default value)", "select1", "selectBacklightDuration");*/
            this.select2 = addRadioButton(this.modSpecificDiv, "2x - up to 10s LCD backlight", "select2", "selectBacklightDuration");
            this.select4 = addRadioButton(this.modSpecificDiv, "4x - up to 20s LCD backlight", "select4", "selectBacklightDuration");
            this.select8 = addRadioButton(this.modSpecificDiv, "8x - up to 40s LCD backlight", "select8", "selectBacklightDuration");
         /*   this.select40 = addRadioButton(this.modSpecificDiv, "10x - up to 60s LCD backlight", "select10", "selectBacklightDuration"); //joking martz*/
            
            this.select2.checked = true;
        }

        apply(firmwareData) {
            const offset = 0x5976;
            const buffer = new ArrayBuffer(4);
            const dataView = new DataView(buffer);
           /* if (this.select1.checked) {
                dataView.setUint32(0, 64, true);//is 1x default but hey rather enhance the max possible selectable valie in menu from 5 to 10 as in piotr and annemonic mods, combined with freq steps patch!!!
            }*/
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
    ,    
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

            // the  b l o c k
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
