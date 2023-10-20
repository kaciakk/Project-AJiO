# Automatic Video Subtitle Generation using Google Cloud Speech-to-Text

## Overview

This project showcases automatic video subtitle generation using the Google Cloud Speech-to-Text service. The script takes a video file as input, converts its audio content into text, generates subtitles, and adds them to the video. The process is managed using Node.js and several libraries, including `ffmpeg` for video processing and Google Cloud's Speech-to-Text for audio-to-text conversion.

## Prerequisites

Before running the project, ensure you have the following:

1. **Node.js**: Make sure you have Node.js installed on your system.

2. **Google Cloud Speech-to-Text Service Account**: You'll need a Google Cloud account and a service account key file to use the Speech-to-Text service. Update the `keyFilename` in the code with the path to your service account key JSON file.

3. **FFmpeg**: Ensure that FFmpeg is installed on your system or provide the path to the FFmpeg executable using the `ffmpegPath` variable in the code.

## Usage

Follow these steps to use the project:

1. **Configuration**:
   - Configure the `keyFilename` to point to your Google Cloud service account key.
   - Set other parameters such as `encoding`, `sampleRateHertz`, and `languageCode` in the `config` object as needed.

2. **Run the Script**:
   - Execute the script, providing the path to the input video and the desired output path. For example:
     ```javascript
     const videoPath = 'input-video.mp4';
     const outputPath = 'output-video-with-subtitles.mp4';
     generateSubtitles(videoPath, outputPath);
     ```

3. **Enjoy the Subtitled Video**:
   - Once the script completes its task, you can enjoy the subtitled video.

## Technologies Used

This project relies on the following technologies and libraries:

- Node.js
- FFmpeg
- Google Cloud Speech-to-Text

## Customization

This project can be customized for various use cases. You can modify the text splitting logic, configure subtitle formatting, or adapt it to specific video content.

## Note

The use of the Google Cloud Speech-to-Text service may incur charges, depending on your Google Cloud account and usage. Make sure to monitor your usage to avoid unexpected costs.


## Suggestions for Further Project Expansion

1. Enhance speech analysis functions to include additional aspects like speaker recognition, emotion detection, or language identification.
2. Improve the subtitle generation function by implementing better dialogue segmentation, speaker timing annotation, and subtitle styling.
3. Implement a user interface that allows users to select a video file, define subtitle generation preferences (e.g., language, translation options), and view the resulting video file with subtitles.
4. Optimize the subtitle generation process by parallel processing of multiple audio segments or using cloud services for scalable processing.
5. Add support for other subtitle file formats such as VTT (WebVTT) or XML.
6. Incorporate support for other speech recognition engines. Currently, the code utilizes the Google Cloud Speech-to-Text service, but integration with other providers like Amazon Transcribe, Microsoft Azure Speech to Text, or Sphinx can be considered.
7. Integration with streaming platforms. Enable the application to generate and add subtitles to video content on streaming platforms like YouTube, Netflix, Amazon Prime, etc.
8. Include a subtitle editor feature, allowing users to edit generated subtitles, correct errors, adjust subtitle timing, add timestamp markers, apply text formatting, and more.

