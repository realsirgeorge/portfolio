---
slug: "beepcode-audio-spectrogram-steganography"
title: "BeepCode: the answer was in the spectrogram, and I read it wrong"
date: "2026-10-14"
category: "ctf"
tags:
  - "CTF"
  - "Steganography"
  - "Audio Forensics"
  - "Signal Processing"
  - "31 Nights of Cyber"
excerpt: "Sixty-six seconds of audio, all of its energy in a 2.9 kHz band, and a message drawn in the spectrum. The hard part was admitting my first reading was wrong."
---

![BeepCode — text hidden in an audio spectrogram](/images/blog/beepcode-audio-spectrogram-steganography/hero.png)

This is the challenge where I was confidently wrong for about twenty minutes.

The file is 66 seconds of mono 44.1 kHz audio. No RIFF comment, no trailing data, no LSB weirdness — the sample LSBs are statistically random (`ones frac = 0.5001`), which is what you would expect from ordinary audio. So the payload is not in the bytes.

It is in the spectrum.

## Fingerprint first

```console
$ soxi out.wav
Channels      : 1
Sample Rate   : 44100
Duration      : 00:01:06.07
Precision     : 16-bit
```

A 5.8 MB file, 66 seconds. Nothing in the metadata. The `data` chunk accounts for the whole file, so there is no appended payload. I checked the sample distribution, then moved to the frequency domain.

## Render the spectrogram

[SoX](https://sox.sourceforge.net/) is the quickest way to look:

```console
$ sox out.wav -n spectrogram -o spec.png -x 1400 -y 513 -z 90
```

Two things stand out immediately:

- **Every bit of energy lives between 4.4 kHz and 7.3 kHz.** Outside that band, the signal sits at the −120 dB noise floor.
- Inside that band, there is *text*.

Coarse render, whole 66 seconds:

```
r00t{fr33ling_w4vy}
```

I read that, typed it in, and the platform said no.

## The failure

I did what anyone does when a flag is rejected: I tried permutations. Maybe the `l` is a `1`. Maybe the `i` is an `l`. Maybe the `w` is a `vv`. I generated every `l/1/i` variant of `fr33ling_w4vy` and submitted them one by one. All rejected.

At that point I had two options: keep guessing, or change the representation. I changed the representation.

## Rebuild the carrier

The audio is pulsed at roughly 30 Hz — one pulse per image column. Instead of asking SoX for a spectrogram with a fixed window, I took each pulse, ran an FFT on it, and assembled the results into a bitmap. That removes the time-smearing that makes glyphs ambiguous.

```python
import numpy as np
import scipy.signal

env = np.abs(scipy.signal.hilbert(bandpassed))
pk  = scipy.signal.find_peaks(env, distance=int(0.02 * sr))[0]   # 1659 pulses

M = np.array([
    np.abs(np.fft.rfft(windowed_pulse))[band_bins]
    for p in pk
]).T
```

The result is a 1659 × 64 bitmap. Rendered at pixel resolution, the glyphs are objective — no interpolation, no smearing, no guessing. And the answer became obvious:

```
f 3 3 l i n g _ w 4 v y
```

The glyph I had read as `r` was the first `3`. The `f`'s hook reaches cap height, and the `3` starts lower, so at coarse resolution they run together into something that looks like `fr`. At pixel resolution, the gap is unambiguous.

The flag is leetspeak for "feeling wavy":

```
r00t{f33ling_w4vy}
```

Accepted. `+100`.

![Reading the spectrum, then rebuilding it](/images/blog/beepcode-audio-spectrogram-steganography/flow.png)

## Why the spectrogram trick works

Spectrogram text art is a real technique, not just a CTF gimmick. You draw an image in the time-frequency plane, then synthesize audio whose STFT approximates that image. The result sounds like noise or a hum, but the spectrum contains readable text.

Uses in the wild:

- **Watermarking** audio for provenance or leak tracing.
- **Smuggling strings** past text-based DLP, because the payload never exists as text.
- **Covert channels** in voice or music files.
- **CTF challenges**, obviously.

Defensive triage for unknown media: render a spectrogram. If all the energy is confined to a narrow band or forms shapes, treat it as a container, not as audio.

## The tools I would reach for next time

- [SoX](https://sox.sourceforge.net/) — fast, scriptable spectrograms.
- [Audacity](https://www.audacityteam.org/) — the spectrogram view is good for eyeballing, and you can zoom.
- [SciPy signal processing](https://docs.scipy.org/doc/scipy/reference/signal.html) — when you need to rebuild the carrier rather than look at it.
- [Praat](https://www.fon.hum.uva.nl/praat/) — if the payload is in speech-like formants rather than drawn text.

The technique that mattered here was not a tool. It was the decision to stop looking at a lossy rendering and reconstruct the underlying data. A spectrogram is a visualisation; the FFT is the data.

## What I learned

- **A rejected flag is information.** It tells you the derivation is wrong, not necessarily the whole hypothesis. I falsified the `r`, not the "spectrogram text" idea.
- **When your eyes disagree with the data, change the representation.** Zooming a PNG is not the same as recomputing the STFT with a short hop.
- **Cheap negative results are useful.** The permutation sweep eliminated the `l/1/i` ambiguity and left the `f`/`r` question as the only remaining variable. That is progress, even though it felt like flailing.

I kept the artefacts: `bitmap.npy`, `crisp_*.png`, `panel*.png`. If I ever need to explain this technique to someone, the before/after pair is the whole lesson.

## Further reading

- [SoX — Sound eXchange](https://sox.sourceforge.net/)
- [SciPy `signal.spectrogram`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.spectrogram.html)
- [Audacity spectrogram view](https://manual.audacityteam.org/man/spectrogram_view.html)
- [Spectrogram text art (background)](https://en.wikipedia.org/wiki/Spectrogram)

Next: a login form, a JWT, and an admin report generator that rendered EJS.
