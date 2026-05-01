Feature: AI Twin Library
  As a creator
  I want to create, preview, and manage AI avatar twins
  So that I can produce branded video content without appearing on camera myself

  Background:
    Given the creator is signed in
    And the creator is on the /twins page

  Scenario: Creator views their existing twin library
    Given the creator has previously created at least one twin
    When the creator opens the AI Twins page
    Then all existing twins are shown in a card grid
    And each card displays the twin's name, style, voice, and number of videos produced

  Scenario: Creator creates a new twin and sees a live avatar preview
    Given the creator starts the twin creation flow
    When the creator completes all four steps and submits for training
    Then an avatar generation job is started
    And the creator sees a progress indicator that updates in real time
    And when the job completes the twin's avatar preview is displayed
    And the new twin appears in the library

  # QUESTION: Should the creator be able to navigate away while the job runs and receive a notification on completion?

  Scenario: Creator uploads a video sample to model a custom twin
    Given the creator selects "Upload video" as the twin source
    When the creator uploads a 1–3 minute MP4 or MOV file
    Then the file is accepted and a preview thumbnail is shown
    And the creator can proceed to the next step

  Scenario: Creator registers a twin as an AI agent
    Given the creator has a trained twin in their library
    When the creator promotes the twin to agent status
    Then the twin can be assigned to generate scripts and reels autonomously
    And the twin appears with an "Agent" badge in the library

  # QUESTION: What is the UI entry point for promoting a twin to agent status — toggle on card, or separate flow?

  Scenario: Creator edits an existing twin's personality settings
    Given the creator opens the edit flow for an existing twin
    When the creator adjusts the pace, energy, and formality sliders and saves
    Then the twin's settings are updated without requiring full retraining

  Scenario: Creator attempts to proceed without providing a twin name
    Given the creator is on step 3 of the twin creation flow
    When the creator leaves the name field empty and attempts to advance
    Then the creator cannot advance
    And the creator sees a message that a name is required

  Scenario: Avatar generation job fails
    Given the creator has submitted a twin for training
    When the avatar generation service returns an error
    Then the creator sees an error message
    And the failed twin is not added to the library
    And the creator is offered the option to retry

  Scenario: Creator uploads a video that is too short
    Given the creator selects "Upload video" as the twin source
    When the creator uploads a video shorter than 1 minute
    Then the upload is rejected
    And the creator sees a message stating the minimum sample length is 1 minute

  Scenario: Creator deletes a twin that has associated reels
    Given the creator has a twin with previously rendered reels
    When the creator deletes the twin
    Then the creator is warned that the twin is linked to existing reels
    And the creator must confirm before the twin is removed
    And after confirmation the associated reels remain accessible but show the twin as deleted
