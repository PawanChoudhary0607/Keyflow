# Third-Party Notices

KeyFlow is original, MIT-licensed software (see [LICENSE](./LICENSE)). It
includes two audio assets sourced from a third-party project, used under
that project's original license as noted below.

## Mechanical keyboard sounds

- **Files:** `public/sounds/mechanical/sprite.ogg`, `public/sounds/error.mp3`
- **Source:** [Keythm](https://github.com/aayushbharti/keythm) by Aayush Bharti
- **License:** Apache License 2.0 (see full text below)
- **Changes:** No modification was made to the audio files themselves.
  The offset/duration metadata describing where each key's click sits
  within `sprite.ogg` was reproduced (not the surrounding application
  code) in [`lib/mechanical-sprite-map.ts`](./lib/mechanical-sprite-map.ts)
  so KeyFlow's own, independently-written playback code
  ([`hooks/use-keyboard-sound.ts`](./hooks/use-keyboard-sound.ts)) can
  use the sprite. No other code, components, or UI from Keythm are
  included in this project.

All other sounds (the Typewriter sound pack) are original audio
synthesized specifically for KeyFlow and are covered by the project's
own MIT license.

---

```
                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   Copyright [yyyy] Aayush Bharti

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```

Full license text: <https://www.apache.org/licenses/LICENSE-2.0>
