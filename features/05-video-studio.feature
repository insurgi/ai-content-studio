Feature: Video Studio
  As a creator
  I want to compose a reel from clips, add a voiceover and captions, then render it
  So that I can produce polished short-form content without leaving the studio

  Background:
    Given the creator is signed in
    And the creator is on the /studio page
    And the creator has at least one twin and one saved script

  Scenario: Creator assembles a reel and renders it
    Given the creator has placed video, text, and audio clips on the timeline
    When the creator initiates a render
    Then a render job is started
    And the creator sees a real-time progress bar showing the render percentage
    And when the job completes the creator can preview and download the finished reel
    And the reel appears in the creator's reel library

  Scenario: Creator previews the reel before rendering
    Given the creator has clips on the timeline
    When the creator presses Play in the preview panel
    Then the playhead advances and the preview shows the active clip at each moment
    And text overlay clips display their labels at the correct timeline positions
    And the playhead stops at the end of the timeline

  Scenario: Creator generates a TTS voiceover from their script
    Given the creator has a script open and has selected a twin with a voice
    When the creator generates a voiceover
    Then a TTS job is submitted using the twin's voice settings
    And a generating indicator appears on the audio track while the job runs
    And when complete the voiceover clip appears on the audio track
    And the creator can play back the voiceover in the preview

  Scenario: Creator generates auto-captions from the voiceover
    Given a voiceover clip is present on the audio track
    When the creator enables auto-captions
    Then a Whisper transcription job is submitted
    And caption clips appear on the text track time-aligned to the speech
    And the creator can edit individual caption clips in the inspector

  # QUESTION: Are captions editable text clips in the timeline, or a burned-in subtitle layer applied at render time?

  Scenario: Creator edits a generated caption clip
    Given auto-captions have been generated and appear on the text track
    When the creator selects a caption clip and edits its text in the inspector
    Then the updated text is shown in the preview at the correct time

  Scenario: Render job fails mid-way
    Given the creator has initiated a render
    When the render job fails due to a service error
    Then the creator sees an error message with a reason
    And the reel is not added to the library
    And the creator can retry the render without rebuilding the timeline

  # QUESTION: Is there a credit refund policy for failed render jobs?

  Scenario: Creator attempts to render with no clips on the timeline
    Given the timeline contains no clips
    When the creator initiates a render
    Then the render does not start
    And the creator sees a message that at least one clip is required

  Scenario: Creator navigates away from the studio with unsaved changes
    Given the creator has made unsaved changes to the timeline
    When the creator navigates to a different section
    Then the creator is warned that unsaved changes will be lost
    And the creator can choose to stay and save or leave and discard
