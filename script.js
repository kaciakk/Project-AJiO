const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const speech = require('@google-cloud/speech');

const speechClient = new speech.SpeechClient({ keyFilename: 'C:\\Users\\wlomc\\Desktop\\Nowy folder (4)\\ajio-391111-e6dba511d60b.json' });
const config = {
  encoding: 'LINEAR16',
  sampleRateHertz: 44100,
  languageCode: 'pl-PL',
};

// Ustaw ścieżkę do ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

function generateSubtitles(videoPath, outputPath) {
    const subtitlePath = 'subtitles.srt'; // Ścieżka do tymczasowego pliku z napisami
  
    // Sprawdź, czy istnieje plik "subtitles1.srt"
    const updatedSubtitlePath = 'subtitles1.srt';
    const subtitlesExist = fs.existsSync(updatedSubtitlePath);
  
    if (subtitlesExist) {
      // Jeśli istnieje plik "subtitles1.srt", skopiuj go do docelowej ścieżki
      fs.copyFileSync(updatedSubtitlePath, subtitlePath);
  
      // Dodawanie napisów do filmu
      ffmpeg()
        .input(videoPath)
        .input(subtitlePath)
        .outputOptions([
          '-c:v copy',
          '-c:a copy',
          '-scodec mov_text',
          '-map 0',
          '-map 1',
        ])
        .output(outputPath)
        .on('end', () => {
          console.log('Napisy zostały dodane do filmu:', outputPath);
  
          // Jeśli istnieje plik "subtitles1.srt", usuń go po zakończeniu procesu
          fs.unlinkSync(updatedSubtitlePath);
        })
        .on('error', err => {
          console.error('Błąd podczas dodawania napisów do filmu:', err);
        })
        .run();
    } else {
      const audioPath = 'temp.wav';
  
      const command = ffmpeg(videoPath)
        .output(audioPath)
        .audioChannels(1) // Konwersja na jeden kanał (mono)
        .on('end', () => {
          const audioBytes = fs.readFileSync(audioPath);
          const audio = {
            content: audioBytes.toString('base64'),
          };
  
          const request = {
            audio: audio,
            config: config,
          };
  
          speechClient
            .recognize(request)
            .then(response => {
              const transcription = response[0].results
                .map(result => result.alternatives[0].transcript)
                .join('\n');
  
              fs.writeFileSync(outputPath, transcription);
  
              // Generowanie pliku z napisami w formacie SRT
              const subtitleContent = generateSubtitleContent(transcription);
              fs.writeFileSync(subtitlePath, subtitleContent);
  
              // Dodawanie napisów do filmu
              ffmpeg()
                .input(videoPath)
                .input(subtitlePath)
                .outputOptions([
                  '-c:v copy',
                  '-c:a copy',
                  '-scodec mov_text',
                  '-map 0',
                  '-map 1',
                ])
                .output(outputPath)
                .on('end', () => {
                  console.log('Napisy zostały dodane do filmu:', outputPath);
                })
                .on('error', err => {
                  console.error('Błąd podczas dodawania napisów do filmu:', err);
                })
                .run();
            })
            .catch(err => {
              console.error('Błąd podczas generowania napisów:', err);
            });
        })
        .on('error', err => {
          console.error('Błąd podczas konwersji wideo:', err);
        });
  
      command.run();
    }
  }
  
  
  function updateSubtitleContent(existingContent, newContent) {
    // Implementuj logikę aktualizacji napisów na podstawie istniejących i nowych napisów
    // Możesz użyć bibliotek takich jak `srt-parser` do analizy i manipulacji zawartości napisów
  
    // Przykładowa implementacja, która dodaje nowe napisy na koniec istniejących
    const updatedContent = existingContent + newContent;
  
    return updatedContent;
  }
  

function calculateDialogueDuration(dialogue) {
  const wordsPerMinute = 100; // Przykładowa średnia liczba słów na minutę
  const words = dialogue.split(' ');
  const wordCount = words.length;
  const dialogueDuration = (wordCount / wordsPerMinute) * 60; // Czas trwania dialogu na podstawie liczby słów i średniej liczby słów na minutę

  // Dodaj dodatkowy czas na przerwę między dialogami
  const pauseDuration = 1; // Czas trwania przerwy w sekundach
  const totalDuration = dialogueDuration + pauseDuration;

  return totalDuration;
}

function generateSubtitleContent(transcription) {
  const lines = transcription.split('\n');
  const subtitleLines = [];

  let currentTime = 0; // Aktualny czas dla napisów

  for (let i = 0; i < lines.length; i++) {
    const text = lines[i];
    const dialogues = splitIntoDialogues(text); // Podziel tekst na dialogi

    for (let j = 0; j < dialogues.length; j++) {
      const dialogue = dialogues[j];
      const startTime = formatTime(currentTime); // Czas początkowy dialogu

      // Oblicz czas trwania dialogu na podstawie analizy czasu wypowiedzi
      const dialogueDuration = calculateDialogueDuration(dialogue);
      currentTime += dialogueDuration; // Aktualizuj czas dla kolejnego dialogu
      const endTime = formatTime(currentTime); // Czas końcowy dialogu

      const subtitleLine = `${subtitleLines.length + 1}\n${startTime} --> ${endTime}\n${dialogue}\n`;
      subtitleLines.push(subtitleLine);
    }
  }

  return subtitleLines.join('');
}

function splitIntoDialogues(text) {
  // Możesz dostosować tę funkcję, aby podzielić tekst na dialogi na podstawie preferencji
  // Obecnie używam znaku nowej linii jako separatora, ale możesz zmienić to na potrzeby swojego projektu
  const dialogues = text.split('\n');
  return dialogues;
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)},000`;
}

function padZero(number) {
  return number.toString().padStart(2, '0');
}

const videoPath = 'C:\\Users\\wlomc\\Desktop\\Nowy folder (4)\\test2.mp4';
const outputPath = 'film_z_napisami.mp4'; // Ścieżka do pliku wynikowego z napisami
generateSubtitles(videoPath, outputPath);
