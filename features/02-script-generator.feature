Feature: Script Generator
  As a creator
  I want to generate, save, and refine AI scripts through conversation
  So that I can produce platform-optimised scripts that match my voice without starting from scratch each time

  Background:
    Given the creator is signed in
    And the creator is on the /scripts page

  Scenario: Creator generates a script for a chosen platform and duration
    Given the creator has not yet generated a script in this session
    When the creator enters a topic, selects a platform, tone, and duration
    And the creator generates a script
    Then the script streams into the output panel word by word
    And the script is tailored to the chosen platform and duration
    And the creator's credit balance decreases to reflect the generation cost

  # QUESTION: What is the credit cost per script generation — fixed per duration tier or metered by token count?

  Scenario: Creator saves a generated script
    Given a script has been generated
    When the creator saves the script
    Then the script appears in the "Recent scripts" list with its title, platform, and duration
    And the script persists across page refreshes

  Scenario: Creator edits a saved script inline
    Given the creator has a saved script open
    When the creator edits the script text and saves the changes
    Then the updated text is reflected in the saved script

  Scenario: Creator refines a script through follow-up prompts
    Given the creator has generated a script
    When the creator sends a follow-up instruction such as "make the hook punchier"
    Then the output panel shows a revised script incorporating that instruction
    And the conversation history shows both the original generation and the revision

  Scenario: Creator reviews the conversation history for a script
    Given the creator has refined a script through three follow-up exchanges
    When the creator opens the conversation history for that script
    Then all three exchanges are displayed in chronological order

  Scenario: Creator's personal style preferences are applied to generated scripts
    Given the creator has previously set style preferences
    When the creator generates a new script without overriding the preferences
    Then the script reflects the creator's preferred tone and vocabulary
    And a "personalised" indicator is visible on the output panel

  # QUESTION: Where does the creator configure memory/style preferences? Inferred from past scripts or explicit settings?

  Scenario: Creator attempts to generate a script with no topic entered
    Given the topic field is empty
    When the creator attempts to generate a script
    Then the generation does not start
    And the creator sees a prompt to enter a topic

  Scenario: Script generation fails due to a service error
    Given the AI service is unavailable
    When the creator attempts to generate a script
    Then the creator sees an error message explaining that generation failed
    And the creator's credit balance is not reduced
    And the creator can retry without re-entering their settings

  Scenario: Creator runs out of credits before generating
    Given the creator has insufficient credits for a generation
    When the creator attempts to generate a script
    Then the creator sees a message indicating insufficient credits
    And the generator does not start
    And the creator is shown a link to purchase more credits
