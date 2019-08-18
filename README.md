# Latynka

Module performs text transcription from Ukrainian cyrillic script to Ukrainian latin script using modified Jirechek\`s latin alphabet for Ukrainian language. It uses diacritics as carons and acutes. Sounds `ħ`, `ɦ`, `g` are written as `h`, `g` and `ġ` letters respectively. `я`, `ю`, `є` are `ja`, `ju`, `je` at the beginning of a word or after a vowel or apostrophe; `ia`, `iu`, `ie` after a hard consonant and `a`, `u`, `e` after a soft consonant. For example, `яблуко` — `jabluko`, `бюро` — `biuro`, `левеня` — `leveńa`.

## Install
```
npm i latynka
```
## Usage
```javascript
import { Latynka } from "latynka"
//or
const { Latynka } = require("latynka")

const transcripter = new Latynka()

//to transcript from cyrillic to latin
transcripter.toLatin("Текст кирилицею")

//to transcript from latin to cyrillic
transcripter.toCyrillic("Tekst latynkоju")
```